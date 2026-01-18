"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  Envelope,
  ArrowRight,
  ArrowUp,
  Check,
  Users,
  Briefcase,
  ProjectorScreen,
  CreditCard,
  Bank,
  Globe
} from "@phosphor-icons/react";

// Animated stats counter
function StatCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
}

// Footer link component with hover animation
function FooterLink({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 py-1"
    >
      {Icon && <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />}
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
      </span>
      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
    </Link>
  );
}

// Social media icon with hover effect
function SocialIcon({
  href,
  icon: Icon,
  label,
  color
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="relative group"
    >
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: color }}
      />
      <div className="relative w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center group-hover:bg-background transition-colors duration-300">
        <Icon className="w-5 h-5 text-foreground" />
      </div>
    </a>
  );
}

export function EnhancedFooter() {
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Newsletter submit handler
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-muted/50" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary/20 rounded-full animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-20 right-20 w-3 h-3 bg-purple-500/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-blue-500/20 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-green-500/20 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-10 right-10 w-3 h-3 bg-yellow-500/20 rounded-full animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative container py-16 md:py-20">
        {/* Top Section - Brand & Newsletter */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <img
                  src="/logo.png"
                  alt="KurdFreelance"
                  className="relative h-10 w-auto"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                KurdFreelance
              </span>
            </Link>

            <p className="text-muted-foreground leading-relaxed max-w-md">
              Connecting Kurdish talent with global opportunities. The premier freelance platform
              tailored for the Kurdistan region.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <SocialIcon href="https://facebook.com" icon={FacebookLogo} label="Facebook" color="#1877F2" />
              <SocialIcon href="https://twitter.com" icon={TwitterLogo} label="Twitter" color="#1DA1F2" />
              <SocialIcon href="https://instagram.com" icon={InstagramLogo} label="Instagram" color="#E4405F" />
              <SocialIcon href="https://linkedin.com" icon={LinkedinLogo} label="LinkedIn" color="#0A66C2" />
              <SocialIcon href="https://youtube.com" icon={YoutubeLogo} label="YouTube" color="#FF0000" />
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <div className="glass-card p-6 rounded-2xl border bg-card/50 backdrop-blur-sm">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Envelope className="w-5 h-5 text-primary" />
                Stay Updated
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest job postings, tips, and platform updates delivered to your inbox.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
                    disabled={isSubscribed}
                  />
                  {isSubscribed && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" weight="bold" />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!emailInput || isSubscribed}
                  className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isSubscribed ? (
                    <>Subscribed!</>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Middle Section - Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* For Clients */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              For Clients
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/how-it-works" icon={Globe}>How It Works</FooterLink>
              <FooterLink href="/freelancers" icon={Users}>Find Talent</FooterLink>
              <FooterLink href="/jobs" icon={Briefcase}>Post a Job</FooterLink>
              <FooterLink href="/pricing" icon={CreditCard}>Pricing</FooterLink>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              For Freelancers
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/how-it-works" icon={Globe}>How It Works</FooterLink>
              <FooterLink href="/jobs" icon={Briefcase}>Browse Jobs</FooterLink>
              <FooterLink href="/register" icon={Users}>Create Profile</FooterLink>
              <FooterLink href="/resources" icon={ProjectorScreen}>Resources</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Company
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Envelope className="w-5 h-5 text-orange-500" />
              Support
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Stats, Payment Methods & Legal */}
        <div className="border-t pt-12 space-y-8">
          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-xl bg-card/50 border">
              <div className="text-3xl font-bold text-primary mb-1">
                <StatCounter end={5000} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Freelancers</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 border">
              <div className="text-3xl font-bold text-purple-500 mb-1">
                <StatCounter end={12000} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Jobs Posted</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 border">
              <div className="text-3xl font-bold text-green-500 mb-1">
                <StatCounter end={8500} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Projects Done</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/50 border">
              <div className="text-3xl font-bold text-orange-500 mb-1">
                <StatCounter end={98} suffix="%" />
              </div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Secure Payments Via</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-background border flex items-center gap-2 hover:border-primary/50 transition-colors">
                <Bank className="w-5 h-5" />
                <span className="text-sm font-medium">FIB Bank</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-background border flex items-center gap-2 hover:border-primary/50 transition-colors">
                <Bank className="w-5 h-5" />
                <span className="text-sm font-medium">RT Bank</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-background border flex items-center gap-2 hover:border-primary/50 transition-colors">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-medium">FastPay</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-background border flex items-center gap-2 hover:border-primary/50 transition-colors">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">PayPal</span>
              </div>
            </div>
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} KurdFreelance. All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <span className="text-sm font-medium">Back to Top</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default EnhancedFooter;
