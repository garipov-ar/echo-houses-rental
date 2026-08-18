'use client';

import React from 'react';
import { MapPin, Navigation, Car, ExternalLink, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './LocationMap.module.css';

export const LocationMap: React.FC = () => {
  return (
    <section className="section" id="location">
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrapper">
          <span className="section-tag">
            <MapPin size={14} />
            Локация и схема проезда
          </span>
          <h2 className="section-heading">Как добраться в гостевой комплекс «ЭХО»</h2>
          <p className="section-subtitle">
            Мы находимся в черте города Комсомольск-на-Амуре, в тихом лесном массиве вдали от шума дорог.
          </p>
        </div>

        {/* Location Box */}
        <div className={styles.locationBox}>
          {/* Left Details */}
          <div className={styles.infoCol}>
            <div className={styles.addressCard}>
              <div className={styles.pinCircle}>
                <MapPin size={22} />
              </div>
              <div>
                <span className={styles.addressTitle}>Точный адрес:</span>
                <strong className={styles.addressValue}>
                  г. Комсомольск-на-Амуре, ул. Комитетская, 1
                </strong>
                <span className={styles.coords}>Координаты GPS: 50.575678, 136.910337</span>
              </div>
            </div>

            <div className={styles.routesList}>
              <div className={styles.routeItem}>
                <Car size={18} className={styles.routeIcon} />
                <div>
                  <strong>На личном автомобиле:</strong>
                  <p>Асфальтированный подъезд прямо до ворот. На территории закрытая освещенная парковка на 5+ авто с видеонаблюдением.</p>
                </div>
              </div>

              <div className={styles.routeItem}>
                <Navigation size={18} className={styles.routeIcon} />
                <div>
                  <strong>На такси:</strong>
                  <p>10-15 минут из Центрального района или от Ж/Д вокзала. В навигаторе вводите «Гостевой комплекс ЭХО» или «Комитетская, 1».</p>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <a
                href="https://yandex.ru/maps/org/ekho/132315669502/?ll=136.910337%2C50.575678&z=17"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapBtn}
              >
                <ExternalLink size={16} />
                Открыть в Яндекс Картах
              </a>
            </div>
          </div>

          {/* Right Map Visual / Embed */}
          <div className={styles.mapFrameCol}>
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=136.910337%2C50.575678&z=16&pt=136.910337,50.575678,pm2rdm"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen={true}
              className={styles.mapIframe}
              title="Карта проезда к гостевому комплексу ЭХО"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
