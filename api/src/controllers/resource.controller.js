import Resource from '../models/resource.model.js';
import { errorHandler } from '../utils/error.js';
import cloudinary from '../config/cloudinary.js';

export const createResource = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to upload a resource'));
  }
  if (!req.body.title || !req.body.category) {
    return next(errorHandler(400, 'Please provide title and category'));
  }

  const baseSlug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const slug = req.body.slug || `${baseSlug}-${Math.random().toString(36).slice(-4)}`;

  const newResource = new Resource({ ...req.body, slug });
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
    const sortDirection = req.query.sortOrder === 'desc' ? -1 : 1; // default to 1 for documentation flow

    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: 'i' } },
        { description: { $regex: req.query.searchTerm, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query)
      .sort({ order: sortDirection, createdAt: sortDirection })
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
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) {
      return next(errorHandler(404, 'Resource not found'));
    }

    if (resource.fileUrl) {
      const publicIdEncoded = resource.fileUrl.split('/upload/')[1].split('/').slice(1).join('/').split('?')[0];
      const publicId = decodeURI(publicIdEncoded);
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }

    await Resource.findByIdAndDelete(req.params.resourceId);
    res.status(200).json('The resource has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to update this resource'));
  }
  
  if (!req.body.title || !req.body.category) {
    return next(errorHandler(400, 'Please provide title and category'));
  }

  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) {
      return next(errorHandler(404, 'Resource not found'));
    }

    let newSlug = resource.slug;
    // Generate new slug only if title has changed
    if (req.body.title !== resource.title) {
      const baseSlug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');
      newSlug = `${baseSlug}-${Math.random().toString(36).slice(-4)}`;
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.resourceId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          content: req.body.content,
          fileUrl: req.body.fileUrl,
          order: req.body.order,
          slug: newSlug,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedResource);
  } catch (error) {
    next(error);
  }
};
