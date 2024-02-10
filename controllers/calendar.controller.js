const { validationResult } = require('express-validator');
const prisma = require('../prisma/prismaClient');
const Logger = require('../config/winston');
const AppError = require('../utils/appError');

async function getAll(req, res, next) {
  try {
    const allCalendars = await prisma.callendar.findMany();

    if (!allCalendars) {
      return next(
        new AppError(404, 'fail', 'calendars could not be found'),
        req,
        res,
        next
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        calendars: allCalendars,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function getByUserId(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in calendar.getByStudentId validation!');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;

    const calendarByUserId = await prisma.callendar.findMany({
      where: {
        user_id: Number(id),
      },
    });

    if (!calendarByUserId) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      data: {
        callendar: calendarByUserId,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function createCalendar(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in calendar.createCalendar validation!');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { timeStart, timeEnd, weekday, title } = req.body;

    const newCalendar = await prisma.callendar.create({
      data: {
        user_id: req.user.user_id,
        time_start: timeStart,
        time_end: timeEnd,
        weekday: Number(weekday),
        title: title,
      },
    });

    if (!newCalendar) {
      return next(
        new AppError(409, 'fail', 'calendar failed to create'),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        newCalendar,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function updateCalendar(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in calendar.updateCalendar validation!');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;
    const { timeStart, timeEnd, weekday, title } = req.body;

    const calendarAlreadyExists = await prisma.callendar.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!calendarAlreadyExists) {
      throw new AppError(
        409,
        'fail',
        'calendar does not exist so it cannot be updated'
      );
    }

    const updatedCalendar = await prisma.callendar.update({
      where: {
        id: Number(id),
      },
      data: {
        time_start: timeStart,
        time_end: timeEnd,
        weekday: Number(weekday),
        title: title,
      },
    });

    if (!updateCalendar) {
      return next(
        new AppError(409, 'fail', 'ad could not be updated'),
        req,
        res,
        next
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        updatedCalendar,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function deleteCalendar(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in calendar.deleteCalendar validation!');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;

    const calendar = await prisma.callendar.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!calendar) {
      throw new AppError(
        409,
        'fail',
        'calendar does not exist so it cannot be deleted'
      );
    }

    const deletedCalendar = await prisma.callendar.delete({
      where: {
        id: Number(id),
      },
    });

    if (!deletedCalendar) {
      return next(
        new AppError(409, 'fail', 'calendar could not be deleted'),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        deletedCalendar,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = {
  getAll,
  getByUserId,
  createCalendar,
  updateCalendar,
  deleteCalendar,
};
