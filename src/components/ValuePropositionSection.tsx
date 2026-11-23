import { ArrowRight, Car, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { KEY_BENEFITS } from '../data/fleetData';
import { VehicleCategory } from '../types/rental';

interface ValuePropositionSectionProps {
  onSelectCategoryAndScroll: (category: 'All' | VehicleCategory) => void;
}

export function ValuePropositionSection({
  onSelectCategoryAndScroll,
}: ValuePropositionSectionProps) {
  const [activeIndex, setActiveIndex] = useState(1); // "Luxury and Comfort." active by default like reference
  const [imgFailed, setImgFailed] = useState(false);
  const activeBenefit = KEY_BENEFITS[activeIndex];

  return (
    <section id="benefits" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: Heading + Interactive 6-item list */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2
                className="font-display font-bold text-[#111111] tracking-tight leading-[1.14]"
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  textWrap: 'balance',
                }}
              >
                Keys to freedom,
                <br />
                wheels to adventure.
              </h2>

              <div className="mt-10 space-y-1" role="tablist" aria-label="Vromon key benefits">
                {KEY_BENEFITS.map((benefit, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={benefit.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-full flex items-center gap-3 py-3 px-2 text-left rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F95B2B] ${
                        isActive
                          ? 'text-[#111111] font-bold bg-neutral-50'
                          : 'text-neutral-400 hover:text-neutral-700 font-medium'
                      }`}
                    >
                      <span
                        className={`w-5 flex items-center justify-center shrink-0 transition-transform duration-150 ${
                          isActive ? 'text-[#F95B2B]' : 'text-neutral-300'
                        }`}
                      >
                        {isActive ? (
                          <ChevronRight className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
                        ) : (
                          <span className="w-px h-4 bg-neutral-200 block" aria-hidden="true" />
                        )}
                      </span>
                      <span className="text-base md:text-lg">{benefit.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Description + Studio Sports Fastback */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="lg:pl-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#F95B2B]">
                {activeBenefit.statLabel}
              </p>
              <h3 className="mt-2 font-display text-xl md:text-2xl font-semibold text-[#111111] leading-snug">
                {activeBenefit.headline}
              </h3>
              <p className="mt-3 text-sm md:text-base text-neutral-600 leading-relaxed max-w-xl">
                {activeBenefit.description}
              </p>

              <button
                type="button"
                onClick={() => onSelectCategoryAndScroll(activeBenefit.recommendedCategory)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#111111] hover:text-[#F95B2B] transition-colors cursor-pointer"
              >
                <span>Explore matching vehicles</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 flex items-end justify-center lg:justify-end">
              {imgFailed ? (
                <div className="w-full aspect-[4/3] max-h-[340px] rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col items-center justify-center text-neutral-500">
                  <Car className="w-12 h-12 text-[#F95B2B] mb-2" aria-hidden="true" />
                  <span className="text-sm font-medium">Porsche Panamera 4S</span>
                </div>
              ) : (
                <img
                  src="/src/assets/images/car_slate_fastback_1795456196924.jpg"
                  alt="Metallic gunmetal luxury sports fastback front view"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full max-w-lg aspect-[4/3] object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
