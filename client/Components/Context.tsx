import { createContext } from 'react';

export const ThemeContext = createContext(null);

// check env for whether app is in demo mode or not
export const RunModeContext = createContext(process.env.RUN_MODE);