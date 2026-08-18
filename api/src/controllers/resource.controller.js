import Resource from '../models/resource.model.js';
import { errorHandler } from '../utils/error.js';

export const createResource = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to upload a resource'));
  }
  if (!req.body.title || !req.body.description || !req.body.category || !req.body.fileUrl) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const newResource = new Resource(req.body);
  try {
    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    next(error);
  }
};

export const getResources = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: 'i' } },
        { description: { $regex: req.query.searchTerm, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query)
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalResources = await Resource.countDocuments(query);

    res.status(200).json({
      resources,
      totalResources,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this resource'));
  }
  try {
    await Resource.findByIdAndDelete(req.params.resourceId);
    res.status(200).json('The resource has been deleted');
  } catch (error) {
    next(error);
  }
};
