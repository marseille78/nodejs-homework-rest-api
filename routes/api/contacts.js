const express = require('express');
const router = express.Router();

const {validateBody, isValidId, authenticate} = require('../../middlewares');
const {schemas} = require('../../models/contact');

const {
  getAllContacts,
  getContact,
  postContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contacts');

router.get('/', authenticate, getAllContacts);
router.get('/:contactId', authenticate, isValidId, getContact);
router.post('/', authenticate, validateBody(schemas.addSchema), postContact);
router.delete('/:contactId', authenticate, isValidId, deleteContact);
router.put(
  '/:contactId',
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  updateContact
);
router.patch(
  '/:contactId/favorite',
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema, 'Missing field favorite'),
  updateStatusContact
);

module.exports = router;
