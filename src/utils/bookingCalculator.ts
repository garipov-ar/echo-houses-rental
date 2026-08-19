import { HOUSES, House } from '../data/housesData';
import { SPA_SERVICES } from '../data/spaData';

export interface BookingCalculationInput {
  houseId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  selectedSpaIds: string[];
}

export interface BookingCalculationResult {
  nightsCount: number;
  weekdayNights: number;
  weekendNights: number;
  houseBaseTotal: number;
  discountAmount: number;
  extraGuestsTotal: number;
  spaTotal: number;
  grandTotal: number;
  deposit: number;
}

export function calculateBooking(input: BookingCalculationInput): BookingCalculationResult {
  const house = HOUSES.find((h) => h.id === input.houseId) || HOUSES[0];

  const startDate = new Date(input.checkIn);
  const endDate = new Date(input.checkOut);

  // If invalid or same day, minimum 1 night
  let diffTime = endDate.getTime() - startDate.getTime();
  let nightsCount = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (nightsCount < 1 || isNaN(nightsCount)) {
    nightsCount = 1;
  }

  let weekdayNights = 0;
  let weekendNights = 0;
  let houseBaseTotal = 0;

  for (let i = 0; i < nightsCount; i++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i);
    const dayOfWeek = currentDay.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday

    // Friday (5) and Saturday (6) are weekend rates
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      weekendNights++;
      houseBaseTotal += house.priceWeekend;
    } else {
      weekdayNights++;
      houseBaseTotal += house.priceWeekday;
    }
  }

  // Multi-night discount (10% off house rental for 2+ nights)
  let discountAmount = 0;
  if (nightsCount >= 2) {
    discountAmount = Math.round(houseBaseTotal * 0.1);
  }

  // Extra guests calculation
  const extraGuestsCount = Math.max(0, input.guests - house.capacityStandard);
  const extraGuestsTotal = extraGuestsCount * house.priceExtraGuest * nightsCount;

  // Spa services sum
  let spaTotal = 0;
  input.selectedSpaIds.forEach((spaId) => {
    const service = SPA_SERVICES.find((s) => s.id === spaId);
    if (service) {
      spaTotal += service.price;
    }
  });

  const grandTotal = houseBaseTotal - discountAmount + extraGuestsTotal + spaTotal;

  return {
    nightsCount,
    weekdayNights,
    weekendNights,
    houseBaseTotal,
    discountAmount,
    extraGuestsTotal,
    spaTotal,
    grandTotal,
    deposit: house.rules.deposit,
  };
}

export function formatRubles(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(amount);
}
