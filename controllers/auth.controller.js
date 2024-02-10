const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const { validationResult } = require('express-validator');
const cryptoRandomString = require('crypto-random-string');
const AppError = require('../utils/appError');
const config = require('../config/project.config');
const prisma = require('../prisma/prismaClient');
const Logger = require('../config/winston');
const emailService = require('../utils/mailer');

const createToken = (id) =>
  jwt.sign(
    {
      id,
    },
    config.jwtSettings.secret,
    {
      expiresIn: config.jwtSettings.expiresIn,
    }
  );

async function login(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in login req.body validation!');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { email, nickname, password } = req.body;

    if ((!email && !password) || (!nickname && !password)) {
      return next(
        new AppError(404, 'fail', 'please provide your stuff'),
        req,
        res,
        next
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            nickname: {
              contains: nickname,
            },
          },
          {
            email: {
              contains: email,
            },
          },
        ],
      },
    });

    if (
      !user ||
      !bcrypt.compareSync(password, user.password) ||
      !user.is_email_confirmed
    ) {
      Logger.error(
        'while checking returned user object, password hash or if user is email verified'
      );
      return next(
        new AppError(
          401,
          'fail',
          'email, nickname, password or email auth is wrong!'
        )
      );
    }

    const token = createToken(user.user_id);
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }

  return null;
}

async function register(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in register req.body validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { name, surname, email, nickname, password, userType } = req.body;

    // Just in case
    if (Number(userType) === 1) {
      Logger.error(
        'cannot register user with userType: 1 (reserved for admin)'
      );
      next(new AppError(403, 'fail', 'wrong userType'));
    }

    const userExists = await prisma.user.findFirst({
      where: {
        email,
        nickname,
      },
    });

    if (userExists) {
      Logger.error('user already exists!');
      throw new AppError(500, 'fail', 'User already exists!');
    }

    const registerToken = cryptoRandomString({ length: 45, type: 'url-safe' });

    const user = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        nickname,
        password: bcrypt.hashSync(password),
        user_type: Number(userType),
        register_token: registerToken,
      },
    });

    user.password = undefined;
    const token = createToken(user.user_id);

    const emailLink = `${process.env.CLIENT_URL}/verify/${user.email}/${registerToken}`;
    emailService
      .send(
        'no-reply@korepetycjeapp.pl',
        user.email,
        'Verify your account now!',
        `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
        <meta content="width=device-width" name="viewport"/>
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <!--<![endif]-->
        <style type="text/css">
            body {
              margin: 0;
              padding: 0;
            }
        
            table,
            td,
            tr {
              vertical-align: top;
              border-collapse: collapse;
            }
        
            * {
              line-height: inherit;
            }
        
            a[x-apple-data-detectors=true] {
              color: inherit !important;
              text-decoration: none !important;
            }
          </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {
        
              .block-grid,
              .col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
              }
        
              .block-grid {
                width: 100% !important;
              }
        
              .col {
                width: 100% !important;
              }
        
              .col_cont {
                margin: 0 auto;
              }
        
              img.fullwidth,
              img.fullwidthOnMobile {
                max-width: 100% !important;
              }
        
              .no-stack .col {
                min-width: 0 !important;
                display: table-cell !important;
              }
        
              .no-stack.two-up .col {
                width: 50% !important;
              }
        
              .no-stack .col.num2 {
                width: 16.6% !important;
              }
        
              .no-stack .col.num3 {
                width: 25% !important;
              }
        
              .no-stack .col.num4 {
                width: 33% !important;
              }
        
              .no-stack .col.num5 {
                width: 41.6% !important;
              }
        
              .no-stack .col.num6 {
                width: 50% !important;
              }
        
              .no-stack .col.num7 {
                width: 58.3% !important;
              }
        
              .no-stack .col.num8 {
                width: 66.6% !important;
              }
        
              .no-stack .col.num9 {
                width: 75% !important;
              }
        
              .no-stack .col.num10 {
                width: 83.3% !important;
              }
        
              .video-block {
                max-width: none !important;
              }
        
              .mobile_hide {
                min-height: 0px;
                max-height: 0px;
                max-width: 0px;
                display: none;
                overflow: hidden;
                font-size: 0px;
              }
        
              .desktop_hide {
                display: block !important;
                max-height: none !important;
              }
            }
          </style>
        <style id="icon-media-query" type="text/css">
            @media (max-width: 520px) {
              .icons-inner {
                text-align: center;
              }
        
              .icons-inner td {
                margin: 0 auto;
              }
            }
          </style>
        </head>
        <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td style="word-break: break-word; vertical-align: top;" valign="top">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
        <div style="background-color:transparent;">
        <div class="block-grid" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 3px solid #0B4167; border-bottom: 0px solid transparent; border-right: 3px solid #0B4167;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top:5px; padding-bottom:5px;"><![endif]-->
        <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 494px;">
        <div class="col_cont" style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
        <div style="border-top:0px solid transparent; border-left:3px solid #0B4167; border-bottom:0px solid transparent; border-right:3px solid #0B4167; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">
        <!--<![endif]-->
        <table cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%">
        <tr style="vertical-align: top;" valign="top">
        <td align="center" style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;" valign="top" width="100%">
        <h1 style="color:#555555;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:23px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;"><strong>Potwierdź adres email</strong></h1>
        </td>
        </tr>
        </table>
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
        <div style="color:#555555;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
        <div class="txtTinyMce-wrapper" style="font-size: 14px; line-height: 1.2; color: #555555; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 17px;">
        <p style="margin: 0; font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;">Drogi użytkowniku,</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;"> </p>
        <p style="margin: 0; font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;">Dokończ rejestrację i potwierdź adres email, aby mieć pełen dostęp do naszych usług</p>
        </div>
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
        <div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href=${emailLink} style="height:31.5pt;width:129pt;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#0b4167"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href=${emailLink} style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #0b4167; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; width: auto; border-top: 1px solid #0b4167; border-right: 1px solid #0b4167; border-bottom: 1px solid #0b4167; border-left: 1px solid #0b4167; padding-top: 5px; padding-bottom: 5px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:undefined;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">Potwierdzam</span></span></a>
        <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
        </div>
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
        <div style="color:#555555;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
        <div class="txtTinyMce-wrapper" style="font-size: 14px; line-height: 1.2; color: #555555; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 17px;">
        <p style="margin: 0; font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;">Jeśli uważasz, że ta wiadomość została wysłana do Ciebie przez pomyłkę, zignoruj ją.</p>
        </div>
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
        <!--[if (!mso)&(!IE)]><!-->
        </div>
        <!--<![endif]-->
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
        </div>
        </div>
        <div style="background-color:transparent;">
        <div class="block-grid" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
        <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
        <div class="col_cont" style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
        <!--<![endif]-->
        <table cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%">
        <tr style="vertical-align: top;" valign="top">
        <td align="center" style="word-break: break-word; vertical-align: top; padding-top: 5px; padding-right: 0px; padding-bottom: 5px; padding-left: 0px; text-align: center;" valign="top">
        <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
        <!--[if !vml]><!-->
        <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" valign="top">
        <!--<![endif]-->
        </table>
        </td>
        </tr>
        </table>
        <!--[if (!mso)&(!IE)]><!-->
        </div>
        <!--<![endif]-->
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
        </tr>
        </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
        </body>
        </html>`
      )
      .then(() => {
        user.password = undefined;
        res.status(201).json({
          status: 'success',
          emailStatus: `verification email has been sent to ${user.email}`,
          token,
          data: {
            user,
          },
        });
        Logger.info('email has been sent');
      })
      .catch((err) => {
        next(new AppError(409, 'fail', 'email has not been sent'));
        Logger.error(err);
      });
  } catch (err) {
    next(err);
  }

  return null;
}

async function confirmEmail(req, res, next) {
  try {
    if (!validationResult(req).isEmpty()) {
      Logger.error('in register req.params validation');
      next(new AppError(400, 'fail', validationResult(req).array()));
    }

    const { email, token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        email,
        register_token: token,
      },
    });

    if (!user) {
      Logger.error('user with given email and register_token not found');
      next(
        new AppError(
          401,
          'fail',
          'user with given email address has not been found'
        )
      );
    } else if (user.is_email_confirmed) {
      Logger.error('user is already email verified');
      next(new AppError(500, 'fail', 'user has been already verified'));
    } else {
      const updatedUser = await prisma.user.update({
        where: {
          email,
        },
        data: {
          is_email_confirmed: true,
        },
      });

      updatedUser.password = undefined;

      if (!updatedUser) {
        Logger.error('user cannot be updated');
        next(new AppError(500, 'fail', 'user cannot be updated'));
      }

      res.status(200).json({
        status: 'success',
        emailStatus: 'your account has been verified',
        data: {
          updateUser: updatedUser,
        },
      });
    }
  } catch (err) {
    next(err);
  }

  return null;
}

async function protect(req, res, next) {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      Logger.error('user is missing bearer token authorization');
      return next(
        new AppError(401, 'fail', 'you need to login if you want to continue'),
        req,
        res,
        next
      );
    }

    const decode = await promisify(jwt.verify)(
      token,
      config.jwtSettings.secret
    );

    req.user = await prisma.user.findUnique({
      where: {
        user_id: Number(decode.id),
      },
    });
    next();
  } catch (err) {
    next(err);
  }

  return null;
}

function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.user_type)) {
      Logger.error('userType is not matching');
      return next(
        new AppError(403, 'fail', 'you are not allowed to do this action'),
        req,
        res,
        next
      );
    }
    next();
  };
}

module.exports = { protect, login, register, confirmEmail, restrictTo };
