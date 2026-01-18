"use client";

// Web & App Development - Browser + Phone mockup
export function DevIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full" fill="none">
      {/* Browser Window */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        <rect x="10" y="15" width="110" height="80" rx="6" fill={`${color}10`} stroke={`${color}40`} strokeWidth="1.5" />
        {/* Browser top bar */}
        <rect x="10" y="15" width="110" height="14" rx="6" fill={`${color}15`} />
        <circle cx="22" cy="22" r="3" fill="#EF4444" fillOpacity="0.6" />
        <circle cx="32" cy="22" r="3" fill="#F59E0B" fillOpacity="0.6" />
        <circle cx="42" cy="22" r="3" fill="#22C55E" fillOpacity="0.6" />
        {/* URL bar */}
        <rect x="52" y="19" width="60" height="6" rx="3" fill={`${color}20`} />
        {/* Content blocks */}
        <rect x="18" y="38" width="30" height="20" rx="3" fill={`${color}25`} />
        <rect x="54" y="38" width="58" height="8" rx="2" fill={`${color}15`} />
        <rect x="54" y="50" width="45" height="8" rx="2" fill={`${color}10`} />
        <rect x="18" y="64" width="94" height="6" rx="2" fill={`${color}10`} />
        <rect x="18" y="74" width="70" height="6" rx="2" fill={`${color}08`} />
        <rect x="18" y="84" width="50" height="4" rx="1" fill={`${color}08`} />
      </g>

      {/* Phone */}
      <g className="animate-float" style={{ animationDelay: "0.3s" }}>
        <rect x="135" y="25" width="50" height="90" rx="8" fill={`${color}10`} stroke={`${color}40`} strokeWidth="1.5" />
        {/* Phone notch */}
        <rect x="152" y="30" width="16" height="4" rx="2" fill={`${color}20`} />
        {/* App UI */}
        <rect x="142" y="42" width="36" height="10" rx="3" fill={`${color}25`} />
        <rect x="142" y="56" width="36" height="20" rx="3" fill={`${color}15`} />
        <rect x="142" y="80" width="20" height="6" rx="2" fill={`${color}20`} />
        <rect x="142" y="90" width="36" height="4" rx="1" fill={`${color}10`} />
        <rect x="142" y="98" width="28" height="4" rx="1" fill={`${color}08`} />
        {/* Home indicator */}
        <rect x="152" y="107" width="16" height="3" rx="1.5" fill={`${color}30`} />
      </g>

      {/* Floating code symbols */}
      <text x="85" y="125" fontSize="14" fill={color} fillOpacity="0.4" fontFamily="monospace" className="animate-float" style={{ animationDelay: "0.6s" }}>{"{ }"}</text>
      <text x="145" y="18" fontSize="10" fill={color} fillOpacity="0.3" fontFamily="monospace" className="animate-float" style={{ animationDelay: "0.9s" }}>{"</>"}</text>
    </svg>
  );
}

// Design & Creative - Artboard + shapes
export function DesignIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" fill="none">
      {/* Artboard */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        <rect x="15" y="10" width="70" height="55" rx="4" fill={`${color}08`} stroke={`${color}30`} strokeWidth="1.5" />
        {/* Shapes on canvas */}
        <circle cx="35" cy="32" r="12" fill={`${color}30`} />
        <rect x="52" y="22" width="20" height="20" rx="2" fill={`${color}20`} />
        <polygon points="45,55 55,40 65,55" fill={`${color}25`} />
      </g>
      
      {/* Pen cursor */}
      <g className="animate-float" style={{ animationDelay: "0.4s" }}>
        <path d="M90 20 L95 25 L80 45 L75 45 L75 40 Z" fill={color} fillOpacity="0.5" />
        <path d="M75 45 L73 52 L80 45" fill={color} fillOpacity="0.3" />
      </g>

      {/* Color palette dots */}
      <g className="animate-float" style={{ animationDelay: "0.2s" }}>
        <circle cx="20" cy="78" r="5" fill="#EF4444" fillOpacity="0.6" />
        <circle cx="34" cy="78" r="5" fill="#F59E0B" fillOpacity="0.6" />
        <circle cx="48" cy="78" r="5" fill="#22C55E" fillOpacity="0.6" />
        <circle cx="62" cy="78" r="5" fill="#3B82F6" fillOpacity="0.6" />
        <circle cx="76" cy="78" r="5" fill={color} fillOpacity="0.6" />
      </g>

      {/* Floating sparkle */}
      <g className="animate-float" style={{ animationDelay: "0.6s" }}>
        <path d="M100 60 L102 65 L107 65 L103 68 L105 73 L100 70 L95 73 L97 68 L93 65 L98 65 Z" fill={color} fillOpacity="0.3" />
      </g>
    </svg>
  );
}

// Writing & Translation - Document + languages
export function WritingIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" fill="none">
      {/* Document */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        <rect x="20" y="8" width="55" height="70" rx="4" fill={`${color}08`} stroke={`${color}30`} strokeWidth="1.5" />
        {/* Folded corner */}
        <path d="M63 8 L75 8 L75 20 L63 20 Z" fill={`${color}15`} />
        <path d="M63 8 L63 20 L75 20" stroke={`${color}30`} strokeWidth="1" fill="none" />
        {/* Text lines */}
        <rect x="28" y="28" width="40" height="4" rx="1" fill={`${color}25`} />
        <rect x="28" y="36" width="35" height="4" rx="1" fill={`${color}20`} />
        <rect x="28" y="44" width="38" height="4" rx="1" fill={`${color}15`} />
        <rect x="28" y="52" width="28" height="4" rx="1" fill={`${color}15`} />
        <rect x="28" y="60" width="32" height="4" rx="1" fill={`${color}10`} />
        <rect x="28" y="68" width="20" height="3" rx="1" fill={`${color}10`} />
      </g>

      {/* Translation symbol A → ب */}
      <g className="animate-float" style={{ animationDelay: "0.3s" }}>
        <text x="82" y="45" fontSize="14" fill={color} fillOpacity="0.6" fontWeight="bold">A</text>
        <path d="M92 42 L100 42 M98 40 L100 42 L98 44" stroke={color} strokeOpacity="0.5" strokeWidth="1.5" fill="none" />
        <text x="102" y="45" fontSize="14" fill={color} fillOpacity="0.6" fontWeight="bold" fontFamily="Arial">ب</text>
      </g>

      {/* Pencil */}
      <g className="animate-float" style={{ animationDelay: "0.5s" }}>
        <rect x="85" y="60" width="25" height="6" rx="1" fill={color} fillOpacity="0.3" transform="rotate(-30 97 63)" />
        <polygon points="82,72 85,65 88,68" fill={color} fillOpacity="0.4" />
      </g>
    </svg>
  );
}

// Digital Marketing - Charts + target
export function MarketingIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" fill="none">
      {/* Chart container */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        <rect x="15" y="15" width="65" height="50" rx="4" fill={`${color}08`} stroke={`${color}30`} strokeWidth="1.5" />
        {/* Bar chart */}
        <rect x="25" y="45" width="8" height="15" rx="2" fill={`${color}30`} />
        <rect x="38" y="38" width="8" height="22" rx="2" fill={`${color}40`} />
        <rect x="51" y="30" width="8" height="30" rx="2" fill={`${color}50`} />
        <rect x="64" y="25" width="8" height="35" rx="2" fill={color} fillOpacity="0.6" />
        {/* Trend line */}
        <path d="M25 48 L38 40 L51 32 L68 24" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
        <circle cx="68" cy="24" r="3" fill={color} fillOpacity="0.8" />
      </g>

      {/* Target */}
      <g className="animate-float" style={{ animationDelay: "0.4s" }}>
        <circle cx="95" cy="35" r="18" fill="none" stroke={`${color}30`} strokeWidth="2" />
        <circle cx="95" cy="35" r="12" fill="none" stroke={`${color}40`} strokeWidth="2" />
        <circle cx="95" cy="35" r="6" fill="none" stroke={`${color}50`} strokeWidth="2" />
        <circle cx="95" cy="35" r="2" fill={color} fillOpacity="0.7" />
      </g>

      {/* Growth arrow */}
      <g className="animate-float" style={{ animationDelay: "0.2s" }}>
        <path d="M30 78 L55 78" stroke={`${color}40`} strokeWidth="2" strokeLinecap="round" />
        <path d="M55 78 L80 68" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M75 65 L82 68 L78 75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity="0.6" />
      </g>
    </svg>
  );
}

// Video & Animation - Player + film
export function VideoIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" fill="none">
      {/* Video player */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        <rect x="15" y="12" width="70" height="45" rx="4" fill={`${color}10`} stroke={`${color}30`} strokeWidth="1.5" />
        {/* Play button */}
        <circle cx="50" cy="34" r="12" fill={`${color}20`} />
        <polygon points="46,28 46,40 58,34" fill={color} fillOpacity="0.6" />
        {/* Progress bar */}
        <rect x="20" y="50" width="60" height="3" rx="1.5" fill={`${color}15`} />
        <rect x="20" y="50" width="35" height="3" rx="1.5" fill={color} fillOpacity="0.5" />
        <circle cx="55" cy="51.5" r="4" fill={color} fillOpacity="0.7" />
      </g>

      {/* Film strip */}
      <g className="animate-float" style={{ animationDelay: "0.3s" }}>
        <rect x="15" y="65" width="90" height="18" rx="2" fill={`${color}15`} />
        {/* Film frames */}
        <rect x="20" y="68" width="12" height="12" rx="1" fill={`${color}30`} />
        <rect x="36" y="68" width="12" height="12" rx="1" fill={`${color}25`} />
        <rect x="52" y="68" width="12" height="12" rx="1" fill={`${color}35`} />
        <rect x="68" y="68" width="12" height="12" rx="1" fill={`${color}25`} />
        <rect x="84" y="68" width="12" height="12" rx="1" fill={`${color}30`} />
        {/* Sprocket holes */}
        <circle cx="17" cy="68" r="1.5" fill={`${color}40`} />
        <circle cx="17" cy="80" r="1.5" fill={`${color}40`} />
        <circle cx="103" cy="68" r="1.5" fill={`${color}40`} />
        <circle cx="103" cy="80" r="1.5" fill={`${color}40`} />
      </g>

      {/* Clapperboard */}
      <g className="animate-float" style={{ animationDelay: "0.5s" }}>
        <rect x="88" y="15" width="22" height="18" rx="2" fill={`${color}25`} />
        <rect x="88" y="10" width="22" height="8" rx="2" fill={color} fillOpacity="0.4" />
        <line x1="90" y1="10" x2="95" y2="18" stroke={`${color}60`} strokeWidth="2" />
        <line x1="97" y1="10" x2="102" y2="18" stroke={`${color}60`} strokeWidth="2" />
        <line x1="104" y1="10" x2="109" y2="18" stroke={`${color}60`} strokeWidth="2" />
      </g>
    </svg>
  );
}

// Business Consulting - Charts + handshake
export function BusinessIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" fill="none">
      {/* Presentation board */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        <rect x="20" y="10" width="50" height="38" rx="3" fill={`${color}08`} stroke={`${color}30`} strokeWidth="1.5" />
        {/* Pie chart */}
        <circle cx="45" cy="30" r="12" fill={`${color}15`} />
        <path d="M45 30 L45 18 A12 12 0 0 1 56 26 Z" fill={`${color}40`} />
        <path d="M45 30 L56 26 A12 12 0 0 1 50 41 Z" fill={color} fillOpacity="0.5" />
        {/* Stand */}
        <line x1="45" y1="48" x2="45" y2="58" stroke={`${color}40`} strokeWidth="2" />
        <line x1="35" y1="58" x2="55" y2="58" stroke={`${color}40`} strokeWidth="2" />
      </g>

      {/* Handshake */}
      <g className="animate-float" style={{ animationDelay: "0.3s" }}>
        <path d="M80 35 Q85 30 92 32 L100 38 Q102 42 98 45 L88 50 Q82 52 78 48 L75 42 Q74 38 80 35" fill={`${color}25`} stroke={`${color}50`} strokeWidth="1.5" />
        <path d="M92 32 L88 28 Q84 26 80 30" stroke={`${color}40`} strokeWidth="1.5" fill="none" />
        <path d="M78 48 L82 54" stroke={`${color}40`} strokeWidth="1.5" />
      </g>

      {/* Documents */}
      <g className="animate-float" style={{ animationDelay: "0.5s" }}>
        <rect x="75" y="60" width="28" height="22" rx="2" fill={`${color}10`} stroke={`${color}30`} strokeWidth="1" />
        <rect x="80" y="65" width="18" height="2" rx="1" fill={`${color}30`} />
        <rect x="80" y="70" width="14" height="2" rx="1" fill={`${color}20`} />
        <rect x="80" y="75" width="16" height="2" rx="1" fill={`${color}15`} />
      </g>
    </svg>
  );
}

// AI & Data Science - Neural network + data
export function AIIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 280 90" className="w-full h-full" fill="none">
      {/* Neural Network */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        {/* Input layer */}
        <circle cx="30" cy="25" r="6" fill={`${color}30`} stroke={`${color}50`} strokeWidth="1.5" />
        <circle cx="30" cy="45" r="6" fill={`${color}30`} stroke={`${color}50`} strokeWidth="1.5" />
        <circle cx="30" cy="65" r="6" fill={`${color}30`} stroke={`${color}50`} strokeWidth="1.5" />
        
        {/* Hidden layer */}
        <circle cx="70" cy="20" r="6" fill={`${color}40`} stroke={`${color}60`} strokeWidth="1.5" />
        <circle cx="70" cy="45" r="6" fill={`${color}40`} stroke={`${color}60`} strokeWidth="1.5" />
        <circle cx="70" cy="70" r="6" fill={`${color}40`} stroke={`${color}60`} strokeWidth="1.5" />
        
        {/* Output layer */}
        <circle cx="110" cy="35" r="6" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.5" strokeOpacity="0.7" />
        <circle cx="110" cy="55" r="6" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.5" strokeOpacity="0.7" />
        
        {/* Connections */}
        <line x1="36" y1="25" x2="64" y2="20" stroke={`${color}30`} strokeWidth="1" />
        <line x1="36" y1="25" x2="64" y2="45" stroke={`${color}30`} strokeWidth="1" />
        <line x1="36" y1="45" x2="64" y2="20" stroke={`${color}30`} strokeWidth="1" />
        <line x1="36" y1="45" x2="64" y2="45" stroke={`${color}30`} strokeWidth="1" />
        <line x1="36" y1="45" x2="64" y2="70" stroke={`${color}30`} strokeWidth="1" />
        <line x1="36" y1="65" x2="64" y2="45" stroke={`${color}30`} strokeWidth="1" />
        <line x1="36" y1="65" x2="64" y2="70" stroke={`${color}30`} strokeWidth="1" />
        
        <line x1="76" y1="20" x2="104" y2="35" stroke={`${color}40`} strokeWidth="1" />
        <line x1="76" y1="20" x2="104" y2="55" stroke={`${color}40`} strokeWidth="1" />
        <line x1="76" y1="45" x2="104" y2="35" stroke={`${color}40`} strokeWidth="1" />
        <line x1="76" y1="45" x2="104" y2="55" stroke={`${color}40`} strokeWidth="1" />
        <line x1="76" y1="70" x2="104" y2="35" stroke={`${color}40`} strokeWidth="1" />
        <line x1="76" y1="70" x2="104" y2="55" stroke={`${color}40`} strokeWidth="1" />
      </g>

      {/* Data flow visualization */}
      <g className="animate-float" style={{ animationDelay: "0.3s" }}>
        <rect x="145" y="20" width="25" height="50" rx="3" fill={`${color}15`} stroke={`${color}30`} strokeWidth="1.5" />
        {/* Data bars */}
        <rect x="150" y="28" width="15" height="6" rx="1" fill={`${color}40`} />
        <rect x="150" y="38" width="10" height="6" rx="1" fill={`${color}30`} />
        <rect x="150" y="48" width="13" height="6" rx="1" fill={`${color}35`} />
        <rect x="150" y="58" width="8" height="6" rx="1" fill={`${color}25`} />
        
        {/* Arrow */}
        <path d="M175 45 L190 45 M186 41 L190 45 L186 49" stroke={color} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
        
        {/* Processed data */}
        <rect x="195" y="25" width="30" height="40" rx="3" fill={`${color}10`} stroke={`${color}40`} strokeWidth="1.5" />
        <circle cx="210" cy="38" r="8" fill={`${color}30`} />
        <path d="M206 38 L209 42 L216 34" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
        <rect x="200" y="52" width="20" height="4" rx="1" fill={`${color}25`} />
      </g>

      {/* Binary code floating */}
      <g className="animate-float" style={{ animationDelay: "0.6s" }}>
        <text x="240" y="30" fontSize="10" fill={color} fillOpacity="0.3" fontFamily="monospace">01</text>
        <text x="250" y="45" fontSize="10" fill={color} fillOpacity="0.25" fontFamily="monospace">10</text>
        <text x="242" y="60" fontSize="10" fill={color} fillOpacity="0.2" fontFamily="monospace">11</text>
      </g>

      {/* Sparkles */}
      <g className="animate-float" style={{ animationDelay: "0.4s" }}>
        <path d="M130 15 L132 20 L137 20 L133 23 L135 28 L130 25 L125 28 L127 23 L123 20 L128 20 Z" fill={color} fillOpacity="0.25" />
      </g>
      <g className="animate-float" style={{ animationDelay: "0.8s" }}>
        <path d="M260 70 L261 73 L264 73 L262 75 L263 78 L260 76 L257 78 L258 75 L256 73 L259 73 Z" fill={color} fillOpacity="0.2" />
      </g>
    </svg>
  );
}
