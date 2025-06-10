import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import { join } from 'path';

type FileUpload = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  name: string;
  type: string;
  size: number;
};

export async function uploadFile(file: FileUpload, directory = 'public/uploads'): Promise<string> {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and AVIF images are allowed.');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds the maximum limit of 5MB');
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = join(process.cwd(), directory, fileName);
    const publicUrl = `/${directory.split('/').pop()}/${fileName}`;

    // Convert the file data to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write the file to the filesystem
    await writeFile(filePath, buffer);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Construct the full path to the file
    const fullPath = path.join(process.cwd(), filePath);
    
    // Check if file exists before trying to delete it
    try {
      await fs.access(fullPath);
      await fs.unlink(fullPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('File does not exist, skipping deletion:', fullPath);
        return;
      }
      throw err;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
