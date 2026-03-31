"use client";

import { useMemo } from "react";

type Quote = {
  text: string;
  author: string;
  delay: number;
  duration: number;
  top: string;
};

const defaultQuotes: Quote[] = [
  { text: "\"Know thyself\"", author: "— Socrates", delay: 0, duration: 40, top: "15%" },
  { text: "\"I am what I choose to become\"", author: "— Jung", delay: 15, duration: 42, top: "50%" },
  { text: "\"To find yourself, think for yourself\"", author: "— Socrates", delay: 30, duration: 45, top: "25%" },
  { text: "\"Become who you truly are\"", author: "— Jung", delay: 45, duration: 40, top: "65%" },
  { text: "\"The self is well hidden\"", author: "— Nietzsche", delay: 60, duration: 43, top: "40%" },
  { text: "\"To thine own self be true\"", author: "— Shakespeare", delay: 75, duration: 42, top: "80%" },
];

export function FloatingQuotes({ enabled = true }: { enabled?: boolean }) {
  const quotes = useMemo(() => defaultQuotes, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {quotes.map((quote, index) => (
        <div
          key={index}
          className="floating-quote"
          style={{
            top: quote.top,
            animationDelay: `${quote.delay}s`,
            animationDuration: `${quote.duration}s`,
          }}
        >
          {quote.text} {quote.author}
        </div>
      ))}
    </div>
  );
}
