import React, { useState } from 'react';
import { Login } from './Login.js';
import { Register } from './Register.js';

interface AuthScreenProps {
  selectedRole?: 'learner' | 'teacher' | null;
  onAuthSuccess?: () => void;
  initialMode?: 'login' | 'register';
}

type AuthMode = 'login' | 'register';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, initialMode = 'register' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  return (
    <>
      {mode === 'login' ? (
        <Login
          onSuccess={onAuthSuccess}
          onSwitchToRegister={() => setMode('register')}
        />
      ) : (
        <Register
          onSuccess={onAuthSuccess}
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </>
  );
};
