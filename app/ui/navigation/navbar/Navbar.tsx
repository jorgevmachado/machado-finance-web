import React from 'react';
import { MdAttachMoney ,MdMenu ,MdMenuOpen } from 'react-icons/md';

import { useAppTranslation } from '@/app/shared';
import { LanguageSwitcher } from '@/app/ui/navigation/language-switcher';

import './Navbar.scss';

type NavbarProps = {
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

const Navbar = ({ isAuthenticated, isSidebarCollapsed, onToggleSidebar }: NavbarProps) => {
  const { t } = useAppTranslation();
  
  return (
    <header className='app-navbar'>
      <div className='app-navbar__brand'>
        {isAuthenticated && (
          <button
            type='button'
            className='app-navbar__hamburger'
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? t('navigation.expandSidebar') : t('navigation.collapseSidebar')}
          >
            {isSidebarCollapsed ? <MdMenu size={22} /> : <MdMenuOpen size={22} />}
          </button>
        )}

        <div className='app-navbar__logo' aria-label={t('navigation.pokeballLogo')}>
          <MdAttachMoney/>
        </div>

        <div className='app-navbar__heading'>
          <h1 className='app-navbar__title'>{t('navigation.title')}</h1>
          <p className='app-navbar__subtitle'>{t('navigation.subtitle')}</p>
        </div>
      </div>

      <LanguageSwitcher />
    </header>
  );
};
export default React.memo(Navbar);