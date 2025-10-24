const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// Validation middleware
const validateTreatment = [
  body('patientId')
    .isUUID()
    .withMessage('Valid patient ID is required'),
  body('primaryTreatmentPlan')
    .optional()
    .isIn(['CONSERVATIVE', 'SURGERY', 'CHEMOTHERAPY', 'RADIOTHERAPY', 'REFERRED_OTHER_DEPARTMENT'])
    .withMessage('Invalid treatment plan')
];

// @route   GET /api/treatments
// @desc    Get all treatments with filters
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      patientId,
      primaryTreatmentPlan,
      search = ''
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      ...(patientId && { patientId }),
      ...(primaryTreatmentPlan && { primaryTreatmentPlan }),
      ...(search && {
        OR: [
          { finalDiagnosis: { contains: search, mode: 'insensitive' } },
          { treatmentPlan: { contains: search, mode: 'insensitive' } },
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } },
          { patient: { patientId: { contains: search, mode: 'insensitive' } } }
        ]
      })
    };

    const [treatments, totalCount] = await Promise.all([
      prisma.patientTreatment.findMany({
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
      prisma.patientTreatment.count({ where })
    ]);

    // Add age to patient data
    const treatmentsWithAge = treatments.map(treatment => ({
      ...treatment,
      patient: {
        ...treatment.patient,
        age: new Date().getFullYear() - new Date(treatment.patient.dateOfBirth).getFullYear()
      }
    }));

    res.json({
      success: true,
      data: {
        treatments: treatmentsWithAge,
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
    console.error('Get treatments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching treatments'
    });
  }
});

// @route   GET /api/treatments/:id
// @desc    Get treatment by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const treatment = await prisma.patientTreatment.findUnique({
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

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Treatment not found'
      });
    }

    // Add age to patient data
    const treatmentWithAge = {
      ...treatment,
      patient: {
        ...treatment.patient,
        age: new Date().getFullYear() - new Date(treatment.patient.dateOfBirth).getFullYear()
      }
    };

    res.json({
      success: true,
      data: { treatment: treatmentWithAge }
    });
  } catch (error) {
    console.error('Get treatment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching treatment'
    });
  }
});

// @route   POST /api/treatments
// @desc    Create new treatment
// @access  Private
router.post('/', validateTreatment, async (req, res) => {
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

    const treatmentData = req.body;

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: treatmentData.patientId }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Create treatment
    const treatment = await prisma.patientTreatment.create({
      data: {
        ...treatmentData,
        admissionDate: treatmentData.admissionDate ? new Date(treatmentData.admissionDate) : null
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
      message: 'Treatment created successfully',
      data: { treatment }
    });
  } catch (error) {
    console.error('Create treatment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating treatment'
    });
  }
});

// @route   PUT /api/treatments/:id
// @desc    Update treatment
// @access  Private
router.put('/:id', validateTreatment, async (req, res) => {
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
    const treatmentData = req.body;

    // Check if treatment exists
    const existingTreatment = await prisma.patientTreatment.findUnique({
      where: { id }
    });

    if (!existingTreatment) {
      return res.status(404).json({
        success: false,
        message: 'Treatment not found'
      });
    }

    // Update treatment
    const treatment = await prisma.patientTreatment.update({
      where: { id },
      data: {
        ...treatmentData,
        admissionDate: treatmentData.admissionDate ? new Date(treatmentData.admissionDate) : undefined
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
      message: 'Treatment updated successfully',
      data: { treatment }
    });
  } catch (error) {
    console.error('Update treatment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating treatment'
    });
  }
});

// @route   DELETE /api/treatments/:id
// @desc    Delete treatment
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if treatment exists
    const existingTreatment = await prisma.patientTreatment.findUnique({
      where: { id }
    });

    if (!existingTreatment) {
      return res.status(404).json({
        success: false,
        message: 'Treatment not found'
      });
    }

    // Delete treatment
    await prisma.patientTreatment.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Treatment deleted successfully'
    });
  } catch (error) {
    console.error('Delete treatment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting treatment'
    });
  }
});

module.exports = router;
