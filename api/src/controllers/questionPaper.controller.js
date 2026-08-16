import QuestionPaper from '../models/questionPaper.model.js';
import { errorHandler } from '../utils/error.js';

export const createPaper = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to upload a question paper'));
  }
  if (!req.body.title || !req.body.branch || !req.body.subject || !req.body.year || !req.body.semester || !req.body.examType || !req.body.fileUrl) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const newPaper = new QuestionPaper(req.body);
  try {
    const savedPaper = await newPaper.save();
    res.status(201).json(savedPaper);
  } catch (error) {
    next(error);
  }
};

export const getPapers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const query = {};
    if (req.query.branch) query.branch = req.query.branch;
    if (req.query.year) query.year = parseInt(req.query.year);
    if (req.query.semester) query.semester = parseInt(req.query.semester);
    if (req.query.examType) query.examType = req.query.examType;

    const papers = await QuestionPaper.find(query)
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPapers = await QuestionPaper.countDocuments(query);

    res.status(200).json({
      papers,
      totalPapers,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePaper = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this question paper'));
  }
  try {
    await QuestionPaper.findByIdAndDelete(req.params.paperId);
    res.status(200).json('The question paper has been deleted');
  } catch (error) {
    next(error);
  }
};
