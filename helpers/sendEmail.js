const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const {SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = {...data, from: 'boyko.ruslan78@gmail.com'};
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;

// const email = {
//   to: 'yefoj44610@miqlab.com',
//   from: 'boyko.ruslan78@gmail.com',
//   subject: 'Test email',
//   html: '<p><strong>Test email</strong> from localhost:3000</p>'
// };

// sgMail.send(email)
//   .then(() => console.log('Email send success'))
//   .catch((err) => console.log(err.message));