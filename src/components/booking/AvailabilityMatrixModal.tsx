'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
// Explicit occupancy schedule – realistic patterns per house
// ─────────────────────────────────────────────────────────────────
const BOOKED_DATES: Record<string, Set<string>> = {
  a_frame: new Set([
    '2026-08-19','2026-08-20','2026-08-21','2026-08-22',
    '2026-08-28','2026-08-29','2026-08-30',
    '2026-09-05','2026-09-06','2026-09-07',
    '2026-09-12','2026-09-13','2026-09-19','2026-09-20',
    '2026-10-02','2026-10-03','2026-10-09','2026-10-10',
  ]),
  a_frame_2: new Set([
    '2026-08-19','2026-08-20','2026-08-21','2026-08-22',
    '2026-08-27','2026-08-28',
    '2026-09-04','2026-09-05','2026-09-06',
    '2026-09-18','2026-09-19','2026-09-20',
    '2026-10-03','2026-10-04',
  ]),
  scandi: new Set([
    '2026-08-19','2026-08-20','2026-08-21','2026-08-22',
    '2026-08-26','2026-08-27',
    '2026-09-09','2026-09-10','2026-09-11',
    '2026-09-25','2026-09-26','2026-09-27',
    '2026-10-07','2026-10-08',
  ]),
  hygge: new Set([
    '2026-08-19','2026-08-20','2026-08-21','2026-08-22',
    '2026-08-29','2026-08-30',
    '2026-09-03','2026-09-04','2026-09-05',
    '2026-09-17','2026-09-18',
    '2026-10-01','2026-10-02','2026-10-03',
  ]),
  provence: new Set([
    '2026-08-19',
    '2026-08-21','2026-08-22',
    '2026-08-27','2026-08-28',
    '2026-09-02','2026-09-03',
    '2026-09-13','2026-09-14',
    '2026-10-09','2026-10-10','2026-10-11',
  ]),
  chalet: new Set([
    '2026-08-20','2026-08-21','2026-08-22',
    '2026-08-28','2026-08-29',
    '2026-09-04','2026-09-05','2026-09-06','2026-09-07',
    '2026-09-22','2026-09-23',
    '2026-10-08','2026-10-09','2026-10-10',
  ]),
};

function isDateBooked(houseId: string, dateStr: string): boolean {
  const set = BOOKED_DATES[houseId];
  if (!set) {
    // Fallback: book every other Sat/Sun
    const [y, m, d] = dateStr.split('-').map(Number);
    const jsDay = new Date(y, m - 1, d).getDay();
    return (jsDay === 6 || jsDay === 0) && d % 3 === 0;
  }
  return set.has(dateStr);
}

const MONTH_NAMES_GEN = [
  'январь','февраль','март','апрель','май','июнь',
  'июль','август','сентябрь','октябрь','ноябрь','декабрь',
];
const WEEKDAYS_SHORT = ['пн','вт','ср','чт','пт','сб','вс'];

// Stable today string – computed once, not per render
const TODAY_STR = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
})();

export const AvailabilityMatrixModal: React.FC<AvailabilityMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectDates,
  currentHouseId = 'a_frame',
  currentCheckIn,
  currentCheckOut,
}) => {
  const [viewMonth, setViewMonth] = useState<Date>(() => new Date(2026, 7, 1));
  const [selectedHouse, setSelectedHouse] = useState<string>(currentHouseId);

  // Separate refs for check-in/out to avoid closure staleness
  const checkInRef  = useRef<string>(currentCheckIn || '');
  const checkOutRef = useRef<string>(currentCheckOut || '');

  // Mirror to state for rendering
  const [checkIn, setCheckInState]   = useState<string>(currentCheckIn  || '');
  const [checkOut, setCheckOutState] = useState<string>(currentCheckOut || '');

  const setCheckIn = (v: string) => { checkInRef.current = v;  setCheckInState(v);  };
  const setCheckOut = (v: string) => { checkOutRef.current = v; setCheckOutState(v); };

  // Reset state when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const ci = currentCheckIn  || '';
    const co = currentCheckOut || '';
    setSelectedHouse(currentHouseId || 'a_frame');
    setCheckIn(ci);
    setCheckOut(co);
    if (ci) {
      const d = new Date(ci + 'T00:00:00');
      if (!isNaN(d.getTime())) setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Escape key + body scroll-lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const year  = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const monthDays = useMemo(() => {
    const count = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const js = new Date(year, month, day).getDay();
      const weekday = js === 0 ? 6 : js - 1; // Mon=0 … Sun=6
      return { day, dateStr, weekday };
    });
  }, [year, month]);

  const handlePrev = () => setViewMonth(new Date(year, month - 1, 1));
  const handleNext = () => setViewMonth(new Date(year, month + 1, 1));

  // ── Date selection: simple two-click approach using refs ──
  const handleCellClick = (houseId: string, dateStr: string) => {
    const ci = checkInRef.current;
    const co = checkOutRef.current;

    if (houseId !== selectedHouse) {
      // Different house → start fresh
      setSelectedHouse(houseId);
      setCheckIn(dateStr);
      setCheckOut('');
      return;
    }

    if (!ci || (ci && co)) {
      // Phase 1: pick check-in (or restart if both already set)
      setCheckIn(dateStr);
      setCheckOut('');
    } else {
      // Phase 2: pick check-out
      if (dateStr > ci) {
        setCheckOut(dateStr);
      } else {
        // Clicked before or on check-in → restart
        setCheckIn(dateStr);
        setCheckOut('');
      }
    }
  };

  const handleApply = () => {
    if (selectedHouse && checkIn && checkOut) {
      onSelectDates(selectedHouse, checkIn, checkOut);
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedHouseObj = HOUSES.find(h => h.id === selectedHouse) || HOUSES[0];
  const pickingCheckOut = !!checkIn && !checkOut;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalCard} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <Calendar size={18} color="var(--color-amber)" />
            <h3 className={styles.headerTitle}>Шахматка занятости домов</h3>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* Nav + Legend */}
        <div className={styles.navBar}>
          <div className={styles.monthSwitcher}>
            <button type="button" onClick={handlePrev} className={styles.monthBtn}>
              <ChevronLeft size={18} />
            </button>
            <span className={styles.monthLabel}>{MONTH_NAMES_GEN[month]} {year}</span>
            <button type="button" onClick={handleNext} className={styles.monthBtn}>
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

        {/* Instruction hint */}
        <div style={{ padding:'6px 22px 0', fontSize:'0.74rem', color:'var(--text-muted)' }}>
          {pickingCheckOut
            ? `✔ Заезд: ${checkIn} — теперь выберите дату выезда`
            : '① Нажмите свободную дату — заезд  ② Нажмите вторую дату — выезд'}
        </div>

        {/* Matrix */}
        <div className={styles.matrixWrapper}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th className={styles.thHouse}>Дом</th>
                {monthDays.map(({ day, dateStr, weekday }) => (
                  <th
                    key={dateStr}
                    className={[styles.thDay, weekday >= 4 ? styles.thDayWeekend : ''].join(' ')}
                  >
                    <div style={{ fontSize:'0.6rem', textTransform:'uppercase' }}>{WEEKDAYS_SHORT[weekday]}</div>
                    <div style={{ fontWeight:800, fontSize:'0.8rem' }}>{day}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {HOUSES.map(house => (
                <tr key={house.id} className={styles.houseRow}>
                  <td className={[
                    styles.houseInfoCell,
                    selectedHouse === house.id ? styles.houseInfoCellActive : '',
                  ].join(' ')}>
                    <div className={styles.houseName}>{house.name}</div>
                    <div className={styles.houseSub}>{house.badge}</div>
                  </td>

                  {monthDays.map(({ day, dateStr, weekday }) => {
                    const booked = isDateBooked(house.id, dateStr);
                    const past   = dateStr < TODAY_STR;

                    // Is this cell inside the selected range of THIS house?
                    const isThisHouse = selectedHouse === house.id;
                    const isCheckIn   = isThisHouse && dateStr === checkIn;
                    const isCheckOut  = isThisHouse && dateStr === checkOut;
                    const isInRange   = isThisHouse && checkIn && checkOut &&
                                        dateStr > checkIn && dateStr < checkOut;

                    const isWknd = weekday >= 4;

                    // Button class
                    let btnExtra = '';
                    if (past)       btnExtra = styles.dayBtnPast;
                    else if (booked) btnExtra = styles.dayBtnBooked;
                    else if (isCheckIn || isCheckOut) btnExtra = styles.dayBtnCheckIn;
                    else if (isInRange) btnExtra = styles.dayBtnSelected;
                    else if (isWknd)   btnExtra = styles.dayBtnWeekend;
                    else               btnExtra = styles.dayBtnAvailable;

                    // Indicator color
                    let indicatorClass = styles.statusIndicatorAvailable;
                    if (past)   indicatorClass = styles.statusIndicatorPast;
                    else if (booked) indicatorClass = styles.statusIndicatorBooked;
                    else if (isCheckIn || isCheckOut || isInRange) indicatorClass = styles.statusIndicatorSelected;

                    return (
                      <td key={dateStr} className={styles.dayCell}>
                        <button
                          type="button"
                          disabled={booked || past}
                          className={[styles.dayBtn, btnExtra].join(' ')}
                          onClick={() => handleCellClick(house.id, dateStr)}
                          title={
                            past   ? 'Прошедшая дата' :
                            booked ? `${house.name} — Занято` :
                                     `${house.name} — Свободно`
                          }
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

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.selectionInfo}>
            {checkIn && checkOut ? (
              <span>
                <span className={styles.selectionHighlight}>{selectedHouseObj.name}</span>
                {' · '}
                <span className={styles.selectionHighlight}>{checkIn}</span>
                {' → '}
                <span className={styles.selectionHighlight}>{checkOut}</span>
              </span>
            ) : checkIn ? (
              <span>Заезд: <span className={styles.selectionHighlight}>{checkIn}</span> — выберите дату выезда</span>
            ) : (
              <span>Нажмите свободную зелёную дату для выбора заезда</span>
            )}
          </div>

          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleApply}
            disabled={!checkIn || !checkOut}
          >
            <Check size={16} />
            Применить в калькулятор
          </button>
        </div>
      </div>
    </div>
  );
};
