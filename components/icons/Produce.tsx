export function PapayaIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="68" rx="38" ry="30" fill="#F2A93B" />
      <ellipse cx="60" cy="68" rx="38" ry="30" fill="url(#papayaShade)" />
      <path
        d="M35 45c6-10 16-16 25-16s19 6 25 16"
        stroke="#4C8B3B"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M52 32c0-6 4-11 8-11s8 5 8 11" stroke="#4C8B3B" strokeWidth="4" strokeLinecap="round" />
      <g fill="#7A3E1D" opacity="0.85">
        <circle cx="48" cy="62" r="2.4" />
        <circle cx="57" cy="70" r="2.4" />
        <circle cx="66" cy="60" r="2.4" />
        <circle cx="72" cy="72" r="2.4" />
        <circle cx="52" cy="78" r="2.2" />
        <circle cx="64" cy="80" r="2.2" />
      </g>
      <defs>
        <linearGradient id="papayaShade" x1="30" y1="45" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCC873" />
          <stop offset="1" stopColor="#EE8F2A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function StrawberryIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M60 34c-8-10-20-12-28-8-4 2-6 6-4 10 2 5 8 6 12 6"
        fill="#4C8B3B"
      />
      <path
        d="M60 34c8-10 20-12 28-8 4 2 6 6 4 10-2 5-8 6-12 6"
        fill="#5C9F45"
      />
      <path
        d="M60 30c-3-6-3-6 0-10 3 4 3 4 0 10z"
        fill="#4C8B3B"
      />
      <path
        d="M60 42C40 42 26 58 30 78c3 16 18 26 30 26s27-10 30-26c4-20-10-36-30-36z"
        fill="url(#strawberryShade)"
      />
      <g fill="#FFE082" opacity="0.9">
        <circle cx="45" cy="58" r="2" />
        <circle cx="58" cy="52" r="2" />
        <circle cx="72" cy="58" r="2" />
        <circle cx="40" cy="72" r="2" />
        <circle cx="55" cy="70" r="2" />
        <circle cx="70" cy="72" r="2" />
        <circle cx="48" cy="86" r="2" />
        <circle cx="63" cy="88" r="2" />
        <circle cx="76" cy="80" r="2" />
      </g>
      <defs>
        <linearGradient id="strawberryShade" x1="30" y1="42" x2="90" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F6544A" />
          <stop offset="1" stopColor="#D6272B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CarrotIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-18 60 60)">
        <path d="M52 20c4 6 4 6 0 16-4-2-6-2-9 0-4-10-4-10 9-16z" fill="#4C8B3B" />
        <path d="M60 18c3 8 3 8-1 18-4-2-6-2-8 0-3-11-2-11 9-18z" fill="#5C9F45" />
        <path d="M68 22c2 7 2 7-2 16-4-2-5-1-7 1-2-10-1-10 9-17z" fill="#4C8B3B" />
        <path
          d="M60 40c9 0 14 6 12 14L54 96c-2 6-9 6-11 0l-8-40c-2-9 6-16 15-16h10z"
          fill="url(#carrotShade)"
        />
        <g stroke="#D96A1C" strokeWidth="2" strokeLinecap="round" opacity="0.6">
          <line x1="47" y1="52" x2="52" y2="52" />
          <line x1="49" y1="62" x2="55" y2="62" />
          <line x1="51" y1="72" x2="56" y2="72" />
          <line x1="53" y1="82" x2="57" y2="82" />
        </g>
      </g>
      <defs>
        <linearGradient id="carrotShade" x1="40" y1="40" x2="75" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBA23B" />
          <stop offset="1" stopColor="#EF7E1C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TomatoIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M60 40c17 0 30 13 30 32s-13 32-30 32-30-13-30-32 13-32 30-32z"
        fill="url(#tomatoShade)"
      />
      <path
        d="M60 40c-4-4-4-10 0-14 4 4 4 10 0 14z"
        fill="#4C8B3B"
      />
      <path
        d="M42 38c4-6 12-8 18-6-2 6-8 10-14 10-2 0-3-2-4-4z"
        fill="#5C9F45"
      />
      <path
        d="M78 38c-4-6-12-8-18-6 2 6 8 10 14 10 2 0 3-2 4-4z"
        fill="#5C9F45"
      />
      <ellipse cx="50" cy="58" rx="6" ry="4" fill="#F0837D" opacity="0.7" />
      <defs>
        <linearGradient id="tomatoShade" x1="30" y1="40" x2="90" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0524A" />
          <stop offset="1" stopColor="#C81E2A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
