import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'UNSUBSCRIBED'],
      default: 'PENDING',
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;
