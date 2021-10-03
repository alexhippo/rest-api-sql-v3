const express = require('express');

const router = express.Router();
const User = require('../models').User;

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

// Return the list of users
router.get('/users', asyncHandler(async (req, res) => {
  let users = await User.findAll();
  res.json(users);
}));

// Create a user
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201)
      .location('/')
      .json({ "message": "User successfully created!" });
  } catch (error) {
    console.log('ERROR: ', error.name);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

module.exports = router;

