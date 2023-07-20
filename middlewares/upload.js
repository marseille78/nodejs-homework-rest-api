const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, '../', 'tmp');

const multerConf = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConf,
});

module.exports = upload;