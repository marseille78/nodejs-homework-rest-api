const express = require("express");
const router = express.Router();

const { validateBody, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const {
  getAllContacts,
  getContact,
  postContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");

router.get("/", getAllContacts);
router.get("/:contactId", isValidId, getContact);
router.post("/", validateBody(schemas.addSchema), postContact);
router.delete("/:contactId", isValidId, deleteContact);
router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addSchema),
  updateContact
);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema, "Missing field favorite"),
  updateStatusContact
);

module.exports = router;
