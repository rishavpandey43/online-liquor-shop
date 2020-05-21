const multer = require("multer");
// * configure and multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploadedDocuments");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

exports.upload = multer({ storage });
