import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useIdleTimer = (timeoutMinutes: number = 5) => {
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout>();
  const warningTimerRef = useRef<NodeJS.Timeout>();

  const logout = () => {
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
  };

  const showWarning = () => {
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
  };

  const resetTimer = () => {
    // Clear existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    
    // Set warning timer (4.5 minutes)
    warningTimerRef.current = setTimeout(showWarning, (timeoutMinutes - 0.5) * 60 * 1000);
    
    // Set logout timer (5 minutes)
    timerRef.current = setTimeout(logout, timeoutMinutes * 60 * 1000);
  };

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
  }, [timeoutMinutes]);
};