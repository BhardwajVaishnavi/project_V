const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCampData() {
  try {
    console.log('🏕️ Seeding camp demo data...');

    // Get the demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'doctor@medical.com' }
    });

    if (!demoUser) {
      console.log('❌ Demo user not found. Please run the setup script first.');
      return;
    }

    // Create demo camps
    const camps = [
      {
        name: 'Health Screening Camp - Mumbai',
        venue: 'Community Health Center, Andheri West, Mumbai',
        date: new Date('2025-08-17T07:00:00.000Z'), // August 17, 2025 (Sunday)
        startTime: '07:00',
        endTime: '13:00',
        description: 'Comprehensive health screening camp focusing on gastroenterology and liver health. Free basic checkups and discounted specialized tests.',
        maxCapacity: 100,
        status: 'ACTIVE'
      },
      {
        name: 'Liver Health Awareness Camp - Delhi',
        venue: 'Max Hospital, Saket, New Delhi',
        date: new Date('2025-08-24T07:00:00.000Z'), // August 24, 2025 (Sunday)
        startTime: '07:00',
        endTime: '13:00',
        description: 'Specialized liver health camp with endoscopy services and SIBO testing. Expert consultation available.',
        maxCapacity: 75,
        status: 'ACTIVE'
      },
      {
        name: 'Digestive Health Camp - Bangalore',
        venue: 'Apollo Hospital, Bannerghatta Road, Bangalore',
        date: new Date('2025-08-31T07:00:00.000Z'), // August 31, 2025 (Sunday)
        startTime: '07:00',
        endTime: '13:00',
        description: 'Focus on digestive health disorders, SIBO testing, and preventive care. Nutritional counseling included.',
        maxCapacity: 80,
        status: 'ACTIVE'
      },
      {
        name: 'Rural Health Outreach - Pune',
        venue: 'Government Primary Health Center, Hadapsar, Pune',
        date: new Date('2025-09-07T07:00:00.000Z'), // September 7, 2025 (Sunday)
        startTime: '07:00',
        endTime: '13:00',
        description: 'Rural outreach program providing basic health checkups and awareness about liver diseases.',
        maxCapacity: 120,
        status: 'ACTIVE'
      },
      {
        name: 'Corporate Health Camp - Chennai',
        venue: 'Tech Park Convention Center, OMR, Chennai',
        date: new Date('2025-07-20T07:00:00.000Z'), // July 20, 2025 (Past date for demo)
        startTime: '07:00',
        endTime: '13:00',
        description: 'Corporate health screening for IT professionals. Focus on lifestyle-related digestive issues.',
        maxCapacity: 150,
        status: 'COMPLETED'
      }
    ];

    // Create camps
    const createdCamps = [];
    for (const campData of camps) {
      const existingCamp = await prisma.camp.findFirst({
        where: { 
          name: campData.name,
          venue: campData.venue 
        }
      });

      if (!existingCamp) {
        const camp = await prisma.camp.create({
          data: {
            ...campData,
            createdById: demoUser.id
          }
        });
        createdCamps.push(camp);
        console.log(`✅ Created camp: ${campData.name}`);
      } else {
        createdCamps.push(existingCamp);
        console.log(`⚠️  Camp "${campData.name}" already exists`);
      }
    }

    // Create demo registrations for some camps
    const registrations = [
      {
        campIndex: 0, // Mumbai camp
        registrations: [
          {
            fullName: 'Rajesh Kumar',
            age: 45,
            gender: 'MALE',
            mobileNumber: '9876543210',
            address: 'Flat 301, Sunrise Apartments, Andheri West, Mumbai - 400058',
            emailId: 'rajesh.kumar@email.com',
            emergencyContactName: 'Sunita Kumar',
            emergencyContactNumber: '9876543211',
            selectedServices: ['Complete Health Checkup', 'SIBO Test'],
            endoscopySelected: false,
            siboTestSelected: true,
            healthCheckupSelected: true,
            totalAmount: 1098,
            currentSymptoms: ['Abdominal pain', 'Bloating/Gas'],
            abdominalPain: true,
            bloatingGas: true,
            previousHistory: ['Diabetes'],
            diabetes: true,
            alcoholConsumption: false,
            smoking: false,
            familyHistoryGastro: true,
            paymentStatus: 'PAID',
            preferredTimeSlot: '8:00 AM - 9:00 AM',
            consentForProcedures: true,
            priorityLevel: 'NORMAL'
          },
          {
            fullName: 'Priya Sharma',
            age: 32,
            gender: 'FEMALE',
            mobileNumber: '9876543212',
            address: 'B-204, Green Valley Society, Malad East, Mumbai - 400097',
            emailId: 'priya.sharma@email.com',
            emergencyContactName: 'Amit Sharma',
            emergencyContactNumber: '9876543213',
            selectedServices: ['Endoscopy'],
            endoscopySelected: true,
            siboTestSelected: false,
            healthCheckupSelected: false,
            totalAmount: 999,
            currentSymptoms: ['Heartburn/Acid reflux', 'Difficulty swallowing'],
            heartburnAcidReflux: true,
            difficultySwallowing: true,
            previousHistory: [],
            alcoholConsumption: false,
            smoking: false,
            familyHistoryGastro: false,
            paymentStatus: 'PAID',
            preferredTimeSlot: '9:00 AM - 10:00 AM',
            consentForProcedures: true,
            fastingStatus: true,
            priorityLevel: 'HIGH'
          }
        ]
      },
      {
        campIndex: 1, // Delhi camp
        registrations: [
          {
            fullName: 'Vikram Singh',
            age: 38,
            gender: 'MALE',
            mobileNumber: '9876543214',
            address: 'House No. 45, Sector 12, Dwarka, New Delhi - 110075',
            emailId: 'vikram.singh@email.com',
            emergencyContactName: 'Kavita Singh',
            emergencyContactNumber: '9876543215',
            selectedServices: ['Complete Health Checkup'],
            endoscopySelected: false,
            siboTestSelected: false,
            healthCheckupSelected: true,
            totalAmount: 599,
            currentSymptoms: ['Unexplained weight loss', 'Loss of appetite'],
            unexplainedWeightLoss: true,
            lossOfAppetite: true,
            previousHistory: ['High blood pressure'],
            highBloodPressure: true,
            alcoholConsumption: true,
            alcoholFrequency: 'Occasionally',
            smoking: false,
            familyHistoryGastro: false,
            paymentStatus: 'PENDING',
            preferredTimeSlot: '10:00 AM - 11:00 AM',
            consentForProcedures: true,
            priorityLevel: 'HIGH'
          }
        ]
      }
    ];

    // Create registrations
    for (const campReg of registrations) {
      const camp = createdCamps[campReg.campIndex];
      if (!camp) continue;

      for (const regData of campReg.registrations) {
        // Generate registration ID
        const campDate = new Date(camp.date);
        const year = campDate.getFullYear();
        const month = String(campDate.getMonth() + 1).padStart(2, '0');
        const day = String(campDate.getDate()).padStart(2, '0');
        
        const existingCount = await prisma.campRegistration.count({
          where: { campId: camp.id }
        });
        
        const registrationId = `CAMP${year}${month}${day}${String(existingCount + 1).padStart(4, '0')}`;

        const existingRegistration = await prisma.campRegistration.findUnique({
          where: { registrationId }
        });

        if (!existingRegistration) {
          await prisma.campRegistration.create({
            data: {
              campId: camp.id,
              registrationId,
              ...regData
            }
          });
          
          // Update camp registration count
          await prisma.camp.update({
            where: { id: camp.id },
            data: {
              currentRegistrations: {
                increment: 1
              }
            }
          });
          
          console.log(`✅ Created registration: ${regData.fullName} for ${camp.name}`);
        } else {
          console.log(`⚠️  Registration for ${regData.fullName} already exists`);
        }
      }
    }

    console.log('🎉 Camp demo data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`• ${createdCamps.length} camps created`);
    console.log(`• Multiple registrations created for demonstration`);
    console.log(`• Camp management system ready for testing`);

  } catch (error) {
    console.error('❌ Error seeding camp data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCampData();
