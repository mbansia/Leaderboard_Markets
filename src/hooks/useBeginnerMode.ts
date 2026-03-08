import { useState } from 'react';
import type { DetailMode, Persona } from '../types/market';

export const useBeginnerMode = () => {
  const [mode, setMode] = useState<DetailMode>('beginner');
  const [persona, setPersona] = useState<Persona>('Trader');
  return { mode, setMode, persona, setPersona };
};
