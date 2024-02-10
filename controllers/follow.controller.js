const { validationResult } = require('express-validator');
const Logger = require('../config/winston');
const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');

async function getFollowers(req, res, next) {
  try {
    const follower = await prisma.$queryRaw(
      `SELECT
    f.follow_id,
    f.advertisement_ad_id,
    f.user_user_id,
    a.title,
    a.content,
    a.price,
    a.date_created,
    a.view_count,
    a.is_accepted,
    a.type_id,
    a.user_id,
    user.avatar,
    user.nickname,
    (SELECT avg(rating_number) FROM user_rating WHERE recipent_id = a.user_id) AS Rating
    FROM follow AS f
    JOIN advertisement AS a ON f.advertisement_ad_id=a.ad_id
    JOIN user ON user.user_id = a.user_id
    WHERE f.user_user_id = ?;`,
      req.user.user_id
    );

    if (!follower) {
      return next(
        new AppError(404, 'fail', 'followers could not be found'),
        req,
        res,
        next
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        followers: follower,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function createFollow(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in follow.createFollow validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;

    const createdFollow = await prisma.follow.create({
      data: {
        advertisement_ad_id: Number(id),
        user_user_id: req.user.user_id,
      },
    });

    if (!createFollow) {
      return next(
        new AppError(409, 'fail', 'follow could not be created'),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        createdFollow,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function deleteFollow(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in follow.deleteFollow validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;

    const followAlreadyExists = await prisma.follow.findFirst({
      where: {
        advertisement_ad_id: Number(id),
        user_user_id: req.user.user_id,
      },
    });

    if (!followAlreadyExists) {
      Logger.error('follow does not exist');
      return next(
        new AppError(
          409,
          'fail',
          'follow does not exist so it cannot be deleted'
        ),
        req,
        res,
        next
      );
    }

    const deletedFollow = await prisma.follow.deleteMany({
      where: {
        advertisement_ad_id: Number(id),
      },
    });

    if (!deletedFollow) {
      return next(
        new AppError(409, 'fail', 'follow could not be created'),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        deletedFollow,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = { getFollowers, createFollow, deleteFollow };
