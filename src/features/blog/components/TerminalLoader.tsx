"use client";

import { useEffect, useState } from "react";

export function TerminalLoader() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      { text: "> BOOT_SEQUENCE_INIT...", delay: 50 },
      { text: "> MOUNTING_DRIVE...", delay: 200 },
      { text: "> SECURE_UPLINK_ESTABLISHED...", delay: 400 },
      { text: "> RESOLVING_HOST...", delay: 600 },
      { text: "> HANDSHAKE_ACK.", delay: 800 },
      { text: "> AWAITING_DATA...", delay: 1000 }
    ];

    const timeouts: NodeJS.Timeout[] = [];

    sequence.forEach(({ text, delay }) => {
      const t = setTimeout(() => {
        setLines(prev => {
          const newLines = [...prev, text];
          return newLines.slice(-10);
        });
      }, delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-black font-mono text-accent p-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg space-y-2">
        {lines.map((line, i) => (
          <div key={i} className="text-sm md:text-base animate-in fade-in slide-in-from-left-2 duration-300">
            {line}
          </div>
        ))}
        <div className="animate-blink inline-block w-3 h-5 bg-accent mt-2"></div>
      </div>
    </div>
  );
}
