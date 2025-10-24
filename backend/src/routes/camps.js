const express = require('express');
const { body, validationResult, query } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();


// Validation middleware for camp creation
const validateCamp = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Camp name must be at least 3 characters long'),
  body('venue')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Venue must be at least 5 characters long'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('startTime')
    .trim()
    .notEmpty()
    .withMessage('Start time is required'),
  body('endTime')
    .trim()
    .notEmpty()
    .withMessage('End time is required'),
  body('maxCapacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max capacity must be a positive number')
];

// Validation middleware for camp registration
const validateCampRegistration = [
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

// @route   GET /api/camps
// @desc    Get all camps with pagination
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [camps, total] = await Promise.all([
      prisma.camp.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: {
              registrations: true
            }
          }
        }
      }),
      prisma.camp.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      success: true,
      data: {
        camps,
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
    console.error('Error fetching camps:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch camps',
      error: error.message
    });
  }
});

// @route   GET /api/camps/:id
// @desc    Get camp by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const camp = await prisma.camp.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        registrations: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: true
          }
        }
      }
    });

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: 'Camp not found'
      });
    }

    res.json({
      success: true,
      data: camp
    });
  } catch (error) {
    console.error('Error fetching camp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch camp',
      error: error.message
    });
  }
});

// @route   POST /api/camps
// @desc    Create new camp
// @access  Private
router.post('/', validateCamp, async (req, res) => {
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
      name,
      venue,
      date,
      startTime,
      endTime,
      description,
      maxCapacity
    } = req.body;

    const camp = await prisma.camp.create({
      data: {
        name,
        venue,
        date: new Date(date),
        startTime,
        endTime,
        description,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
        createdById: req.user.id
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Camp created successfully',
      data: camp
    });
  } catch (error) {
    console.error('Error creating camp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create camp',
      error: error.message
    });
  }
});

// @route   PUT /api/camps/:id
// @desc    Update camp
// @access  Private
router.put('/:id', validateCamp, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const {
      name,
      venue,
      date,
      startTime,
      endTime,
      description,
      maxCapacity,
      status
    } = req.body;

    const camp = await prisma.camp.update({
      where: { id },
      data: {
        name,
        venue,
        date: new Date(date),
        startTime,
        endTime,
        description,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
        status
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Camp updated successfully',
      data: camp
    });
  } catch (error) {
    console.error('Error updating camp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update camp',
      error: error.message
    });
  }
});

// @route   DELETE /api/camps/:id
// @desc    Delete camp
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if camp has registrations
    const registrationCount = await prisma.campRegistration.count({
      where: { campId: id }
    });

    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete camp with existing registrations'
      });
    }

    await prisma.camp.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Camp deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting camp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete camp',
      error: error.message
    });
  }
});

module.exports = router;

