const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDemoData() {
  try {
    console.log('🌱 Seeding comprehensive demo data for all components...');

    // Get or create demo users
    let demoUser = await prisma.user.findUnique({
      where: { email: 'doctor@medical.com' }
    });

    if (!demoUser) {
      console.log('Creating demo user...');
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      demoUser = await prisma.user.create({
        data: {
          email: 'doctor@medical.com',
          password: hashedPassword,
          firstName: 'Dr. John',
          lastName: 'Doe',
          role: 'DOCTOR'
        }
      });
      console.log('✅ Created demo user');
    }

    // Create comprehensive demo patients
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
        bmi: 22.86,
        aadharNumber: '123456789012',
        referredBy: 'Dr. Sharma',
        occupation: 'Engineer',
        bloodGroup: 'B+',
        meldScore: 18,
        transplantType: 'LDLT'
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
        bmi: 22.04,
        aadharNumber: '123456789013',
        referredBy: 'Dr. Patel',
        occupation: 'Teacher',
        bloodGroup: 'A+',
        meldScore: 22,
        transplantType: 'DDLT'
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
        bmi: 26.23,
        aadharNumber: '123456789014',
        referredBy: 'Dr. Kumar',
        occupation: 'Business Owner',
        bloodGroup: 'O+',
        meldScore: 25,
        transplantType: 'LDLT'
      },
      {
        patientId: 'PAT004',
        firstName: 'Priya',
        lastName: 'Sharma',
        dateOfBirth: new Date('1990-05-18'),
        sex: 'FEMALE',
        mobile: '9876543213',
        email: 'priya.sharma@email.com',
        houseVillage: '321 Garden Street',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        primaryDisease: 'Fatty Liver Disease',
        height: 160,
        weight: 65,
        bmi: 25.39,
        aadharNumber: '123456789015',
        referredBy: 'Dr. Reddy',
        occupation: 'Software Developer',
        bloodGroup: 'AB+',
        meldScore: 15,
        transplantType: 'DDLT'
      },
      {
        patientId: 'PAT005',
        firstName: 'Rajesh',
        lastName: 'Gupta',
        dateOfBirth: new Date('1965-12-03'),
        sex: 'MALE',
        mobile: '9876543214',
        email: 'rajesh.gupta@email.com',
        houseVillage: '654 Market Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        primaryDisease: 'Liver Transplant Candidate',
        height: 170,
        weight: 75,
        bmi: 25.96,
        aadharNumber: '123456789016',
        referredBy: 'Dr. Singh',
        occupation: 'Retired',
        bloodGroup: 'O-',
        meldScore: 30,
        transplantType: 'DDLT'
      }
    ];

    // Create patients
    const createdPatients = [];
    for (const patientData of patients) {
      const existingPatient = await prisma.patient.findUnique({
        where: { patientId: patientData.patientId }
      });

      if (!existingPatient) {
        const patient = await prisma.patient.create({
          data: {
            ...patientData,
            createdById: demoUser.id,
            updatedById: demoUser.id
          }
        });
        createdPatients.push(patient);
        console.log(`✅ Created patient: ${patientData.firstName} ${patientData.lastName}`);
      } else {
        createdPatients.push(existingPatient);
        console.log(`⚠️  Patient ${patientData.patientId} already exists`);
      }
    }

    // Create comprehensive demo data for each patient
    for (let i = 0; i < createdPatients.length; i++) {
      const patient = createdPatients[i];

      // 1. Create Comorbidities
      await createComorbidities(patient.id, i);

      // 2. Create Investigations
      await createInvestigations(patient.id, i);

      // 3. Create Treatments
      await createTreatments(patient.id, i);

      // 4. Create Surgery Details (for some patients)
      if (i % 2 === 0) {
        await createSurgeryDetails(patient.id, i);
      }

      // 5. Create Conservative Treatments
      if (i % 3 === 0) {
        await createConservativeTreatments(patient.id, i);
      }

      // 6. Create Follow-up Records
      await createFollowUpRecords(patient.id, i);

      // 7. Create Liver Transplant Evaluation (for specific patients)
      if (i === 4) { // Last patient
        await createLiverTransplantEvaluation(patient.id);
      }
    }

    console.log('🎉 Comprehensive demo data seeded successfully for all components!');
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to create comorbidities
async function createComorbidities(patientId, index) {
  const comorbiditiesData = [
    {
      diabetes: true,
      hypertension: true,
      hyperlipidemia: false,
      hypothyroid: false,
      cardiacDisease: false,
      pulmonaryDisease: false,
      neurologicalDisease: false,
      rheumatologicalDisease: false,
      otherDiseases: 'None',
      charlsonComorbidityIndex: 3,
      asaGrade: 2,
      ecogGrade: 1,
      symptoms: 'Fatigue, abdominal pain',
      clinicalExamination: 'Hepatomegaly present',
      investigations: 'Elevated liver enzymes'
    },
    {
      diabetes: false,
      hypertension: true,
      hyperlipidemia: true,
      hypothyroid: true,
      cardiacDisease: false,
      pulmonaryDisease: false,
      neurologicalDisease: false,
      rheumatologicalDisease: false,
      otherDiseases: 'Thyroid disorder',
      charlsonComorbidityIndex: 2,
      asaGrade: 2,
      ecogGrade: 0,
      symptoms: 'Weakness, weight loss',
      clinicalExamination: 'Jaundice present',
      investigations: 'Viral markers positive'
    },
    {
      diabetes: true,
      hypertension: true,
      hyperlipidemia: true,
      hypothyroid: false,
      cardiacDisease: true,
      pulmonaryDisease: false,
      neurologicalDisease: false,
      rheumatologicalDisease: false,
      otherDiseases: 'Coronary artery disease',
      charlsonComorbidityIndex: 4,
      asaGrade: 3,
      ecogGrade: 2,
      symptoms: 'Abdominal distension, loss of appetite',
      clinicalExamination: 'Ascites present',
      investigations: 'Tumor markers elevated'
    }
  ];

  const data = comorbiditiesData[index % comorbiditiesData.length];
  await prisma.patientComorbidity.create({
    data: {
      patientId,
      ...data
    }
  });
  console.log(`✅ Created comorbidities for patient ${index + 1}`);
}

// Helper function to create investigations
async function createInvestigations(patientId, index) {
  const investigationsData = [
    {
      investigationType: 'ULTRASONOGRAPHY',
      status: 'COMPLETED',
      findings: 'Liver shows signs of cirrhosis with irregular surface and coarse echotexture',
      ultrasonographyDate: new Date('2024-01-15'),
      ultrasonographyFindings: 'Liver shows signs of cirrhosis with irregular surface and coarse echotexture. Portal vein diameter 12mm.'
    },
    {
      investigationType: 'BLOOD_TEST',
      status: 'COMPLETED',
      findings: 'Elevated liver enzymes, positive viral markers'
    },
    {
      investigationType: 'CECT_ABDOMEN',
      status: 'COMPLETED',
      findings: 'Multiple hypodense lesions in liver consistent with metastases',
      cectAbdomenDate: new Date('2024-01-20'),
      cectAbdomenFindings: 'Multiple hypodense lesions in liver consistent with metastases. Largest lesion measures 4.2 cm in segment VII.'
    },
    {
      investigationType: 'UPPER_GI_ENDOSCOPY',
      status: 'COMPLETED',
      findings: 'Grade II esophageal varices, portal hypertensive gastropathy',
      upperGIEndoscopyDate: new Date('2024-01-25'),
      upperGIEndoscopyFindings: 'Grade II esophageal varices, portal hypertensive gastropathy. No active bleeding.'
    },
    {
      investigationType: 'PET_CT_SCAN',
      status: 'PENDING',
      findings: 'Scheduled for next week',
      petCtScanFindings: 'Awaiting results'
    }
  ];

  // Create 2-3 investigations per patient
  const numInvestigations = Math.min(3, investigationsData.length);
  for (let i = 0; i < numInvestigations; i++) {
    const data = investigationsData[(index + i) % investigationsData.length];
    await prisma.patientInvestigation.create({
      data: {
        patientId,
        ...data
      }
    });
  }
  console.log(`✅ Created ${numInvestigations} investigations for patient ${index + 1}`);
}

// Helper function to create treatments
async function createTreatments(patientId, index) {
  const treatmentsData = [
    {
      finalDiagnosis: 'Liver Cirrhosis - Child Pugh Class B',
      diseaseStage: 'Stage 3',
      treatmentPlan: 'Conservative management with regular monitoring',
      medication1: 'Lactulose 15ml TID',
      medication2: 'Propranolol 40mg BD',
      medication3: 'Ursodeoxycholic acid 300mg BD',
      medication4: 'Vitamin B complex',
      medication5: 'Calcium carbonate',
      primaryTreatmentPlan: 'CONSERVATIVE',
      admissionDate: new Date('2024-01-10')
    },
    {
      finalDiagnosis: 'Chronic Hepatitis B',
      diseaseStage: 'Active phase',
      treatmentPlan: 'Antiviral therapy and monitoring',
      medication1: 'Tenofovir 300mg OD',
      medication2: 'Multivitamin',
      medication3: 'Hepatoprotective agents',
      primaryTreatmentPlan: 'CONSERVATIVE',
      admissionDate: new Date('2024-01-12')
    },
    {
      finalDiagnosis: 'Hepatocellular Carcinoma',
      diseaseStage: 'T2N0M0',
      treatmentPlan: 'Surgical resection followed by adjuvant therapy',
      medication1: 'Sorafenib 400mg BD',
      medication2: 'Ondansetron 8mg TID',
      medication3: 'Pantoprazole 40mg OD',
      primaryTreatmentPlan: 'SURGERY',
      admissionDate: new Date('2024-01-15')
    }
  ];

  const data = treatmentsData[index % treatmentsData.length];
  await prisma.patientTreatment.create({
    data: {
      patientId,
      ...data
    }
  });
  console.log(`✅ Created treatment for patient ${index + 1}`);
}

// Helper function to create surgery details
async function createSurgeryDetails(patientId, index) {
  const surgeryData = [
    {
      planDate: new Date('2024-02-01'),
      nameOfSurgery: 'Right Hepatectomy',
      risksAssociated: 'Bleeding, infection, bile leak, liver failure',
      consentObtained: true,
      dateOfSurgery: new Date('2024-02-05'),
      surgeon: 'Dr. Smith',
      assistantSurgeon: 'Dr. Johnson',
      otFindings: 'Large tumor in right lobe of liver, no peritoneal deposits',
      otProcedure: 'Right hepatectomy with lymph node dissection',
      hospitalCourse: 'Uneventful recovery, mobilized on POD 2',
      complications: 'None',
      clavienDindoGrade: 1,
      dateOfDischarge: new Date('2024-02-12'),
      dischargeMedication1: 'Paracetamol 500mg TID',
      dischargeMedication2: 'Pantoprazole 40mg OD',
      dischargeMedication3: 'Multivitamin',
      dischargeAdvice: 'Regular follow-up, avoid heavy lifting',
      nextFollowUp: new Date('2024-02-26')
    },
    {
      planDate: new Date('2024-02-10'),
      nameOfSurgery: 'Laparoscopic Liver Resection',
      risksAssociated: 'Conversion to open, bleeding, infection',
      consentObtained: true,
      dateOfSurgery: new Date('2024-02-15'),
      surgeon: 'Dr. Brown',
      assistantSurgeon: 'Dr. Davis',
      otFindings: 'Single lesion in segment VI, suitable for laparoscopic approach',
      otProcedure: 'Laparoscopic segmentectomy VI',
      hospitalCourse: 'Smooth recovery, early mobilization',
      complications: 'Minor bile leak, managed conservatively',
      clavienDindoGrade: 2,
      dateOfDischarge: new Date('2024-02-20'),
      dischargeMedication1: 'Ibuprofen 400mg BD',
      dischargeMedication2: 'Omeprazole 20mg OD',
      dischargeAdvice: 'Gradual return to activities',
      nextFollowUp: new Date('2024-03-05')
    }
  ];

  const data = surgeryData[index % surgeryData.length];
  await prisma.surgeryDetail.create({
    data: {
      patientId,
      ...data
    }
  });
  console.log(`✅ Created surgery details for patient ${index + 1}`);
}

// Helper function to create conservative treatments
async function createConservativeTreatments(patientId, index) {
  const conservativeData = [
    {
      treatmentGiven: 'Medical management with diuretics and dietary modifications',
      icuStay: false,
      wardStay: true,
      hospitalStay: 7,
      planForSurgery: true,
      planDateOfSurgery: new Date('2024-03-15'),
      nextFollowUpDate: new Date('2024-02-28'),
      dischargeMedication1: 'Furosemide 40mg OD',
      dischargeMedication2: 'Spironolactone 25mg OD',
      dischargeMedication3: 'Lactulose 15ml TID',
      dischargeMedication4: 'Rifaximin 400mg BD',
      furtherPlanOfManagement: 'Continue medical therapy, reassess for surgery in 6 weeks'
    },
    {
      treatmentGiven: 'Supportive care with nutritional support',
      icuStay: true,
      wardStay: true,
      hospitalStay: 14,
      planForSurgery: false,
      nextFollowUpDate: new Date('2024-03-01'),
      dischargeMedication1: 'Protein supplements',
      dischargeMedication2: 'Multivitamin',
      dischargeMedication3: 'Calcium carbonate',
      furtherPlanOfManagement: 'Continue supportive care, monitor liver function'
    }
  ];

  const data = conservativeData[index % conservativeData.length];
  await prisma.conservativeTreatment.create({
    data: {
      patientId,
      ...data
    }
  });
  console.log(`✅ Created conservative treatment for patient ${index + 1}`);
}

// Helper function to create follow-up records
async function createFollowUpRecords(patientId, index) {
  const followUpData = [
    {
      followUpDate: new Date('2024-03-01'),
      finalBiopsy: 'Hepatocellular carcinoma, well differentiated',
      stageOfDisease: 'T1N0M0',
      chemotherapyDetails: 'Not indicated',
      radiotherapyDetails: 'Not indicated',
      nextFollowUpDate: new Date('2024-06-01'),
      status: 'COMPLETED',
      notes: 'Patient doing well, no recurrence'
    },
    {
      followUpDate: new Date('2024-02-15'),
      finalBiopsy: 'Chronic hepatitis with fibrosis',
      stageOfDisease: 'F3',
      chemotherapyDetails: 'Not applicable',
      radiotherapyDetails: 'Not applicable',
      nextFollowUpDate: new Date('2024-05-15'),
      status: 'COMPLETED',
      notes: 'Stable condition, continue current medications'
    },
    {
      followUpDate: new Date('2024-04-01'),
      finalBiopsy: 'Pending',
      stageOfDisease: 'Under evaluation',
      nextFollowUpDate: new Date('2024-07-01'),
      status: 'SCHEDULED',
      notes: 'Scheduled for routine follow-up'
    }
  ];

  const data = followUpData[index % followUpData.length];
  await prisma.followUpRecord.create({
    data: {
      patientId,
      ...data
    }
  });
  console.log(`✅ Created follow-up record for patient ${index + 1}`);
}

// Helper function to create liver transplant evaluation
async function createLiverTransplantEvaluation(patientId) {
  const liverTransplantData = {
    name: 'Rajesh Gupta',
    age: 59,
    sex: 'MALE',
    mrn: 'MRN005',
    address: '654 Market Road, Pune, Maharashtra',
    mobileNumber: '9876543214',
    heightCm: 170,
    weightKg: 75,
    bmiKgM2: 25.96,
    performanceStatus: 'Good',
    ecogClass: 1,
    sarcopenia: false,
    childScore: 9,
    meldNaScore: 18,
    etiologyNonAlcoholic: 'Hepatitis B cirrhosis',
    decompensation: 'Ascites, varices',
    comorbidities: 'Diabetes, Hypertension',
    sixMinuteWalkTest: '450 meters',
    bloodGroupSubtype: 'B+',
    // CBC
    hemoglobin: 11.2,
    totalCount: 6500,
    plateletCount: 85000,
    hematocrit: 34.5,
    // LFT
    totalBilirubin: 3.8,
    directBilirubin: 2.9,
    indirectBilirubin: 0.9,
    sgot: 89,
    sgpt: 76,
    alkalinePhosphatase: 156,
    albumin: 2.8,
    totalProtein: 6.2,
    // KFT
    urea: 45,
    creatinine: 1.2,
    sodium: 135,
    potassium: 4.1,
    chloride: 98,
    // Blood Sugar
    rbs: 145,
    fbs: 118,
    twoHrPpbs: 165,
    hba1c: 7.2,
    // Coagulation
    ptInr: 1.8,
    aptt: 45,
    thrombinTime: 18
  };

  await prisma.liverTransplantEvaluation.create({
    data: {
      patientId,
      ...liverTransplantData
    }
  });
  console.log(`✅ Created liver transplant evaluation`);
}

// Run the seeding
seedDemoData();
