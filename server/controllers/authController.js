import sequelize from '../conn.js'
import User from '../models/User.js'
import {isStrongPassword }from '../utils/auth.js'

const signupController = async (req, res) => {
  console.log(req.body);
  
  const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,  // This will be hashed in the User model
  };

  try {
      // Create the user
      const user = await User.create(userData);
      res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


const loginController = async (req, res) => {
    try {
      const requestData = req.body
      if (requestData) {
        const { email, password } = requestData
        const token = await User.matchPassword(email, password);
        res.json({ token });
      } else {
        res.status(400).json({ error: 'Invalid request format' });
      }
    } catch (e) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  };

export { signupController, loginController }