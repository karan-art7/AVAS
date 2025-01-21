const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const bcrypt = require('bcrypt');


router.post('/submit-users', async (req, res) => {
  try {
    const { name, email, phone, password, cpassword } = req.body;

    if (password !== cpassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Number already Registered' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already Registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password during Signup:', hashedPassword);

    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    res.status(201).json({
      success: true,
      message: 'User Registered successfully',
      user: userData,
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.post('/login-users', async (req, res) => {
  try {
    const { input, password } = req.body;  // `input` could be email or phone

    if (!input || !password) {
      return res.status(400).json({ success: false, message: 'Missing email/phone or password' });
    }

    let user;
    if (input.includes('@')) {  // Check if it's an email
      user = await User.findOne({ email: input });
    } else {
      user = await User.findOne({ phone: input });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'User is not Registered' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Wrong password' });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




module.exports = router;
