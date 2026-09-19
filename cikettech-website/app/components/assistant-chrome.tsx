import Link from "next/link";
import Image from "next/image";
import LangButton from "./LangButton";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Technology", href: "/technology" },
  { label: "Innovation", href: "/innovation" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1h-.2a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6v-.2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.3a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2 1-1.2 2" />
      <circle cx="12" cy="16.8" r="0.2" fill="currentColor" />
    </svg>
  );
}

export function AssistantHeader() {
  return (
    <header className="assistant-header">
      <Link href="/" className="assistant-logo" aria-label="CIKETTECH home">
        <Image src="/cikettech-logo-mark.svg" alt="CIKETTECH" width={48} height={48} priority />
      </Link>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="assistant-header-actions">
        <LangButton className="icon-btn" />
        <button className="icon-btn" aria-label="Settings">
          <GearIcon />
        </button>
        <button className="icon-btn" aria-label="Help">
          <HelpIcon />
        </button>
        <Link className="quote-button" href="/contact">
          Request Quote
        </Link>
      </div>
    </header>
  );
}

export function AssistantFooter() {
  return (
    <footer className="assistant-footer">
      <span>&copy; 2024 CIKETTECH AI. Built for precision.</span>
      <nav>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
        <Link href="/security">Security</Link>
        <Link href="/status">Status</Link>
      </nav>
    </footer>
  );
}
