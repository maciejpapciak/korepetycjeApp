const { validationResult } = require('express-validator');
const Logger = require('../config/winston');
const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');

async function getRanking(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in advertisement.getAllFilteredByClass validation!');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const ranking = await prisma.$queryRaw(`SELECT
    u.user_id,
    u.nickname,
    u.avatar,
    (SELECT avg(rating_number) FROM user_rating WHERE recipent_id = u.user_id) AS Rating
    FROM user AS u
    HAVING Rating > 0
    ORDER BY Rating DESC
    LIMIT 5;`);

    if (!ranking) {
      return next(
        new AppError(404, 'fail', 'ranking could not be created'),
        req,
        res,
        next
      );
    }

    const response = {
      status: 'success',
      results: ranking.length,
      data: {
        rankings: ranking,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = { getRanking };
