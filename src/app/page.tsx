'use client';

import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { HouseSwitcher } from '../components/houses/HouseSwitcher';
import { BookingCalculator } from '../components/booking/BookingCalculator';
import { SpaSection } from '../components/sections/SpaSection';
import { AtmosphereGallery } from '../components/sections/AtmosphereGallery';
import { RulesAndFAQ } from '../components/sections/RulesAndFAQ';
import { LocationMap } from '../components/sections/LocationMap';
import { JsonLd } from '../components/seo/JsonLd';

export default function EchoHomePage() {
  const [selectedHouseForBooking, setSelectedHouseForBooking] = useState<'a_frame' | 'chalet'>('a_frame');

  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <Hero />
        <HouseSwitcher onSelectHouseForBooking={(houseId) => setSelectedHouseForBooking(houseId)} />
        <BookingCalculator selectedHouseId={selectedHouseForBooking} />
        <SpaSection />
        <AtmosphereGallery />
        <RulesAndFAQ />
        <LocationMap />
      </main>
      <Footer />
    </>
  );
}
