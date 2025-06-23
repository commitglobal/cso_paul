import { useState } from 'react';
import { CommonProps } from '@/types/CommonProps';
import { AppSidebar } from './AppSidebar';
import { AppTopBar } from './AppTopBar';
import { usePage } from '@inertiajs/react';

export function AppNavBars() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    props: { is_authenticated },
  } = usePage<CommonProps>();

  return (
    <>
      <AppTopBar handleOpenSidebar={() => setSidebarOpen(true)} />
      {is_authenticated && (
        <AppSidebar
          handleClose={() => setSidebarOpen(false)}
          open={sidebarOpen}
        />
      )}
    </>
  );
}
