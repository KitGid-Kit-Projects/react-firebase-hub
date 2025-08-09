import { useState } from "react";
import { useForm } from 'react-hook-form';

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}
const useLoginPage = () => {
   const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const loginForm = useForm<LoginForm>();
  const signupForm = useForm<SignupForm>();


  const handleLogin = async (data: LoginForm) => {
    try {
      setLoading(true);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupForm) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading(true);
    } catch (error) {
      console.error('GitHub sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

    return {loading, setLoading,showPassword, setShowPassword,resetEmail, setResetEmail,loginForm,signupForm,
        handleLogin,handleSignup,handleGoogleSignIn,handleGithubSignIn
    }
};

export default useLoginPage;
