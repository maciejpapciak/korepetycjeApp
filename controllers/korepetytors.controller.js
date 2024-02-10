const prisma = require('../prisma/prismaClient');
const AppError = require('../utils/appError');

async function getAll(req, res, next) {
  try {
    const allKorepetytors = await prisma.user.findMany({
      where: {
        user_type: 3,
      },
      include: {
        advertisement: true,
        user_rating_userTouser_rating_recipent_id: true,
      },
    });

    if (!allKorepetytors) {
      return next(new AppError(404, 'fail', 'Not Found'), req, res, next);
    }

    res.status(200).send({
      status: 'success',
      results: allKorepetytors.length,
      data: {
        korepetytors: allKorepetytors,
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

module.exports = { getAll, getById };
