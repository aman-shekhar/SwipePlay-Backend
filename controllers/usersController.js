const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Create user in the database
    const user = await User.create({ username, email });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};
exports.createUser2 = async (req, res) => {
    try {
        res.status(500).json({
            success: true,
            message: 'User created successfully',
          });
    }
    catch (error) {
        // Return error response
        res.status(500).json({
          success: false,
          message: 'Failed to create user',
          error: error.message,
        });
      }
  };