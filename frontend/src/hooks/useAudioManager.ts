import { useEffect, useRef } from 'react';

export function useAudioManager() {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any currently playing audio
  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  // Play audio - stops any existing audio first
  const playAudio = (audioPath: string) => {
    // Stop any previously playing audio
    stopAudio();

    const audio = new Audio(audioPath);
    currentAudioRef.current = audio;
    
    audio.play().catch((error) => {
      console.log(`Failed to play audio: ${audioPath}`, error);
    });

    // Clean up reference when audio ends
    audio.addEventListener('ended', () => {
      currentAudioRef.current = null;
    });

    return audio;
  };

  // Stop audio and cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Stop audio when page visibility changes (user navigates away)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, stop audio
        stopAudio();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    playAudio,
    stopAudio,
  };
}
