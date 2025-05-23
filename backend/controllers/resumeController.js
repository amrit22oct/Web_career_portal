import Resume from '../models/Resume.js';
import multer from 'multer';
// import cloudStorage from '../config/cloudStorage.js'; // Assuming you're using cloud storage like AWS S3

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Upload resume
export const uploadResume = async (req, res) => {
  const { userId } = req.user;

  try {
    const uploadedFile = req.file;  // Uploaded file info

    const resume = new Resume({
      userId,
      filePath: uploadedFile.path,
      fileName: uploadedFile.originalname,
    });

    await resume.save();
    res.status(201).json({ message: 'Resume uploaded successfully', resume });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resume' });
  }
};

// Parse resume (example, this would be an AI-driven service)
export const parseResume = async (req, res) => {
  const { filePath } = req.body;

  try {
    // Add logic to parse the resume here
    const parsedData = {}; // Dummy data
    res.status(200).json({ parsedData });
  } catch (error) {
    res.status(500).json({ message: 'Error parsing resume' });
  }
};
