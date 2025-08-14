const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware for liver transplant evaluation
const validateLiverTransplantEvaluation = [
  body('patientId')
    .isUUID()
    .withMessage('Valid patient ID is required'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('age')
    .isInt({ min: 1, max: 120 })
    .withMessage('Age must be between 1 and 120'),
  body('sex')
    .isIn(['MALE', 'FEMALE', 'OTHER'])
    .withMessage('Sex must be MALE, FEMALE, or OTHER'),
  body('mobileNumber')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid mobile number'),
  body('heightCm')
    .optional()
    .isFloat({ min: 50, max: 250 })
    .withMessage('Height must be between 50 and 250 cm'),
  body('weightKg')
    .optional()
    .isFloat({ min: 10, max: 300 })
    .withMessage('Weight must be between 10 and 300 kg')
];

// Helper function to calculate BMI
const calculateBMI = (height, weight) => {
  if (!height || !weight) return null;
  return parseFloat((weight / ((height / 100) ** 2)).toFixed(2));
};

// @route   GET /api/liver-transplant/evaluations
// @desc    Get all liver transplant evaluations
// @access  Private
router.get('/evaluations', async (req, res) => {
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
          { name: { contains: search, mode: 'insensitive' } },
          { mrn: { contains: search, mode: 'insensitive' } },
          { mobileNumber: { contains: search } }
        ]
      })
    };

    const [evaluations, totalCount] = await Promise.all([
      prisma.liverTransplantEvaluation.findMany({
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
              lastName: true
            }
          },
          viralMarkers: true,
          autoImmuneMarkers: true,
          tumorMarkers: true,
          urineAnalysis: true,
          imagingStudies: true,
          specialistEvaluations: true,
          clearances: true
        }
      }),
      prisma.liverTransplantEvaluation.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        evaluations,
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
    console.error('Get liver transplant evaluations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching liver transplant evaluations'
    });
  }
});

// @route   GET /api/liver-transplant/evaluations/:id
// @desc    Get liver transplant evaluation by ID
// @access  Private
router.get('/evaluations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const evaluation = await prisma.liverTransplantEvaluation.findUnique({
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
        },
        viralMarkers: true,
        autoImmuneMarkers: true,
        tumorMarkers: true,
        urineAnalysis: true,
        imagingStudies: true,
        specialistEvaluations: true,
        clearances: true
      }
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Liver transplant evaluation not found'
      });
    }

    res.json({
      success: true,
      data: { evaluation }
    });
  } catch (error) {
    console.error('Get liver transplant evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching liver transplant evaluation'
    });
  }
});

// @route   POST /api/liver-transplant/evaluations
// @desc    Create new liver transplant evaluation
// @access  Private
router.post('/evaluations', validateLiverTransplantEvaluation, async (req, res) => {
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

    const evaluationData = req.body;

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: evaluationData.patientId }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Calculate BMI if height and weight are provided
    const bmi = calculateBMI(evaluationData.heightCm, evaluationData.weightKg);

    // Create liver transplant evaluation
    const evaluation = await prisma.liverTransplantEvaluation.create({
      data: {
        ...evaluationData,
        bmiKgM2: bmi
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
      message: 'Liver transplant evaluation created successfully',
      data: { evaluation }
    });
  } catch (error) {
    console.error('Create liver transplant evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating liver transplant evaluation'
    });
  }
});

// @route   PUT /api/liver-transplant/evaluations/:id
// @desc    Update liver transplant evaluation
// @access  Private
router.put('/evaluations/:id', validateLiverTransplantEvaluation, async (req, res) => {
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
    const evaluationData = req.body;

    // Check if evaluation exists
    const existingEvaluation = await prisma.liverTransplantEvaluation.findUnique({
      where: { id }
    });

    if (!existingEvaluation) {
      return res.status(404).json({
        success: false,
        message: 'Liver transplant evaluation not found'
      });
    }

    // Calculate BMI if height and weight are provided
    const bmi = calculateBMI(evaluationData.heightCm, evaluationData.weightKg);

    // Update liver transplant evaluation
    const evaluation = await prisma.liverTransplantEvaluation.update({
      where: { id },
      data: {
        ...evaluationData,
        bmiKgM2: bmi
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
      message: 'Liver transplant evaluation updated successfully',
      data: { evaluation }
    });
  } catch (error) {
    console.error('Update liver transplant evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating liver transplant evaluation'
    });
  }
});

// @route   DELETE /api/liver-transplant/evaluations/:id
// @desc    Delete liver transplant evaluation
// @access  Private
router.delete('/evaluations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if evaluation exists
    const existingEvaluation = await prisma.liverTransplantEvaluation.findUnique({
      where: { id }
    });

    if (!existingEvaluation) {
      return res.status(404).json({
        success: false,
        message: 'Liver transplant evaluation not found'
      });
    }

    // Delete liver transplant evaluation (this will cascade delete related records)
    await prisma.liverTransplantEvaluation.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Liver transplant evaluation deleted successfully'
    });
  } catch (error) {
    console.error('Delete liver transplant evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting liver transplant evaluation'
    });
  }
});

// @route   POST /api/liver-transplant/evaluations/:id/viral-markers
// @desc    Add/Update viral markers for liver transplant evaluation
// @access  Private
router.post('/evaluations/:id/viral-markers', async (req, res) => {
  try {
    const { id } = req.params;
    const viralMarkersData = req.body;

    // Check if evaluation exists
    const evaluation = await prisma.liverTransplantEvaluation.findUnique({
      where: { id }
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Liver transplant evaluation not found'
      });
    }

    // Upsert viral markers
    const viralMarkers = await prisma.liverTransplantViralMarker.upsert({
      where: { evaluationId: id },
      update: viralMarkersData,
      create: {
        evaluationId: id,
        ...viralMarkersData
      }
    });

    res.json({
      success: true,
      message: 'Viral markers updated successfully',
      data: { viralMarkers }
    });
  } catch (error) {
    console.error('Update viral markers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating viral markers'
    });
  }
});

// @route   POST /api/liver-transplant/evaluations/:id/clearances
// @desc    Update clearances for liver transplant evaluation
// @access  Private
router.post('/evaluations/:id/clearances', async (req, res) => {
  try {
    const { id } = req.params;
    const clearancesData = req.body;

    // Check if evaluation exists
    const evaluation = await prisma.liverTransplantEvaluation.findUnique({
      where: { id }
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Liver transplant evaluation not found'
      });
    }

    // Upsert clearances
    const clearances = await prisma.liverTransplantClearance.upsert({
      where: { evaluationId: id },
      update: clearancesData,
      create: {
        evaluationId: id,
        ...clearancesData
      }
    });

    res.json({
      success: true,
      message: 'Clearances updated successfully',
      data: { clearances }
    });
  } catch (error) {
    console.error('Update clearances error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating clearances'
    });
  }
});

// @route   POST /api/liver-transplant/evaluations/:id/tumor-markers
// @desc    Add/Update tumor markers for liver transplant evaluation
// @access  Private
router.post('/evaluations/:id/tumor-markers', async (req, res) => {
  try {
    const { id } = req.params;
    const tumorMarkersData = req.body;

    // Check if evaluation exists
    const evaluation = await prisma.liverTransplantEvaluation.findUnique({
      where: { id }
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Liver transplant evaluation not found'
      });
    }

    // Upsert tumor markers
    const tumorMarkers = await prisma.liverTransplantTumorMarker.upsert({
      where: { evaluationId: id },
      update: tumorMarkersData,
      create: {
        evaluationId: id,
        ...tumorMarkersData
      }
    });

    res.json({
      success: true,
      message: 'Tumor markers updated successfully',
      data: { tumorMarkers }
    });
  } catch (error) {
    console.error('Update tumor markers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tumor markers'
    });
  }
});

// @route   GET /api/liver-transplant/evaluations/:id/progress
// @desc    Get evaluation progress summary
// @access  Private
router.get('/evaluations/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;

    const evaluation = await prisma.liverTransplantEvaluation.findUnique({
      where: { id },
      include: {
        viralMarkers: true,
        autoImmuneMarkers: true,
        tumorMarkers: true,
        urineAnalysis: true,
        imagingStudies: true,
        specialistEvaluations: true,
        clearances: true
      }
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Liver transplant evaluation not found'
      });
    }

    // Calculate progress
    const progress = {
      basicInfo: !!evaluation.name && !!evaluation.age && !!evaluation.sex,
      bloodInvestigations: !!evaluation.hemoglobin || !!evaluation.totalBilirubin,
      viralMarkers: !!evaluation.viralMarkers?.length,
      autoImmuneMarkers: !!evaluation.autoImmuneMarkers?.length,
      tumorMarkers: !!evaluation.tumorMarkers?.length,
      urineAnalysis: !!evaluation.urineAnalysis?.length,
      imagingStudies: !!evaluation.imagingStudies?.length,
      specialistEvaluations: !!evaluation.specialistEvaluations?.length,
      clearances: evaluation.clearances?.length > 0
    };

    const completedSections = Object.values(progress).filter(Boolean).length;
    const totalSections = Object.keys(progress).length;
    const progressPercentage = Math.round((completedSections / totalSections) * 100);

    res.json({
      success: true,
      data: {
        progress,
        summary: {
          completedSections,
          totalSections,
          progressPercentage
        }
      }
    });
  } catch (error) {
    console.error('Get evaluation progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching evaluation progress'
    });
  }
});

module.exports = router;
