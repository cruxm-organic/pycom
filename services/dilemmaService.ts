import type { Dilemma } from '../types.ts';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const FALLBACK_DILEMMA: Dilemma = {
  problem: "You need to store a user's contact info (name, age, email) and access it quickly by key. Which structure fits best?",
  options: ['List', 'Tuple', 'Dictionary', 'Set'],
  answer: 'Dictionary',
  explanation: 'Dictionaries give O(1) average lookup by key, exactly what keyed contact info needs.',
};

export const generateDataStructureDilemma = async (): Promise<Dilemma> => {
  try {
    const response = await fetch(`${API_BASE}/api/dilemma`);
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    return (await response.json()) as Dilemma;
  } catch (error) {
    console.error('Failed to fetch dilemma from backend, using fallback:', error);
    return FALLBACK_DILEMMA;
  }
};
