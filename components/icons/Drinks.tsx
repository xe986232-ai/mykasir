export function WaterBottleIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M52 14h16v10l6 8v70a6 6 0 01-6 6H52a6 6 0 01-6-6V32l6-8V14z" fill="url(#waterShade)" />
      <rect x="50" y="10" width="20" height="8" rx="2" fill="#2FB350" />
      <rect x="46" y="52" width="28" height="34" rx="3" fill="#ffffff" opacity="0.85" />
      <rect x="46" y="60" width="28" height="4" fill="#3B6DF0" opacity="0.5" />
      <defs>
        <linearGradient id="waterShade" x1="46" y1="14" x2="74" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BFE3FF" />
          <stop offset="1" stopColor="#6FB6F2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function JuiceIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 24h40l-5 14v58a8 8 0 01-8 8H53a8 8 0 01-8-8V38l-5-14z" fill="url(#juiceShade)" />
      <path d="M40 24h40l-2 6H42l-2-6z" fill="#F5B301" />
      <rect x="48" y="18" width="24" height="8" rx="2" fill="#F5B301" />
      <path d="M50 50c4 6 4 10 0 16 6-2 10-2 14 0-2-6 0-10 4-16-6 2-10 2-18 0z" fill="#fff" opacity="0.5" />
      <defs>
        <linearGradient id="juiceShade" x1="35" y1="24" x2="80" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBB03B" />
          <stop offset="1" stopColor="#EF7E1C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function IcedTeaIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38 30h44l-6 66a8 8 0 01-8 8H52a8 8 0 01-8-8l-6-66z" fill="url(#teaShade)" />
      <path d="M34 30h52l1-8H33l1 8z" fill="#4C8B3B" />
      <rect x="66" y="14" width="4" height="10" rx="2" fill="#4C8B3B" />
      <g stroke="#fff" strokeWidth="2.5" opacity="0.7" strokeLinecap="round">
        <line x1="48" y1="54" x2="48" y2="78" />
        <line x1="60" y1="54" x2="60" y2="78" />
        <line x1="72" y1="54" x2="72" y2="78" />
      </g>
      <defs>
        <linearGradient id="teaShade" x1="32" y1="30" x2="82" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D9A65C" />
          <stop offset="1" stopColor="#B97C2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
