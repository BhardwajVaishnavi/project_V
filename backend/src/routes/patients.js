const express = require('express');
const { body, validationResult, query } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// Validation middleware
const validatePatient = [
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('sex')
    .isIn(['MALE', 'FEMALE', 'OTHER'])
    .withMessage('Sex must be MALE, FEMALE, or OTHER'),
  body('mobile')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid mobile number'),
  body('aadharNumber')
    .optional()
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('Aadhar number must be 12 digits'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('height')
    .optional()
    .isFloat({ min: 50, max: 250 })
    .withMessage('Height must be between 50 and 250 cm'),
  body('weight')
    .optional()
    .isFloat({ min: 10, max: 300 })
    .withMessage('Weight must be between 10 and 300 kg')
];

// Helper function to generate patient ID
const generatePatientId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `PAT${currentYear}`;
  
  // Get the last patient ID for this year
  const lastPatient = await prisma.patient.findFirst({
    where: {
      patientId: {
        startsWith: prefix
      }
    },
    orderBy: {
      patientId: 'desc'
    }
  });

  let nextNumber = 1;
  if (lastPatient) {
    const lastNumber = parseInt(lastPatient.patientId.substring(prefix.length));
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
};

// Helper function to calculate BMI
const calculateBMI = (height, weight) => {
  if (!height || !weight) return null;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

// @route   GET /api/patients
// @desc    Get all patients with search and pagination
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sex,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause for search
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { patientId: { contains: search, mode: 'insensitive' } },
          { mobile: { contains: search } },
          { aadharNumber: { contains: search } },
          { mrn: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(sex && { sex })
    };

    // Get patients with pagination
    const [patients, totalCount] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          patientId: true,
          mrn: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          sex: true,
          mobile: true,
          email: true,
          city: true,
          state: true,
          primaryDisease: true,
          dateOfVisit: true,
          profilePhotoUrl: true,
          bloodGroup: true,
          meldScore: true,
          transplantType: true,
          createdAt: true,
          updatedAt: true,
          surgeries: {
            select: {
              id: true,
              dateOfSurgery: true,
              nameOfSurgery: true,
              nextFollowUp: true
            },
            orderBy: {
              dateOfSurgery: 'desc'
            }
          },
          followUps: {
            select: {
              id: true,
              followUpDate: true,
              status: true
            },
            where: {
              followUpDate: {
                gte: new Date()
              }
            },
            orderBy: {
              followUpDate: 'asc'
            }
          }
        }
      }),
      prisma.patient.count({ where })
    ]);

    // Calculate age for each patient
    const patientsWithAge = patients.map(patient => ({
      ...patient,
      age: new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    }));

    res.json({
      success: true,
      data: {
        patients: patientsWithAge,
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
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients'
    });
  }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        comorbidities: true,
        investigations: true,
        treatments: true,
        surgeries: true,
        conservativeTreatments: true,
        followUps: true,
        liverTransplantEvaluations: {
          include: {
            viralMarkers: true,
            autoImmuneMarkers: true,
            tumorMarkers: true,
            urineAnalysis: true,
            imagingStudies: true,
            specialistEvaluations: true,
            clearances: true
          }
        },
        medicalForms: true,
        documents: true,
        investigationResults: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        updatedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Calculate age and BMI
    const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
    const bmi = calculateBMI(patient.height, patient.weight);

    res.json({
      success: true,
      data: {
        patient: {
          ...patient,
          age,
          bmi: bmi || patient.bmi
        }
      }
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient'
    });
  }
});

// @route   POST /api/patients
// @desc    Create new patient
// @access  Private
router.post('/', validatePatient, async (req, res) => {
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

    const patientData = req.body;
    
    // Generate patient ID
    const patientId = await generatePatientId();
    
    // Calculate BMI if height and weight are provided
    const bmi = calculateBMI(patientData.height, patientData.weight);

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        ...patientData,
        patientId,
        bmi,
        dateOfBirth: new Date(patientData.dateOfBirth),
        dateOfVisit: patientData.dateOfVisit ? new Date(patientData.dateOfVisit) : new Date(),
        createdById: req.user.id,
        updatedById: req.user.id
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Create patient error:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Patient with this Aadhar number or mobile already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating patient'
    });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', validatePatient, async (req, res) => {
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
    const patientData = req.body;

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id }
    });

    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Calculate BMI if height and weight are provided
    const bmi = calculateBMI(patientData.height, patientData.weight);

    // Update patient
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...patientData,
        bmi,
        dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : undefined,
        dateOfVisit: patientData.dateOfVisit ? new Date(patientData.dateOfVisit) : undefined,
        updatedById: req.user.id
      },
      include: {
        updatedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Update patient error:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Patient with this Aadhar number or mobile already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating patient'
    });
  }
});

// @route   DELETE /api/patients/:id
// @desc    Soft delete patient (set isActive to false)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id }
    });

    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Soft delete patient
    await prisma.patient.update({
      where: { id },
      data: {
        isActive: false,
        updatedById: req.user.id
      }
    });

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting patient'
    });
  }
});

// @route   GET /api/patients/search/suggestions
// @desc    Get patient search suggestions
// @access  Private
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q = '' } = req.query;

    if (q.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const suggestions = await prisma.patient.findMany({
      where: {
        isActive: true,
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { patientId: { contains: q, mode: 'insensitive' } },
          { mobile: { contains: q } }
        ]
      },
      take: 10,
      select: {
        id: true,
        patientId: true,
        firstName: true,
        lastName: true,
        mobile: true,
        dateOfBirth: true
      }
    });

    const suggestionsWithAge = suggestions.map(patient => ({
      ...patient,
      age: new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    }));

    res.json({
      success: true,
      data: { suggestions: suggestionsWithAge }
    });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching search suggestions'
    });
  }
});

module.exports = router;
