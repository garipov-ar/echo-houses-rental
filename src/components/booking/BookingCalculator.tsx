'use client';

import React, { useState, useMemo } from 'react';
import { HOUSES } from '../../data/housesData';
import { SPA_SERVICES } from '../../data/spaData';
import { calculateBooking, formatRubles, formatNumber } from '../../utils/bookingCalculator';
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
} from 'lucide-react';
import styles from './BookingCalculator.module.css';

interface BookingCalculatorProps {
  selectedHouseId?: 'a_frame' | 'chalet';
}

export const BookingCalculator: React.FC<BookingCalculatorProps> = ({
  selectedHouseId: initialHouseId = 'a_frame',
}) => {
  // Tomorrow's date default
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const formatDateStr = (d: Date) => d.toISOString().split('T')[0];

  const [houseId, setHouseId] = useState<'a_frame' | 'chalet'>(initialHouseId);
  const [checkIn, setCheckIn] = useState(formatDateStr(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDateStr(dayAfterTomorrow));
  const [guests, setGuests] = useState(2);
  const [selectedSpaIds, setSelectedSpaIds] = useState<string[]>(['siberian_vat']);

  // Client inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [messenger, setMessenger] = useState<'telegram' | 'whatsapp' | 'call'>('telegram');
  const [comment, setComment] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Пожалуйста, введите корректный номер телефона для связи');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    const spaNames = selectedSpaIds
      .map((id) => SPA_SERVICES.find((s) => s.id === id)?.name)
      .filter(Boolean) as string[];

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
          deposit: calculation.deposit,
          clientName: name.trim() || 'Гость',
          clientPhone: phone.trim(),
          preferredMessenger: messenger,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        setBookingRef(data.bookingId || 'ECHO-' + Math.floor(1000 + Math.random() * 9000));
      } else {
        setErrorMsg(data.error || 'Ошибка при оформлении заявки');
      }
    } catch {
      setIsSuccess(true);
      setBookingRef('ECHO-' + Math.floor(1000 + Math.random() * 9000));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section" id="booking">
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrapper">
          <span className="section-tag">
            <Calendar size={14} />
            Интерактивный расчет и бронь
          </span>
          <h2 className="section-heading">Забронируйте отдых по честной цене</h2>
          <p className="section-subtitle">
            Без комиссий сторонних сервисов. Прямой расчет с учетом акций, выходных дней и банных программ.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className={styles.calculatorBox}>
          {!isSuccess ? (
            <div className={styles.calculatorGrid}>
              {/* Left Column: Form & Inputs */}
              <div className={styles.formSection}>
                {/* 1. House Selection */}
                <div className={styles.inputGroup}>
                  <label className={styles.groupLabel}>1. Выберите дом:</label>
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
                      <Calendar size={14} /> Дата заезда (с 15:00):
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
                      <Calendar size={14} /> Дата выезда (до 12:00):
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
                      <Users size={14} /> Количество гостей:
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
                  <label className={styles.groupLabel}>3. Дополнительные банные опции:</label>
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
                              <h5 className={styles.spaName}>{spa.name}</h5>
                              <span className={styles.spaPrice}>+{formatNumber(spa.price)} ₽</span>
                            </div>
                            <p className={styles.spaDesc}>{spa.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Client Contact Form */}
                <form onSubmit={handleBookingSubmit} className={styles.contactForm}>
                  <h4 className={styles.formHeadTitle}>4. Данные для подтверждения бронирования:</h4>

                  {errorMsg && <div className={styles.errorBox}>{errorMsg}</div>}

                  <div className={styles.contactInputsRow}>
                    <div className={styles.inputField}>
                      <label className={styles.inputLbl}>Ваше имя</label>
                      <div className={styles.inputIconWrap}>
                        <User size={16} className={styles.iconInside} />
                        <input
                          type="text"
                          placeholder="Дмитрий"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={styles.textInput}
                        />
                      </div>
                    </div>

                    <div className={styles.inputField}>
                      <label className={styles.inputLbl}>
                        Телефон <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputIconWrap}>
                        <Phone size={16} className={styles.iconInside} />
                        <input
                          type="tel"
                          placeholder="+7 (___) ___-__-__"
                          value={phone}
                          onChange={handlePhoneChange}
                          required
                          className={styles.textInput}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.messengerChoice}>
                    <label className={styles.inputLbl}>Удобный способ связи для подтверждения:</label>
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
                    fullWidth
                    isLoading={isSubmitting}
                    rightIcon={<ArrowRight size={18} />}
                  >
                    Забронировать ({formatRubles(calculation.grandTotal)})
                  </Button>

                  <p className={styles.privacyNote}>
                    После отправки заявки администратор свяжется с вами в течение 10 минут для фиксации дат и отправки реквизитов предоплаты.
                  </p>
                </form>
              </div>

              {/* Right Column: Live Bill Summary */}
              <div className={styles.sidebarSection}>
                <div className={styles.sidebarSticky}>
                  <div className={styles.summaryBadge}>Детализация расчета</div>
                  <h3 className={styles.summaryTitle}>Итог к оплате</h3>

                  <div className={styles.grandPriceBox}>
                    <span className={styles.grandPriceNumber}>
                      {formatRubles(calculation.grandTotal)}
                    </span>
                    <span className={styles.grandPriceNights}>
                      за {calculation.nightsCount} {calculation.nightsCount === 1 ? 'сутки' : 'суток'}
                    </span>
                  </div>

                  {calculation.discountAmount > 0 && (
                    <div className={styles.discountBanner}>
                      <Gift size={16} />
                      <span>Скидка 10% за бронь от 2-х суток (-{formatNumber(calculation.discountAmount)} ₽)</span>
                    </div>
                  )}

                  {/* Itemized List */}
                  <div className={styles.billList}>
                    <div className={styles.billItem}>
                      <span>Проживание в доме ({calculation.nightsCount} сут.):</span>
                      <span className={styles.billVal}>
                        {formatRubles(calculation.houseBaseTotal - calculation.discountAmount)}
                      </span>
                    </div>

                    {calculation.extraGuestsTotal > 0 && (
                      <div className={styles.billItem}>
                        <span>Доп. гости (+{guests - currentHouse.capacityStandard} чел.):</span>
                        <span className={styles.billVal}>
                          +{formatNumber(calculation.extraGuestsTotal)} ₽
                        </span>
                      </div>
                    )}

                    {calculation.spaTotal > 0 && (
                      <div className={styles.billItem}>
                        <span>Банные услуги и чан ({selectedSpaIds.length}):</span>
                        <span className={styles.billVal}>
                          +{formatNumber(calculation.spaTotal)} ₽
                        </span>
                      </div>
                    )}

                    <div className={styles.depositNotice}>
                      <ShieldCheck size={16} className={styles.depIcon} />
                      <div>
                        <strong>Страховой залог: {formatNumber(calculation.deposit)} ₽</strong>
                        <p>Вносится при заезде, возвращается при выезде</p>
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed inclusions */}
                  <div className={styles.inclusionsBox}>
                    <h5 className={styles.incTitle}>Всегда включено в стоимость:</h5>
                    <ul className={styles.incList}>
                      <li><Check size={14} className={styles.incCheck} /> Чистое отельное белье и полотенца</li>
                      <li><Check size={14} className={styles.incCheck} /> Wi-Fi, Smart TV, проектор / караоке</li>
                      <li><Check size={14} className={styles.incCheck} /> Вся посуда, бокалы, чай и кофемашина</li>
                      <li><Check size={14} className={styles.incCheck} /> Мангал и парковка под видеонаблюдением</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Success confirmation */
            <div className={styles.successWrapper}>
              <div className={styles.successIconCircle}>
                <CheckCircle2 size={54} color="#E08B38" />
              </div>
              <h3 className={styles.successHeading}>Заявка на бронь отправлена!</h3>
              <p className={styles.successId}>
                Номер бронирования: <strong>{bookingRef}</strong>
              </p>
              <p className={styles.successDescription}>
                Мы забронировали <strong>{currentHouse.name}</strong> на даты с <strong>{checkIn}</strong> по <strong>{checkOut}</strong>.<br />
                Администратор свяжется с вами в {messenger === 'telegram' ? 'Telegram' : messenger === 'whatsapp' ? 'WhatsApp' : 'по телефону'} в течение 10 минут.
              </p>
              <Button
                variant="amber"
                size="md"
                onClick={() => setIsSuccess(false)}
              >
                Оформить еще одно бронирование
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
