const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateInvestigation = [
  body('patientId')
    .isUUID()
    .withMessage('Valid patient ID is required'),
  body('investigationType')
    .isIn(['ULTRASONOGRAPHY', 'CECT_ABDOMEN', 'UPPER_GI_ENDOSCOPY', 'ENDOSCOPIC_BIOPSY', 'COLONOSCOPY', 'COLONOSCOPIC_BIOPSY', 'PET_CT_SCAN', 'OTHER_BIOPSY', 'BLOOD_TEST', 'URINE_TEST', 'IMAGING', 'OTHER'])
    .withMessage('Invalid investigation type'),
  body('status')
    .optional()
    .isIn(['PENDING', 'SCHEDULED', 'COMPLETED', 'REVIEWED', 'CANCELLED'])
    .withMessage('Invalid status')
];

// @route   GET /api/investigations
// @desc    Get all investigations with filters
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      patientId,
      investigationType,
      status,
      search = ''
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(patientId && { patientId }),
      ...(investigationType && { investigationType }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { findings: { contains: search, mode: 'insensitive' } },
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } },
          { patient: { patientId: { contains: search, mode: 'insensitive' } } }
        ]
      })
    };

    const [investigations, totalCount] = await Promise.all([
      prisma.patientInvestigation.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          patient: {
            select: {
              id: true,
              patientId: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              sex: true,
              mobile: true
            }
          }
        }
      }),
      prisma.patientInvestigation.count({ where })
    ]);

    // Add age to patient data
    const investigationsWithAge = investigations.map(investigation => ({
      ...investigation,
      patient: {
        ...investigation.patient,
        age: new Date().getFullYear() - new Date(investigation.patient.dateOfBirth).getFullYear()
      }
    }));

    res.json({
      success: true,
      data: {
        investigations: investigationsWithAge,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / take),
          totalCount,
          hasNext: skip + take < totalCount,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get investigations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching investigations'
    });
  }
});

// @route   GET /api/investigations/:id
// @desc    Get investigation by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const investigation = await prisma.patientInvestigation.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            patientId: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            sex: true,
            mobile: true,
            email: true
          }
        }
      }
    });

    if (!investigation) {
      return res.status(404).json({
        success: false,
        message: 'Investigation not found'
      });
    }

    // Add age to patient data
    const investigationWithAge = {
      ...investigation,
      patient: {
        ...investigation.patient,
        age: new Date().getFullYear() - new Date(investigation.patient.dateOfBirth).getFullYear()
      }
    };

    res.json({
      success: true,
      data: { investigation: investigationWithAge }
    });
  } catch (error) {
    console.error('Get investigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching investigation'
    });
  }
});

// @route   POST /api/investigations
// @desc    Create new investigation
// @access  Private
router.post('/', validateInvestigation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const investigationData = req.body;

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: investigationData.patientId }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Create investigation
    const investigation = await prisma.patientInvestigation.create({
      data: {
        ...investigationData,
        date: investigationData.date ? new Date(investigationData.date) : null,
        ultrasonographyDate: investigationData.ultrasonographyDate ? new Date(investigationData.ultrasonographyDate) : null,
        cectAbdomenDate: investigationData.cectAbdomenDate ? new Date(investigationData.cectAbdomenDate) : null,
        upperGIEndoscopyDate: investigationData.upperGIEndoscopyDate ? new Date(investigationData.upperGIEndoscopyDate) : null,
        endoscopicBiopsyDate: investigationData.endoscopicBiopsyDate ? new Date(investigationData.endoscopicBiopsyDate) : null,
        colonoscopyDate: investigationData.colonoscopyDate ? new Date(investigationData.colonoscopyDate) : null,
        colonoscopicBiopsyDate: investigationData.colonoscopicBiopsyDate ? new Date(investigationData.colonoscopicBiopsyDate) : null,
        otherBiopsyDate: investigationData.otherBiopsyDate ? new Date(investigationData.otherBiopsyDate) : null
      },
      include: {
        patient: {
          select: {
            id: true,
            patientId: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Investigation created successfully',
      data: { investigation }
    });
  } catch (error) {
    console.error('Create investigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating investigation'
    });
  }
});

// @route   PUT /api/investigations/:id
// @desc    Update investigation
// @access  Private
router.put('/:id', validateInvestigation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const investigationData = req.body;

    // Check if investigation exists
    const existingInvestigation = await prisma.patientInvestigation.findUnique({
      where: { id }
    });

    if (!existingInvestigation) {
      return res.status(404).json({
        success: false,
        message: 'Investigation not found'
      });
    }

    // Update investigation
    const investigation = await prisma.patientInvestigation.update({
      where: { id },
      data: {
        ...investigationData,
        date: investigationData.date ? new Date(investigationData.date) : undefined,
        ultrasonographyDate: investigationData.ultrasonographyDate ? new Date(investigationData.ultrasonographyDate) : undefined,
        cectAbdomenDate: investigationData.cectAbdomenDate ? new Date(investigationData.cectAbdomenDate) : undefined,
        upperGIEndoscopyDate: investigationData.upperGIEndoscopyDate ? new Date(investigationData.upperGIEndoscopyDate) : undefined,
        endoscopicBiopsyDate: investigationData.endoscopicBiopsyDate ? new Date(investigationData.endoscopicBiopsyDate) : undefined,
        colonoscopyDate: investigationData.colonoscopyDate ? new Date(investigationData.colonoscopyDate) : undefined,
        colonoscopicBiopsyDate: investigationData.colonoscopicBiopsyDate ? new Date(investigationData.colonoscopicBiopsyDate) : undefined,
        otherBiopsyDate: investigationData.otherBiopsyDate ? new Date(investigationData.otherBiopsyDate) : undefined
      },
      include: {
        patient: {
          select: {
            id: true,
            patientId: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Investigation updated successfully',
      data: { investigation }
    });
  } catch (error) {
    console.error('Update investigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating investigation'
    });
  }
});

// @route   DELETE /api/investigations/:id
// @desc    Delete investigation
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if investigation exists
    const existingInvestigation = await prisma.patientInvestigation.findUnique({
      where: { id }
    });

    if (!existingInvestigation) {
      return res.status(404).json({
        success: false,
        message: 'Investigation not found'
      });
    }

    // Delete investigation
    await prisma.patientInvestigation.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Investigation deleted successfully'
    });
  } catch (error) {
    console.error('Delete investigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting investigation'
    });
  }
});

module.exports = router;
