'use client';

import React from 'react';
import { SPA_SERVICES } from '../../data/spaData';
import { formatNumber } from '../../utils/bookingCalculator';
import { Button } from '../ui/Button';
import { Sparkles, Check, Flame, ArrowRight } from 'lucide-react';
import styles from './SpaSection.module.css';

export const SpaSection: React.FC = () => {
  const scrollToBooking = () => {
    const el = document.querySelector('#booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section" id="spa" style={{ backgroundColor: '#0B0F0C' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrapper">
          <span className="section-tag">
            <Flame size={14} />
            Банные ритуалы и релакс
          </span>
          <h2 className="section-heading">Сибирский чан и русская баня на дровах</h2>
          <p className="section-subtitle">
            Особенное удовольствие — погрузиться в горячую воду с ароматом свежей пихты под открытым дальневосточным небом в окружении сосен.
          </p>
        </div>

        {/* Spa Grid */}
        <div className={styles.grid}>
          {SPA_SERVICES.map((item) => (
            <div key={item.id} className={styles.card}>
              <div
                className={styles.imageBox}
                style={{ backgroundImage: `url('${item.imageUrl}')` }}
              >
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
                <div className={styles.durationTag}>{item.duration}</div>
              </div>

              <div className={styles.content}>
                <div className={styles.header}>
                  <h3 className={styles.title}>{item.name}</h3>
                  <div className={styles.price}>{formatNumber(item.price)} ₽</div>
                </div>

                <p className={styles.desc}>{item.description}</p>

                <div className={styles.inclusions}>
                  <span className={styles.incLabel}>В стоимость входит:</span>
                  <ul className={styles.incList}>
                    {item.inclusions.map((inc, i) => (
                      <li key={i} className={styles.incItem}>
                        <Check size={14} className={styles.checkIcon} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={scrollToBooking}
                  rightIcon={<ArrowRight size={14} />}
                >
                  Добавить к бронированию
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
