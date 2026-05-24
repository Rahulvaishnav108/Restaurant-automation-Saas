import React, { useState } from 'react';
import { Eye, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import loginImage from '../../features/customer/login.jpg';

type AuthFormProps = {
  onLogin?: () => void;
  onOtpLogin?: () => void;
  onSignUp?: () => void;
  className?: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onOtpLogin, onSignUp, className = '' }) => {
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className={`relative flex min-h-[640px] w-full items-center justify-center overflow-hidden bg-[#080b14] px-6 py-10 text-slate-950 shadow-2xl sm:px-10 ${className}`}>
      <div className="absolute inset-0">
        <img
          src={loginImage}
          alt="ServeSphere restaurant staff"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative w-full max-w-[420px]">
          <div className="mb-8 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 stroke-[1.8] text-slate-950" />
            <h1 className="mt-3 text-3xl font-bold tracking-normal text-white">Welcome Back !</h1>
            <p className="mt-2 text-sm font-medium text-white">Login to your ServeSphere account</p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-slate-950">Mobile Number</span>
              <span className="mt-3 flex h-11 items-center gap-3 rounded-md border border-slate-700 bg-white/80 px-3 text-slate-950 shadow-lg shadow-black/20 focus-within:border-orange-500">
                <UserRound className="h-5 w-5 stroke-[1.8]" />
                <input
                  type="text"
                  placeholder="Enter Staff ID or Mobile Number"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-950">Password</span>
              <span className="mt-3 flex h-11 items-center gap-3 rounded-md border border-slate-700 bg-white/80 px-3 text-slate-950 shadow-lg shadow-black/20 focus-within:border-orange-500">
                <LockKeyhole className="h-5 w-5 stroke-[1.8]" />
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                />
                <button type="button" aria-label="Show password" className="text-slate-950">
                  <Eye className="h-5 w-5 stroke-[1.8]" />
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between gap-4 text-xs font-medium text-slate-950">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-orange-400 accent-orange-500"
                />
                Remember me
              </label>
              <button type="button" className="transition hover:text-orange-500">Forgot Password ?</button>
            </div>

            <button
              type="button"
              onClick={onLogin}
              className="mt-3 h-11 w-full rounded-md bg-orange-500 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Login
            </button>

            <div className="text-center text-xs font-medium text-slate-950">OR</div>

            <button
              type="button"
              onClick={onOtpLogin}
              className="h-11 w-full rounded-md border border-orange-500 text-sm font-medium text-orange-300 transition hover:bg-orange-500 hover:text-white"
            >
              Login with OTP
            </button>

            <p className="pt-2 text-center text-xs font-medium text-slate-950">
              New to ServeSphere?{' '}
              <button type="button" onClick={onSignUp} className="font-semibold text-orange-500 hover:underline">
                Create account
              </button>
            </p>
          </div>
      </div>
    </div>
  );
};

export default AuthForm;
