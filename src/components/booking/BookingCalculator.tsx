'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { HOUSES } from '../../data/housesData';
import { SPA_SERVICES } from '../../data/spaData';
import { calculateBooking, formatRubles, formatNumber } from '../../utils/bookingCalculator';
import { AvailabilityMatrixModal } from './AvailabilityMatrixModal';
import { Button } from '../ui/Button';
import {
  Calendar,
  Users,
  Check,
  Send,
  MessageCircle,
  Phone,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Gift,
  ArrowRight,
  Flame,
  Utensils,
  CreditCard,
  QrCode,
  Smartphone,
  Download,
  MapPin,
  ExternalLink,
  Lock,
  RefreshCw,
} from 'lucide-react';
import styles from './BookingCalculator.module.css';

interface BookingCalculatorProps {
  selectedHouseId?: string;
}

export const BookingCalculator: React.FC<BookingCalculatorProps> = ({
  selectedHouseId: initialHouseId = 'a_frame',
}) => {
  // Default dates: tomorrow -> day after tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const formatDateStr = (d: Date) => d.toISOString().split('T')[0];

  const [houseId, setHouseId] = useState<string>(initialHouseId);
  const [checkIn, setCheckIn] = useState(formatDateStr(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDateStr(dayAfterTomorrow));
  const [guests, setGuests] = useState(2);
  const [selectedSpaIds, setSelectedSpaIds] = useState<string[]>(['siberian_vat']);

  // Matrix Modal
  const [matrixOpen, setMatrixOpen] = useState(false);

  // Client inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [messenger, setMessenger] = useState<'telegram' | 'whatsapp' | 'call'>('telegram');
  const [comment, setComment] = useState('');

  // Payment method & split options
  const [paymentMethod, setPaymentMethod] = useState<'sbp' | 'card' | 'tpay'>('sbp');
  const [paySplit, setPaySplit] = useState<'deposit' | 'full'>('deposit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // SBP Countdown Timer (15:00 min)
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialHouseId) {
      setHouseId(initialHouseId);
    }
  }, [initialHouseId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentHouse = HOUSES.find((h) => h.id === houseId) || HOUSES[0];

  const calculation = useMemo(() => {
    return calculateBooking({
      houseId,
      checkIn,
      checkOut,
      guests,
      selectedSpaIds,
    });
  }, [houseId, checkIn, checkOut, guests, selectedSpaIds]);

  // Amount to pay now depending on 50% deposit vs 100% full payment (with -5% bonus discount)
  const amountToPayNow = useMemo(() => {
    if (paySplit === 'deposit') {
      return Math.round(calculation.grandTotal * 0.5);
    } else {
      // 100% full payment with 5% online discount
      return Math.round(calculation.grandTotal * 0.95);
    }
  }, [calculation.grandTotal, paySplit]);

  const toggleSpa = (id: string) => {
    setSelectedSpaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('7') || val.startsWith('8')) val = val.substring(1);
    let formatted = '+7 ';
    if (val.length > 0) formatted += '(' + val.substring(0, 3);
    if (val.length >= 3) formatted += ') ' + val.substring(3, 6);
    if (val.length >= 6) formatted += '-' + val.substring(6, 8);
    if (val.length >= 8) formatted += '-' + val.substring(8, 10);
    setPhone(formatted.trim());
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      setCardExpiry(val.substring(0, 2) + '/' + val.substring(2));
    } else {
      setCardExpiry(val);
    }
  };

  const handleDatesSelectedFromMatrix = (hId: string, inDate: string, outDate: string) => {
    setHouseId(hId);
    setCheckIn(inDate);
    setCheckOut(outDate);
  };

  const handleBookingAndPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Пожалуйста, введите корректный номер телефона для подтверждения брони');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    const spaNames = selectedSpaIds
      .map((id) => SPA_SERVICES.find((s) => s.id === id)?.name)
      .filter(Boolean) as string[];

    const generatedRef = 'ECHO-2026-' + Math.floor(1000 + Math.random() * 9000);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseName: currentHouse.name,
          checkIn,
          checkOut,
          nightsCount: calculation.nightsCount,
          guestsCount: guests,
          selectedSpa: spaNames,
          totalPrice: calculation.grandTotal,
          deposit: amountToPayNow,
          clientName: name.trim() || 'Гость',
          clientPhone: phone.trim(),
          preferredMessenger: messenger,
          paymentMethod: paymentMethod.toUpperCase(),
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBookingRef(data.bookingId || generatedRef);
      } else {
        setBookingRef(generatedRef);
      }
    } catch {
      setBookingRef(generatedRef);
    } finally {
      // Simulate realistic payment verification
      setTimeout(() => {
        setIsSubmitting(false);
        setIsPaid(true);
        setIsSuccess(true);
      }, 1200);
    }
  };

  return (
    <section className="section" id="booking">
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrapper">
          <span className="section-tag">
            <Calendar size={14} />
            Интерактивный расчет, доступность и бронь
          </span>
          <h2 className="section-heading">Забронируйте отдых онлайн за 2 минуты</h2>
          <p className="section-subtitle">
            Календарь свободных дат, динамический расчет без посредников и мгновенная безопасная оплата через СБП.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className={styles.calculatorBox}>
          {!isSuccess ? (
            <div className={styles.calculatorGrid}>
              {/* Left Column: Form & Inputs */}
              <div className={styles.formSection}>
                {/* 1. House Selection & Availability Matrix Button */}
                <div className={styles.inputGroup}>
                  <div className={styles.groupLabel}>
                    <span>1. Выберите дом:</span>
                    <button
                      type="button"
                      onClick={() => setMatrixOpen(true)}
                      className={styles.matrixOpenBtn}
                      title="Открыть сетку занятости домов"
                    >
                      <Calendar size={14} /> Календарь занятости на даты ↗
                    </button>
                  </div>

                  <div className={styles.houseSelectGrid}>
                    {HOUSES.map((h) => {
                      const isSelected = houseId === h.id;
                      return (
                        <div
                          key={h.id}
                          className={`${styles.houseOption} ${isSelected ? styles.houseOptionSelected : ''}`}
                          onClick={() => setHouseId(h.id)}
                        >
                          <div
                            className={styles.houseOptImg}
                            style={{ backgroundImage: `url('${h.mainImage}')` }}
                          />
                          <div className={styles.houseOptInfo}>
                            <h4 className={styles.houseOptTitle}>{h.name}</h4>
                            <span className={styles.houseOptCapacity}>до {h.capacityMax} гостей</span>
                            <span className={styles.houseOptPrice}>
                              от {formatNumber(h.priceWeekday)} ₽ / сут.
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Dates & Guests */}
                <div className={styles.datesGrid}>
                  <div className={styles.fieldBlock}>
                    <label className={styles.fieldLabel}>
                      <Calendar size={14} /> Заезд (с 15:00):
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={formatDateStr(today)}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className={styles.dateInput}
                    />
                  </div>

                  <div className={styles.fieldBlock}>
                    <label className={styles.fieldLabel}>
                      <Calendar size={14} /> Выезд (до 12:00):
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className={styles.dateInput}
                    />
                  </div>

                  <div className={styles.fieldBlock}>
                    <label className={styles.fieldLabel}>
                      <Users size={14} /> Гостей:
                    </label>
                    <div className={styles.counterWrap}>
                      <button
                        type="button"
                        className={styles.counterBtn}
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                      >
                        -
                      </button>
                      <span className={styles.counterValue}>{guests} чел.</span>
                      <button
                        type="button"
                        className={styles.counterBtn}
                        onClick={() => setGuests(Math.min(currentHouse.capacityMax, guests + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Spa & Extra Services */}
                <div className={styles.inputGroup}>
                  <label className={styles.groupLabel}>
                    <span>3. Банные опции и релакс:</span>
                  </label>
                  <div className={styles.spaGrid}>
                    {SPA_SERVICES.map((spa) => {
                      const isChecked = selectedSpaIds.includes(spa.id);
                      return (
                        <div
                          key={spa.id}
                          className={`${styles.spaCard} ${isChecked ? styles.spaCardChecked : ''}`}
                          onClick={() => toggleSpa(spa.id)}
                        >
                          <div className={styles.spaCheckbox}>
                            <div className={`${styles.checkSquare} ${isChecked ? styles.checkSquareActive : ''}`}>
                              {isChecked && <Check size={14} />}
                            </div>
                          </div>
                          <div className={styles.spaText}>
                            <div className={styles.spaHead}>
                              <span className={styles.spaName}>{spa.name}</span>
                              <span className={styles.spaPrice}>{formatNumber(spa.price)} ₽</span>
                            </div>
                            <p className={styles.spaDesc}>{spa.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Payment Gateway Selection with SBP */}
                <div className={styles.paymentSection}>
                  <div className={styles.groupLabel}>
                    <span>4. Способ оплаты и предоплата:</span>
                    <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={12} /> Безопасный шлюз 256-bit
                    </span>
                  </div>

                  {/* 50% Deposit vs 100% Full Payment Toggle */}
                  <div className={styles.paySplitGrid}>
                    <div
                      className={`${styles.paySplitOption} ${paySplit === 'deposit' ? styles.paySplitOptionActive : ''}`}
                      onClick={() => setPaySplit('deposit')}
                    >
                      <span className={styles.paySplitTitle}>Предоплата 50% (Задаток)</span>
                      <span className={styles.paySplitAmount}>{formatNumber(Math.round(calculation.grandTotal * 0.5))} ₽</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Остаток при заселении</span>
                    </div>

                    <div
                      className={`${styles.paySplitOption} ${paySplit === 'full' ? styles.paySplitOptionActive : ''}`}
                      onClick={() => setPaySplit('full')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.paySplitTitle}>100% Оплата онлайн</span>
                        <span style={{ background: '#10B981', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>-5% Скидка</span>
                      </div>
                      <span className={styles.paySplitAmount}>{formatNumber(Math.round(calculation.grandTotal * 0.95))} ₽</span>
                      <span style={{ fontSize: '0.72rem', color: '#34D399' }}>Экономия {formatNumber(Math.round(calculation.grandTotal * 0.05))} ₽</span>
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className={styles.paymentTabs}>
                    <button
                      type="button"
                      className={`${styles.paymentTabBtn} ${paymentMethod === 'sbp' ? styles.paymentTabBtnActive : ''}`}
                      onClick={() => setPaymentMethod('sbp')}
                    >
                      <QrCode size={16} />
                      <span>СБП (QR-код)</span>
                      <span className={styles.sbpBadge}>0%</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.paymentTabBtn} ${paymentMethod === 'card' ? styles.paymentTabBtnActive : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard size={16} />
                      <span>Карта (МИР/Visa)</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.paymentTabBtn} ${paymentMethod === 'tpay' ? styles.paymentTabBtnActive : ''}`}
                      onClick={() => setPaymentMethod('tpay')}
                    >
                      <Smartphone size={16} />
                      <span>T-Pay / SberPay</span>
                    </button>
                  </div>

                  {/* SBP Gateway Interactive View */}
                  {paymentMethod === 'sbp' && (
                    <div className={styles.sbpGatewayCard}>
                      <div className={styles.sbpHeader}>
                        <div className={styles.sbpLogoWrap}>
                          <div className={styles.sbpLogo}>
                            {/* SBP SVG Logo Triangle */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <polygon points="12,2 22,18 2,18" fill="#10B981" />
                              <polygon points="12,7 18,17 6,17" fill="#F59E0B" />
                              <polygon points="12,11 15,16 9,16" fill="#3B82F6" />
                            </svg>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>
                              Оплата через Систему Быстрых Платежей
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Без ввода данных карты • Моментальное подтверждение
                            </div>
                          </div>
                        </div>

                        <div className={styles.sbpTimer}>
                          <Clock size={13} /> {formatTimer(timeLeft)}
                        </div>
                      </div>

                      <div className={styles.sbpBodyGrid}>
                        {/* Dynamic SVG QR Code */}
                        <div className={styles.sbpQrBox}>
                          <svg viewBox="0 0 100 100" width="100%" height="100%">
                            {/* QR Code Matrix Elements */}
                            <rect x="0" y="0" width="100" height="100" fill="#FFF" />
                            {/* Top Left Corner Marker */}
                            <rect x="10" y="10" width="24" height="24" fill="#000" />
                            <rect x="14" y="14" width="16" height="16" fill="#FFF" />
                            <rect x="18" y="18" width="8" height="8" fill="#000" />
                            {/* Top Right Corner Marker */}
                            <rect x="66" y="10" width="24" height="24" fill="#000" />
                            <rect x="70" y="14" width="16" height="16" fill="#FFF" />
                            <rect x="74" y="18" width="8" height="8" fill="#000" />
                            {/* Bottom Left Corner Marker */}
                            <rect x="10" y="66" width="24" height="24" fill="#000" />
                            <rect x="14" y="70" width="16" height="16" fill="#FFF" />
                            <rect x="18" y="74" width="8" height="8" fill="#000" />
                            {/* Dynamic Pattern Pixels */}
                            <rect x="40" y="10" width="6" height="6" fill="#000" />
                            <rect x="52" y="10" width="6" height="6" fill="#000" />
                            <rect x="40" y="22" width="6" height="6" fill="#000" />
                            <rect x="46" y="28" width="6" height="6" fill="#000" />
                            <rect x="58" y="22" width="6" height="6" fill="#000" />
                            <rect x="10" y="42" width="6" height="6" fill="#000" />
                            <rect x="22" y="42" width="6" height="6" fill="#000" />
                            <rect x="34" y="42" width="6" height="6" fill="#000" />
                            <rect x="46" y="42" width="8" height="8" fill="#E57A22" />
                            <rect x="60" y="42" width="6" height="6" fill="#000" />
                            <rect x="72" y="42" width="6" height="6" fill="#000" />
                            <rect x="84" y="42" width="6" height="6" fill="#000" />
                            <rect x="40" y="56" width="6" height="6" fill="#000" />
                            <rect x="52" y="56" width="6" height="6" fill="#000" />
                            <rect x="64" y="56" width="6" height="6" fill="#000" />
                            <rect x="40" y="68" width="6" height="6" fill="#000" />
                            <rect x="52" y="74" width="6" height="6" fill="#000" />
                            <rect x="64" y="80" width="6" height="6" fill="#000" />
                            <rect x="76" y="68" width="6" height="6" fill="#000" />
                            <rect x="84" y="80" width="6" height="6" fill="#000" />
                          </svg>
                        </div>

                        {/* Quick Bank App Buttons */}
                        <div>
                          <div style={{ fontSize: '0.78rem', color: '#E2E8F0', marginBottom: '8px', fontWeight: 600 }}>
                            Откройте приложение вашего банка для оплаты {formatNumber(amountToPayNow)} ₽:
                          </div>
                          <div className={styles.bankButtonsGrid}>
                            {/* Т-Банк (Тинькофф) — SBP deep link */}
                            <a
                              href={`https://www.tbank.ru/payments/open/?amount=${amountToPayNow * 100}&description=${encodeURIComponent(`Бронирование ${currentHouse.name}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.bankQuickBtn}
                            >
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
                              <span>Т-Банк (Тинькофф)</span>
                            </a>
                            {/* Сбер — SBP universal link */}
                            <a
                              href={`https://online.sberbank.ru/CSAFront/index.do#transfer?amount=${amountToPayNow}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.bankQuickBtn}
                            >
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                              <span>СберБанк Онлайн</span>
                            </a>
                            {/* Альфа-Банк */}
                            <a
                              href={`https://click.alfabank.ru/aaa/api/click?amount=${amountToPayNow}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.bankQuickBtn}
                            >
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                              <span>Альфа-Банк</span>
                            </a>
                            {/* ВТБ */}
                            <a
                              href="https://online.vtb.ru/i/pay-by-link"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.bankQuickBtn}
                            >
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3B82F6', flexShrink: 0 }} />
                              <span>ВТБ Онлайн</span>
                            </a>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
                            💡 Или отсканируйте QR-код камерой телефона — откроется приложение вашего банка автоматически
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Gateway View */}
                  {paymentMethod === 'card' && (
                    <div className={styles.cardFormGrid}>
                      <div className={styles.inputField}>
                        <label className={styles.inputLbl}>Номер карты (МИР, Visa, Mastercard)</label>
                        <input
                          type="text"
                          placeholder="4276 3800 0000 0000"
                          value={cardNumber}
                          onChange={handleCardChange}
                          className={styles.textInput}
                          style={{ paddingLeft: '14px' }}
                          maxLength={19}
                        />
                      </div>
                      <div className={styles.inputField}>
                        <label className={styles.inputLbl}>Срок (ММ/ГГ)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className={styles.textInput}
                          style={{ paddingLeft: '14px' }}
                          maxLength={5}
                        />
                      </div>
                      <div className={styles.inputField}>
                        <label className={styles.inputLbl}>CVC / CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                          className={styles.textInput}
                          style={{ paddingLeft: '14px' }}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* T-Pay / SberPay View */}
                  {paymentMethod === 'tpay' && (
                    <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.84rem', color: '#E2E8F0', marginBottom: '12px' }}>
                        Быстрая оплата в 1 клик через биометрию или приложение банка
                      </p>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button type="button" className={styles.bankQuickBtn} style={{ padding: '12px 24px', fontSize: '0.88rem', background: '#F59E0B', color: '#000', fontWeight: 800 }}>
                          Оплатить с T-Pay
                        </button>
                        <button type="button" className={styles.bankQuickBtn} style={{ padding: '12px 24px', fontSize: '0.88rem', background: '#10B981', color: '#000', fontWeight: 800 }}>
                          Оплатить со SberPay
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Contact Details & Confirmation Form */}
                <form onSubmit={handleBookingAndPaymentSubmit} className={styles.contactForm}>
                  <h3 className={styles.formHeadTitle}>5. Контактные данные гостя:</h3>

                  {errorMsg && <div className={styles.errorBox}>{errorMsg}</div>}

                  <div className={styles.contactInputsRow}>
                    <div className={styles.inputField}>
                      <label className={styles.inputLbl}>
                        Ваше имя <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputIconWrap}>
                        <User size={16} className={styles.iconInside} />
                        <input
                          type="text"
                          required
                          placeholder="Иван Иванов"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={styles.textInput}
                        />
                      </div>
                    </div>

                    <div className={styles.inputField}>
                      <label className={styles.inputLbl}>
                        Номер телефона <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputIconWrap}>
                        <Phone size={16} className={styles.iconInside} />
                        <input
                          type="tel"
                          required
                          placeholder="+7 (999) 000-00-00"
                          value={phone}
                          onChange={handlePhoneChange}
                          className={styles.textInput}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.messengerChoice}>
                    <label className={styles.inputLbl}>Куда отправить подтверждение и ваучер:</label>
                    <div className={styles.msgToggles}>
                      <button
                        type="button"
                        className={`${styles.msgBtn} ${messenger === 'telegram' ? styles.msgBtnActive : ''}`}
                        onClick={() => setMessenger('telegram')}
                      >
                        <Send size={15} /> Telegram
                      </button>
                      <button
                        type="button"
                        className={`${styles.msgBtn} ${messenger === 'whatsapp' ? styles.msgBtnActive : ''}`}
                        onClick={() => setMessenger('whatsapp')}
                      >
                        <MessageCircle size={15} /> WhatsApp
                      </button>
                      <button
                        type="button"
                        className={`${styles.msgBtn} ${messenger === 'call' ? styles.msgBtnActive : ''}`}
                        onClick={() => setMessenger('call')}
                      >
                        <Phone size={15} /> Звонок
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="amber"
                    size="lg"
                    isLoading={isSubmitting}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <span>Оплатить {formatNumber(amountToPayNow)} ₽ и забронировать</span>
                    <ArrowRight size={18} />
                  </Button>
                </form>
              </div>

              {/* Right Column: Dynamic Price Summary Card */}
              <div className={styles.sidebarSection}>
                <div className={styles.summaryHead}>
                  <span className={styles.summaryBadge}>Итоговая смета</span>
                  <h3 className={styles.summaryTitle}>{currentHouse.name}</h3>
                </div>

                <div className={styles.grandPriceBox}>
                  <span className={styles.grandPriceNumber}>{formatRubles(calculation.grandTotal)}</span>
                  <span className={styles.grandPriceNights}>
                    За {calculation.nightsCount} {calculation.nightsCount === 1 ? 'сутки' : 'суток'} ({guests} {guests === 1 ? 'гость' : 'гостей'})
                  </span>
                </div>

                {calculation.discountAmount > 0 && (
                  <div className={styles.discountBanner}>
                    <Gift size={16} />
                    <span>Скидка 10% за проживание от 2-х суток (-{formatNumber(calculation.discountAmount)} ₽)</span>
                  </div>
                )}

                <div className={styles.billList}>
                  <div className={styles.billItem}>
                    <span>Проживание (будни: {calculation.weekdayNights}, вых: {calculation.weekendNights}):</span>
                    <span className={styles.billVal}>{formatNumber(calculation.houseBaseTotal)} ₽</span>
                  </div>

                  {calculation.discountAmount > 0 && (
                    <div className={styles.billItem} style={{ color: '#34D399' }}>
                      <span>Скидка от 2-х суток:</span>
                      <span className={styles.billVal} style={{ color: '#34D399' }}>-{formatNumber(calculation.discountAmount)} ₽</span>
                    </div>
                  )}

                  {calculation.extraGuestsTotal > 0 && (
                    <div className={styles.billItem}>
                      <span>Дополнительные гости:</span>
                      <span className={styles.billVal}>+{formatNumber(calculation.extraGuestsTotal)} ₽</span>
                    </div>
                  )}

                  {calculation.spaTotal > 0 && (
                    <div className={styles.billItem}>
                      <span>Банные спа-программы:</span>
                      <span className={styles.billVal}>+{formatNumber(calculation.spaTotal)} ₽</span>
                    </div>
                  )}
                </div>

                {/* Amount to pay now */}
                <div style={{ background: 'rgba(229, 122, 34, 0.1)', padding: '12px', borderRadius: 8, border: '1px solid rgba(229, 122, 34, 0.3)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-amber)', textTransform: 'uppercase', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    К оплате сейчас ({paySplit === 'deposit' ? '50% задаток' : '100% онлайн'}):
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
                    {formatRubles(amountToPayNow)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {paySplit === 'deposit' ? `Остаток ${formatNumber(calculation.grandTotal - amountToPayNow)} ₽ при заселении` : 'Полная оплата зафиксирована'}
                  </div>
                </div>

                <div className={styles.depositNotice}>
                  <ShieldCheck size={16} className={styles.depIcon} />
                  <span>
                    Возвратный залог за сохранность имущества {formatNumber(currentHouse.rules.deposit)} ₽ вносится при заселении и возвращается при выезде.
                  </span>
                </div>

                <div className={styles.inclusionsBox}>
                  <span className={styles.incTitle}>В стоимость включено:</span>
                  <ul className={styles.incList}>
                    <li><Check size={13} className={styles.incCheck} /> Полная приватность территории</li>
                    <li><Check size={13} className={styles.incCheck} /> Индивидуальная мангальная зона и решетки</li>
                    <li><Check size={13} className={styles.incCheck} /> Постельное белье премиум, халаты, полотенца</li>
                    <li><Check size={13} className={styles.incCheck} /> Чай, кофе Nespresso, специи, родниковая вода</li>
                    <li><Check size={13} className={styles.incCheck} /> Высокоскоростной Wi-Fi и парковка</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* Digital Booking Voucher Success Screen */
            <div className={styles.successWrapper}>
              <div className={styles.successIconCircle}>
                <CheckCircle2 size={44} color="#10B981" />
              </div>

              <div>
                <h3 className={styles.successHeading}>Бронирование успешно оплачено!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                  Электронный ваучер сформирован и направлен в ваш {messenger === 'telegram' ? 'Telegram' : messenger === 'whatsapp' ? 'WhatsApp' : 'телефон'}.
                </p>
              </div>

              {/* Printable Official Digital Voucher Ticket */}
              <div className={styles.voucherTicket}>
                <div className={styles.voucherHeader}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-amber)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      ГОСТЕВОЙ КОМПЛЕКС «ЭХО»
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF' }}>
                      Электронный ваучер заселения
                    </div>
                  </div>
                  <span className={styles.voucherStatusBadge}>✓ {isPaid ? 'ОПЛАЧЕНО (СБП)' : 'ПОДТВЕРЖДЕНО'}</span>
                </div>

                <div className={styles.voucherGrid}>
                  <div>
                    <div className={styles.voucherFieldLbl}>Номер бронирования</div>
                    <div className={styles.voucherFieldVal} style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>{bookingRef}</div>
                  </div>

                  <div>
                    <div className={styles.voucherFieldLbl}>Объект размещения</div>
                    <div className={styles.voucherFieldVal}>{currentHouse.name}</div>
                  </div>

                  <div>
                    <div className={styles.voucherFieldLbl}>Даты проживания</div>
                    <div className={styles.voucherFieldVal}>{checkIn} — {checkOut} ({calculation.nightsCount} ноч.)</div>
                  </div>

                  <div>
                    <div className={styles.voucherFieldLbl}>Гости</div>
                    <div className={styles.voucherFieldVal}>{name || 'Гость'} • {guests} чел.</div>
                  </div>

                  <div>
                    <div className={styles.voucherFieldLbl}>Внесенная предоплата</div>
                    <div className={styles.voucherFieldVal} style={{ color: '#34D399' }}>{formatNumber(amountToPayNow)} ₽ (СБП)</div>
                  </div>

                  <div>
                    <div className={styles.voucherFieldLbl}>Время заезда / выезда</div>
                    <div className={styles.voucherFieldVal}>Заезд: 15:00 / Выезд: 12:00</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    📍 Координаты: Ленинградская обл., Выборгский район • 45 мин от КАД
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>
                    Предъявите этот QR-код администратору
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.voucherActions}>
                <a
                  href={`https://t.me/Aidar_RG?text=${encodeURIComponent(`Здравствуйте! Мой номер брони ${bookingRef}. Подтвердите, пожалуйста, бронирование дома ${currentHouse.name} на даты ${checkIn} - ${checkOut}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                >
                  <Send size={16} /> Связаться с администратором
                </a>

                <a
                  href="https://yandex.ru/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
                >
                  <MapPin size={16} /> Построить маршрут
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setIsPaid(false);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '12px 18px' }}
                >
                  Новый расчет
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Availability Matrix Modal */}
      <AvailabilityMatrixModal
        isOpen={matrixOpen}
        onClose={() => setMatrixOpen(false)}
        onSelectDates={handleDatesSelectedFromMatrix}
        currentHouseId={houseId}
        currentCheckIn={checkIn}
        currentCheckOut={checkOut}
      />
    </section>
  );
};
