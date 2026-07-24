'use server';

import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/config/env';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export async function uploadImageToCloudinary(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            resolve({ success: false, error: error.message });
          } else if (result) {
            resolve({ success: true, url: result.secure_url });
          } else {
            resolve({ success: false, error: 'Unknown upload error' });
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error: any) {
    console.error('Upload failed:', error);
    return { success: false, error: error.message || 'Upload failed' };
  }
}
