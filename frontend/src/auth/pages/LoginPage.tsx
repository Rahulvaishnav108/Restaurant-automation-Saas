import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#202020] p-3">
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Back to home"
        className="absolute right-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl transition hover:bg-orange-500 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
      <AuthForm
        className="max-w-6xl"
        onLogin={() => navigate('/dashboard')}
        onOtpLogin={() => navigate('/dashboard')}
        onSignUp={() => navigate('/dashboard')}
      />
    </main>
  );
};

export default LoginPage;
