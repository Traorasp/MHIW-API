const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGOKEY,
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

module.exports = multer({ storage });
