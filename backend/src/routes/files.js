const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'pdf,jpg,jpeg,png,doc,docx').split(',');
  const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Configure multer for S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'private', // Files are private by default
    key: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const folder = req.body.documentType || 'general';
      cb(null, `medical-files/${folder}/${fileName}`);
    },
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname,
        uploadedBy: req.user.id,
        uploadedAt: new Date().toISOString()
      });
    }
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// @route   POST /api/files/upload
// @desc    Upload file to S3 and save record to database
// @access  Private
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const {
      patientId,
      documentType = 'OTHER',
      category,
      description,
      investigationId,
      formId
    } = req.body;

    // Validate required fields
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Save file record to database
    const document = await prisma.patientDocument.create({
      data: {
        patientId,
        fileName: req.file.key,
        originalFileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        fileUrl: req.file.location,
        documentType,
        category,
        description,
        investigationId,
        formId,
        uploadedBy: req.user.id
      }
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        document,
        fileUrl: req.file.location
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    
    // If database save fails, try to delete the uploaded file
    if (req.file && req.file.key) {
      try {
        await s3.deleteObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: req.file.key
        }).promise();
      } catch (deleteError) {
        console.error('Error deleting file after database failure:', deleteError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
});

// @route   POST /api/files/upload-multiple
// @desc    Upload multiple files to S3
// @access  Private
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const {
      patientId,
      documentType = 'OTHER',
      category,
      description,
      investigationId,
      formId
    } = req.body;

    // Validate required fields
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Save all file records to database
    const documents = await Promise.all(
      req.files.map(file =>
        prisma.patientDocument.create({
          data: {
            patientId,
            fileName: file.key,
            originalFileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            fileUrl: file.location,
            documentType,
            category,
            description,
            investigationId,
            formId,
            uploadedBy: req.user.id
          }
        })
      )
    );

    res.status(201).json({
      success: true,
      message: `${req.files.length} files uploaded successfully`,
      data: {
        documents,
        fileUrls: req.files.map(file => file.location)
      }
    });
  } catch (error) {
    console.error('Multiple file upload error:', error);
    
    // If database save fails, try to delete the uploaded files
    if (req.files && req.files.length > 0) {
      try {
        await Promise.all(
          req.files.map(file =>
            s3.deleteObject({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: file.key
            }).promise()
          )
        );
      } catch (deleteError) {
        console.error('Error deleting files after database failure:', deleteError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading files'
    });
  }
});

// @route   GET /api/files/patient/:patientId
// @desc    Get all files for a patient
// @access  Private
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { documentType, category } = req.query;

    const where = {
      patientId,
      isActive: true,
      ...(documentType && { documentType }),
      ...(category && { category })
    };

    const documents = await prisma.patientDocument.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            patientId: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: { documents }
    });
  } catch (error) {
    console.error('Get patient files error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient files'
    });
  }
});

// @route   GET /api/files/:id/download
// @desc    Generate signed URL for file download
// @access  Private
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.patientDocument.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            patientId: true
          }
        }
      }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Generate signed URL for download (expires in 1 hour)
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: document.fileName,
      Expires: 3600, // 1 hour
      ResponseContentDisposition: `attachment; filename="${document.originalFileName}"`
    });

    res.json({
      success: true,
      data: {
        downloadUrl: signedUrl,
        document
      }
    });
  } catch (error) {
    console.error('Generate download URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating download URL'
    });
  }
});

// @route   DELETE /api/files/:id
// @desc    Delete file from S3 and database
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.patientDocument.findUnique({
      where: { id }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from S3
    try {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: document.fileName
      }).promise();
    } catch (s3Error) {
      console.error('Error deleting file from S3:', s3Error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Soft delete from database
    await prisma.patientDocument.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
});

module.exports = router;
