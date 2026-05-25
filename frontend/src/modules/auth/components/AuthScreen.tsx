import React, { useState } from 'react';
import { Login } from './Login.js';
import { Register } from './Register.js';

interface AuthScreenProps {
  selectedRole: 'learner' | 'teacher' | null;
  onAuthSuccess?: () => void;
}

type AuthMode = 'login' | 'register';

export const AuthScreen: React.FC<AuthScreenProps> = ({ selectedRole, onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('register');

  return (
    <>
      {mode === 'login' ? (
        <Login
          onSuccess={onAuthSuccess}
          onSwitchToRegister={() => setMode('register')}
        />
      ) : (
        <Register
          selectedRole={selectedRole as 'learner' | 'teacher'}
          onSuccess={onAuthSuccess}
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </>
  );
};
