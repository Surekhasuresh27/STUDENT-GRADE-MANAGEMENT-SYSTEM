import { Grade } from '../types';

export const calculateAverage = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;
  
  const total = grades.reduce((sum, grade) => sum + grade.value, 0);
  return Number((total / grades.length).toFixed(1));
};

export const getGradeColor = (average: number): string => {
  if (average >= 90) return 'text-emerald-600';
  if (average >= 80) return 'text-green-600';
  if (average >= 70) return 'text-blue-600';
  if (average >= 60) return 'text-amber-600';
  return 'text-red-600';
};

export const getGradeLetterAndEmoji = (average: number): { letter: string; emoji: string } => {
  if (average >= 90) return { letter: 'A', emoji: '🏆' };
  if (average >= 80) return { letter: 'B', emoji: '🌟' };
  if (average >= 70) return { letter: 'C', emoji: '👍' };
  if (average >= 60) return { letter: 'D', emoji: '⚠️' };
  return { letter: 'F', emoji: '❌' };
};