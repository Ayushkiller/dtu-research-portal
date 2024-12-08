const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'sdgzgdzsfdjhgzjufygjuzasyfgjuzsyjfgsjzymgjfzmjayushkillesyoumany';

const authorizeDean = async (req, res, next) => {
  try {
    // Check for token in headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Access denied. No token provided.' });

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Check if userType is 'competentAuthority'
    const user = await User.findById(decoded.id);
    if (!user || user.userType !== 'competentAuthority') {
      return res.status(403).send({ error: 'Access forbidden. Insufficient permissions.' });
    }

    // Allow access to the next middleware or route
    next();
  } catch (error) {
    res.status(401).send({ error: 'Invalid or expired token.' });
  }
};

module.exports = { authorizeDean };
