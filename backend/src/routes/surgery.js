const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();


// Validation middleware
const validateSurgery = [
  body('patientId')
    .isUUID()
    .withMessage('Valid patient ID is required'),
  body('nameOfSurgery')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Surgery name must be at least 2 characters long'),
  body('clavienDindoGrade')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Clavien-Dindo grade must be between 1 and 5')
];

// @route   GET /api/surgery
// @desc    Get all surgeries with filters
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      patientId,
      search = ''
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(patientId && { patientId }),
      ...(search && {
        OR: [
          { nameOfSurgery: { contains: search, mode: 'insensitive' } },
          { surgeon: { contains: search, mode: 'insensitive' } },
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } },
          { patient: { patientId: { contains: search, mode: 'insensitive' } } }
        ]
      })
    };

    const [surgeries, totalCount] = await Promise.all([
      prisma.surgeryDetail.findMany({
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
      prisma.surgeryDetail.count({ where })
    ]);

    // Add age to patient data
    const surgeriesWithAge = surgeries.map(surgery => ({
      ...surgery,
      patient: {
        ...surgery.patient,
        age: new Date().getFullYear() - new Date(surgery.patient.dateOfBirth).getFullYear()
      }
    }));

    res.json({
      success: true,
      data: {
        surgeries: surgeriesWithAge,
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
    console.error('Get surgeries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching surgeries'
    });
  }
});

// @route   GET /api/surgery/:id
// @desc    Get surgery by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const surgery = await prisma.surgeryDetail.findUnique({
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

    if (!surgery) {
      return res.status(404).json({
        success: false,
        message: 'Surgery not found'
      });
    }

    // Add age to patient data
    const surgeryWithAge = {
      ...surgery,
      patient: {
        ...surgery.patient,
        age: new Date().getFullYear() - new Date(surgery.patient.dateOfBirth).getFullYear()
      }
    };

    res.json({
      success: true,
      data: { surgery: surgeryWithAge }
    });
  } catch (error) {
    console.error('Get surgery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching surgery'
    });
  }
});

// @route   POST /api/surgery
// @desc    Create new surgery
// @access  Private
router.post('/', validateSurgery, async (req, res) => {
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

    const surgeryData = req.body;

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: surgeryData.patientId }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Create surgery
    const surgery = await prisma.surgeryDetail.create({
      data: {
        ...surgeryData,
        planDate: surgeryData.planDate ? new Date(surgeryData.planDate) : null,
        dateOfSurgery: surgeryData.dateOfSurgery ? new Date(surgeryData.dateOfSurgery) : null,
        dateOfDischarge: surgeryData.dateOfDischarge ? new Date(surgeryData.dateOfDischarge) : null,
        nextFollowUp: surgeryData.nextFollowUp ? new Date(surgeryData.nextFollowUp) : null
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
      message: 'Surgery created successfully',
      data: { surgery }
    });
  } catch (error) {
    console.error('Create surgery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating surgery'
    });
  }
});

// @route   PUT /api/surgery/:id
// @desc    Update surgery
// @access  Private
router.put('/:id', validateSurgery, async (req, res) => {
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
    const surgeryData = req.body;

    // Check if surgery exists
    const existingSurgery = await prisma.surgeryDetail.findUnique({
      where: { id }
    });

    if (!existingSurgery) {
      return res.status(404).json({
        success: false,
        message: 'Surgery not found'
      });
    }

    // Update surgery
    const surgery = await prisma.surgeryDetail.update({
      where: { id },
      data: {
        ...surgeryData,
        planDate: surgeryData.planDate ? new Date(surgeryData.planDate) : undefined,
        dateOfSurgery: surgeryData.dateOfSurgery ? new Date(surgeryData.dateOfSurgery) : undefined,
        dateOfDischarge: surgeryData.dateOfDischarge ? new Date(surgeryData.dateOfDischarge) : undefined,
        nextFollowUp: surgeryData.nextFollowUp ? new Date(surgeryData.nextFollowUp) : undefined
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
      message: 'Surgery updated successfully',
      data: { surgery }
    });
  } catch (error) {
    console.error('Update surgery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating surgery'
    });
  }
});

// @route   DELETE /api/surgery/:id
// @desc    Delete surgery
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if surgery exists
    const existingSurgery = await prisma.surgeryDetail.findUnique({
      where: { id }
    });

    if (!existingSurgery) {
      return res.status(404).json({
        success: false,
        message: 'Surgery not found'
      });
    }

    // Delete surgery
    await prisma.surgeryDetail.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Surgery deleted successfully'
    });
  } catch (error) {
    console.error('Delete surgery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting surgery'
    });
  }
});

module.exports = router;

