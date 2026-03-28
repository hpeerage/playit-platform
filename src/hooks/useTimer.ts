/* src/hooks/useTimer.ts */
import { useState, useEffect, useRef } from 'react';

/**
 * PostgreSQL Interval string ("HH:MM:SS" 또는 "HH:MM:SS.ms") -> seconds
 */
const parseIntervalToSeconds = (interval: string | null): number => {
  if (!interval) return 0;
  
  // "02:30:00" -> [2, 30, 0]
  const parts = interval.split(':').map(Number);
  if (parts.length === 3) {
    return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  }
  return 0;
};

/**
 * seconds -> "HH:MM:SS"
 */
const formatSecondsToInterval = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
};

export const useTimer = (initialInterval: string | null) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => parseIntervalToSeconds(initialInterval));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 초기값 변경 시 상태 업데이트
  useEffect(() => {
    setTimeLeft(parseIntervalToSeconds(initialInterval));
  }, [initialInterval]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft > 0]);

  return {
    timeLeft, // seconds
    formattedTime: formatSecondsToInterval(timeLeft),
    isExpired: timeLeft <= 0
  };
};
