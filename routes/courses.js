const express = require('express');

const router = express.Router();
const Course = require('../models').Course;

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

// Return all courses
router.get('/courses', asyncHandler(async (req, res) => {
  let courses = await Course.findAll();
  res.json(courses);
}));

// Return a specific course
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    res.json(course);
  } else {
    res.json({
      "message": "Sorry, we couldn't find the course you were looking for."
    });
  }
}));

// Create a course
router.post('/courses', asyncHandler(async (req, res) => {
  try {
    await Course.create(req.body);
    res.status(201)
      .location('/')
      .end();
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

