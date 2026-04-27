'use client';

import NavBar from '@/components/NavBar';
import { useState } from 'react';

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full min-h-screen min-h-dvh">
      <div className="flex flex-row w-full">
        <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
    </div>
  );
}

export default Dashboard;
