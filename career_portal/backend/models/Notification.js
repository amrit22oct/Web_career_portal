import mongoose from 'mongoose';

// Define the Notification schema
const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['job', 'application', 'message'],
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model for the Notification schema
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
