import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from  './app.js';
import { connectDB } from './config/db.js';

dotenv.config();
const PORT = process.env.PORT || 5001;

// connect to the DAtabase
connectDB();

// starting the server
app.listen(PORT, () => {
  console.log(`server is running on the http://localhost:${PORT}`);
});