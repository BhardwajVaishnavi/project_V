const express = require('express');
const { body, validationResult, query } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();


// Validation middleware for camp registration
const validateCampRegistration = [
  body('campId')
    .notEmpty()
    .withMessage('Camp ID is required'),
  body('fullName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters long'),
  body('gender')
    .isIn(['MALE', 'FEMALE', 'OTHER'])
    .withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('mobileNumber')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid mobile number'),
  body('address')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Address must be at least 10 characters long'),
  body('emergencyContactName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Emergency contact name is required'),
  body('emergencyContactNumber')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid emergency contact number'),
  body('selectedServices')
    .isArray({ min: 1 })
    .withMessage('At least one service must be selected'),
  body('consentForProcedures')
    .isBoolean()
    .withMessage('Consent for procedures is required')
];

// Helper function to generate registration ID
const generateRegistrationId = async (campId) => {
  const camp = await prisma.camp.findUnique({ where: { id: campId } });
  const campDate = new Date(camp.date);
  const year = campDate.getFullYear();
  const month = String(campDate.getMonth() + 1).padStart(2, '0');
  const day = String(campDate.getDate()).padStart(2, '0');
  
  const prefix = `CAMP${year}${month}${day}`;
  
  // Get the count of existing registrations for this camp
  const count = await prisma.campRegistration.count({
    where: { campId }
  });
  
  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}${sequence}`;
};

// Helper function to calculate total amount
const calculateTotalAmount = (services) => {
  const servicePrices = {
    'Endoscopy': 999,
    'SIBO Test': 499,
    'Complete Health Checkup': 599
  };
  
  return services.reduce((total, service) => {
    return total + (servicePrices[service] || 0);
  }, 0);
};

// Helper function to determine priority level
const determinePriorityLevel = (symptoms) => {
  const highPrioritySymptoms = [
    'unexplainedWeightLoss',
    'jaundiceYellowEyes',
    'difficultySwallowing'
  ];
  
  const hasHighPrioritySymptom = highPrioritySymptoms.some(symptom => symptoms[symptom]);
  
  if (hasHighPrioritySymptom) return 'HIGH';
  
  const moderatePrioritySymptoms = [
    'abdominalPain',
    'nauseaVomiting',
    'bowelHabitsChange'
  ];
  
  const hasModerateSymptom = moderatePrioritySymptoms.some(symptom => symptoms[symptom]);
  
  return hasModerateSymptom ? 'NORMAL' : 'LOW';
};

// @route   GET /api/camp-registrations
// @desc    Get all camp registrations with pagination
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      campId = '',
      paymentStatus = '',
      priorityLevel = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { mobileNumber: { contains: search } },
        { registrationId: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (campId) {
      where.campId = campId;
    }
    
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    
    if (priorityLevel) {
      where.priorityLevel = priorityLevel;
    }

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [registrations, total] = await Promise.all([
      prisma.campRegistration.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          camp: {
            select: {
              id: true,
              name: true,
              venue: true,
              date: true,
              startTime: true,
              endTime: true
            }
          }
        }
      }),
      prisma.campRegistration.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: take,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching camp registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch camp registrations',
      error: error.message
    });
  }
});

// @route   GET /api/camp-registrations/:id
// @desc    Get camp registration by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await prisma.campRegistration.findUnique({
      where: { id },
      include: {
        camp: true
      }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Camp registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Error fetching camp registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch camp registration',
      error: error.message
    });
  }
});

// @route   POST /api/camp-registrations
// @desc    Create new camp registration
// @access  Public (for camp registrations)
router.post('/', validateCampRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      campId,
      fullName,
      dateOfBirth,
      age,
      gender,
      mobileNumber,
      address,
      emailId,
      emergencyContactName,
      emergencyContactNumber,
      selectedServices,
      // Symptoms
      abdominalPain,
      bloatingGas,
      nauseaVomiting,
      heartburnAcidReflux,
      difficultySwallowing,
      bowelHabitsChange,
      unexplainedWeightLoss,
      lossOfAppetite,
      jaundiceYellowEyes,
      // Previous History
      liverDisease,
      kidneyProblems,
      heartConditions,
      diabetes,
      highBloodPressure,
      previousEndoscopy,
      // Risk Assessment
      alcoholConsumption,
      alcoholFrequency,
      smoking,
      familyHistoryGastro,
      // Administrative
      paymentStatus,
      preferredTimeSlot,
      consentForProcedures,
      specialInstructions,
      followupRequired,
      // Pre-procedure
      fastingStatus,
      currentMedications,
      bloodThinners
    } = req.body;

    // Check camp capacity
    const camp = await prisma.camp.findUnique({
      where: { id: campId },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: 'Camp not found'
      });
    }

    if (camp.maxCapacity && camp._count.registrations >= camp.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Camp is full. Registration not available.'
      });
    }

    // Generate registration ID
    const registrationId = await generateRegistrationId(campId);

    // Calculate total amount
    const totalAmount = calculateTotalAmount(selectedServices);

    // Determine priority level
    const symptoms = {
      abdominalPain,
      bloatingGas,
      nauseaVomiting,
      heartburnAcidReflux,
      difficultySwallowing,
      bowelHabitsChange,
      unexplainedWeightLoss,
      lossOfAppetite,
      jaundiceYellowEyes
    };
    const priorityLevel = determinePriorityLevel(symptoms);

    // Create current symptoms array
    const currentSymptoms = [];
    if (abdominalPain) currentSymptoms.push('Abdominal pain');
    if (bloatingGas) currentSymptoms.push('Bloating/Gas');
    if (nauseaVomiting) currentSymptoms.push('Nausea/Vomiting');
    if (heartburnAcidReflux) currentSymptoms.push('Heartburn/Acid reflux');
    if (difficultySwallowing) currentSymptoms.push('Difficulty swallowing');
    if (bowelHabitsChange) currentSymptoms.push('Changes in bowel habits');
    if (unexplainedWeightLoss) currentSymptoms.push('Unexplained weight loss');
    if (lossOfAppetite) currentSymptoms.push('Loss of appetite');
    if (jaundiceYellowEyes) currentSymptoms.push('Jaundice/Yellow eyes');

    // Create previous history array
    const previousHistory = [];
    if (liverDisease) previousHistory.push('Liver disease');
    if (kidneyProblems) previousHistory.push('Kidney problems');
    if (heartConditions) previousHistory.push('Heart conditions');
    if (diabetes) previousHistory.push('Diabetes');
    if (highBloodPressure) previousHistory.push('High blood pressure');
    if (previousEndoscopy) previousHistory.push('Previous endoscopy/colonoscopy');

    const registration = await prisma.campRegistration.create({
      data: {
        campId,
        registrationId,
        fullName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        age: age ? parseInt(age) : null,
        gender,
        mobileNumber,
        address,
        emailId,
        emergencyContactName,
        emergencyContactNumber,
        selectedServices,
        endoscopySelected: selectedServices.includes('Endoscopy'),
        siboTestSelected: selectedServices.includes('SIBO Test'),
        healthCheckupSelected: selectedServices.includes('Complete Health Checkup'),
        totalAmount,
        currentSymptoms,
        abdominalPain: !!abdominalPain,
        bloatingGas: !!bloatingGas,
        nauseaVomiting: !!nauseaVomiting,
        heartburnAcidReflux: !!heartburnAcidReflux,
        difficultySwallowing: !!difficultySwallowing,
        bowelHabitsChange: !!bowelHabitsChange,
        unexplainedWeightLoss: !!unexplainedWeightLoss,
        lossOfAppetite: !!lossOfAppetite,
        jaundiceYellowEyes: !!jaundiceYellowEyes,
        previousHistory,
        liverDisease: !!liverDisease,
        kidneyProblems: !!kidneyProblems,
        heartConditions: !!heartConditions,
        diabetes: !!diabetes,
        highBloodPressure: !!highBloodPressure,
        previousEndoscopy: !!previousEndoscopy,
        alcoholConsumption: !!alcoholConsumption,
        alcoholFrequency,
        smoking: !!smoking,
        familyHistoryGastro: !!familyHistoryGastro,
        paymentStatus: paymentStatus || 'PENDING',
        preferredTimeSlot,
        consentForProcedures: !!consentForProcedures,
        priorityLevel,
        specialInstructions,
        followupRequired: !!followupRequired,
        fastingStatus: !!fastingStatus,
        currentMedications,
        bloodThinners: !!bloodThinners
      },
      include: {
        camp: true
      }
    });

    // Update camp registration count
    await prisma.camp.update({
      where: { id: campId },
      data: {
        currentRegistrations: {
          increment: 1
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Camp registration created successfully',
      data: registration
    });
  } catch (error) {
    console.error('Error creating camp registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create camp registration',
      error: error.message
    });
  }
});

module.exports = router;

