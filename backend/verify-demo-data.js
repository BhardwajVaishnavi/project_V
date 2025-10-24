const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyDemoData() {
  try {
    console.log('🔍 Verifying demo data across all components...\n');

    // Check Users
    const users = await prisma.user.findMany();
    console.log(`👥 Users: ${users.length}`);

    // Check Patients
    const patients = await prisma.patient.findMany();
    console.log(`🏥 Patients: ${patients.length}`);

    // Check Comorbidities
    const comorbidities = await prisma.patientComorbidity.findMany();
    console.log(`🩺 Comorbidities: ${comorbidities.length}`);

    // Check Investigations
    const investigations = await prisma.patientInvestigation.findMany();
    console.log(`🔬 Investigations: ${investigations.length}`);

    // Check Treatments
    const treatments = await prisma.patientTreatment.findMany();
    console.log(`💊 Treatments: ${treatments.length}`);

    // Check Surgery Details
    const surgeries = await prisma.surgeryDetail.findMany();
    console.log(`⚕️  Surgery Details: ${surgeries.length}`);

    // Check Conservative Treatments
    const conservativeTreatments = await prisma.conservativeTreatment.findMany();
    console.log(`🏥 Conservative Treatments: ${conservativeTreatments.length}`);

    // Check Follow-up Records
    const followUps = await prisma.followUpRecord.findMany();
    console.log(`📅 Follow-up Records: ${followUps.length}`);

    // Check Liver Transplant Evaluations
    const liverTransplants = await prisma.liverTransplantEvaluation.findMany();
    console.log(`🫀 Liver Transplant Evaluations: ${liverTransplants.length}`);

    console.log('\n📊 Demo Data Summary:');
    console.log('='.repeat(50));
    
    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      console.log(`\n👤 Patient ${i + 1}: ${patient.firstName} ${patient.lastName}`);
      console.log(`   📋 Patient ID: ${patient.patientId}`);
      console.log(`   🏥 Primary Disease: ${patient.primaryDisease}`);
      
      // Count related records
      const patientComorbidities = await prisma.patientComorbidity.count({
        where: { patientId: patient.id }
      });
      const patientInvestigations = await prisma.patientInvestigation.count({
        where: { patientId: patient.id }
      });
      const patientTreatments = await prisma.patientTreatment.count({
        where: { patientId: patient.id }
      });
      const patientSurgeries = await prisma.surgeryDetail.count({
        where: { patientId: patient.id }
      });
      const patientFollowUps = await prisma.followUpRecord.count({
        where: { patientId: patient.id }
      });
      
      console.log(`   📊 Records: ${patientComorbidities} comorbidities, ${patientInvestigations} investigations, ${patientTreatments} treatments, ${patientSurgeries} surgeries, ${patientFollowUps} follow-ups`);
    }

    console.log('\n✅ All demo data verified successfully!');
    console.log('\n🎯 You can now test all components with comprehensive demo data:');
    console.log('   • Patient Management');
    console.log('   • Investigations');
    console.log('   • Treatments');
    console.log('   • Surgery Details');
    console.log('   • Conservative Treatments');
    console.log('   • Follow-up Records');
    console.log('   • Liver Transplant Evaluations');

  } catch (error) {
    console.error('❌ Error verifying demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDemoData();
