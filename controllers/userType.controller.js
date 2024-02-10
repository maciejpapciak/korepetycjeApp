const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');

async function getAll(req, res, next) {
  try {
    const allUserTypes = await prisma.user_type.findMany();

    if (!allUserTypes) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      results: allUserTypes.length,
      data: {
        userTypes: allUserTypes,
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
    const userTypeById = await prisma.user_type.findUnique({
      where: {
        usertype_id: Number(id),
      },
    });

    if (!userTypeById) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      data: {
        userType: userTypeById,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = { getAll, getById };
