import React, { useContext } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { ThemeContext } from '../context/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 ease-in-out"
      onClick={toggleTheme}
    >
      <div
        className={`absolute transition-opacity duration-300 ease-in-out ${
          theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
        }`}
      >
        <IconSun size={24} />
      </div>
      <div
        className={`absolute transition-opacity duration-300 ease-in-out ${
          theme === 'dark' ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
        }`}
      >
        <IconMoon size={24} />
      </div>
    </button>
  );
};

export default DarkModeToggle;
