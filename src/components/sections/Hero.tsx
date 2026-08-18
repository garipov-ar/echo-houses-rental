'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Flame, Trees, Check, ArrowRight, Star, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './Hero.module.css';

export const Hero: React.FC = () => {
  const [selectedHouse, setSelectedHouse] = useState<'a_frame' | 'chalet'>('a_frame');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.bgOverlay} />
      <div className={styles.ambientGlow} />

      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          {/* Tagline */}
          <div className={styles.badge}>
            <Sparkles size={14} className={styles.badgeIcon} />
            <span>Комсомольск-на-Амуре • ул. Комитетская, 1</span>
          </div>

          {/* Headline */}
          <h1 className={styles.title}>
            Уединенный отдых в тайге: <span className={styles.highlight}>A-Frame дом</span> и семейное Шале с горячим чаном
          </h1>

          {/* Description */}
          <p className={styles.description}>
            Посуточная аренда загородных домов в черте города. Сибирский банный чан под звездами, русская парная на дровах, проектор с кинотеатром, камин и мангальная зона.
          </p>

          {/* Quick Perks */}
          <div className={styles.perks}>
            <div className={styles.perkItem}>
              <Trees size={16} className={styles.perkIcon} />
              <span>Лесная территория</span>
            </div>
            <div className={styles.perkItem}>
              <Flame size={16} className={styles.perkIcon} />
              <span>Банный чан 38-40°C</span>
            </div>
            <div className={styles.perkItem}>
              <Sparkles size={16} className={styles.perkIcon} />
              <span>Проектор & Камин</span>
            </div>
          </div>

          {/* Dual Action Buttons */}
          <div className={styles.ctaGroup}>
            <Button
              variant="amber"
              size="lg"
              leftIcon={<Calendar size={18} />}
              onClick={() => scrollTo('#booking')}
            >
              Забронировать дом онлайн
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollTo('#houses')}
            >
              Смотреть фото и удобства
            </Button>
          </div>

          {/* Mini Quick Booking Strip */}
          <div className={styles.bookingStrip}>
            <div className={styles.stripField}>
              <label className={styles.stripLabel}>Выберите дом:</label>
              <select
                className={styles.stripSelect}
                value={selectedHouse}
                onChange={(e) => setSelectedHouse(e.target.value as any)}
              >
                <option value="a_frame">A-Frame «Лесной Шалаш» (до 4 чел.)</option>
                <option value="chalet">Семейное Шале «Большой Дом» (до 12 чел.)</option>
              </select>
            </div>

            <div className={styles.stripAction}>
              <Button
                variant="pine"
                size="md"
                fullWidth
                rightIcon={<ArrowRight size={16} />}
                onClick={() => scrollTo('#booking')}
              >
                Рассчитать стоимость
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
