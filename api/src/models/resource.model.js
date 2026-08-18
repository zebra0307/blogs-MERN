import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['DSA', 'Operating System', 'DBMS'],
      required: true,
    },
    resourceType: {
      type: String,
      default: 'PDF',
    },
    fileUrl: {
      type: String,
    },
    content: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
