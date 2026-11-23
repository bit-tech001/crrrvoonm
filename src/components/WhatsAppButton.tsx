export function WhatsAppIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.01 3.2C8.94 3.2 3.2 8.94 3.2 16.01c0 2.26.59 4.46 1.71 6.4L3.1 29l6.76-1.77a12.76 12.76 0 0 0 6.15 1.57h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.64-3.75-9.06A12.72 12.72 0 0 0 16.01 3.2zm0 23.43h-.01a10.63 10.63 0 0 1-5.42-1.48l-.39-.23-4.01 1.05 1.07-3.91-.25-.4a10.62 10.62 0 0 1-1.63-5.65c0-5.87 4.78-10.65 10.65-10.65 2.84 0 5.51 1.11 7.52 3.12a10.58 10.58 0 0 1 3.12 7.53c0 5.87-4.78 10.62-10.65 10.62zm5.84-7.97c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.51-.16-.72.16-.21.32-.83 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67s1.15 3.1 1.31 3.31c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37z" />
    </svg>
  );
}

const WHATSAPP_URL =
  'https://wa.me/8801700876666?text=Hi%20Vromon%20Car%20Rental%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20vehicle.';

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with Vromon Car Rental"
      title="Chat on WhatsApp"
      data-testid="whatsapp-floating-button"
      className="fixed bottom-5 right-5 z-30 w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg shadow-black/20 flex items-center justify-center transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
}
