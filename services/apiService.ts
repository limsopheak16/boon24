const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Production: same domain
  : 'http://localhost:3002/api';  // Development: local server

export const generateImage = async (prompt: string, quality: 'standard' | 'hd' = 'standard', size: string = '1024x1024'): Promise<string> => {
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
