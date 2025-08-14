const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDemoData() {
  try {
    console.log('🌱 Seeding demo data...');

    // Get the demo user first
    const demoUser = await prisma.user.findUnique({
      where: { email: 'doctor@medical.com' }
    });

    if (!demoUser) {
      console.log('❌ Demo user not found. Please run the setup script first.');
      return;
    }

    // Create demo patients
    const patients = [
      {
        patientId: 'PAT001',
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: new Date('1979-01-15'),
        sex: 'MALE',
        mobile: '9876543210',
        email: 'john.smith@email.com',
        houseVillage: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        primaryDisease: 'Liver Cirrhosis',
        height: 175,
        weight: 70,
        bmi: 22.86
      },
      {
        patientId: 'PAT002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: new Date('1986-03-22'),
        sex: 'FEMALE',
        mobile: '9876543211',
        email: 'sarah.johnson@email.com',
        houseVillage: '456 Oak Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        primaryDisease: 'Hepatitis B',
        height: 165,
        weight: 60,
        bmi: 22.04
      },
      {
        patientId: 'PAT003',
        firstName: 'Michael',
        lastName: 'Brown',
        dateOfBirth: new Date('1972-07-10'),
        sex: 'MALE',
        mobile: '9876543212',
        email: 'michael.brown@email.com',
        houseVillage: '789 Pine Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        primaryDisease: 'Liver Cancer',
        height: 180,
        weight: 85,
        bmi: 26.23
      }
    ];

    for (const patientData of patients) {
      const existingPatient = await prisma.patient.findUnique({
        where: { patientId: patientData.patientId }
      });

      if (!existingPatient) {
        await prisma.patient.create({
          data: {
            ...patientData,
            createdById: demoUser.id,
            updatedById: demoUser.id
          }
        });
        console.log(`✅ Created patient: ${patientData.firstName} ${patientData.lastName}`);
      } else {
        console.log(`⚠️  Patient ${patientData.patientId} already exists`);
      }
    }

    // Create some demo investigations
    const patients_list = await prisma.patient.findMany();
    
    if (patients_list.length > 0) {
      const investigations = [
        {
          patientId: patients_list[0].id,
          investigationType: 'ULTRASONOGRAPHY',
          status: 'COMPLETED',
          findings: 'Liver shows signs of cirrhosis with irregular surface',
          ultrasonographyFindings: 'Liver shows signs of cirrhosis with irregular surface'
        },
        {
          patientId: patients_list[1].id,
          investigationType: 'BLOOD_TEST',
          status: 'PENDING',
          findings: 'Pending blood work'
        }
      ];

      for (const invData of investigations) {
        await prisma.patientInvestigation.create({
          data: invData
        });
        console.log(`✅ Created investigation for patient`);
      }
    }

    console.log('🎉 Demo data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDemoData();
