import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  skills: [{ type: String }],
  applyBy: { type: Date, required: true },  // Deadline to apply
  timePeriod: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Internship'], 
    required: true 
  },  // Time period
  jobType: { 
    type: String, 
    enum: ['Job', 'Internship'], 
    required: true 
  },  // Job or Internship
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
