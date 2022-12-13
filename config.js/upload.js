const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGOKEY,
  options: { useUnifiedTopology: true },
  file: (req, file) => new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return reject(err);
      }
      const filename = buf.toString('hex') + path.extname(file.originalname);
      const fileInfo = {
        filename,
        bucketName: 'images',
      };
      resolve(fileInfo);
    });
  }),
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) return cb(null, true);
  cb('filetype');
}

const store = multer({
  storage,
  limits: { fileSize: 20000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = (req, res, next) => {
  const upload = store.single('image');
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: 'File too large' });
    }
    if (err) {
      if (err === 'filetype') return res.status(400).json({ msg: 'Image files onlys' });

      return res.Status(500).json(err);
    }
    next();
  });
};
