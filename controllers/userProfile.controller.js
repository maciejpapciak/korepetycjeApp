const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Logger = require('../config/winston');
const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');

async function updateProfile(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in req.params profile updateProfile');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    Logger.debug(req.user);

    const { id } = req.params;
    const {
      name,
      surname,
      phone_number,
      facebook_url,
      avatar,
    } = req.body;

    const foundUser = await prisma.user.findUnique({
      where: {
        user_id: Number(id),
      },
    });

    if (!foundUser) {
      Logger.error('user does not exist');
      throw new AppError(
        409,
        'fail',
        'user profile does not exist so it cannot be updated'
      );
    }

    const updatedProfile = await prisma.user.update({
      where: {
        user_id: Number(id),
      },
      data: {
        name,
        surname,
        phone_number,
        facebook_url,
        avatar
      },
    });

    if (!updatedProfile) {
      Logger.error('could not update profile');
      return next(
        new AppError(409, 'fail', 'profile could not be updated'),
        req,
        res,
        next
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        updatedProfile,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function getProfileById(req, res, next) {
  try {
    const { id } = req.params;
    const korepetytorById = await prisma.user.findFirst({
      where: {
        user_id: Number(id),
      },
      include: {
        advertisement: true,
        user_rating_userTouser_rating_recipent_id: true,
        user_rating_userTouser_rating_sender_id: true,
      },
    });

    if (!korepetytorById) {
      return next(new AppError(404, 'fail', 'Not found'), req, res, next);
    }

    const commentsLength =
      korepetytorById.user_rating_userTouser_rating_recipent_id.length;

    for (let i = 0; i < commentsLength; i++) {
      const { sender_id } =
        korepetytorById.user_rating_userTouser_rating_recipent_id[i];

      const user = prisma.user.findUnique({
        where: {
          user_id: Number(sender_id),
        },
      });

      korepetytorById.user_rating_userTouser_rating_recipent_id[
        i
      ].sender_nickname = user.nickname;
      korepetytorById.user_rating_userTouser_rating_recipent_id[
        i
      ].sender_avatar = user.avatar;
    }

    res.status(200).send({
      status: 'success',
      results: korepetytorById.length,
      data: {
        korepetytor: korepetytorById,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

module.exports = {
  updateProfile,
  getProfileById,
};
