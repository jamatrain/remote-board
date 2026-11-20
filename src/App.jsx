import React, { useState, useEffect } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { TVBoard } from './components/TVBoard';

export function App() {
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path.includes('/tv') || path.includes('/board') || search.includes('view=tv') || hash.includes('tv')) {
      return 'tv';
    }
    return 'admin';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/tv') || path.includes('/board') || search.includes('view=tv') || hash.includes('tv')) {
        setRoute('tv');
      } else {
        setRoute('admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (route === 'tv') {
    return <TVBoard />;
  }

  return <AdminPanel />;
}

export default App;
