const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePatientFields() {
  try {
    console.log('🔄 Updating existing patients with new fields...\n');

    // Define the updates for each patient
    const patientUpdates = [
      {
        patientId: 'PAT001',
        bloodGroup: 'B+',
        meldScore: 18,
        transplantType: 'LDLT'
      },
      {
        patientId: 'PAT002',
        bloodGroup: 'A+',
        meldScore: 22,
        transplantType: 'DDLT'
      },
      {
        patientId: 'PAT003',
        bloodGroup: 'O+',
        meldScore: 25,
        transplantType: 'LDLT'
      },
      {
        patientId: 'PAT004',
        bloodGroup: 'AB+',
        meldScore: 15,
        transplantType: 'DDLT'
      },
      {
        patientId: 'PAT005',
        bloodGroup: 'O-',
        meldScore: 30,
        transplantType: 'DDLT'
      }
    ];

    // Update each patient
    for (const update of patientUpdates) {
      try {
        const updatedPatient = await prisma.patient.update({
          where: { patientId: update.patientId },
          data: {
            bloodGroup: update.bloodGroup,
            meldScore: update.meldScore,
            transplantType: update.transplantType
          }
        });

        console.log(`✅ Updated ${update.patientId}: ${updatedPatient.firstName} ${updatedPatient.lastName}`);
        console.log(`   Blood Group: ${update.bloodGroup}, MELD: ${update.meldScore}, Type: ${update.transplantType}`);
      } catch (error) {
        console.error(`❌ Failed to update ${update.patientId}:`, error.message);
      }
    }

    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const patients = await prisma.patient.findMany({
      where: {
        patientId: {
          in: patientUpdates.map(u => u.patientId)
        }
      },
      select: {
        patientId: true,
        firstName: true,
        lastName: true,
        bloodGroup: true,
        meldScore: true,
        transplantType: true
      }
    });

    console.log('\n📊 Updated Patient Summary:');
    patients.forEach(patient => {
      console.log(`${patient.patientId}: ${patient.firstName} ${patient.lastName}`);
      console.log(`  Blood Group: ${patient.bloodGroup || 'Not set'}`);
      console.log(`  MELD Score: ${patient.meldScore || 'Not set'}`);
      console.log(`  Transplant Type: ${patient.transplantType || 'Not set'}`);
      console.log('');
    });

    console.log('🎉 Patient fields updated successfully!');

  } catch (error) {
    console.error('❌ Error updating patient fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePatientFields();
