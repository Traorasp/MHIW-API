const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// Verifies jwt token
function verifyToken(req, res, next) {
  // Get authorization from header
  const bearerHeader = req.headers.authorization || req.headers.Authorization;
  const pathsIgnored = ['/', '/register', '/refresh', '/logout'];
  if (pathsIgnored.includes(req.path)) {
    return next();
  }
  // Checks if there is a bearer token
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];

    jwt.verify(
      token,
      process.env.ACCESS_SECRET_KEY,
      (err, decoded) => {
        if (err) return res.status(403).json({ err, msg: 'Forbidden' });
        req.id = decoded.user.id;
        req.admin = decoded.user.admin;
        next();
      },
    );
  } else {
    return res.json({ msg: 'Not signed in' });
  }
}

module.exports = verifyToken;
