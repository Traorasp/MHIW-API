// Verifies jwt token
function verifyToken(req, res, next) {
  // Get authorization from header
  const bearerHeader = req.headers.authorization;
  if (req.path === '/' || req.path === '/register') {
    return next();
  }
  // Checks if there is a bearer token
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    req.token = bearerToken;
    next();
  } else {
    return res.json({ msg: 'Not signed in' });
  }
}

module.exports = verifyToken;
