import express from 'express';
import * as dotenv from 'dotenv';
import { HfInference } from "@huggingface/inference";

dotenv.config();

const router = express.Router();
const hf = new HfInference(process.env.HF_API_KEY); // Initialize with your Hugging Face API key

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from Hugging Face Image Generation!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await hf.textToImage({
      model: "ZB-Tech/Text-to-Image",
      inputs: prompt,
      parameters: {
        negative_prompt: 'blurry',
      }
    });

    const image = aiResponse.image; // Assuming 'image' is the key in the response
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Something went wrong');
  }
});

export default router;
