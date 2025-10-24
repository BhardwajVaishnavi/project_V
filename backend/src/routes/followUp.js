const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();


// Validation middleware
const validateFollowUp = [
  body('patientId')
    .isUUID()
    .withMessage('Valid patient ID is required'),
  body('followUpDate')
    .isISO8601()
    .withMessage('Please provide a valid follow-up date'),
  body('status')
    .optional()
    .isIn(['SCHEDULED', 'COMPLETED', 'MISSED', 'CANCELLED', 'RESCHEDULED'])
    .withMessage('Invalid status')
];

// @route   GET /api/follow-up
// @desc    Get all follow-ups with filters
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      patientId,
      status,
      dateFrom,
      dateTo,
      search = ''
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(patientId && { patientId }),
      ...(status && { status }),
      ...(dateFrom && dateTo && {
        followUpDate: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        }
      }),
      ...(search && {
        OR: [
          { finalBiopsy: { contains: search, mode: 'insensitive' } },
          { stageOfDisease: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } },
          { patient: { patientId: { contains: search, mode: 'insensitive' } } }
        ]
      })
    };

    const [followUps, totalCount] = await Promise.all([
      prisma.followUpRecord.findMany({
        where,
        skip,
        take,
        orderBy: { followUpDate: 'desc' },
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
      prisma.followUpRecord.count({ where })
    ]);

    // Add age to patient data
    const followUpsWithAge = followUps.map(followUp => ({
      ...followUp,
      patient: {
        ...followUp.patient,
        age: new Date().getFullYear() - new Date(followUp.patient.dateOfBirth).getFullYear()
      }
    }));

    res.json({
      success: true,
      data: {
        followUps: followUpsWithAge,
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
    console.error('Get follow-ups error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching follow-ups'
    });
  }
});

// @route   GET /api/follow-up/:id
// @desc    Get follow-up by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const followUp = await prisma.followUpRecord.findUnique({
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

    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found'
      });
    }

    // Add age to patient data
    const followUpWithAge = {
      ...followUp,
      patient: {
        ...followUp.patient,
        age: new Date().getFullYear() - new Date(followUp.patient.dateOfBirth).getFullYear()
      }
    };

    res.json({
      success: true,
      data: { followUp: followUpWithAge }
    });
  } catch (error) {
    console.error('Get follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching follow-up'
    });
  }
});

// @route   POST /api/follow-up
// @desc    Create new follow-up
// @access  Private
router.post('/', validateFollowUp, async (req, res) => {
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

    const followUpData = req.body;

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: followUpData.patientId }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Create follow-up
    const followUp = await prisma.followUpRecord.create({
      data: {
        ...followUpData,
        followUpDate: new Date(followUpData.followUpDate),
        nextFollowUpDate: followUpData.nextFollowUpDate ? new Date(followUpData.nextFollowUpDate) : null
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
      message: 'Follow-up created successfully',
      data: { followUp }
    });
  } catch (error) {
    console.error('Create follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating follow-up'
    });
  }
});

// @route   PUT /api/follow-up/:id
// @desc    Update follow-up
// @access  Private
router.put('/:id', validateFollowUp, async (req, res) => {
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
    const followUpData = req.body;

    // Check if follow-up exists
    const existingFollowUp = await prisma.followUpRecord.findUnique({
      where: { id }
    });

    if (!existingFollowUp) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found'
      });
    }

    // Update follow-up
    const followUp = await prisma.followUpRecord.update({
      where: { id },
      data: {
        ...followUpData,
        followUpDate: followUpData.followUpDate ? new Date(followUpData.followUpDate) : undefined,
        nextFollowUpDate: followUpData.nextFollowUpDate ? new Date(followUpData.nextFollowUpDate) : undefined
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
      message: 'Follow-up updated successfully',
      data: { followUp }
    });
  } catch (error) {
    console.error('Update follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating follow-up'
    });
  }
});

// @route   DELETE /api/follow-up/:id
// @desc    Delete follow-up
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if follow-up exists
    const existingFollowUp = await prisma.followUpRecord.findUnique({
      where: { id }
    });

    if (!existingFollowUp) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found'
      });
    }

    // Delete follow-up
    await prisma.followUpRecord.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Follow-up deleted successfully'
    });
  } catch (error) {
    console.error('Delete follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting follow-up'
    });
  }
});

// @route   GET /api/follow-up/upcoming
// @desc    Get upcoming follow-ups
// @access  Private
router.get('/upcoming', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const upcomingFollowUps = await prisma.followUpRecord.findMany({
      where: {
        followUpDate: {
          gte: new Date(),
          lte: endDate
        },
        status: {
          in: ['SCHEDULED', 'RESCHEDULED']
        }
      },
      orderBy: { followUpDate: 'asc' },
      include: {
        patient: {
          select: {
            id: true,
            patientId: true,
            firstName: true,
            lastName: true,
            mobile: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: { upcomingFollowUps }
    });
  } catch (error) {
    console.error('Get upcoming follow-ups error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming follow-ups'
    });
  }
});

module.exports = router;

