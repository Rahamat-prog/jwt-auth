// middleware besically confirm that the user is login and we decript the user id from the token jo ham sent kar denge user ko matlab token ko cookie se nikal ke user ko denge verify karke.
const JWT = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    // find out the token from the cookie 
const token = req.cookies && req.cookies.token || null;

// if token is not availabel so sent the error message
if(!token) {
    return res.status(400).json({
        success: false,
        message: "not authorized"
    })
}
// now token is available so vefify the token and decript it and given to the user and this user is used inside the controller getUser method
try {
    const payload = JWT.verify(token, process.env.SECRET)
    req.user = {_id: payload._id, email: payload.email};

    next(); // this is importaint because if we don't use next so a age nahi bare ga. matlab middle se next method pe nahi jage ga.

} catch (error) {
    return res.status(401).json({
        success: false,
        message: "invalid token"
    })
}

}


module.exports = jwtAuth;