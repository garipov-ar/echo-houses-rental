'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { HOUSES } from '../../data/housesData';
import { X, ChevronLeft, ChevronRight, Check, Calendar } from 'lucide-react';
import styles from './AvailabilityMatrixModal.module.css';

interface AvailabilityMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDates: (houseId: string, checkIn: string, checkOut: string) => void;
  currentHouseId?: string;
  currentCheckIn?: string;
  currentCheckOut?: string;
}

// ─────────────────────────────────────────────────────────────────
// Deterministic occupancy schedule – realistic patterns per house.
// Each entry is [month(0-indexed), day] → booked=true
// ─────────────────────────────────────────────────────────────────
const BOOKED_DATES: Record<string, string[]> = {
  a_frame: [
    '2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22',
    '2026-08-28', '2026-08-29', '2026-08-30',
    '2026-09-05', '2026-09-06', '2026-09-07',
    '2026-09-12', '2026-09-13', '2026-09-19', '2026-09-20',
    '2026-10-02', '2026-10-03', '2026-10-09', '2026-10-10',
  ],
  a_frame_2: [
    '2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22',
    '2026-08-27', '2026-08-28',
    '2026-09-04', '2026-09-05', '2026-09-06',
    '2026-09-18', '2026-09-19', '2026-09-20',
    '2026-10-03', '2026-10-04',
  ],
  scandi: [
    '2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22',
    '2026-08-26', '2026-08-27',
    '2026-09-09', '2026-09-10', '2026-09-11',
    '2026-09-25', '2026-09-26', '2026-09-27',
    '2026-10-07', '2026-10-08',
  ],
  hygge: [
    '2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22',
    '2026-08-29', '2026-08-30',
    '2026-09-03', '2026-09-04', '2026-09-05',
    '2026-09-17', '2026-09-18',
    '2026-10-01', '2026-10-02', '2026-10-03',
  ],
  provence: [
    '2026-08-19',
    '2026-08-21', '2026-08-22',
    '2026-08-27', '2026-08-28',
    '2026-09-02', '2026-09-03',
    '2026-09-13', '2026-09-14',
    '2026-10-09', '2026-10-10', '2026-10-11',
  ],
  chalet: [
    '2026-08-20', '2026-08-21', '2026-08-22',
    '2026-08-28', '2026-08-29',
    '2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07',
    '2026-09-22', '2026-09-23',
    '2026-10-08', '2026-10-09', '2026-10-10',
  ],
};

function isDateBooked(houseId: string, dateStr: string): boolean {
  const bookedList = BOOKED_DATES[houseId];
  if (!bookedList) {
    // Fallback deterministic schedule for unknown houses
    const [y, m, d] = dateStr.split('-').map(Number);
    const jsDay = new Date(y, m - 1, d).getDay();
    // book every other weekend
    return (jsDay === 6 || jsDay === 0) && d % 3 === 0;
  }
  return bookedList.includes(dateStr);
}

// ─────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
];

const WEEKDAYS_SHORT = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

// Build a consistent "today" string that won't shift during render
const TODAY_STR = new Date().toISOString().split('T')[0];

export const AvailabilityMatrixModal: React.FC<AvailabilityMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectDates,
  currentHouseId = 'a_frame',
  currentCheckIn,
  currentCheckOut,
}) => {
  // Start at the month of the currently selected check-in (or Aug 2026)
  const [activeDate, setActiveDate] = useState<Date>(() => {
    if (currentCheckIn) {
      const d = new Date(currentCheckIn + 'T00:00:00');
      if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date(2026, 7, 1); // August 2026
  });

  const [selectedHouse, setSelectedHouse] = useState<string>(currentHouseId);
  const [selectedIn, setSelectedIn] = useState<string>(currentCheckIn || '');
  const [selectedOut, setSelectedOut] = useState<string>(currentCheckOut || '');
  // step 0 = choosing check-in, step 1 = choosing check-out
  const [step, setStep] = useState<0 | 1>(0);

  // Sync props → local state each time modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedHouse(currentHouseId || 'a_frame');
      setSelectedIn(currentCheckIn || '');
      setSelectedOut(currentCheckOut || '');
      setStep(0);
      if (currentCheckIn) {
        const d = new Date(currentCheckIn + 'T00:00:00');
        if (!isNaN(d.getTime())) setActiveDate(new Date(d.getFullYear(), d.getMonth(), 1));
      }
    }
  }, [isOpen, currentHouseId, currentCheckIn, currentCheckOut]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth(); // 0-indexed

  const monthDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const jsDay = new Date(year, month, day).getDay();
      const weekday = jsDay === 0 ? 6 : jsDay - 1; // Mon=0 … Sun=6
      return { day, dateStr, weekday };
    });
  }, [year, month]);

  const handlePrev = () => setActiveDate(new Date(year, month - 1, 1));
  const handleNext = () => setActiveDate(new Date(year, month + 1, 1));

  const handleCellClick = (houseId: string, dateStr: string, booked: boolean, past: boolean) => {
    if (booked || past) return;

    // Clicking a different house resets selection
    if (houseId !== selectedHouse) {
      setSelectedHouse(houseId);
      setSelectedIn(dateStr);
      setSelectedOut('');
      setStep(1);
      return;
    }

    if (step === 0 || !selectedIn) {
      setSelectedIn(dateStr);
      setSelectedOut('');
      setStep(1);
    } else {
      // step === 1: pick check-out
      if (dateStr > selectedIn) {
        setSelectedOut(dateStr);
        setStep(0);
      } else {
        // clicked before check-in – restart
        setSelectedIn(dateStr);
        setSelectedOut('');
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

  const selectedHouseObj = HOUSES.find((h) => h.id === selectedHouse) || HOUSES[0];

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Шахматка занятости домов"
    >
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--color-amber)" />
            <h3 className={styles.headerTitle}>Шахматка занятости домов</h3>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* ── Month nav + Legend ── */}
        <div className={styles.navBar}>
          <div className={styles.monthSwitcher}>
            <button type="button" onClick={handlePrev} className={styles.monthBtn} aria-label="Предыдущий месяц">
              <ChevronLeft size={18} />
            </button>
            <span className={styles.monthLabel}>
              {MONTH_NAMES[month]} {year}
            </span>
            <button type="button" onClick={handleNext} className={styles.monthBtn} aria-label="Следующий месяц">
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

        {/* Hint */}
        <div style={{
          padding: '6px 24px 0',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          {step === 0
            ? 'Нажмите на зелёную дату — выберите дату заезда'
            : `Заезд: ${selectedIn} — выберите дату выезда (нажмите дату позже)`}
        </div>

        {/* ── Matrix ── */}
        <div className={styles.matrixWrapper}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th className={styles.thHouse}>Дом</th>
                {monthDays.map(({ day, dateStr, weekday }) => {
                  const isWknd = weekday >= 4; // Fri=4, Sat=5, Sun=6
                  return (
                    <th
                      key={dateStr}
                      className={[styles.thDay, isWknd ? styles.thDayWeekend : ''].join(' ')}
                    >
                      <div style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>
                        {WEEKDAYS_SHORT[weekday]}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>{day}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {HOUSES.map((house) => (
                <tr key={house.id} className={styles.houseRow}>
                  {/* House name cell */}
                  <td
                    className={[
                      styles.houseInfoCell,
                      selectedHouse === house.id ? styles.houseInfoCellActive : '',
                    ].join(' ')}
                  >
                    <div className={styles.houseName}>{house.name}</div>
                    <div className={styles.houseSub}>{house.badge}</div>
                  </td>

                  {/* Day cells */}
                  {monthDays.map(({ day, dateStr, weekday }) => {
                    const booked = isDateBooked(house.id, dateStr);
                    const past = dateStr < TODAY_STR;

                    const isInRange =
                      selectedHouse === house.id &&
                      selectedIn &&
                      selectedOut &&
                      dateStr >= selectedIn &&
                      dateStr < selectedOut;

                    const isCheckIn = selectedHouse === house.id && dateStr === selectedIn;
                    const isWknd = weekday >= 4;

                    // Determine indicator color
                    let indicatorClass = styles.statusIndicatorAvailable;
                    if (past) indicatorClass = styles.statusIndicatorPast;
                    else if (booked) indicatorClass = styles.statusIndicatorBooked;
                    else if (isInRange || isCheckIn) indicatorClass = styles.statusIndicatorSelected;

                    // Button variant class
                    let btnExtra = '';
                    if (past) btnExtra = styles.dayBtnPast;
                    else if (booked) btnExtra = styles.dayBtnBooked;
                    else if (isCheckIn) btnExtra = styles.dayBtnCheckIn;
                    else if (isInRange) btnExtra = styles.dayBtnSelected;
                    else if (isWknd) btnExtra = styles.dayBtnWeekend;
                    else btnExtra = styles.dayBtnAvailable;

                    return (
                      <td key={dateStr} className={styles.dayCell}>
                        <button
                          type="button"
                          disabled={booked || past}
                          className={[styles.dayBtn, btnExtra].join(' ')}
                          onClick={() => handleCellClick(house.id, dateStr, booked, past)}
                          title={
                            past
                              ? 'Прошедшая дата'
                              : booked
                              ? `${house.name} — Занято`
                              : `${house.name} — Свободно`
                          }
                          aria-label={`${house.name} ${dateStr}`}
                        >
                          <span className={styles.dayNum}>{day}</span>
                          <span className={indicatorClass} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className={styles.modalFooter}>
          <div className={styles.selectionInfo}>
            {selectedIn && selectedOut ? (
              <span>
                Выбрано:{' '}
                <span className={styles.selectionHighlight}>{selectedHouseObj.name}</span>
                {' '}·{' '}
                <span className={styles.selectionHighlight}>{selectedIn}</span>
                {' → '}
                <span className={styles.selectionHighlight}>{selectedOut}</span>
              </span>
            ) : selectedIn ? (
              <span>Заезд: <span className={styles.selectionHighlight}>{selectedIn}</span> — выберите дату выезда</span>
            ) : (
              <span>Нажмите на зелёную дату для выбора заезда</span>
            )}
          </div>

          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleApply}
            disabled={!selectedIn || !selectedOut}
          >
            <Check size={16} />
            Применить в калькулятор
          </button>
        </div>
      </div>
    </div>
  );
};
