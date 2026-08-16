
export default function ThemeProvider({ children }) {
  return (
    <div className='light'>
      <div className='min-h-screen transition-colors duration-200 bg-white text-gray-900'>
        {children}
      </div>
    </div>
  );
}