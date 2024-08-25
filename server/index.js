import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Hugging Face API query function
async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  const result = await response.blob();
  return result;
}
app.use('/api/v1/post', postRoutes);
// Route to handle image generation
app.post('/api/v1/generate-image', async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await query({ inputs: prompt });
    const base64Image = await result.arrayBuffer().then(buffer => {
      return Buffer.from(buffer).toString('base64');
    });

    res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Simple root endpoint
app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from Image Generator!',
  });
});

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
