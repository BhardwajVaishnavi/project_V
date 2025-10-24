const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixDemoUser() {
  try {
    console.log('🔧 Fixing demo user credentials...\n');

    // First, let's see what users exist
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    console.log(`📊 Current users in database (${allUsers.length}):`);
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.role} - ${user.isActive ? 'Active' : 'Inactive'}`);
    });

    // Check if demo user exists
    let demoUser = await prisma.user.findUnique({
      where: { email: 'doctor@medical.com' }
    });

    if (demoUser) {
      console.log('\n✅ Demo user found, updating password...');
      
      // Hash the password properly
      const hashedPassword = await bcrypt.hash('doctor123', 12);
      
      // Update the user
      const updatedUser = await prisma.user.update({
        where: { id: demoUser.id },
        data: { 
          password: hashedPassword,
          isActive: true // Make sure user is active
        }
      });
      
      console.log('✅ Demo user password updated successfully');
      
      // Test the password
      const isPasswordValid = await bcrypt.compare('doctor123', updatedUser.password);
      console.log(`🔍 Password test: ${isPasswordValid ? 'VALID ✅' : 'INVALID ❌'}`);
      
    } else {
      console.log('\n❌ Demo user not found, creating new one...');
      
      // Create demo user
      const hashedPassword = await bcrypt.hash('doctor123', 12);
      
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
      
      console.log('✅ Demo user created successfully');
      console.log(`🆔 User ID: ${newUser.id}`);
      
      // Test the password
      const isPasswordValid = await bcrypt.compare('doctor123', newUser.password);
      console.log(`🔍 Password test: ${isPasswordValid ? 'VALID ✅' : 'INVALID ❌'}`);
    }

    // Also create an admin user if it doesn't exist
    let adminUser = await prisma.user.findUnique({
      where: { email: 'admin@medical.com' }
    });

    if (!adminUser) {
      console.log('\n🔧 Creating admin user...');
      const adminPassword = await bcrypt.hash('admin123', 12);
      
      await prisma.user.create({
        data: {
          email: 'admin@medical.com',
          password: adminPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          isActive: true
        }
      });
      
      console.log('✅ Admin user created');
    }

    console.log('\n🎉 User setup completed!');
    console.log('\n📋 Login Credentials:');
    console.log('👨‍⚕️ Doctor: doctor@medical.com / doctor123');
    console.log('👨‍💼 Admin:  admin@medical.com / admin123');

  } catch (error) {
    console.error('❌ Error fixing demo user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDemoUser();
