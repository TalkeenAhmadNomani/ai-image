import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetch all posts
router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

// Create a new post
router.route('/').post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // Upload the photo to Cloudinary
    let photoUrl;
    try {
      photoUrl = await cloudinary.uploader.upload(photo);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
    }

    // Create a new post in MongoDB
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
});

export default router;
