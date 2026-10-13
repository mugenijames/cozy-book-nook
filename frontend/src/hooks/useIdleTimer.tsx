// frontend/src/hooks/useIdleTimer.ts

import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useIdleTimer = (timeoutMinutes: number = 5) => {
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('token_expiry');
    
    toast.warning('Session expired. Please login again.', {
      duration: 3000,
    });
    
    navigate('/admin/login');
  }, [navigate]);

  const showWarning = useCallback(() => {
    toast.warning('You will be logged out in 30 seconds due to inactivity', {
      duration: 10000,
      action: {
        label: 'Stay Logged In',
        onClick: () => {
          resetTimer();
          toast.success('Session extended');
        },
      },
    });
  }, []);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    
    // Set warning timer (e.g., at 4.5 minutes for a 5-minute timeout)
    const warningTime = Math.max((timeoutMinutes - 0.5) * 60 * 1000, 0);
    warningTimerRef.current = setTimeout(showWarning, warningTime);
    
    // Set logout timer (5 minutes)
    timerRef.current = setTimeout(logout, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, showWarning, logout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);
};