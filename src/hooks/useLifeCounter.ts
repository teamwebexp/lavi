import { useState, useEffect } from 'react';
import { getEffectiveSpecialDate } from '../config/albumConfig';

export interface LifeCounterData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalWeeks: number;
  totalMonthsApprox: number;
  isPast: boolean;
  formattedTargetDate: string;
}

export function useLifeCounter(): LifeCounterData {
  const [targetDateStr, setTargetDateStr] = useState<string>(() => getEffectiveSpecialDate());
  
  const [data, setData] = useState<LifeCounterData>(() => calculateTime(getEffectiveSpecialDate()));

  useEffect(() => {
    // Check if configuration changed in localStorage
    const checkConfig = () => {
      const current = getEffectiveSpecialDate();
      if (current !== targetDateStr) {
        setTargetDateStr(current);
      }
    };

    const timer = setInterval(() => {
      checkConfig();
      setData(calculateTime(getEffectiveSpecialDate()));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  return data;
}

function calculateTime(dateString: string): LifeCounterData {
  const targetDate = new Date(dateString);
  const now = new Date();
  
  const validDate = isNaN(targetDate.getTime()) ? new Date('2026-09-28T21:19:00') : targetDate;
  
  const diffMs = now.getTime() - validDate.getTime();
  const isPast = diffMs >= 0;
  const absDiffMs = Math.abs(diffMs);

  const totalSeconds = Math.floor(absDiffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonthsApprox = Math.floor((totalDays / 30.4375) * 10) / 10; // 1 decimal place

  const formattedTargetDate = validDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalWeeks,
    totalMonthsApprox,
    isPast,
    formattedTargetDate,
  };
}
