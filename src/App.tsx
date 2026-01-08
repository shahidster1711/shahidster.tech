import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';

/**
 * Global App Wrapper for layout and global effects
 */
const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
};

export default App;