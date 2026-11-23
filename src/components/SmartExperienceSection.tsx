import { ArrowRight, Check, CreditCard, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { EXPERIENCE_TABS } from '../data/fleetData';

interface SmartExperienceSectionProps {
  onStartBooking: () => void;
}

export function SmartExperienceSection({
  onStartBooking,
}: SmartExperienceSectionProps) {
  const [activeTabId, setActiveTabId] = useState(EXPERIENCE_TABS[0].id);
  const activeTab =
    EXPERIENCE_TABS.find((t) => t.id === activeTabId) ?? EXPERIENCE_TABS[0];

  return (
    <section id="experience" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Centered Headline + 4-Tab Switcher matching reference */}
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-display font-bold text-[#111111] tracking-tight leading-[1.14]"
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              textWrap: 'balance',
            }}
          >
            Drive your way,
            <br />
            anytime, anywhere.
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Vromon digital booking experience"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {EXPERIENCE_TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F95B2B] ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Interactive 2-Column Preview */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: Clean Interactive Phone / Dispatch Map Preview */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[330px] rounded-[2.25rem] bg-[#111111] p-3 shadow-xl shadow-neutral-900/15 border border-neutral-800">
              <div className="rounded-[1.7rem] bg-[#FAFAFA] overflow-hidden border border-neutral-200">
                {/* Device Top Bar */}
                <div className="bg-white px-5 pt-5 pb-3 border-b border-neutral-100 flex items-center justify-between">
                  <span className="font-display font-extrabold text-sm tracking-tight text-[#111111]">
                    VROMON PASS
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                    VRM-8421
                  </span>
                </div>

                {/* Route SVG Visualization */}
                <div className="p-5 bg-gradient-to-b from-[#FFF6EB] to-white">
                  <div className="rounded-xl bg-white border border-neutral-200/90 p-4">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                      <span>ACTIVE ROUTE</span>
                      <span className="font-semibold text-[#F95B2B]">
                        {activeTab.label}
                      </span>
                    </div>

                    {/* Clean SVG Route Map Line */}
                    <svg
                      viewBox="0 0 240 84"
                      className="w-full h-20 my-2"
                      role="img"
                      aria-label={`Route preview for ${activeTab.appRouteLabel}`}
                    >
                      <defs>
                        <linearGradient id="vromonRoute" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#111111" />
                          <stop offset="100%" stopColor="#F95B2B" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 18 60 Q 78 16, 125 46 T 222 24"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 18 60 Q 78 16, 125 46 T 222 24"
                        fill="none"
                        stroke="url(#vromonRoute)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray="6 4"
                      />
                      <circle cx="18" cy="60" r="6" fill="#111111" />
                      <circle cx="125" cy="46" r="5" fill="#F95B2B" />
                      <circle cx="222" cy="24" r="6" fill="#F95B2B" />
                    </svg>

                    <p className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F95B2B] shrink-0" aria-hidden="true" />
                      <span className="truncate">{activeTab.appRouteLabel}</span>
                    </p>
                  </div>

                  {/* Active Mode Detail Card inside Device */}
                  <div className="mt-3 rounded-xl bg-[#111111] text-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/70">
                        {activeTab.appCardTitle}
                      </span>
                      {activeTab.id === 'payments' && (
                        <CreditCard className="w-4 h-4 text-[#F95B2B]" aria-hidden="true" />
                      )}
                      {activeTab.id === 'tracking' && (
                        <MapPin className="w-4 h-4 text-[#F95B2B]" aria-hidden="true" />
                      )}
                      {activeTab.id === 'personalized' && (
                        <Sparkles className="w-4 h-4 text-[#F95B2B]" aria-hidden="true" />
                      )}
                      {activeTab.id === 'assistance' && (
                        <ShieldCheck className="w-4 h-4 text-[#F95B2B]" aria-hidden="true" />
                      )}
                    </div>
                    <p className="mt-1.5 font-display text-sm font-bold tabular-nums">
                      {activeTab.appCardMetric}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Copy + Highlights */}
          <div className="lg:col-span-6">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[#111111] leading-snug">
              {activeTab.title}
            </h3>
            <p className="mt-3 text-sm md:text-base text-neutral-600 leading-relaxed">
              {activeTab.description}
            </p>

            <ul className="mt-6 space-y-3">
              {activeTab.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#111111]">
                  <span className="w-5 h-5 rounded-full bg-[#F95B2B]/12 text-[#F95B2B] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                type="button"
                onClick={onStartBooking}
                className="inline-flex items-center gap-3 bg-[#111111] hover:bg-[#F95B2B] text-white text-xs font-semibold uppercase tracking-wider pl-5 pr-2 py-2 rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F95B2B]"
              >
                <span>Reserve Your Vehicle</span>
                <span className="w-7 h-7 rounded-full bg-white text-[#111111] flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
