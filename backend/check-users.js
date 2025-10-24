const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    console.log(`📊 Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.role} - ${user.isActive ? 'Active' : 'Inactive'}`);
    });

    // Check if demo user exists
    const demoUser = await prisma.user.findUnique({
      where: { email: 'doctor@medical.com' }
    });

    if (demoUser) {
      console.log('\n✅ Demo user found:');
      console.log(`   Name: ${demoUser.firstName} ${demoUser.lastName}`);
      console.log(`   Email: ${demoUser.email}`);
      console.log(`   Role: ${demoUser.role}`);
      console.log(`   Active: ${demoUser.isActive}`);
      
      // Test password
      const testPassword = 'doctor123';
      const isPasswordValid = await bcrypt.compare(testPassword, demoUser.password);
      console.log(`   Password '${testPassword}' is ${isPasswordValid ? 'VALID' : 'INVALID'}`);
      
      if (!isPasswordValid) {
        console.log('\n🔧 Fixing demo user password...');
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        await prisma.user.update({
          where: { id: demoUser.id },
          data: { password: hashedPassword }
        });
        console.log('✅ Demo user password updated');
      }
    } else {
      console.log('\n❌ Demo user not found. Creating demo user...');
      
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      const newUser = await prisma.user.create({
        data: {
          email: 'doctor@medical.com',
          password: hashedPassword,
          firstName: 'Dr. John',
          lastName: 'Doe',
          role: 'DOCTOR',
          isActive: true
        }
      });
      
      console.log('✅ Demo user created:');
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Name: ${newUser.firstName} ${newUser.lastName}`);
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
