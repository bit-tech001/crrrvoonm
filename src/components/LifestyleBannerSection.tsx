import { ArrowRight, Car } from 'lucide-react';
import { useState } from 'react';

interface LifestyleBannerSectionProps {
  onStartBooking: () => void;
}

export function LifestyleBannerSection({
  onStartBooking,
}: LifestyleBannerSectionProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden min-h-[380px] md:min-h-[440px] flex items-center bg-[#18181B]">
          {imgFailed ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[#27272A] to-[#111111] flex items-center justify-end pr-16 opacity-60">
              <Car className="w-32 h-32 text-white/20" aria-hidden="true" />
            </div>
          ) : (
            <img
              src="/src/assets/images/banner_road_trip_1795456196832.jpg"
              alt="Traveler standing beside a pearl-white SUV on a scenic mountain highway at golden hour"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}

          {/* Measured left contrast scrim ensuring >= 4.5:1 legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent"
          />

          <div className="relative z-10 p-8 md:p-14 max-w-xl">
            <h2
              className="font-display font-bold text-white leading-[1.12] tracking-tight"
              style={{
                fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
                textWrap: 'balance',
              }}
            >
              Affordable rides,
              <br />
              unforgettable trips.
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/85 leading-relaxed max-w-md">
              Enjoy the freedom to travel on your own schedule without relying on
              crowded public transportation or unpredictable rideshare surge pricing.
            </p>

            <button
              type="button"
              onClick={onStartBooking}
              className="mt-7 inline-flex items-center gap-3 bg-[#F95B2B] hover:bg-[#E24A1D] text-white text-xs font-semibold uppercase tracking-wider pl-5 pr-2 py-2 rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>Start Booking</span>
              <span className="w-7 h-7 rounded-full bg-white text-[#F95B2B] flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
