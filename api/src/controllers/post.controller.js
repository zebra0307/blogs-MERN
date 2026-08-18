import Post from '../models/post.model.js';
import Subscriber from '../models/subscriber.model.js';
import { errorHandler } from '../utils/error.js';
import { sendNewPostNotification } from '../services/email.service.js';

export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  // 1 post per month limit for non-admins
  if (!req.user.isAdmin) {
    const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const recentPosts = await Post.countDocuments({
      userId: req.user.id,
      createdAt: { $gte: oneMonthAgo }
    });
    if (recentPosts >= 1) {
      return next(errorHandler(403, 'You have reached your limit of 1 post per month.'));
    }
  }

  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
    
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
    isApproved: req.user.isAdmin ? true : false,
  });
  
  try {
    const savedPost = await newPost.save();
    
    // Notify subscribers if the post is published directly (admin)
    if (savedPost.isApproved) {
      Subscriber.find({ status: 'ACTIVE' }).then(subscribers => {
        if (subscribers.length > 0) {
          sendNewPostNotification(subscribers, savedPost).catch(err => console.error('Failed to send notifications:', err));
        }
      }).catch(err => console.error('Failed to fetch subscribers:', err));
    }

    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    console.log('getposts called');
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    console.log('Query params:', { startIndex, limit, sortDirection, query: req.query });

    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };
    
    // Filter by isApproved unless specified otherwise (e.g. admin fetching all posts)
    if (req.query.isApproved !== undefined) {
      if (req.query.isApproved === 'true') {
        query.isApproved = { $ne: false }; // Matches true and old posts where the field doesn't exist
      } else {
        query.isApproved = false;
      }
    } else if (!req.query.userId) { // Public feed should only show approved posts
      query.isApproved = { $ne: false };
    }

    const posts = await Post.find(query)
      .populate('attachedResources')
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    console.log('Posts fetched:', posts.length);

    const totalPosts = await Post.countDocuments();
    console.log('Total posts:', totalPosts);

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    console.log('Last month posts:', lastMonthPosts);

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    console.error('Error in getposts:', error);
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          ...(req.body.attachedResources !== undefined && { attachedResources: req.body.attachedResources }),
          ...(req.user.isAdmin && req.body.isApproved !== undefined && { isApproved: req.body.isApproved }),
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const approvePost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to approve posts'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: { isApproved: true } },
      { new: true }
    );

    // Notify subscribers when a post is approved
    if (updatedPost) {
      Subscriber.find({ status: 'ACTIVE' }).then(subscribers => {
        if (subscribers.length > 0) {
          sendNewPostNotification(subscribers, updatedPost).catch(err => console.error('Failed to send notifications:', err));
        }
      }).catch(err => console.error('Failed to fetch subscribers:', err));
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};