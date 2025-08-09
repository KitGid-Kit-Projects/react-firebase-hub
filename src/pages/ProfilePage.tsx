import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStorage } from '@/hooks/useStorage';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Upload,
  Edit3,
  Trash2,
  Check,
  X,
  Camera
} from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ProfileForm {
  displayName: string;
}

const ProfilePage: React.FC = () => {
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarUrl} alt="Profile" />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {currentUser?.displayName?.[0]?.toUpperCase() || 
                       currentUser?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    <Camera className="h-3 w-3" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      Uploading... {Math.round(progress)}%
                    </p>
                  </div>
                )}

                <CardTitle>
                  {currentUser?.displayName || 'User'}
                </CardTitle>
                <CardDescription>
                  {currentUser?.email}
                </CardDescription>

                <div className="flex justify-center mt-4">
                  <Badge 
                    variant={currentUser?.emailVerified ? "default" : "secondary"}
                    className={currentUser?.emailVerified ? "bg-success" : ""}
                  >
                    {currentUser?.emailVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Profile Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                        <span className="text-sm font-medium">{stat.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{stat.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your account's profile information.
                    </CardDescription>
                  </div>
                  
                  {!editing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {editing ? (
                  <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="Enter your display name"
                        {...form.register('displayName', { required: 'Display name is required' })}
                      />
                      {form.formState.errors.displayName && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.displayName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        value={currentUser?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed from this interface.
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" size="sm">
                        <Check className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditing(false);
                          form.reset();
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Display Name</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentUser?.displayName || 'Not set'}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Email Address</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">User ID</Label>
                        <p className="text-sm text-muted-foreground mt-1 font-mono">
                          {currentUser?.uid}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Last Sign In</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentUser?.metadata?.lastSignInTime 
                            ? new Date(currentUser.metadata.lastSignInTime).toLocaleString()
                            : 'Unknown'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security settings.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    Setup 2FA
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Change your account password.
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;