
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { useSupabaseFileUpload } from '@/hooks/useSupabaseFileUpload';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (fileUrl: string, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const { uploadFile, isUploading, uploadProgress } = useSupabaseFileUpload();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      console.log('Processing file upload:', file.name);
      const result = await uploadFile(file);
      
      console.log('File upload successful:', result);
      setUploadedFile({ name: result.fileName, url: result.fileUrl });
      onFileUpload(result.fileUrl, result.fileName);
      
      toast({
        title: "File uploaded successfully!",
        description: `${result.fileName} has been uploaded and is ready for submission.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  }, [uploadFile, onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading
  });

  const removeFile = () => {
    setUploadedFile(null);
    onFileUpload('', '');
  };

  if (uploadedFile) {
    return (
      <div className="border-2 border-green-200 border-dashed rounded-lg p-6 bg-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{uploadedFile.name}</p>
              <p className="text-sm text-green-600">File uploaded successfully</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : isUploading
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-blue-500 mx-auto animate-bounce" />
            <div>
              <p className="text-lg font-medium text-gray-700">Uploading...</p>
              <p className="text-sm text-gray-500">Please wait while we upload your file</p>
            </div>
            <div className="max-w-xs mx-auto">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <File className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop the file here' : 'Choose a file or drag & drop'}
              </p>
              <p className="text-sm text-gray-500">
                PDF, DOC, DOCX or image files up to 10MB
              </p>
            </div>
            <Button type="button" variant="outline" disabled={isUploading}>
              Select File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
