const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password',
    });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  next();
};

const validateFAQ = (req, res, next) => {
  const { question, answer, category } = req.body;

  if (!question || !answer || !category) {
    return res.status(400).json({
      success: false,
      message: 'Please provide question, answer, and category',
    });
  }

  const validCategories = ['Technology', 'Education', 'Health', 'Banking', 'General'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
    });
  }

  next();
};

const validateAIAnswer = (req, res, next) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid question string',
    });
  }

  next();
};

const validateAIFaq = (req, res, next) => {
  const { topic } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid topic string',
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateFAQ,
  validateAIAnswer,
  validateAIFaq,
};
