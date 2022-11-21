// Verifies jwt token
function verifyToken(req, res, next) {

    // Get authorization from header
    const bearerHeader = req.headers["authorization"];

    // Checks if there is a bearer token
    if(typeof bearerHeader !== "undefined") {

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        req.token = bearerToken;
        console.log("token")
        next();
    } else {
        res.senStatus(403).json({msg: 'Not signed in'});
    }
}

module.exports = verifyToken;