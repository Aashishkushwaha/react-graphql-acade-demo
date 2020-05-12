const jwt = require("jsonwebtoken");

module.exports  = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if(!authHeader) {
    req.isAuth = false;
    return next();
  }
  // authorization: Bearer token
  const token = authHeader.split(" ")[1];
  if(!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, "jwt@secret");
  }
  catch(error) {
    req.isAuth = false;
    next();
  }
  if(!decodedToken) {
    req.isAuth = false;
    return next();
  }
  
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
}