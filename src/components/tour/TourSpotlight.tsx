"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightContextType {
  activeId: string | string[] | null;
  setSpotlight: (id: string | string[] | null) => void;
  rects: DOMRect[];
}

const SpotlightContext = createContext<SpotlightContextType | undefined>(undefined);

export const SpotlightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeId, setActiveId] = useState<string | string[] | null>(null);
  const [rects, setRects] = useState<DOMRect[]>([]);

  const updateRects = useCallback(() => {
    if (!activeId) {
      setRects([]);
      return;
    }
    
    const ids = Array.isArray(activeId) ? activeId : [activeId];
    const newRects: DOMRect[] = [];

    ids.forEach(id => {
      const elements = Array.from(document.querySelectorAll(`#${id}, [data-tour-id="${id}"]`));
      
      const el = elements.find(e => {
        const rect = e.getBoundingClientRect();
        const style = window.getComputedStyle(e);
        const isVisible = style.display !== "none" && 
                          style.visibility !== "hidden" && 
                          style.opacity !== "0" &&
                          rect.width > 0 && 
                          rect.height > 0 &&
                          rect.top < window.innerHeight &&
                          rect.bottom > 0 &&
                          rect.left < window.innerWidth &&
                          rect.right > 0;
        return isVisible;
      }) as HTMLElement;

      if (el) {
        newRects.push(el.getBoundingClientRect());
      }
    });

    setRects(newRects);
  }, [activeId]);

  useEffect(() => {
    const timer = setTimeout(updateRects, 0);
    const interval = setInterval(updateRects, 100); 
    window.addEventListener("resize", updateRects);
    window.addEventListener("scroll", updateRects, true);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener("resize", updateRects);
      window.removeEventListener("scroll", updateRects, true);
    };
  }, [updateRects]);

  return (
    <SpotlightContext.Provider value={{ activeId, setSpotlight: setActiveId, rects }}>
      {children}
    </SpotlightContext.Provider>
  );
};

export const useSpotlight = () => {
  const context = useContext(SpotlightContext);
  if (!context) throw new Error("useSpotlight must be used within SpotlightProvider");
  return context;
};

export const SpotlightOverlay = () => {
  const { rects, activeId } = useSpotlight();

  if (!activeId || rects.length === 0) return null;

  const currentIds = Array.isArray(activeId) ? activeId : [activeId];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] pointer-events-none overflow-hidden"
      >
        <svg className="w-full h-full">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {rects.map((rect, idx) => (
                <motion.rect
                  key={`mask-${idx}`}
                  initial={false}
                  animate={{
                    x: rect.left - 8,
                    y: rect.top - 8,
                    width: rect.width + 16,
                    height: rect.height + 16,
                  }}
                  transition={{ type: "spring", damping: 30, stiffness: 250 }}
                  fill="black"
                  rx="4"
                />
              ))}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.85)"
            mask="url(#spotlight-mask)"
            className="backdrop-blur-[2px]"
          />
        </svg>

        {rects.map((rect, idx) => {
          const id = currentIds[idx] || (Array.isArray(activeId) ? activeId[0] : activeId);
          const displayId = typeof id === "string" ? id : "multiple";

          return (
            <motion.div
              key={`frame-${idx}`}
              initial={false}
              animate={{
                left: rect.left - 8,
                top: rect.top - 8,
                width: rect.width + 16,
                height: rect.height + 16,
                opacity: 1,
              }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="absolute border border-accent/40 pointer-events-none"
            >
              {/* Corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />
              
              {/* Animated Scanning Beam */}
              <motion.div 
                className="absolute inset-0 bg-accent/5"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              />

              {/* Locator Label */}
              <div className={cn(
                "absolute flex items-center gap-2 transition-all duration-300",
                rect.top < 60 ? "top-full mt-2" : "-top-6",
                rect.bottom > (typeof window !== "undefined" ? window.innerHeight - 60 : 0) && "-top-6 mt-0",
                rect.left > (typeof window !== "undefined" ? window.innerWidth / 2 : 0) ? "right-0 flex-row-reverse" : "left-0"
              )}>
                <div className="w-1 h-1 bg-accent animate-pulse" />
                <div className="bg-accent text-black font-mono text-[9px] font-bold px-1 uppercase whitespace-nowrap">
                  TARGET_ACQUIRED::{displayId.toUpperCase()}
                </div>
              </div>
              
              {/* Coordinate Data */}
              <div className="absolute -bottom-6 right-0 font-mono text-[8px] text-accent/60 uppercase tracking-widest whitespace-nowrap hidden md:block">
                LOC_X:{Math.round(rect.left)} LOC_Y:{Math.round(rect.top)}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};
