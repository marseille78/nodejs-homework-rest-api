const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require("gravatar");
const path = require('path');
const fs = require("fs/promises");
const Jimp = require("jimp");
const {User} = require('../models/user');
const {ctrlTryCatchWrapper, HttpError, sendEmail} = require('../helpers');
const {nanoid} = require("nanoid");

const {SECRET_KEY, BASE_URL} = process.env;
const avatarDir = path.join(__dirname, '../', 'public', 'avatars');

const registerUser = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
  const {verificationToken} = req.params;
  const user = await User.findOne({verificationToken});

  if (!user) {
    throw HttpError(401, 'Email not found');
  }

  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ''});

  res.json({
    message: 'Email verify success'
  });
};

const resendVerifyEmail = async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});

  if (!user) {
    throw HttpError(401, 'Email not found');
  }

  if (user.verify) {
    throw HttpError(401, 'Email already verified');
  }

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.json({
    message: 'Verify email send success',
  });
};

const loginUser = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});

  if (!user) {
    throw HttpError(401, 'Email or password is invalid');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'});
  await User.findByIdAndUpdate(user._id, {token});

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription
    },
  });
};

const getCurrentUser = async (req, res) => {
  const {email, subscription} = req.user;

  res.json({
    email,
    subscription,
  });
};

const logoutUser = async (req, res) => {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ''});

  res.json({
    message: 'No Content',
  });
};

const updateAvatar = async (req, res) => {
  const {_id} = req.user;
  const {path: tempUpload, originalname} = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  await fs.rename(tempUpload, resultUpload);

  const uploadedAvatar = await Jimp.read(resultUpload);

  await uploadedAvatar.resize(256, 256).write(resultUpload);

  const avatarURL = path.join('avatars', filename);

  await User.findByIdAndUpdate(_id, {avatarURL});

  res.json({
    avatarURL,
  });
};

module.exports = {
  registerUser: ctrlTryCatchWrapper(registerUser),
  loginUser: ctrlTryCatchWrapper(loginUser),
  getCurrentUser: ctrlTryCatchWrapper(getCurrentUser),
  logoutUser: ctrlTryCatchWrapper(logoutUser),
  updateAvatar: ctrlTryCatchWrapper(updateAvatar),
  verifyEmail: ctrlTryCatchWrapper(verifyEmail),
  resendVerifyEmail: ctrlTryCatchWrapper(resendVerifyEmail),
};