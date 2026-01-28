"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm font-body">
      <Link
        href="/menu"
        className="inline-flex items-center gap-1 text-[var(--yume-miso)] hover:text-[var(--yume-charcoal)] transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back to Menu</span>
      </Link>
      
      <span className="text-[var(--yume-miso)] hidden sm:inline">/</span>
      
      {items.map((item, index) => (
        <span key={index} className="hidden sm:flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="text-[var(--yume-miso)] hover:text-[var(--yume-charcoal)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--yume-charcoal)] font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight size={14} className="text-[var(--yume-miso)]" />
          )}
        </span>
      ))}
    </nav>
  );
}