import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    attachedResources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
    }],
  },
  { timestamps: true }
);

postSchema.index({ attachedResources: 1, isApproved: 1 });
postSchema.index({ category: 1, isApproved: 1, updatedAt: -1 });
postSchema.index({ isApproved: 1, updatedAt: -1 });
// Add a text index for high-performance full-text search
postSchema.index({ title: 'text', content: 'text' });

const Post = mongoose.model('Post', postSchema);

export default Post;