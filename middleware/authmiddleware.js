const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(428); // if no token, unauthorized
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(428);
    req.user = user;
    next();
  });
};

exports.authorizeRole = (req,res,next,role) => {
  if(role == "admin") role_id = 1;
  else if(role == "customer") role_id = 2;
  else if(role == "employee") role_id = 3;
  if (req.user.r_id !== role_id) return res.sendStatus(428); 
  next();
  
};


// router.post(
//   "/",
//   [
//     authenticateToken,
//     (req, res, next) => authorizeRole(req, res, next, "admin"),
//   ],
//   Controller.create
// );
