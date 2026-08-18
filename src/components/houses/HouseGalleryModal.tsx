'use client';

import React, { useState } from 'react';
import { House } from '../../data/housesData';
import { Modal } from '../ui/Modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './HouseSwitcher.module.css';

interface HouseGalleryModalProps {
  house: House | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HouseGalleryModal: React.FC<HouseGalleryModalProps> = ({ house, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!house) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % house.gallery.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + house.gallery.length) % house.gallery.length);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" title={`Фотогалерея: ${house.name}`}>
      <div className={styles.modalGalleryWrapper}>
        <div className={styles.modalMainImg} style={{ backgroundImage: `url('${house.gallery[currentIndex]}')` }}>
          <button className={`${styles.galleryNavBtn} ${styles.prevBtn}`} onClick={prevImage} aria-label="Предыдущее фото">
            <ChevronLeft size={24} />
          </button>
          <button className={`${styles.galleryNavBtn} ${styles.nextBtn}`} onClick={nextImage} aria-label="Следующее фото">
            <ChevronRight size={24} />
          </button>
          <div className={styles.imgCounter}>
            {currentIndex + 1} / {house.gallery.length}
          </div>
        </div>

        <div className={styles.thumbsGrid}>
          {house.gallery.map((url, idx) => (
            <div
              key={idx}
              className={`${styles.thumbItem} ${currentIndex === idx ? styles.thumbActive : ''}`}
              style={{ backgroundImage: `url('${url}')` }}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};
