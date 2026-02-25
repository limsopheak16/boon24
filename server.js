import express from 'express';
import { OpenAI } from 'openai';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.server' });

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// In development, let Vite handle the frontend
if (process.env.NODE_ENV !== 'production') {
  // Just API endpoints in development
  app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend server is running' });
  });
} else {
  // In production, serve the built React app
  app.use(express.static(path.join(process.cwd(), 'dist')));
  
  // Serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Proxy endpoint for image generation
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, quality = 'standard', size = '1024x1024' } = req.body;
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size,
      quality: quality,
      style: 'natural'
    });

    res.json({ 
      success: true, 
      imageUrl: response.data[0].url 
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Proxy endpoint for image editing
app.post('/api/edit-image', async (req, res) => {
  try {
    const { prompt, image, mask } = req.body;
    
    const response = await openai.images.edit({
      model: 'dall-e-2',
      image: image,
      mask: mask,
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    });

    res.json({ 
      success: true, 
      imageUrl: response.data[0].url 
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
