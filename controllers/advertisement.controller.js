const { validationResult } = require('express-validator');
const he = require('he');
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
      Logger.error('in advertisement.getAll validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { page, size } = req.query;
    const { take, skip } = await defaultPagination(page, size);

    const allAds = await prisma.advertisement.findMany();

    const allAdsPaginated = await prisma.advertisement.findMany({
      skip: skip,
      take: take,
    });

    if (!allAdsPaginated) {
      return next(
        new AppError(404, 'fail', 'ads could not be found'),
        req,
        res,
        next
      );
    }

    const response = await retrievePagingData(
      {
        status: 'success',
        results: allAds.length,
        data: {
          advertisement: allAdsPaginated,
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

async function getAllFiltered(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in advertisement.getAllFiltered validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { page, size, type, after } = req.query;
    const { take, skip } = await defaultPagination(page, size);

    const allAds = await prisma.$queryRaw(
      `SELECT
      a.ad_id,
      a.title,
      a.content,
      a.price,
      a.date_created,
      a.view_count,
      a.is_accepted,
      a.class_id,
      a.type_id,
      a.user_id,
      user.avatar,
      user.nickname,
      (SELECT avg(rating_number) FROM user_rating WHERE recipent_id = a.user_id) AS Rating
      FROM advertisement AS a
      JOIN user ON user.user_id = a.user_id
      WHERE ((a.type_id = ?) AND (a.date_created > ?) AND (a.is_accepted = 1))
      ;`,type, after
    )

    const allAdsPaginated = await prisma.$queryRaw(
      `SELECT
      a.ad_id,
      a.title,
      a.content,
      a.price,
      a.date_created,
      a.view_count,
      a.is_accepted,
      a.class_id,
      a.type_id,
      a.user_id,
      user.avatar,
      user.nickname,
      (SELECT avg(rating_number) FROM user_rating WHERE recipent_id = a.user_id) AS Rating
      FROM advertisement AS a
      JOIN user ON user.user_id = a.user_id
      WHERE ((a.type_id = ?) AND (a.date_created > ?) AND (a.is_accepted = 1)) ORDER BY a.date_created DESC LIMIT ?, ?
      ;`,
      type,
      after,
      skip,
      take
    );

    if (!allAdsPaginated) {
      return next(
        new AppError(404, 'fail', 'ads could not be found'),
        req,
        res,
        next
      );
    }

    const response = await retrievePagingData(
      {
        status: 'success',
        results: allAds.length,
        data: {
          advertisement: allAdsPaginated,
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

async function getAllFilteredByClass(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in advertisement.getAllFilteredByClass validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { page, size, type, after, classId } = req.query;
    const { take, skip } = await defaultPagination(page, size);

    const allAds = await prisma.$queryRaw(
      `SELECT
      a.ad_id,
      a.title,
      a.content,
      a.price,
      a.date_created,
      a.view_count,
      a.is_accepted,
      a.class_id,
      a.type_id,
      a.user_id,
      user.avatar,
      user.nickname,
      (SELECT avg(rating_number) FROM user_rating WHERE recipent_id = a.user_id) AS Rating
      FROM advertisement AS a
      JOIN user ON user.user_id = a.user_id
      WHERE ((a.class_id = ?) AND (a.type_id = ?) AND (a.date_created > ?) AND (a.is_accepted = 1))
      ;`, classId, type, after
    )

    const allAdsPaginated = await prisma.$queryRaw(
      `SELECT
      a.ad_id,
      a.title,
      a.content,
      a.price,
      a.date_created,
      a.view_count,
      a.is_accepted,
      a.class_id,
      a.type_id,
      a.user_id,
      user.avatar,
      user.nickname,
      (SELECT avg(rating_number) FROM user_rating WHERE recipent_id = a.user_id) AS Rating
      FROM advertisement AS a
      JOIN user ON user.user_id = a.user_id
      WHERE ((a.class_id = ?) AND (a.type_id = ?) AND (a.date_created > ?) AND (a.is_accepted = 1)) ORDER BY a.date_created DESC LIMIT ?, ?
      ;`,
      classId,
      type,
      after,
      skip,
      take
    );

    if (!allAdsPaginated) {
      return next(
        new AppError(404, 'fail', 'ads could not be found'),
        req,
        res,
        next
      );
    }

    const response = await retrievePagingData(
      {
        status: 'success',
        results: allAds.length,
        data: {
          advertisement: allAdsPaginated,
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

async function getAllByStatus(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in advertisement.getAllByStatus validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }
    const { page, size, status } = req.query;
    const { take, skip } = await defaultPagination(page, size);

    const allNotacceptedAds = await prisma.advertisement.findMany({
      where: { is_accepted: status === 'true' },
    });

    const allNotacceptedAdsPaginated = await prisma.advertisement.findMany({
      where: {
        is_accepted: status === 'true',
      },
      skip: skip,
      take: take,
    });

    if (!allNotacceptedAdsPaginated) {
      return next(
        new AppError(404, 'fail', 'ads could not be found'),
        req,
        res,
        next
      );
    }

    const response = await retrievePagingData(
      {
        status: 'success',
        results: allNotacceptedAds.length,
        data: {
          advertisement: allNotacceptedAdsPaginated,
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

async function getAllByType(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in advertisement.getAllByType validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }
    const { page, size, type } = req.query;
    const { take, skip } = await defaultPagination(page, size);

    const allNotacceptedAds = await prisma.advertisement.findMany({
      where: {
        type_id: Number(type),
      },
    });

    const allNotacceptedAdsPaginated = await prisma.advertisement.findMany({
      where: {
        type_id: Number(type),
      },
      skip: skip,
      take: take,
    });

    if (!allNotacceptedAdsPaginated) {
      return next(
        new AppError(404, 'fail', 'ads could not be found'),
        req,
        res,
        next
      );
    }

    const response = await retrievePagingData(
      {
        status: 'success',
        results: allNotacceptedAds.length,
        data: {
          advertisement: allNotacceptedAdsPaginated,
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
      Logger.error('in advertisement.getById validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;
    const advertisementById = await prisma.$queryRaw(
      `SELECT
      a.ad_id,
      a.title,
      a.content,
      a.price,
      a.date_created,
      a.view_count,
      a.is_accepted,
      c.name AS 'class_name',
      a.type_id,
      a.user_id,
      user.avatar,
      user.nickname,
      user.email,
      user.phone_number,
      (SELECT avg(rating_number) FROM user_rating WHERE recipent_id = a.user_id) AS Rating
      FROM advertisement AS a
      JOIN user ON user.user_id = a.user_id
      JOIN classroom AS c ON a.class_id = c.class_id
      WHERE (a.ad_id = ?);`,
      id
    );

    const updateViewCount = await prisma.advertisement.update({
      where: {
        ad_id: Number(id),
      },
      data: {
        view_count: {
          increment: 1,
        },
      },
    });

    if (!updateViewCount) {
      return next(
        new AppError(
          500,
          'fail',
          'could not update ad view count',
          req,
          res,
          next
        )
      );
    }

    if (!advertisementById) {
      return next(
        new AppError(404, 'fail', 'ad could not be found'),
        req,
        res,
        next
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        advertisement: advertisementById,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function createAd(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in advertisement.createAdd');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { title, content, price, classId, typeId } = req.body;
    const contentDecoded = await he.decode(content);

    const createdAd = await prisma.advertisement.create({
      data: {
        title,
        content: contentDecoded,
        price: Number(price),
        class_id: Number(classId),
        type_id: Number(typeId),
        user_id: req.user.user_id,
      },
    });

    if (!createdAd) {
      Logger.error('ad has not been created.');
      return next(
        new AppError(409, 'fail', 'ad could not be created'),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        createdAd,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function updateAd(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in advertisement.updateAd validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;
    const { title, content, price, classId, typeId } = req.body;

    const contentDecoded = await he.decode(content);

    const adAlreadyExists = await prisma.advertisement.findUnique({
      where: {
        ad_id: Number(id),
      },
    });

    if (!adAlreadyExists) {
      Logger.error('ad does not exist');
      throw new AppError(
        409,
        'fail',
        'ad does not exist so it cannot be updated'
      );
    }

    const updatedAd = await prisma.advertisement.update({
      where: {
        ad_id: Number(id),
      },
      data: {
        title,
        content: contentDecoded,
        price: Number(price),
        class_id: Number(classId),
        type_id: Number(typeId),
      },
    });

    if (!updatedAd) {
      Logger.error('could not update ad');
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
        updatedAd,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function acceptAd(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in advertisement.acceptAd validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;

    const adAlreadyExists = await prisma.advertisement.findUnique({
      where: {
        ad_id: Number(id),
      },
    });

    if (!adAlreadyExists) {
      Logger.error('ad does not exist');
      throw new AppError(
        409,
        'fail',
        'ad does not exist so it cannot be updated'
      );
    }

    const updatedAd = await prisma.advertisement.update({
      where: {
        ad_id: Number(id),
      },
      data: {
        is_accepted: true,
      },
    });

    if (!updatedAd) {
      Logger.error('could not update ad');
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
        updatedAd,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function deleteAd(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in advertisement.deleteAd validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { id } = req.params;

    const adAlreadyExists = await prisma.advertisement.findUnique({
      where: {
        ad_id: Number(id),
      },
    });

    if (!adAlreadyExists) {
      Logger.error('ad does not exist');
      next(
        new AppError(409, 'fail', 'ad does not exist so it cannot be deleted')
      );
    }

    const deletedAd = await prisma.advertisement.delete({
      where: {
        ad_id: Number(id),
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

module.exports = {
  getAll,
  getAllFiltered,
  getAllFilteredByClass,
  getAllByStatus,
  getAllByType,
  getById,
  createAd,
  updateAd,
  acceptAd,
  deleteAd,
};
