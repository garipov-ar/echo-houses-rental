import React from 'react';
import { Trees, Phone, MapPin, Send, MessageCircle, ExternalLink, Clock, ShieldCheck } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topGrid}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <div className={styles.logo}>
              <div className={styles.logoIconWrap}>
                <Trees size={22} className={styles.logoIcon} />
              </div>
              <div className={styles.logoText}>
                <span className={styles.brandTitle}>ЭХО</span>
                <span className={styles.brandSub}>Гостевые дома • Комсомольск</span>
              </div>
            </div>
            <p className={styles.brandDesc}>
              Уединенный загородный отдых в черте города. Стильный A-Frame дом и семейное Шале с горячим сибирским чаном на дровах, русской баней и мангальной зоной.
            </p>
            <div className={styles.yandexBadge}>
              <ExternalLink size={16} className={styles.linkIcon} />
              <a
                href="https://yandex.ru/maps/org/ekho/132315669502/?ll=136.910337%2C50.575678&z=17"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.yandexLink}
              >
                Организация на Яндекс Картах ➔
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Навигация</h4>
            <ul className={styles.linkList}>
              <li><a href="#houses" className={styles.link}>A-Frame дом (до 4 чел.)</a></li>
              <li><a href="#houses" className={styles.link}>Семейное Шале (до 12 чел.)</a></li>
              <li><a href="#booking" className={styles.link}>Калькулятор стоимости</a></li>
              <li><a href="#spa" className={styles.link}>Сибирский чан и Баня</a></li>
              <li><a href="#rules" className={styles.link}>Правила проживания</a></li>
              <li><a href="#location" className={styles.link}>Схема проезда</a></li>
            </ul>
          </div>

          {/* Contacts Col */}
          <div className={styles.contactsCol}>
            <h4 className={styles.colTitle}>Контакты и Бронирование</h4>

            <div className={styles.contactItem}>
              <Phone size={18} className={styles.contactIcon} />
              <div>
                <a href="tel:+78000000000" className={styles.phone}>+7 (800) 000-00-00</a>
                <span className={styles.contactSub}>Бронирование с 09:00 до 22:00</span>
              </div>
            </div>

            <div className={styles.contactItem}>
              <MapPin size={18} className={styles.contactIcon} />
              <div>
                <span className={styles.address}>г. Комсомольск-на-Амуре, ул. Комитетская, 1</span>
                <span className={styles.contactSub}>Координаты: 50.575678, 136.910337</span>
              </div>
            </div>

            <div className={styles.socialBtns}>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tgBtn}
              >
                <Send size={15} /> Telegram
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waBtn}
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} Гостевой комплекс «ЭХО» (г. Комсомольск-на-Амуре). Портфолио-проект.
          </div>
          <div className={styles.rulesSummary}>
            Заезд с 15:00 • Выезд до 12:00 • Режим тишины после 22:00
          </div>
        </div>
      </div>
    </footer>
  );
};
