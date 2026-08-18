'use client';

import React, { useState } from 'react';
import { HOUSES, House } from '../../data/housesData';
import { formatNumber } from '../../utils/bookingCalculator';
import { Button } from '../ui/Button';
import { HouseGalleryModal } from './HouseGalleryModal';
import {
  Users,
  Maximize2,
  Bed,
  Bath,
  Tv,
  Disc,
  Coffee,
  Wifi,
  Utensils,
  Flame,
  ShowerHead,
  ThermometerSnowflake,
  Mic,
  UtensilsCrossed,
  Gamepad2,
  CheckCircle2,
  Calendar,
  Eye,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import styles from './HouseSwitcher.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  Tv: <Tv size={18} />,
  Disc: <Disc size={18} />,
  Coffee: <Coffee size={18} />,
  Wifi: <Wifi size={18} />,
  Utensils: <Utensils size={18} />,
  Flame: <Flame size={18} />,
  ShowerHead: <ShowerHead size={18} />,
  ThermometerSnowflake: <ThermometerSnowflake size={18} />,
  Mic: <Mic size={18} />,
  Users: <Users size={18} />,
  Bed: <Bed size={18} />,
  UtensilsCrossed: <UtensilsCrossed size={18} />,
  Bath: <Bath size={18} />,
  Gamepad2: <Gamepad2 size={18} />,
};

interface HouseSwitcherProps {
  onSelectHouseForBooking?: (houseId: 'a_frame' | 'chalet') => void;
}

export const HouseSwitcher: React.FC<HouseSwitcherProps> = ({ onSelectHouseForBooking }) => {
  const [selectedHouseId, setSelectedHouseId] = useState<'a_frame' | 'chalet'>('a_frame');
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const currentHouse = HOUSES.find((h) => h.id === selectedHouseId) || HOUSES[0];

  const handleBookClick = () => {
    if (onSelectHouseForBooking) {
      onSelectHouseForBooking(currentHouse.id);
    }
    const el = document.querySelector('#booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section" id="houses">
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrapper">
          <span className="section-tag">
            <Sparkles size={14} />
            Выберите пространство для вашего отдыха
          </span>
          <h2 className="section-heading">Два формата загородного уюта</h2>
          <p className="section-subtitle">
            Камерный A-Frame для романтических вечеров или просторный коттедж для теплых встреч с друзьями и праздников.
          </p>
        </div>

        {/* House Switcher Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            {HOUSES.map((house) => (
              <button
                key={house.id}
                className={`${styles.tabBtn} ${selectedHouseId === house.id ? styles.tabBtnActive : ''}`}
                onClick={() => {
                  setSelectedHouseId(house.id);
                  setActivePhotoIdx(0);
                }}
              >
                <span className={styles.tabName}>{house.name}</span>
                <span className={styles.tabBadge}>{house.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* House Detailed Card */}
        <div className={styles.houseCard}>
          <div className={styles.grid}>
            {/* Left: Gallery & Photos */}
            <div className={styles.galleryCol}>
              <div
                className={styles.mainImage}
                style={{ backgroundImage: `url('${currentHouse.gallery[activePhotoIdx]}')` }}
                onClick={() => setGalleryModalOpen(true)}
              >
                <div className={styles.zoomPrompt}>
                  <Eye size={16} /> Смотреть все {currentHouse.gallery.length} фото
                </div>
                <div className={styles.imageBadge}>{currentHouse.badge}</div>
              </div>

              <div className={styles.thumbsRow}>
                {currentHouse.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className={`${styles.thumb} ${activePhotoIdx === idx ? styles.thumbSelected : ''}`}
                    style={{ backgroundImage: `url('${img}')` }}
                    onClick={() => setActivePhotoIdx(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Right: Info, Amenities, Pricing */}
            <div className={styles.infoCol}>
              <div className={styles.infoHeader}>
                <h3 className={styles.houseTitle}>{currentHouse.name}</h3>
                <p className={styles.tagline}>{currentHouse.tagline}</p>
              </div>

              {/* Metric Pills */}
              <div className={styles.specsRow}>
                <div className={styles.specItem}>
                  <Maximize2 size={16} className={styles.specIcon} />
                  <span>{currentHouse.area} м²</span>
                </div>
                <div className={styles.specItem}>
                  <Users size={16} className={styles.specIcon} />
                  <span>до {currentHouse.capacityMax} гостей</span>
                </div>
                <div className={styles.specItem}>
                  <Bed size={16} className={styles.specIcon} />
                  <span>{currentHouse.bedrooms} спальни</span>
                </div>
                <div className={styles.specItem}>
                  <Bath size={16} className={styles.specIcon} />
                  <span>{currentHouse.bathrooms} с/у</span>
                </div>
              </div>

              <p className={styles.houseDesc}>{currentHouse.description}</p>

              {/* Highlights */}
              <div className={styles.highlightsBlock}>
                {currentHouse.features.map((feat, idx) => (
                  <div key={idx} className={styles.highItem}>
                    <CheckCircle2 size={16} className={styles.highCheck} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Amenities Grid */}
              <div className={styles.amenitiesBox}>
                <h4 className={styles.amenitiesTitle}>В доме есть всё для комфорта:</h4>
                <div className={styles.amenitiesGrid}>
                  {currentHouse.amenities.map((item, idx) => (
                    <div key={idx} className={styles.amenityItem}>
                      <span className={styles.amenityIcon}>
                        {ICON_MAP[item.iconName] || <Sparkles size={16} />}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className={styles.priceCard}>
                <div className={styles.priceColumn}>
                  <div className={styles.priceRow}>
                    <span className={styles.priceType}>Будние дни (пн–чт):</span>
                    <span className={styles.priceValue}>{formatNumber(currentHouse.priceWeekday)} ₽/сут.</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.priceType}>Выходные (пт–вс):</span>
                    <span className={styles.priceValueWeekend}>{formatNumber(currentHouse.priceWeekend)} ₽/сут.</span>
                  </div>
                </div>

                <Button
                  variant="amber"
                  size="md"
                  className={styles.bookHouseBtn}
                  rightIcon={<ArrowRight size={18} />}
                  onClick={handleBookClick}
                >
                  Забронировать дом
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Lightbox */}
        <HouseGalleryModal
          house={currentHouse}
          isOpen={galleryModalOpen}
          onClose={() => setGalleryModalOpen(false)}
        />
      </div>
    </section>
  );
};
