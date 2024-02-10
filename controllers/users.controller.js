const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');

async function getAll(req, res, next) {
  try {
    const allUsers = await prisma.user.findMany();

    if (!allUsers) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      results: allUsers.length,
      data: {
        users: allUsers,
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
    const userById = await prisma.user.findUnique({
      where: {
        user_id: Number(id),
      },
    });

    if (!userById) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      data: {
        user: userById,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = { getAll, getById };
