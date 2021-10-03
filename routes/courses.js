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


module.exports = router;

