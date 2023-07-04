const Joi = require("joi");
const { HttpError, ctrlTryCatchWrapper } = require("../helpers");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const getAllContacts = async (req, res, next) => {
  const result = await listContacts();
  res.json(result);
};

const getContact = async (req, res, next) => {
  const result = await getContactById(req.params.contactId);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const postContact = async (req, res, next) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const result = await addContact(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await removeContact(contactId);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({
    message: "Contact deleted",
  });
};

const putContact = async (req, res, next) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

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
  putContact: ctrlTryCatchWrapper(putContact),
};
