const jwt = require('jsonwebtoken');

// Middleware to check if the refresh token has expired
const verifyAdmin = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken; // Assuming the token is stored in a cookie
 
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    // Check if the token is valid (not expired)
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    if(decoded.role !== "Supervisor"){
        return res.status(405).json({ message: 'You are not authorized to access this route'})
    }
        // Attach decoded data to the request object
    req.user = decoded;
    console.log(decoded.role)
    next(); // Proceed to the next middleware
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

module.exports = verifyAdmin