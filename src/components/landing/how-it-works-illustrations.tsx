"use client";

// Step 1: Profile Creation Illustration
export function ProfileIllustration() {
  return (
    <div className="relative w-full h-[320px] md:h-[400px]">
      {/* Background gradient blob */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-64 h-64 bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent rounded-full blur-3xl" />
      </div>
      
      <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main profile card - glassmorphism effect */}
        <g className="animate-float-slow">
          <rect x="120" y="100" width="160" height="200" rx="16" 
            className="fill-card stroke-border" strokeWidth="1"/>
          
          {/* Avatar circle */}
          <circle cx="200" cy="160" r="40" fill="url(#profileGradient)" />
          <circle cx="200" cy="160" r="35" className="fill-muted" />
          {/* User icon in avatar */}
          <path d="M200 150 a8 8 0 1 0 0 -16 a8 8 0 0 0 0 16 M185 175 a15 15 0 0 1 30 0" 
            className="stroke-muted-foreground" strokeWidth="2" fill="none" strokeLinecap="round"/>
          
          {/* Name placeholder */}
          <rect x="155" y="210" width="90" height="10" rx="5" className="fill-muted" />
          
          {/* Title placeholder */}
          <rect x="165" y="228" width="70" height="8" rx="4" className="fill-muted/60" />
          
          {/* Verification badge */}
          <circle cx="245" cy="130" r="14" fill="#22c55e" filter="url(#glow)"/>
          <path d="M240 130 l4 4 l8 -8" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        
        {/* Floating skill tags */}
        <g className="animate-float-delayed">
          {/* React tag */}
          <rect x="60" y="140" width="55" height="26" rx="13" className="fill-blue-500/20 stroke-blue-500/40" strokeWidth="1"/>
          <text x="87" y="158" className="fill-blue-500 text-[11px] font-medium" textAnchor="middle">React</text>
        </g>
        
        <g className="animate-float">
          {/* Design tag */}
          <rect x="285" y="160" width="60" height="26" rx="13" className="fill-purple-500/20 stroke-purple-500/40" strokeWidth="1"/>
          <text x="315" y="178" className="fill-purple-500 text-[11px] font-medium" textAnchor="middle">Design</text>
        </g>
        
        <g className="animate-float-slow">
          {/* Node.js tag */}
          <rect x="70" y="220" width="50" height="26" rx="13" className="fill-green-500/20 stroke-green-500/40" strokeWidth="1"/>
          <text x="95" y="238" className="fill-green-500 text-[11px] font-medium" textAnchor="middle">Node</text>
        </g>
        
        <g className="animate-float-delayed">
          {/* UI/UX tag */}
          <rect x="295" y="230" width="50" height="26" rx="13" className="fill-orange-500/20 stroke-orange-500/40" strokeWidth="1"/>
          <text x="320" y="248" className="fill-orange-500 text-[11px] font-medium" textAnchor="middle">UI/UX</text>
        </g>
        
        {/* Portfolio thumbnails */}
        <g className="animate-float">
          <rect x="55" y="280" width="50" height="40" rx="8" className="fill-card stroke-border" strokeWidth="1"/>
          <rect x="60" y="285" width="40" height="25" rx="4" className="fill-gradient-to-br from-pink-500/30 to-purple-500/30" />
        </g>
        
        <g className="animate-float-delayed">
          <rect x="295" y="290" width="50" height="40" rx="8" className="fill-card stroke-border" strokeWidth="1"/>
          <rect x="300" y="295" width="40" height="25" rx="4" className="fill-gradient-to-br from-blue-500/30 to-cyan-500/30" />
        </g>
        
        {/* Progress bar at bottom */}
        <g>
          <rect x="140" y="320" width="120" height="6" rx="3" className="fill-muted" />
          <rect x="140" y="320" width="90" height="6" rx="3" fill="url(#profileGradient)" />
          <text x="200" y="345" className="fill-muted-foreground text-[10px]" textAnchor="middle">75% Complete</text>
        </g>
        
        {/* Decorative dots */}
        <circle cx="50" cy="120" r="4" className="fill-blue-500/30" />
        <circle cx="350" cy="140" r="3" className="fill-purple-500/30" />
        <circle cx="340" cy="340" r="5" className="fill-green-500/20" />
        <circle cx="60" cy="350" r="4" className="fill-blue-500/20" />
      </svg>
    </div>
  );
}

// Step 2: Find Opportunities Illustration
export function DiscoveryIllustration() {
  return (
    <div className="relative w-full h-[320px] md:h-[400px]">
      {/* Background gradient blob */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-64 h-64 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-transparent rounded-full blur-3xl" />
      </div>
      
      <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>
        
        {/* Search bar */}
        <g className="animate-float-slow">
          <rect x="80" y="80" width="240" height="50" rx="25" className="fill-card stroke-border" strokeWidth="1.5"/>
          <circle cx="115" cy="105" r="12" className="stroke-muted-foreground" strokeWidth="2" fill="none"/>
          <line x1="123" y1="113" x2="130" y2="120" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round"/>
          <rect x="145" y="98" width="100" height="14" rx="7" className="fill-muted/60" />
          <rect x="270" y="93" width="35" height="24" rx="12" fill="url(#purpleGradient)" />
        </g>
        
        {/* Job Card 1 - Main */}
        <g className="animate-float">
          <rect x="100" y="160" width="200" height="100" rx="12" className="fill-card stroke-border" strokeWidth="1"/>
          {/* Company logo placeholder */}
          <rect x="115" y="175" width="35" height="35" rx="8" fill="url(#purpleGradient)" opacity="0.2"/>
          <circle cx="132" cy="192" r="10" fill="url(#purpleGradient)" opacity="0.5"/>
          {/* Job title */}
          <rect x="160" y="178" width="120" height="12" rx="6" className="fill-foreground/80" />
          {/* Company name */}
          <rect x="160" y="196" width="80" height="8" rx="4" className="fill-muted-foreground/50" />
          {/* Tags */}
          <rect x="115" y="225" width="45" height="20" rx="10" className="fill-purple-500/20" />
          <rect x="165" y="225" width="55" height="20" rx="10" className="fill-blue-500/20" />
          <rect x="225" y="225" width="50" height="20" rx="10" className="fill-green-500/20" />
        </g>
        
        {/* Match badge */}
        <g className="animate-pulse-slow">
          <rect x="260" y="150" width="55" height="24" rx="12" fill="url(#matchGradient)" />
          <text x="287" y="166" className="fill-white text-[10px] font-bold" textAnchor="middle">95%</text>
        </g>
        
        {/* Job Card 2 - Floating behind */}
        <g className="animate-float-delayed" opacity="0.6">
          <rect x="60" y="200" width="160" height="80" rx="10" className="fill-card stroke-border" strokeWidth="1"/>
          <rect x="75" y="215" width="25" height="25" rx="6" className="fill-muted" />
          <rect x="110" y="218" width="90" height="10" rx="5" className="fill-muted" />
          <rect x="110" y="232" width="60" height="8" rx="4" className="fill-muted/60" />
        </g>
        
        {/* Job Card 3 - Floating behind */}
        <g className="animate-float-slow" opacity="0.4">
          <rect x="200" y="240" width="160" height="80" rx="10" className="fill-card stroke-border" strokeWidth="1"/>
          <rect x="215" y="255" width="25" height="25" rx="6" className="fill-muted" />
          <rect x="250" y="258" width="90" height="10" rx="5" className="fill-muted" />
          <rect x="250" y="272" width="60" height="8" rx="4" className="fill-muted/60" />
        </g>
        
        {/* Notification bell */}
        <g className="animate-float">
          <circle cx="340" cy="100" r="22" className="fill-card stroke-border" strokeWidth="1"/>
          <path d="M340 90 a8 8 0 0 1 8 8 v6 h-16 v-6 a8 8 0 0 1 8 -8" className="stroke-purple-500" strokeWidth="2" fill="none"/>
          <line x1="340" y1="104" x2="340" y2="108" className="stroke-purple-500" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="333" cy="112" r="2" className="fill-purple-500"/>
          <circle cx="347" cy="112" r="2" className="fill-purple-500"/>
          {/* Notification dot */}
          <circle cx="352" cy="88" r="6" className="fill-red-500 animate-pulse" />
          <text x="352" y="92" className="fill-white text-[9px] font-bold" textAnchor="middle">3</text>
        </g>
        
        {/* Connection lines */}
        <g className="opacity-30">
          <line x1="300" y1="170" x2="340" y2="120" className="stroke-purple-500" strokeWidth="1" strokeDasharray="4 4"/>
          <line x1="200" y1="260" x2="150" y2="320" className="stroke-purple-500" strokeWidth="1" strokeDasharray="4 4"/>
        </g>
        
        {/* Decorative elements */}
        <circle cx="50" cy="150" r="5" className="fill-purple-500/30" />
        <circle cx="380" cy="200" r="4" className="fill-purple-500/20" />
        <circle cx="70" cy="320" r="6" className="fill-blue-500/20" />
      </svg>
    </div>
  );
}

// Step 3: Payment Illustration
export function PaymentIllustration() {
  return (
    <div className="relative w-full h-[320px] md:h-[400px]">
      {/* Background gradient blob */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-64 h-64 bg-gradient-to-br from-green-500/20 via-green-400/10 to-transparent rounded-full blur-3xl" />
      </div>
      
      <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        
        {/* Central shield */}
        <g className="animate-float-slow">
          <path d="M200 90 L275 125 L275 200 C275 255 200 295 200 295 C200 295 125 255 125 200 L125 125 Z"
            fill="url(#greenGradient)" opacity="0.2" className="stroke-green-500" strokeWidth="2"/>
          <path d="M200 110 L260 138 L260 195 C260 240 200 270 200 270 C200 270 140 240 140 195 L140 138 Z"
            fill="url(#greenGradient)" />
          {/* Checkmark */}
          <path d="M175 185 L192 202 L228 165" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        
        {/* Floating coins */}
        <g className="animate-float">
          <circle cx="80" cy="150" r="20" fill="url(#goldGradient)" />
          <text x="80" y="156" className="fill-yellow-900 text-[14px] font-bold" textAnchor="middle">$</text>
        </g>
        
        <g className="animate-float-delayed">
          <circle cx="320" cy="170" r="18" fill="url(#goldGradient)" />
          <text x="320" y="176" className="fill-yellow-900 text-[12px] font-bold" textAnchor="middle">$</text>
        </g>
        
        <g className="animate-float-slow">
          <circle cx="100" cy="280" r="15" fill="url(#goldGradient)" />
          <text x="100" y="285" className="fill-yellow-900 text-[10px] font-bold" textAnchor="middle">$</text>
        </g>
        
        <g className="animate-float">
          <circle cx="300" cy="300" r="16" fill="url(#goldGradient)" />
          <text x="300" y="305" className="fill-yellow-900 text-[11px] font-bold" textAnchor="middle">$</text>
        </g>
        
        {/* Wallet card */}
        <g className="animate-float-delayed">
          <rect x="50" y="200" width="90" height="60" rx="10" className="fill-card stroke-border" strokeWidth="1"/>
          <rect x="60" y="215" width="40" height="8" rx="4" fill="url(#greenGradient)" />
          <rect x="60" y="230" width="70" height="6" rx="3" className="fill-muted" />
          <rect x="60" y="242" width="50" height="6" rx="3" className="fill-muted/60" />
        </g>
        
        {/* Bank icon */}
        <g className="animate-float">
          <rect x="280" y="220" width="70" height="55" rx="8" className="fill-card stroke-border" strokeWidth="1"/>
          {/* Bank building */}
          <path d="M315 235 L295 245 L335 245 Z" className="fill-green-500/30" />
          <rect x="300" y="245" width="8" height="15" className="fill-green-500/20" />
          <rect x="312" y="245" width="8" height="15" className="fill-green-500/20" />
          <rect x="324" y="245" width="8" height="15" className="fill-green-500/20" />
          <rect x="295" y="260" width="40" height="4" className="fill-green-500/30" />
        </g>
        
        {/* Success transaction badge */}
        <g className="animate-pulse-slow">
          <rect x="155" y="310" width="90" height="32" rx="16" fill="url(#greenGradient)" />
          <circle cx="172" cy="326" r="8" fill="white" opacity="0.3"/>
          <path d="M169 326 L172 329 L178 323" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <text x="210" y="331" className="fill-white text-[11px] font-medium" textAnchor="middle">Paid!</text>
        </g>
        
        {/* Confetti/celebration elements */}
        <g className="animate-float">
          <rect x="120" y="80" width="8" height="8" rx="1" className="fill-yellow-400" transform="rotate(15 124 84)"/>
          <rect x="270" y="90" width="6" height="6" rx="1" className="fill-green-400" transform="rotate(-20 273 93)"/>
          <rect x="90" y="120" width="5" height="5" rx="1" className="fill-blue-400" transform="rotate(30 92 122)"/>
          <rect x="320" y="130" width="7" height="7" rx="1" className="fill-purple-400" transform="rotate(-10 323 133)"/>
        </g>
        
        {/* Sparkles */}
        <g className="animate-pulse-slow">
          <path d="M340 80 L343 88 L351 88 L345 93 L348 101 L340 96 L332 101 L335 93 L329 88 L337 88 Z" className="fill-yellow-400"/>
          <path d="M60 90 L62 95 L67 95 L63 98 L65 103 L60 100 L55 103 L57 98 L53 95 L58 95 Z" className="fill-green-400" transform="scale(0.7) translate(30 50)"/>
        </g>
        
        {/* Handshake */}
        <g className="animate-float-slow" opacity="0.8">
          <circle cx="200" cy="370" r="20" className="fill-green-500/10 stroke-green-500/30" strokeWidth="1"/>
          <path d="M190 370 C195 365 205 365 210 370 M190 370 L185 375 M210 370 L215 375" 
            className="stroke-green-500" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
        
        {/* Decorative dots */}
        <circle cx="50" cy="320" r="4" className="fill-green-500/30" />
        <circle cx="360" cy="250" r="5" className="fill-green-500/20" />
      </svg>
    </div>
  );
}
