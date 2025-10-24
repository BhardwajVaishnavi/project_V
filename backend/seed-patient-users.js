const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedPatientUsers() {
  try {
    console.log('🌱 Seeding demo patient users...');

    // Demo patient users with credentials
    const patientUsers = [
      {
        email: 'patient1@example.com',
        password: 'password123',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        role: 'DOCTOR' // Using DOCTOR role for patients
      },
      {
        email: 'patient2@example.com',
        password: 'password123',
        firstName: 'Priya',
        lastName: 'Singh',
        role: 'DOCTOR'
      },
      {
        email: 'patient3@example.com',
        password: 'password123',
        firstName: 'Amit',
        lastName: 'Patel',
        role: 'DOCTOR'
      },
      {
        email: 'patient4@example.com',
        password: 'password123',
        firstName: 'Neha',
        lastName: 'Sharma',
        role: 'DOCTOR'
      },
      {
        email: 'patient5@example.com',
        password: 'password123',
        firstName: 'Vikram',
        lastName: 'Verma',
        role: 'DOCTOR'
      }
    ];

    for (const userData of patientUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            isActive: true
          }
        });
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    console.log('\n📋 Demo Patient Credentials:');
    console.log('================================');
    patientUsers.forEach((user, index) => {
      console.log(`\nPatient ${index + 1}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Name: ${user.firstName} ${user.lastName}`);
    });
    console.log('\n================================');

    console.log('\n✅ Demo patient users seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding demo patient users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPatientUsers();

