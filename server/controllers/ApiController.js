const User = require('../models/user'); // Assuming you have a User model
const jwt = require('jsonwebtoken');
const secretKey = 'lovementory'; // Replace 'your_secret_key' with your actual secret key
const bcrypt=require('bcrypt')
// Function to generate JWT token
const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role // Assuming 'role' is stored in the user object
    };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
};

const apiControllers = {

  register: async (req, res) => {
    try {
      const { email, phone, username, password, role } = req.body;
  
      // Check if user with the same email exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with hashed password
      const newUser = new User({ email, phone, username, password: hashedPassword, role });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the password is correct
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Generate and return a token (you can use JWT for this)
      const token = generateToken(user);

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = apiControllers;

