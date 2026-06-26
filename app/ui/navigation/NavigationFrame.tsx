'use client';

import React ,{ useCallback ,useState } from 'react';

import { useAppTranslation } from '@/app/shared';
import { EUserRole, useUser } from '@/app/modules';
import { usePathname ,useRouter } from 'next/navigation';

import { getAuthenticatedMenuItems } from './business';
import { logoutAction } from '@/app/actions/auth';
import { Navbar } from '@/app/ui/navigation/navbar';

import './navigation.scss';
import { Breadcrumb } from '@/app/ds';
import { Sidebar } from '@/app/ui/navigation/sidebar';

type NavigationFrameProps = {
  role?: EUserRole;
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const NavigationFrame = ({ role = 'USER', isAuthenticated, children }: NavigationFrameProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useUser();
  const { t } = useAppTranslation();
  const isSidebarVisible = isAuthenticated && !isSidebarCollapsed;

  const authenticatedMenuItems = getAuthenticatedMenuItems(t);

  const authenticatedMenuItemsFiltered = authenticatedMenuItems.filter((item) => item.roles.includes(role));

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    clearUser();
    await logoutAction();
    router.push('/login');
    router.refresh();
  }, [clearUser, router]);

  return (
    <div className="app-shell">
      <Navbar
        isAuthenticated={isAuthenticated}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className={`${isAuthenticated ? 'app-content' : 'app-content--public'} ${isSidebarVisible ? 'app-content--sidebar-open' : ''}`}>
        {isAuthenticated && (
          <Sidebar
            items={authenticatedMenuItemsFiltered}
            isCollapsed={isSidebarCollapsed}
            pathname={pathname}
            onLogout={handleLogout}
          />
        )}
        {isSidebarVisible && (
          <button
            type='button'
            className='app-sidebar-overlay'
            aria-label={t('navigation.closeSidebar')}
            onClick={handleToggleSidebar}
          />
        )}
        <main className='app-main'>
          {isAuthenticated && <Breadcrumb />}
          {children}
        </main>
      </div>
    </div>
  );
};

export default React.memo(NavigationFrame);