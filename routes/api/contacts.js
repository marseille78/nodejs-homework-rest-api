const express = require("express");
const router = express.Router();

const {
  getAllContacts,
  getContact,
  postContact,
  deleteContact,
  putContact,
} = require("../../controllers/contacts");

router.get("/", getAllContacts);
router.get("/:contactId", getContact);
router.post("/", postContact);
router.delete("/:contactId", deleteContact);
router.put("/:contactId", putContact);

module.exports = router;
