import { useState, useEffect } from 'react';

export const useScore = () => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const savedScore = parseInt(localStorage.getItem('gera_score') || '0');
    setScore(savedScore);
  }, []);

  const handleAction = (points: number) => {
    const newScore = Math.min(100, score + points);
    setScore(newScore);
    localStorage.setItem('gera_score', newScore.toString());
  };

  return { score, handleAction };
};
