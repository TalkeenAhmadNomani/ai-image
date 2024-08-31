import express from 'express';

const router = express.Router();

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

// Route to handle image generation
router.post('/generate-image', async (req, res) => {
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

// Simple root endpoint for the Hugging Face routes
router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from Image Generator!',
  });
});

export default router;
