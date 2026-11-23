import { ArrowLeft, ArrowRight, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import { FAQ_ITEMS, TESTIMONIALS } from '../data/fleetData';

export function TestimonialsAndFaqSection() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);
  const [failedPortraits, setFailedPortraits] = useState<Record<string, boolean>>({});

  const handlePrev = () => {
    setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  // Show two consecutive testimonials cleanly on desktop
  const visibleTestimonials = [
    TESTIMONIALS[testimonialIndex],
    TESTIMONIALS[(testimonialIndex + 1) % TESTIMONIALS.length],
  ];

  return (
    <>
      {/* Testimonials Band in Warm Peach Wash */}
      <section id="reviews" className="vromon-peach-band py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2
              className="font-display font-bold text-[#111111] tracking-tight leading-[1.14] max-w-md"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                textWrap: 'balance',
              }}
            >
              Drive with confidence,
              <br />
              rent with trustable.
            </h2>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous customer testimonial"
                className="w-10 h-10 rounded-full bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F95B2B]"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next customer testimonial"
                className="w-10 h-10 rounded-full bg-[#F95B2B] hover:bg-[#E24A1D] text-white flex items-center justify-center shadow-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#111111]"
              >
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visibleTestimonials.map((item) => (
              <article
                key={item.id}
                className="bg-white/95 border border-black/5 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start"
              >
                <div className="w-full sm:w-44 aspect-square rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                  {failedPortraits[item.id] ? (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <User className="w-10 h-10" aria-hidden="true" />
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={`Portrait of ${item.name}`}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedPortraits((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between h-full">
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="mt-5 pt-4 border-t border-neutral-100 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-display font-bold text-sm text-[#111111]">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {item.role} · {item.vehicleRented}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display text-xl font-bold text-[#111111] tabular-nums">
                        {item.rating}
                      </span>
                      <span className="block text-[11px] text-neutral-500">Rating</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="font-display font-bold text-[#111111] text-center tracking-tight leading-[1.15]"
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
              textWrap: 'balance',
            }}
          >
            Vromon is here to give
            <br />
            answers to your questions
          </h2>

          <div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F95B2B]"
                  >
                    <span className="font-display font-semibold text-base text-[#111111]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-500 shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-[#F95B2B]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 pr-8 text-sm text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
