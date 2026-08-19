'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { HOUSES } from '../../data/housesData';
import { X, ChevronLeft, ChevronRight, Check, Calendar, Sparkles } from 'lucide-react';
import styles from './AvailabilityMatrixModal.module.css';

interface AvailabilityMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDates: (houseId: string, checkIn: string, checkOut: string) => void;
  currentHouseId?: string;
  currentCheckIn?: string;
  currentCheckOut?: string;
}

// Deterministic seedable generator for booked dates (Aug/Sep/Oct 2026)
function isDateBooked(houseId: string, year: number, month: number, day: number): boolean {
  // Deterministic realistic busy schedule simulation (e.g. August 2026 as in screenshot)
  const hash = (houseId.charCodeAt(0) * 17 + houseId.charCodeAt(houseId.length - 1) * 31 + year * 100 + month * 31 + day) % 100;
  
  // Specific days matching the screenshot for August 2026:
  // E.g., for A-Frame #2: 19, 20, 21, 22 are booked (red), 23 is green.
  // For Scandi: 19, 20, 21, 22 are booked, 23 is green.
  // For Hygge: 19, 20, 21, 22 are booked, 23 is green.
  // For Provence: 19 (red), 20 (green), 21, 22 (red), 23 (green).
  // For Maly Dom / Chalet: 19 (green), 20 (red), 21 (green), 22 (red), 23 (green).
  if (year === 2026 && month === 7) { // August (0-indexed 7)
    if (houseId === 'a_frame_2' || houseId === 'a_frame') {
      if ([19, 20, 21, 22, 28, 29].includes(day)) return true;
      if ([23, 24, 25, 26, 27, 30, 31].includes(day)) return false;
    }
    if (houseId === 'scandi') {
      if ([19, 20, 21, 22, 26, 27].includes(day)) return true;
      if ([23, 24, 25, 28, 29, 30, 31].includes(day)) return false;
    }
    if (houseId === 'hygge') {
      if ([19, 20, 21, 22, 29, 30].includes(day)) return true;
      if ([23, 24, 25, 26, 27, 28, 31].includes(day)) return false;
    }
    if (houseId === 'provence') {
      if ([19, 21, 22, 27, 28].includes(day)) return true;
      if ([20, 23, 24, 25, 26, 29, 30, 31].includes(day)) return false;
    }
    if (houseId === 'chalet') {
      if ([20, 22, 28, 29].includes(day)) return true;
      if ([19, 21, 23, 24, 25, 26, 27, 30, 31].includes(day)) return false;
    }
  }

  // Weekends have higher occupancy in other months
  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 5 || dayOfWeek === 6) { // Fri, Sat
    return hash > 40;
  }
  return hash > 75;
}

const MONTH_NAMES = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export const AvailabilityMatrixModal: React.FC<AvailabilityMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectDates,
  currentHouseId = 'a_frame',
  currentCheckIn,
  currentCheckOut,
}) => {
  const [activeDate, setActiveDate] = useState(() => {
    if (currentCheckIn) {
      const d = new Date(currentCheckIn);
      if (!isNaN(d.getTime())) return d;
    }
    // Default to August 2026 as in design/screenshot or current year
    return new Date(2026, 7, 1);
  });

  const [selectedHouse, setSelectedHouse] = useState<string>(currentHouseId);
  const [selectedIn, setSelectedIn] = useState<string>(currentCheckIn || '');
  const [selectedOut, setSelectedOut] = useState<string>(currentCheckOut || '');

  useEffect(() => {
    if (isOpen) {
      if (currentHouseId) setSelectedHouse(currentHouseId);
      if (currentCheckIn) setSelectedIn(currentCheckIn);
      if (currentCheckOut) setSelectedOut(currentCheckOut);
    }
  }, [isOpen, currentHouseId, currentCheckIn, currentCheckOut]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const monthDays = useMemo(() => {
    const days: { dayNum: number; dateStr: string; weekday: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const curDate = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      // convert 0 (Sunday) to 6, 1 (Monday) to 0
      const jsDay = curDate.getDay();
      const weekday = jsDay === 0 ? 6 : jsDay - 1;
      days.push({ dayNum: d, dateStr, weekday });
    }
    return days;
  }, [year, month, daysInMonth]);

  const handlePrevMonth = () => {
    setActiveDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setActiveDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (houseId: string, dateStr: string, isBooked: boolean, isPast: boolean) => {
    if (isBooked || isPast) return;

    if (selectedHouse !== houseId) {
      setSelectedHouse(houseId);
      setSelectedIn(dateStr);
      // set checkOut to next day
      const d = new Date(dateStr);
      d.setDate(d.getDate() + 1);
      const nextDayStr = d.toISOString().split('T')[0];
      setSelectedOut(nextDayStr);
      return;
    }

    if (!selectedIn || (selectedIn && selectedOut)) {
      setSelectedIn(dateStr);
      const d = new Date(dateStr);
      d.setDate(d.getDate() + 1);
      const nextDayStr = d.toISOString().split('T')[0];
      setSelectedOut(nextDayStr);
    } else if (selectedIn && !selectedOut) {
      if (dateStr > selectedIn) {
        setSelectedOut(dateStr);
      } else {
        setSelectedIn(dateStr);
        const d = new Date(dateStr);
        d.setDate(d.getDate() + 1);
        setSelectedOut(d.toISOString().split('T')[0]);
      }
    }
  };

  const handleApply = () => {
    if (selectedHouse && selectedIn && selectedOut) {
      onSelectDates(selectedHouse, selectedIn, selectedOut);
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentHouseObj = HOUSES.find((h) => h.id === selectedHouse) || HOUSES[0];

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--color-amber)" />
            <h3 className={styles.headerTitle}>Шахматка занятости домов</h3>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Bar: Month & Legend */}
        <div className={styles.navBar}>
          <div className={styles.monthSwitcher}>
            <button type="button" onClick={handlePrevMonth} className={styles.monthBtn} title="Предыдущий месяц">
              <ChevronLeft size={18} />
            </button>
            <span className={styles.monthLabel}>
              {MONTH_NAMES[month]} {year}
            </span>
            <button type="button" onClick={handleNextMonth} className={styles.monthBtn} title="Следующий месяц">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDotAvailable} />
              <span>Свободно</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDotBooked} />
              <span>Занято</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDotSelected} />
              <span>Выбрано</span>
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className={styles.matrixWrapper}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th className={styles.thHouse}>Дом</th>
                {monthDays.map((d) => {
                  const isWeekend = d.weekday === 5 || d.weekday === 6;
                  return (
                    <th key={d.dateStr} className={`${styles.thDay} ${isWeekend ? styles.thDayWeekend : ''}`}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {WEEKDAYS[d.weekday]}
                      </div>
                      <div style={{ fontWeight: 800 }}>{d.dayNum}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {HOUSES.map((house) => {
                const isCurrentHouse = selectedHouse === house.id;
                return (
                  <tr key={house.id} className={styles.houseRow}>
                    <td className={styles.houseInfoCell}>
                      <div className={styles.houseName}>{house.name}</div>
                      <div className={styles.houseSub}>{house.badge}</div>
                    </td>

                    {monthDays.map((d) => {
                      const booked = isDateBooked(house.id, year, month, d.dayNum);
                      // check past
                      const todayStr = new Date().toISOString().split('T')[0];
                      const isPast = d.dateStr < todayStr;
                      
                      // check selected
                      const isSelected =
                        isCurrentHouse &&
                        selectedIn &&
                        selectedOut &&
                        d.dateStr >= selectedIn &&
                        d.dateStr < selectedOut;

                      let btnClass = styles.dayBtn;
                      if (isPast) {
                        btnClass += ` ${styles.dayBtnPast}`;
                      } else if (booked) {
                        btnClass += ` ${styles.dayBtnBooked}`;
                      } else {
                        btnClass += ` ${styles.dayBtnAvailable}`;
                      }

                      if (isSelected) {
                        btnClass += ` ${styles.dayBtnSelected}`;
                      }

                      return (
                        <td key={d.dateStr} className={styles.dayCell}>
                          <button
                            type="button"
                            className={btnClass}
                            disabled={booked || isPast}
                            onClick={() => handleDayClick(house.id, d.dateStr, booked, isPast)}
                            title={
                              isPast
                                ? 'Прошедшая дата'
                                : booked
                                ? `${house.name}: Занято на ${d.dayNum} ${MONTH_NAMES[month]}`
                                : `${house.name}: Свободно для бронирования`
                            }
                          >
                            <span className={styles.dayNum}>{d.dayNum}</span>
                            <span
                              className={
                                isPast
                                  ? styles.statusIndicatorPast
                                  : booked
                                  ? styles.statusIndicatorBooked
                                  : styles.statusIndicatorAvailable
                              }
                            />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer with Selected Summary & Action */}
        <div className={styles.modalFooter}>
          <div className={styles.selectionInfo}>
            {selectedIn && selectedOut ? (
              <div>
                Выбрано: <span className={styles.selectionHighlight}>{currentHouseObj.name}</span> c{' '}
                <span className={styles.selectionHighlight}>{selectedIn}</span> по{' '}
                <span className={styles.selectionHighlight}>{selectedOut}</span>
              </div>
            ) : (
              <div>Нажмите на свободную зеленую дату для выбора дома и периода отдыха</div>
            )}
          </div>

          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleApply}
            disabled={!selectedIn || !selectedOut}
          >
            <Check size={16} /> Применить даты в калькулятор
          </button>
        </div>
      </div>
    </div>
  );
};
