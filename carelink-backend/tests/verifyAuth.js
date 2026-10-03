const mongoose = require('mongoose');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../src/models');
const { protect, restrictTo } = require('../src/middleware/auth.middleware');
require('dotenv').config();

async function runAuthVerification() {
  console.log('--- [CareLink] Verifying Authentication & RBAC ---');
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carelink');

    // 1. Test password hashing & user creation
    const email = `auth_test_${Date.now()}@carelink.in`;
    const password = 'SuperSecretPassword123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const testUser = await User.create({
      name: 'Dr. Auth Tester',
      email,
      password: hashedPassword,
      role: 'doctor',
      phone: '9998887770'
    });
    console.log('✓ Created test user with hashed password');

    // 2. Test password verification
    const isMatch = await bcrypt.compare(password, testUser.password);
    assert.strictEqual(isMatch, true, 'Valid password should match bcrypt hash');
    const isWrongMatch = await bcrypt.compare('WrongPassword', testUser.password);
    assert.strictEqual(isWrongMatch, false, 'Invalid password should not match');
    console.log('✓ Bcrypt password verification passes');

    // 3. Test JWT token signing and verification
    const secret = process.env.JWT_SECRET || 'carelink_dev_secret_key_2026_super_secure_jwt';
    const token = jwt.sign({ id: testUser._id }, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.id.toString(), testUser._id.toString(), 'Decoded token ID must match');
    console.log('✓ JWT issuance and verification passes');

    // 4. Test protect middleware behavior
    const mockReq = {
      headers: { authorization: `Bearer ${token}` }
    };
    let nextCalled = false;
    const mockNext = () => { nextCalled = true; };
    const mockRes = {
      status: (code) => ({
        json: (data) => ({ code, data })
      })
    };

    await protect(mockReq, mockRes, mockNext);
    assert.strictEqual(nextCalled, true, 'protect middleware should call next() for valid token');
    assert.strictEqual(mockReq.user._id.toString(), testUser._id.toString(), 'User object should be attached to req');
    console.log('✓ protect middleware properly validates token and attaches user');

    // 5. Test restrictTo middleware
    let rolePassed = false;
    const doctorGuard = restrictTo('doctor', 'admin');
    doctorGuard(mockReq, mockRes, () => { rolePassed = true; });
    assert.strictEqual(rolePassed, true, 'Doctor should be permitted through doctor guard');

    let patientBlocked = false;
    const patientReq = { user: { role: 'patient' } };
    const patientRes = {
      status: (code) => ({
        json: (data) => {
          if (code === 403) patientBlocked = true;
        }
      })
    };
    doctorGuard(patientReq, patientRes, () => {});
    assert.strictEqual(patientBlocked, true, 'Patient role should be blocked from doctor-only route (403)');
    console.log('✓ restrictTo RBAC guard properly authorizes and rejects roles');

    // Cleanup
    await User.findByIdAndDelete(testUser._id);
    console.log('✓ Cleanup complete');

    console.log('\n>>> AUTHENTICATION & RBAC TESTS PASSED SUCCESSFULLY <<<');
    process.exit(0);
  } catch (err) {
    console.error('Error during auth verification:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runAuthVerification();
