"use client";

import { Shield, LockKey, CurrencyDollar, Globe, Clock, Trophy, IconProps } from "@phosphor-icons/react";

export function TrustShieldIllustration() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-80 h-80 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-green-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Orbiting rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full border border-dashed border-primary/20 animate-spin-slow" />
        {/* Middle ring */}
        <div className="absolute w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full border border-primary/10" />
        {/* Inner ring */}
        <div className="absolute w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full border border-primary/5" />
      </div>

      {/* Orbiting icons with RNA wave motion - 6 icons evenly spaced at 60° intervals */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] animate-orbit">
          {/* Icon 1 - 0° (Top) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-orbit-wave animate-counter-orbit" style={{ animationDelay: '0s' }}>
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-blue-500" weight="duotone" />
            </div>
          </div>

          {/* Icon 2 - 60° (Top Right) - cos(30°)=0.866, sin(30°)=0.5 from center */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: '25%', left: '93.3%' }}>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-orbit-wave animate-counter-orbit" style={{ animationDelay: '0.5s' }}>
              <LockKey className="w-6 h-6 md:w-7 md:h-7 text-purple-500" weight="duotone" />
            </div>
          </div>

          {/* Icon 3 - 120° (Bottom Right) */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: '75%', left: '93.3%' }}>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-orbit-wave animate-counter-orbit" style={{ animationDelay: '1s' }}>
              <CurrencyDollar className="w-6 h-6 md:w-7 md:h-7 text-green-500" weight="duotone" />
            </div>
          </div>

          {/* Icon 4 - 180° (Bottom) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-orbit-wave animate-counter-orbit" style={{ animationDelay: '1.5s' }}>
              <Globe className="w-6 h-6 md:w-7 md:h-7 text-cyan-500" weight="duotone" />
            </div>
          </div>

          {/* Icon 5 - 240° (Bottom Left) */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: '75%', left: '6.7%' }}>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-orbit-wave animate-counter-orbit" style={{ animationDelay: '2s' }}>
              <Clock className="w-6 h-6 md:w-7 md:h-7 text-orange-500" weight="duotone" />
            </div>
          </div>

          {/* Icon 6 - 300° (Top Left) */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: '25%', left: '6.7%' }}>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card border shadow-lg flex items-center justify-center animate-orbit-wave animate-counter-orbit" style={{ animationDelay: '2.5s' }}>
              <Trophy className="w-6 h-6 md:w-7 md:h-7 text-yellow-500" weight="duotone" />
            </div>
          </div>
        </div>
      </div>

      {/* Central Shield */}
      <div className="relative z-10">
        {/* Glow rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-xl animate-pulse-slow" />
        </div>
        
        {/* Shield SVG */}
        <svg viewBox="0 0 120 140" className="w-28 h-32 md:w-36 md:h-40 relative z-10 drop-shadow-2xl">
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="shieldInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            <filter id="shieldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer shield shape */}
          <path 
            d="M60 5 L110 25 L110 70 C110 100 60 135 60 135 C60 135 10 100 10 70 L10 25 Z" 
            fill="url(#shieldGradient)"
            filter="url(#shieldGlow)"
          />
          
          {/* Inner shield shape */}
          <path 
            d="M60 15 L100 32 L100 68 C100 92 60 120 60 120 C60 120 20 92 20 68 L20 32 Z" 
            fill="url(#shieldInner)"
          />
          
          {/* Checkmark */}
          <path 
            d="M40 70 L55 85 L85 50" 
            stroke="white" 
            strokeWidth="8" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="animate-draw-check"
          />
          
          {/* Shine effect */}
          <path 
            d="M30 30 L40 25 L35 40 Z" 
            fill="white" 
            opacity="0.3"
          />
        </svg>
        
        {/* "Protected" badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Protected
          </span>
        </div>
      </div>
    </div>
  );
}

// Feature card component with hover effects
interface TrustFeatureCardProps {
  icon: React.ComponentType<IconProps>;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

export function TrustFeatureCard({ icon: Icon, title, description, color, delay = 0 }: TrustFeatureCardProps) {
  const colorClasses: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-500", border: "group-hover:border-blue-500/50", glow: "group-hover:shadow-blue-500/10" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-500", border: "group-hover:border-purple-500/50", glow: "group-hover:shadow-purple-500/10" },
    green: { bg: "bg-green-500/10", text: "text-green-500", border: "group-hover:border-green-500/50", glow: "group-hover:shadow-green-500/10" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "group-hover:border-cyan-500/50", glow: "group-hover:shadow-cyan-500/10" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-500", border: "group-hover:border-orange-500/50", glow: "group-hover:shadow-orange-500/10" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "group-hover:border-yellow-500/50", glow: "group-hover:shadow-yellow-500/10" },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div 
      className={`group relative p-6 rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${colors.border} ${colors.glow}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`w-7 h-7 ${colors.text}`} weight="duotone" />
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      
      {/* Hover gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
    </div>
  );
}

// Stats component
interface TrustStatProps {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function TrustStat({ value, label, icon: Icon }: TrustStatProps) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <div className="text-xl md:text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
