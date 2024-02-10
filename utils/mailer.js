const nodemailer = require('nodemailer');
const config = require('../config/project.config');

const transporter = nodemailer.createTransport({
  service: 'SendinBlue',
  auth: {
    user: `${config.smtpSettings.auth.user}`,
    pass: `${config.smtpSettings.auth.pass}`,
  },
});

exports.send = (from, to, subject, html) =>
  transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
