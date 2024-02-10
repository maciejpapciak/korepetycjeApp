const express = require('express');
const { param, body } = require('express-validator');
const calendarController = require('../controllers/calendar.controller');

const router = express.Router();

router.get('/calendar', calendarController.getAll);

router.get(
  '/calendar/:id',
  param('id').isString().notEmpty(),
  calendarController.getByUserId
);

router.post(
  '/calendar',
  body('timeStart').isString().notEmpty(),
  body('timeEnd').isString().notEmpty(),
  body('weekday').isString().notEmpty(),
  body('title').isString().notEmpty(),
  calendarController.createCalendar
);

router.put(
  '/calendar/:id',
  param('id').isString().notEmpty(),
  body('timeStart').isString().notEmpty(),
  body('timeEnd').isString().notEmpty(),
  body('weekday').isString().notEmpty(),
  body('title').isString().notEmpty(),
  calendarController.updateCalendar
);

router.delete(
  '/calendar/:id',
  param('id').isString().notEmpty(),
  calendarController.deleteCalendar
);

module.exports = router;
