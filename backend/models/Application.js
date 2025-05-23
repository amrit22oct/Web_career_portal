import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  resumeLink: { type: String, required: true },
  coverLetter: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
