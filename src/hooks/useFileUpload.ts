
import { useState } from 'react';

export interface FileUploadResult {
  fileUrl: string;
  fileName: string;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File): Promise<FileUploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // For demo purposes, we'll create a mock file URL
      // In a real implementation, this would upload to a cloud storage service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      const mockFileUrl = URL.createObjectURL(file);
      
      return {
        fileUrl: mockFileUrl,
        fileName: file.name
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error('Failed to upload file');
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
