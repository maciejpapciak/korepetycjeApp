const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');

async function getAll(req, res, next) {
  try {
    const allAdvertisementTypes = await prisma.advertisement_type.findMany();

    if (!allAdvertisementTypes) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      results: allAdvertisementTypes.length,
      data: {
        advertisementsTypes: allAdvertisementTypes,
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
    const advertisementTypeById = await prisma.advertisement_type.findUnique({
      where: { type_id: Number(id) },
    });

    if (!advertisementTypeById) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      data: {
        advertisementsType: advertisementTypeById,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = { getAll, getById };
