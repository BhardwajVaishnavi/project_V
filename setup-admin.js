const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Setting up admin user...');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@medical.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@medical.com');
      console.log('🔑 Password: admin123');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@medical.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@medical.com');
    console.log('🔑 Password: admin123');
    console.log('👤 User ID:', adminUser.id);

    // Create a sample patient for testing
    const samplePatient = await prisma.patient.create({
      data: {
        patientId: 'PAT001',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-15'),
        sex: 'MALE',
        mobile: '9876543210',
        state: 'Maharashtra',
        city: 'Mumbai',
        dateOfVisit: new Date(),
        createdBy: adminUser.id
      }
    });

    console.log('✅ Sample patient created for testing');
    console.log('👤 Patient ID:', samplePatient.patientId);

  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
