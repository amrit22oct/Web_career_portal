import mongoose from 'mongoose';

// Define the Resume schema
const resumeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    parsedData: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

// Create a model for the Resume schema
const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
