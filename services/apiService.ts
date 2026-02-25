const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'  // Direct Google AI
  : 'http://localhost:3002/api';  // Development: local server

export const generateImage = async (prompt: string, quality: 'standard' | 'hd' = 'standard', size: string = '1024x1024'): Promise<string> => {
  if (process.env.NODE_ENV === 'production') {
    // Direct Google AI call in production
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
            imageSize: '1024x1024'
          }
        }
      })
    });

    const data = await response.json();
    
    // Extract image from response
    if (data.candidates && data.candidates[0]) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error('No image generated');
  } else {
    // Development: use local backend
    const response = await fetch(`${API_BASE_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        quality,
        size
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate image');
    }
    
    return data.imageUrl;
  }
};

export const editImage = async (prompt: string, image: File, mask?: File): Promise<string> => {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('image', image);
  if (mask) {
    formData.append('mask', mask);
  }

  const response = await fetch(`${API_BASE_URL}/edit-image`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to edit image');
  }
  
  return data.imageUrl;
};
