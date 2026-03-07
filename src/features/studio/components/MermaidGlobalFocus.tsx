"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, RefreshCw, X } from "lucide-react";

interface MaximizeEvent extends CustomEvent {
  detail: {
    svg: string;
  };
}

export function MermaidGlobalFocus() {
  const [maximizedSvg, setMaximizedSvg] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleMaximize = (e: Event) => {
      const customEvent = e as MaximizeEvent;
      if (customEvent.detail && customEvent.detail.svg) {
        setMaximizedSvg(customEvent.detail.svg);
        setZoomLevel(1);
      }
    };

    document.addEventListener("conduit:maximize-mermaid", handleMaximize);
    return () => document.removeEventListener("conduit:maximize-mermaid", handleMaximize);
  }, [mounted]);

  const isZoomed = zoomLevel > 1;
  useEffect(() => {
    if (!maximizedSvg || !containerRef.current || !contentRef.current) return;
    if (!isZoomed) return;

    const container = containerRef.current;
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
  }, [isZoomed, maximizedSvg]);

  const sanitizedSvg = useMemo(() => {
    if (!maximizedSvg) return null;
    return maximizedSvg
      .replace(/<svg\b/i, '<svg style="max-width: 100%; max-height: 100%; width: auto; height: auto; display: block;"');
  }, [maximizedSvg]);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {sanitizedSvg && (
        <Portal key="mermaid-portal">
          <motion.div
            key="mermaid-focus-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000000] flex flex-col select-none overflow-hidden touch-none"
            style={{ 
              backgroundColor: 'var(--color-noir-bg)',
            }}
          >
            {/* Opaque Header Bar */}
            <div 
              className="absolute top-0 left-0 right-0 z-[150] h-16 md:h-24 flex items-center justify-between px-6 md:px-12 pointer-events-auto border-b border-noir-border shadow-sm"
              style={{ backgroundColor: 'var(--color-noir-bg)' }}
            >
              <div className="flex flex-col">
                <h3 className="text-foreground text-xs md:text-lg font-black uppercase tracking-[0.2em] leading-none mb-1">
                  DIAGRAM_FOCUS_MODE
                </h3>
                <span className="text-[10px] md:text-xs text-accent uppercase font-mono tracking-widest font-bold opacity-80">
                  Precision_Engine_v10.1
                </span>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all cursor-pointer"
                  title="Fit to Screen"
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setMaximizedSvg(null)}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-signal-red/10 border border-signal-red/20 flex items-center justify-center text-signal-red hover:bg-signal-red hover:text-white transition-all cursor-pointer shadow-lg active:scale-90"
                >
                  <X size={22} className="md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            {/* CenterLock Canvas */}
            <div
              ref={containerRef}
              className={`flex-1 relative custom-scrollbar ${zoomLevel > 1 ? 'overflow-auto' : 'overflow-hidden'} mt-16 md:mt-24 mb-20 md:mb-0`}
              style={{ backgroundColor: 'transparent' }}
            >
              <div 
                ref={contentRef}
                className="min-h-full min-w-full flex items-center justify-center p-4 md:p-12"
                style={{
                  width: zoomLevel > 1 ? `${zoomLevel * 100}%` : "100%",
                  height: zoomLevel > 1 ? `${zoomLevel * 100}%` : "100%",
                  margin: "0 auto",
                }}
              >
                <div
                  className="rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-16 border border-noir-border shadow-2xl relative flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'var(--color-noir-panel)',
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    width: 'min(94vw, 1400px)',
                    height: 'min(80vh, 1200px)',
                    maxHeight: 'calc(100vh - 12rem)',
                    flexShrink: 0
                  }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div 
              className="md:hidden absolute bottom-0 left-0 right-0 z-[150] h-20 border-t border-noir-border flex items-center justify-center px-6 pointer-events-auto shadow-lg"
              style={{ backgroundColor: 'var(--color-noir-bg)' }}
            >
              <div className="flex items-center gap-2 bg-accent/5 border border-accent/10 rounded-full px-4 py-1.5 ">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(0.1, prev * 0.8))}
                  className="w-10 h-10 text-foreground/60 flex items-center justify-center"
                >
                  <Minus size={22} />
                </button>
                <span className="text-xs font-mono text-accent font-black min-w-[50px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(10, prev * 1.2))}
                  className="w-10 h-10 text-foreground/60 flex items-center justify-center"
                >
                  <Plus size={22} />
                </button>
              </div>
            </div>

            {/* Desktop Zoom Controls */}
            <div className="hidden md:flex absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-[160] pointer-events-auto">
              <div 
                className="flex items-center gap-4 border border-noir-border rounded-full px-6 py-2.5 shadow-2xl backdrop-blur-md"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-noir-bg) 80%, transparent)' }}
              >
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(0.1, prev * 0.8))}
                  className="w-8 h-8 text-foreground/40 hover:text-accent transition-colors flex items-center justify-center"
                >
                  <Minus size={20} />
                </button>
                <span className="text-sm font-mono text-accent font-black min-w-[65px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(10, prev * 1.2))}
                  className="w-8 h-8 text-foreground/40 hover:text-accent transition-colors flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}

function Portal({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setHost(document.body));
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!host) return null;
  return createPortal(children, host);
}
