const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token for an authenticated user.
 * @param {string} id - The user ID
 * @returns {string} The signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here_must_be_long_and_secure',
    {
      expiresIn: '30d',
    }
  );
};

module.exports = {
  generateToken,
};
