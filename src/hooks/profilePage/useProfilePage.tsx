import { useAuth } from "@/contexts/AuthContext";
import { useStorage } from "../useStorage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Mail,
    Calendar,
    Shield,
  } from 'lucide-react';
interface ProfileForm {
    displayName: string;
  }
export default function useProfilePage() {
    const { currentUser, updateUserProfile, deleteAccount } = useAuth();
    const { uploadFile, uploading, progress } = useStorage();
    const [editing, setEditing] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(currentUser?.photoURL || '');
  
    const form = useForm<ProfileForm>({
      defaultValues: {
        displayName: currentUser?.displayName || ''
      }
    });
  
    const handleUpdateProfile = async (data: ProfileForm) => {
      try {
        await updateUserProfile(data.displayName);
        setEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };
  
    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      try {
        const path = `avatars/${currentUser?.uid}/${Date.now()}_${file.name}`;
        const url = await uploadFile(file, path);
        if (url) {
          setAvatarUrl(url);
          // Note: In a real app, you'd update the user's photoURL in Firebase Auth
          // This requires additional setup with Firebase Admin SDK or Cloud Functions
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    };
  
    const handleDeleteAccount = async () => {
      try {
        await deleteAccount();
        // User will be redirected to login page automatically
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    };
  
    const profileStats = [
      {
        label: 'Account Type',
        value: 'Free Tier',
        icon: Shield,
        color: 'text-info'
      },
      {
        label: 'Member Since',
        value: currentUser?.metadata?.creationTime 
          ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
          : 'Unknown',
        icon: Calendar,
        color: 'text-success'
      },
      {
        label: 'Email Verified',
        value: currentUser?.emailVerified ? 'Yes' : 'No',
        icon: Mail,
        color: currentUser?.emailVerified ? 'text-success' : 'text-warning'
      },
    ];
  return {
    form,
    handleUpdateProfile,
    handleAvatarUpload,
    handleDeleteAccount,
    profileStats,
    editing,
    setEditing,
    avatarUrl,
    uploading,
    progress,
    currentUser
  }
}
