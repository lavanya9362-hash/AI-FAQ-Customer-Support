const mongoose = require('mongoose');
const FAQ = require('../models/FAQ');

/**
 * @desc    Create a new FAQ
 * @route   POST /api/faqs
 * @access  Private
 */
const createFAQ = async (req, res, next) => {
  const { question, answer, category } = req.body;

  try {
    const faq = await FAQ.create({
      question,
      answer,
      category,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all FAQs
 * @route   GET /api/faqs
 * @access  Public
 */
const getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: 'FAQs retrieved successfully',
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get FAQ by ID
 * @route   GET /api/faqs/:id
 * @access  Public
 */
const getFAQById = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid FAQ ID format',
    });
  }

  try {
    const faq = await FAQ.findById(req.params.id).populate('createdBy', 'name email');

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    return res.json({
      success: true,
      message: 'FAQ retrieved successfully',
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update FAQ
 * @route   PUT /api/faqs/:id
 * @access  Private
 */
const updateFAQ = async (req, res, next) => {
  const { question, answer, category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid FAQ ID format',
    });
  }

  try {
    let faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    // Verify ownership: only the creator can update the FAQ
    if (faq.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this FAQ',
      });
    }

    // Update fields
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;

    const updatedFAQ = await faq.save();

    return res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: updatedFAQ,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete FAQ
 * @route   DELETE /api/faqs/:id
 * @access  Private
 */
const deleteFAQ = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid FAQ ID format',
    });
  }

  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    // Verify ownership: only the creator can delete the FAQ
    if (faq.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this FAQ',
      });
    }

    await faq.deleteOne();

    return res.json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search FAQs by question, category, or keyword
 * @route   GET /api/faqs/search
 * @access  Public
 */
const searchFAQs = async (req, res, next) => {
  const { q } = req.query;

  try {
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter "q" is required',
      });
    }

    // Keyword search using regex on question, answer, and category
    const searchRegex = new RegExp(q, 'i');
    const query = {
      $or: [
        { question: searchRegex },
        { answer: searchRegex },
        { category: searchRegex },
      ],
    };

    const faqs = await FAQ.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: `Found ${faqs.length} FAQs matching "${q}"`,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
  searchFAQs,
};
