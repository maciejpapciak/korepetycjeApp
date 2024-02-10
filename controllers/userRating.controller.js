const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');

async function getAll(req, res, next) {
  try {
    const allUsersRatings = await prisma.user_rating.findMany();

    if (!allUsersRatings) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      results: allUsersRatings.length,
      data: {
        userRatings: allUsersRatings,
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
    const userRatingById = await prisma.user_rating.findUnique({
      where: {
        rating_id: Number(id),
      },
    });

    if (!userRatingById) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      data: {
        userRating: userRatingById,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = { getAll, getById };
