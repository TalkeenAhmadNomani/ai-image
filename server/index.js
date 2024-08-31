import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/postRoutes.js';
import generateImageRoutes from './routes/generateImageRoutes.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Use routes from the routes folder

app.use('/api/v1/post', postRoutes);
app.use('/api/v1', generateImageRoutes); // Use the generateImage routes

// Start the server and connect to MongoDB
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    console.log('Connecting to MongoDB with URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    app.listen(8080, () => {
      console.log('Server running on http://localhost:8080');
    });
  } catch (error) {
    console.error('Failed to connect with MongoDB');
    console.error(error.message);
    process.exit(1); // Exit process with failure
  }
};

startServer();
