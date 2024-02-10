const { validationResult } = require('express-validator');
const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');
const Logger = require('../config/winston');
const {
  defaultPagination,
  retrievePagingData,
} = require('../utils/pagination');

async function getAll(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in classroom.getAll validation!');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const allClasses = await prisma.classroom.findMany();

    if (!allClasses) {
      return next(
        new AppError(404, 'fail', 'ads could not be found'),
        req,
        res,
        next
      );
    }

    res.status(200).json({
      status: 'success',
      results: allClasses.length,
      data: {
        classes: allClasses,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const classById = await prisma.classroom.findUnique({
      where: {
        class_id: Number(id),
      },
    });

    if (!classById) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      data: {
        class: classById,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function createClass(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in req.body class createClass');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { name } = req.body;

    const createdClass = await prisma.classroom.create({
      data: {
        name: name,
      },
    });

    if (!createdClass) {
      Logger.error('class has not been created.');
      return next(
        new AppError(409, 'fail', 'class failed to create'),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        createdClass,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function updateClass(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in class updateClass validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;
    const { name } = req.body;

    const classAlreadyExists = await prisma.classroom.findUnique({
      where: {
        class_id: Number(id),
      },
    });

    if (!classAlreadyExists) {
      Logger.error('class does not exist');
      throw new AppError(
        409,
        'fail',
        'class does not exist so it cannot be updated'
      );
    }

    const updatedClass = await prisma.classroom.update({
      where: {
        class_id: Number(id),
      },
      data: {
        name: name,
      },
    });

    if (!updatedClass) {
      Logger.error('could not update class');
      return next(
        new AppError(409, 'fail', 'class could not be updated'),
        req,
        res,
        next
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        updatedClass,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function deleteClass(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in class deleteClass validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;

    const classAlreadyExists = await prisma.classroom.findUnique({
      where: {
        class_id: Number(id),
      },
    });

    if (!classAlreadyExists) {
      Logger.error('class does not exist');
      return next(
        new AppError(409, 'fail', 'class does not exist'),
        req,
        res,
        next
      );
    }

    const deletedClass = await prisma.classroom.delete({
      where: {
        class_id: Number(id),
      },
    });

    if (!deletedClass) {
      Logger.error('class could not be deleted');
      return next(
        new AppError(409, 'fail', 'could not delete class'),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        deletedAd: deletedClass,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = { getAll, getById, createClass, updateClass, deleteClass };
