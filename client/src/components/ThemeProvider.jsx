import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark'
          ? 'bg-black text-white'
          : 'bg-white text-gray-900'
        }`}>
        {children}
      </div>
    </div>
  );
}