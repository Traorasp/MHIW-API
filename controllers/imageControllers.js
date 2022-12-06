const { default: mongoose } = require('mongoose');
const upload = require('../config.js/upload');

// Returns a download stream of the selcted image
exports.get_image = (req, res, next) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  req.app.locals.gfs.find({ _id }).toArray((err, image) => {
    if (err) return res.status(404).json({ err, msg: 'Error getting image' });
    if (!image) {
      return res.status(404).json({ err, msg: 'Image does not exist' });
    }
    return req.app.locals.gfs.openDownloadStream(_id).pipe(res);
  });
};

// Adds image to database and returns its id
exports.post_image = [
  upload,
  (req, res, next) => {
    if (!req.file) {
      return res.json({ msg: 'There is no image file attached' });
    }
    const _id = new mongoose.Types.ObjectId(req.file.id);
    return res.json({ imageId: _id, msg: 'Sucessfully posted new image' });
  },
];

// Adds new image to database, removes the old one and returns the new image id
exports.post_update_image = [
  upload,
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ msg: 'There is no image file attached' });
    }
    const _id = new mongoose.Types.ObjectId(req.params.id);
    req.app.locals.gfs.delete(_id, (err) => {
      if (err) return res.status(500).json({ err, msg: 'Failed to remove image' });
    });
    return res.json({ imageId: req.file.id, msg: 'Sucessfully updated image' });
  },
];

// Deletes the image from database
exports.delete_image = (req, res, next) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  req.app.locals.gfs.delete(_id, (err) => {
    if (err) return res.status(500).json({ err, msg: 'Failed to remove image' });
  });
  return res.json({ msg: 'Sucessfully deleted image' });
};
