'use client';

import React, { useState, useEffect } from 'react';
import { Trees, Phone, MapPin, Menu, X, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Наши дома', href: '#houses' },
    { label: 'Калькулятор брони', href: '#booking', isHighlight: true },
    { label: 'Чан и Баня', href: '#spa' },
    { label: 'Атмосфера', href: '#gallery' },
    { label: 'Правила & FAQ', href: '#rules' },
    { label: 'Локация', href: '#location' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.container}`}>
        {/* Brand Group */}
        <div className={styles.brandWrapper}>
          <a href="#" className={styles.logo} onClick={(e) => handleScrollTo(e, '#')}>
            <div className={styles.logoIconWrap}>
              <Trees size={22} className={styles.logoIcon} />
            </div>
            <div className={styles.logoText}>
              <span className={styles.brandTitle}>ЭХО</span>
              <span className={styles.brandSub}>Гостевые дома • Комсомольск</span>
            </div>
          </a>

          {/* Location Tag */}
          <div className={styles.locationTag}>
            <MapPin size={14} className={styles.mapIcon} />
            <span>ул. Комитетская, 1</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`${styles.navLink} ${link.isHighlight ? styles.highlightLink : ''}`}
                  onClick={(e) => handleScrollTo(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <a href="tel:+78000000000" className={styles.phoneLink}>
            <Phone size={15} className={styles.phoneIcon} />
            <span>+7 (800) 000-00-00</span>
          </a>

          <Button
            variant="amber"
            size="sm"
            className={styles.ctaBtn}
            leftIcon={<Calendar size={16} />}
            onClick={() => {
              const el = document.querySelector('#booking');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Бронь онлайн
          </Button>

          <button
            className={styles.menuToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className={styles.mobileDrawer}>
          <div className={styles.mobileDrawerBody}>
            <div className={styles.mobileLocation}>
              <MapPin size={16} />
              <span>г. Комсомольск-на-Амуре, ул. Комитетская, 1</span>
            </div>
            <ul className={styles.mobileNavList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={styles.mobileNavLink}
                    onClick={(e) => handleScrollTo(e, link.href)}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={16} />
                  </a>
                </li>
              ))}
            </ul>
            <div className={styles.mobileContacts}>
              <a href="tel:+78000000000" className={styles.mobilePhone}>
                +7 (800) 000-00-00
              </a>
              <Button
                variant="amber"
                fullWidth
                size="md"
                onClick={() => {
                  setMobileOpen(false);
                  const el = document.querySelector('#booking');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Рассчитать стоимость и забронировать
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
