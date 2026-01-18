"use client";

import Link from "next/link";
import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  ArrowRight,
  ArrowUp
} from "@phosphor-icons/react";

// Footer link component with hover animation
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 py-1"
    >
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
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
      <div className="relative w-9 h-9 rounded-full bg-muted/80 flex items-center justify-center group-hover:bg-background transition-colors duration-300">
        <Icon className="w-4 h-4 text-foreground" />
      </div>
    </a>
  );
}

export function EnhancedFooter() {
  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      <div className="relative container py-12 md:py-16">
        {/* Main Grid - Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 mb-10">
          {/* Brand Column - Spans 2 columns */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <img
                  src="/logo.png"
                  alt="KurdFreelance"
                  className="relative h-9 w-auto"
                />
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Connecting Kurdish talent with global opportunities. The premier freelance platform
              tailored for the Kurdistan region.
            </p>

            {/* Social Links */}
            <div className="flex gap-2 pt-1">
              <SocialIcon href="https://facebook.com" icon={FacebookLogo} label="Facebook" color="#1877F2" />
              <SocialIcon href="https://twitter.com" icon={TwitterLogo} label="Twitter" color="#1DA1F2" />
              <SocialIcon href="https://instagram.com" icon={InstagramLogo} label="Instagram" color="#E4405F" />
              <SocialIcon href="https://linkedin.com" icon={LinkedinLogo} label="LinkedIn" color="#0A66C2" />
              <SocialIcon href="https://youtube.com" icon={YoutubeLogo} label="YouTube" color="#FF0000" />
            </div>
          </div>

          {/* Link Columns - Each spans 1 column */}
          {/* For Clients */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">For Clients</h3>
            <ul className="space-y-2">
              <FooterLink href="/how-it-works">How It Works</FooterLink>
              <FooterLink href="/freelancers">Find Talent</FooterLink>
              <FooterLink href="/jobs">Post a Job</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">For Freelancers</h3>
            <ul className="space-y-2">
              <FooterLink href="/how-it-works">How It Works</FooterLink>
              <FooterLink href="/jobs">Browse Jobs</FooterLink>
              <FooterLink href="/register">Create Profile</FooterLink>
              <FooterLink href="/resources">Resources</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">Support</h3>
            <ul className="space-y-2">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright & Back to Top */}
        <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kurdlance. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm font-medium"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default EnhancedFooter;
