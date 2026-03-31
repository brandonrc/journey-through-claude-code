"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  href: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  accentColor: string;
};

export function JourneyCard({ href, title, tagline, icon, accentColor }: Props) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="relative group p-8 rounded-xl border border-border bg-bg-elevated overflow-hidden cursor-pointer"
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}15, transparent 40%)`,
          }}
        />
        <div className="relative z-10">
          <div className="text-4xl mb-4">{icon}</div>
          <h2 className="text-2xl font-bold mb-2 text-text-primary">{title}</h2>
          <p className="text-text-secondary">{tagline}</p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: accentColor }}
        />
      </motion.div>
    </Link>
  );
}
