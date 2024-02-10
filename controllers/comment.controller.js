const { validationResult } = require('express-validator');
const Logger = require('../config/winston');
const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');
const {
  defaultPagination,
  retrievePagingData,
} = require('../utils/pagination');

async function getAll(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in comment.getAll validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { page, size } = req.query;
    const { take, skip } = await defaultPagination(page, size);

    const allComments = await prisma.user_rating.findMany();

    const allCommentsPaginated = await prisma.user_rating.findMany({
      skip,
      take,
    });

    if (!allCommentsPaginated) {
      return next(
        new AppError(404, 'fail', 'comments not found'),
        req,
        res,
        next
      );
    }

    const response = await retrievePagingData(
      {
        status: 'success',
        results: allComments.length,
        data: {
          comments: allCommentsPaginated,
        },
      },
      page,
      take
    );

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }

  return null;
}

async function getById(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in comment.getById validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;

    const commentById = await prisma.user_rating.findFirst({
      where: {
        recipent_id: Number(id),
      },
    });

    if (!commentById) {
      return next(
        new AppError(404, 'fail', 'comment could not be found'),
        req,
        res,
        next
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        comment: commentById,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function createComment(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in comment.createComment');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { recipentId, ratingNumber, content } = req.body;

    const createdComment = await prisma.user_rating.create({
      data: {
        sender_id: req.user.user_id,
        recipent_id: Number(recipentId),
        rating_number: Number(ratingNumber),
        content: content,
      },
    });

    if (!createdComment) {
      Logger.error('could not create a comment');
      return next(
        new AppError(409, 'fail', 'comment could not be created'),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        createdComment,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function deleteComment(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in comment.deleteComment validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;

    const commentAlreadyExists = await prisma.user_rating.findUnique({
      where: {
        rating_id: Number(id),
      },
    });

    if (!commentAlreadyExists) {
      Logger.error('comment does not exist');
      return next(
        new AppError(
          409,
          'fail',
          'comment does not exist so it cannot be deleted'
        ),
        req,
        res,
        next
      );
    }

    const deletedAd = await prisma.user_rating.delete({
      where: {
        rating_id: Number(id),
      },
    });

    if (!deletedAd) {
      Logger.error('ad could not be deleted');
      return next(
        new AppError(409, 'fail', 'could not delete ad'),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        deletedAd,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = { getAll, getById, createComment, deleteComment };
