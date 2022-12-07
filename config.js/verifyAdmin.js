module.exports = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    return res.status(403).json({ msg: 'Forbidden, user is not an admin' });
  }
};
