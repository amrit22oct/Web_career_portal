import Notification from '../models/Notification.js';
import nodemailer from 'nodemailer';

// Send email notification
export const sendNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    // Logic to send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userId,
      subject: 'New Notification',
      text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Email sent successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
