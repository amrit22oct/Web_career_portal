import Message from '../models/Message.js';

// Send message
export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const message = new Message({
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
    });

    await message.save();
    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Get messages between users
export const getMessages = async (req, res) => {
  const { userId } = req.user;
  const { receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages' });
  }
};
