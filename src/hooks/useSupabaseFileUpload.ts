
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FileUploadResult {
  fileUrl: string;
  fileName: string;
}

export const useSupabaseFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File): Promise<FileUploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate a unique file name to avoid conflicts
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `papers/${fileName}`;

      console.log('Starting file upload:', { fileName, fileSize: file.size });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('papers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('Upload successful:', data);

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('papers')
        .getPublicUrl(filePath);

      setUploadProgress(100);

      return {
        fileUrl: publicUrl,
        fileName: file.name
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadProgress
  };
};
