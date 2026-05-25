import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, GraduationCap, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../auth.context.js';

interface RegisterProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  selectedRole?: 'learner' | 'teacher';
}

export const Register: React.FC<RegisterProps> = ({ onSuccess, onSwitchToLogin, selectedRole }) => {
  const { register, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'learner' | 'teacher'>(selectedRole || 'learner');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !name || !password || !confirmPassword) {
      setLocalError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(email, password, confirmPassword, role, name);
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      onSuccess?.();
    } catch (err) {
      // Error is already handled by the auth context
    }
  };

  const roleTitle = role === 'learner' ? 'Student' : 'Teacher';

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#EEF2FF] opacity-70" />
      <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#FEF3C7] opacity-60" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#FB7185]" />
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-[#10B981]" />

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(31,36,48,0.04),0_8px_24px_-12px_rgba(31,36,48,0.10)] p-8 border border-[#1F243014]">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-[#EEF2FF] rounded-xl mx-auto mb-4 flex items-center justify-center shadow-[0_4px_12px_-4px_rgba(79,70,229,0.2)]">
              <span className="text-3xl font-semibold text-[#4F46E5]">R</span>
            </div>
            <h1 className="text-2xl font-semibold text-[#1F2430] mb-1">Join Readlr</h1>
            <p className="text-[#4B5266] text-sm">Create your account as a {roleTitle}</p>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] px-4 py-3 rounded-xl mb-6 text-sm"
            >
              {error || localError}
            </motion.div>
          )}

          {/* Role Display */}
          {!selectedRole && (
            <div className="mb-6">
              <label className="block text-[#1F2430] font-medium text-sm mb-3">Select Your Role</label>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setRole('learner')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm font-medium ${
                    role === 'learner'
                      ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]'
                      : 'border-[#E5E7EB] bg-white text-[#4B5266] hover:border-[#4F46E5]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Student
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm font-medium ${
                    role === 'teacher'
                      ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]'
                      : 'border-[#E5E7EB] bg-white text-[#4B5266] hover:border-[#4F46E5]'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Teacher
                </motion.button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#1F2430] font-medium text-sm mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#4F46E5] transition-colors bg-white text-[#1F2430] placeholder-[#9CA3AF]"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-[#1F2430] font-medium text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#4F46E5] transition-colors bg-white text-[#1F2430] placeholder-[#9CA3AF]"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-[#1F2430] font-medium text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#4F46E5] transition-colors bg-white text-[#1F2430] placeholder-[#9CA3AF]"
                disabled={isLoading}
              />
              <p className="text-xs text-[#9CA3AF] mt-1">At least 6 characters</p>
            </div>

            <div>
              <label className="block text-[#1F2430] font-medium text-sm mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#4F46E5] transition-colors bg-white text-[#1F2430] placeholder-[#9CA3AF]"
                disabled={isLoading}
              />
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold py-3 rounded-lg hover:shadow-[0_2px_4px_rgba(31,36,48,0.05),0_18px_40px_-18px_rgba(79,70,229,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">Already registered?</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Switch to Login */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSwitchToLogin}
            className="w-full bg-white border-2 border-[#4F46E5] text-[#4F46E5] font-semibold py-3 rounded-lg hover:bg-[#EEF2FF] transition-colors"
          >
            Sign In
          </motion.button>

          {/* Footer */}
          <p className="text-xs text-[#9CA3AF] text-center mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
};

