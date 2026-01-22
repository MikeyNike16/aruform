"use client";

import "./globals.css";

const quotes = [
  { text: "\"Know thyself\"", author: "— Socrates", delay: 0, duration: 40, top: "15%" },
  { text: "\"I am what I choose to become\"", author: "— Jung", delay: 15, duration: 42, top: "50%" },
  { text: "\"To find yourself, think for yourself\"", author: "— Socrates", delay: 30, duration: 45, top: "25%" },
  { text: "\"Become who you truly are\"", author: "— Jung", delay: 45, duration: 40, top: "65%" },
  { text: "\"The self is well hidden\"", author: "— Nietzsche", delay: 60, duration: 43, top: "40%" },
  { text: "\"To thine own self be true\"", author: "— Shakespeare", delay: 75, duration: 42, top: "80%" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>aruform - existential journaling</title>
        <meta name="description" content="Explore your existence through reflective journaling" />
      </head>
      <body className="antialiased">
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
        <div style={{ position: 'relative', zIndex: 10 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
