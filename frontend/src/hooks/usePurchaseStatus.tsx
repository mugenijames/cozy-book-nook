// frontend/src/hooks/usePurchaseStatus.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function usePurchaseStatus(bookId: string) {
  const { user } = useAuth();
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsPurchased(false);
      setLoading(false);
      return;
    }

    // Check if user has purchased this book
    const checkPurchase = async () => {
      try {
        const response = await fetch(`/api/orders/check/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });
        const data = await response.json();
        setIsPurchased(data.purchased);
      } catch (error) {
        console.error('Error checking purchase:', error);
        setIsPurchased(false);
      } finally {
        setLoading(false);
      }
    };

    checkPurchase();
  }, [user, bookId]);

  return { isPurchased, loading };
}