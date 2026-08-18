'use client';

import React from 'react';
import { Camera, Sparkles, Heart } from 'lucide-react';
import styles from './AtmosphereGallery.module.css';

const GALLERY_ITEMS = [
  {
    title: 'Горячий чан под звездным небом',
    tag: 'Спа-релакс',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-2',
  },
  {
    title: 'Уютные вечера у камина с пледом',
    tag: 'Интерьер Шале',
    url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Киносеанс на проекторе в A-Frame',
    tag: 'Атмосфера',
    url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Костровая зона с живым пламенем',
    tag: 'Территория',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Виниловый проигрыватель и теплый свет',
    tag: 'Детали уюта',
    url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-2',
  },
];

export const AtmosphereGallery: React.FC = () => {
  return (
    <section className="section" id="gallery">
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrapper">
          <span className="section-tag">
            <Camera size={14} />
            Атмосфера и фото-локации
          </span>
          <h2 className="section-heading">Моменты, которые хочется сохранить</h2>
          <p className="section-subtitle">
            Каждая деталь в домах «ЭХО» создана для красивых фотосессий, душевного спокойствия и перезагрузки от городской суеты.
          </p>
        </div>

        {/* Masonry / Bento Grid */}
        <div className={styles.grid}>
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`${styles.item} ${item.span === 'col-span-2' ? styles.span2 : ''}`}
            >
              <div
                className={styles.image}
                style={{ backgroundImage: `url('${item.url}')` }}
              />
              <div className={styles.overlay}>
                <span className={styles.tag}>{item.tag}</span>
                <h4 className={styles.itemTitle}>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
