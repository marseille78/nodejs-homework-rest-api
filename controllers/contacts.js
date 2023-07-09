const { ctrlTryCatchWrapper, HttpError } = require("../helpers");

const { Contact } = require("../models/contact");

const getAllContacts = async (req, res, next) => {
  const result = await Contact.find({}, "-createdAt -updatedAt");
  res.json(result);
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const postContact = async (req, res, next) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({
    message: "Contact deleted",
  });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

module.exports = {
  getAllContacts: ctrlTryCatchWrapper(getAllContacts),
  getContact: ctrlTryCatchWrapper(getContact),
  postContact: ctrlTryCatchWrapper(postContact),
  deleteContact: ctrlTryCatchWrapper(deleteContact),
  updateContact: ctrlTryCatchWrapper(updateContact),
  updateStatusContact: ctrlTryCatchWrapper(updateStatusContact),
};
