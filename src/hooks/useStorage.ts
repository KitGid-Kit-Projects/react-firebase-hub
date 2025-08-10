import { useState } from 'react';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot
} from 'firebase/storage';
import { storage } from '@/config/firebase';
import { useToast } from '@/hooks/use-toast';

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
            onProgress?.(progress);
          },
          (error) => {
            setError(error.message);
            setUploading(false);
            toast({
              title: "Upload failed",
              description: error.message,
              variant: "destructive",
            });
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploading(false);
              toast({
                title: "File uploaded successfully",
                description: "Your file has been uploaded to Firebase Storage",
              });
              resolve(downloadURL);
            } catch (err: any) {
              setError(err.message);
              setUploading(false);
              reject(err);
            }
          }
        );
      });
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
      toast({
        title: "Upload error",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteFile = async (path: string): Promise<boolean> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      toast({
        title: "File deleted",
        description: "File has been successfully deleted from storage",
      });
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const getFileUrl = async (path: string): Promise<string | null> => {
    try {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error getting file URL",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    uploading,
    progress,
    error
  };
};