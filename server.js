import express from 'express';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.server' });

const app = express();
const port = 3003;

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
  // In production, serve the built React app AND API
  app.use(express.static(path.join(process.cwd(), 'dist')));
  
  // Serve the React app for all non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      // Let API routes handle themselves
      return;
    }
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

// Initialize Google AI
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Proxy endpoint for image generation
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, quality = 'standard', size = '1024x1024' } = req.body;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: '1024x1024'
        }
      }
    });

    // Extract image from response
    let imageUrl = null;
    if (response.candidates && response.candidates[0]) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    res.json({ 
      success: true, 
      imageUrl: imageUrl 
    });
  } catch (error) {
    console.error('Google AI API Error:', error);
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
    
    // For now, use generation for editing as well
    const enhancedPrompt = `ARCHITECTURAL EDITING: ${prompt}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: enhancedPrompt }] },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: '1024x1024'
        }
      }
    });

    // Extract image from response
    let imageUrl = null;
    if (response.candidates && response.candidates[0]) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    res.json({ 
      success: true, 
      imageUrl: imageUrl 
    });
  } catch (error) {
    console.error('Google AI API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
