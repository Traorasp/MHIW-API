const { default: mongoose } = require('mongoose');
const upload = require('../config.js/upload');

exports.get_image = (req, res, next) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  req.app.locals.gfs.find({ _id }).toArray((err, image) => {
    if (err) return res.status(500).json({ msg: 'Error getting image' });
    if (!image) {
      return res.status(400).json({ msg: 'No profile exists' });
    }
    return req.app.locals.gfs.openDownloadStream(_id).pipe(res);
  });
};

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

exports.post_update_image = [
  upload,
  (req, res, next) => {
    if (!req.file) {
      return res.json({ msg: 'There is no image file attached' });
    }
    const _id = new mongoose.Types.ObjectId(req.params.id);
    req.app.locals.gfs.delete(_id, (err) => {
      if (err) return res.status(500).json({ msg: 'Image deletion error' });
    });
    return res.json({ imageId: req.file.id, msg: 'Sucessfully updated image' });
  },
];

exports.delete_image = (req, res, next) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  req.app.locals.gfs.delete(_id, (err) => {
    if (err) return res.status(500).json({ msg: 'Image deletion error' });
  });
  return res.json({ msg: 'Sucessfully deleted image' });
};
