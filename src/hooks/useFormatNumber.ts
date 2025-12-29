import { useCallback } from 'react';

/**
 * Hook for formatting numbers with locale support
 */
export const useFormatNumber = () => {
  const formatNumber = useCallback((value: number): string => {
    return value.toLocaleString('en-US');
  }, []);

  return { formatNumber };
};

