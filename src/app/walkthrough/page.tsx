"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Target,
  ArrowRight,
} from "lucide-react";
import { ThemePage } from "@/components/theme/ThemePage";
import { ThemeCard } from "@/components/theme/ThemeCard";
import { Button } from "@/components/ui/button";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { useSpotlight } from "@/components/tour/TourSpotlight";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { updateCurrentUser } from "@/features/auth/api";
import { WalkthroughStage } from "@/features/walkthrough/types";
import { 
  creatorSteps, 
  desktopDiscoverySteps,
  mobileDiscoverySteps
} from "@/features/walkthrough/constants";

export default function WalkthroughPage() {
  const { isTerminalCopy, fontFamily } = useThemeHelpers();
  const { setSpotlight } = useSpotlight();
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlStage = (searchParams.get("tourStage") as WalkthroughStage) || "discovery";
  const stage = urlStage;
  const [currentStep, setCurrentStep] = useState(0);

  const saveOnboardingStatus = useCallback(async () => {
    localStorage.setItem("conduit_onboarding_completed", "true");
    
    if (user) {
      try {
        await updateCurrentUser({ onboardingCompleted: true });
        await refreshUser();
        window.location.href = "/";
      } catch (error) {
        console.error("Failed to save onboarding status:", error);
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
  }, [user, refreshUser]);

  const setStage = useCallback((newStage: WalkthroughStage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tourStage", newStage);
    router.push(`/walkthrough?${params.toString()}`);
  }, [router, searchParams]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const discoverySteps = isMobile ? mobileDiscoverySteps : desktopDiscoverySteps;
  const currentSteps = stage === "discovery" ? discoverySteps : creatorSteps;
  const currentStepData = currentSteps[currentStep] || currentSteps[0];

  useEffect(() => {
    if (currentStepData.spotlightId) {
      const targets = Array.isArray(currentStepData.spotlightId) 
        ? [...currentStepData.spotlightId, "walkthrough-simulation"] 
        : [currentStepData.spotlightId, "walkthrough-simulation"];
      setSpotlight(targets);
    } else {
      setSpotlight(["walkthrough-simulation"]);
    }

    if (stage === "creator" && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-studio-sidebar"));
    }
  }, [currentStep, currentStepData?.spotlightId, setSpotlight, stage]);

  useEffect(() => {
    return () => setSpotlight(null);
  }, [setSpotlight]);

  // Navigation Logic
  const nextStep = () => {
    if (currentStep < currentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (stage === "discovery") {
      setStage("creator");
      setCurrentStep(0);
    } else {
      saveOnboardingStatus();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (stage === "creator") {
      setStage("discovery");
      setCurrentStep(discoverySteps.length - 1);
    }
  };

  const isLastStep = stage === "creator" && currentStep === creatorSteps.length - 1;

  return (
    <ThemePage className={cn(
      "max-w-[1600px] mx-auto py-0 md:py-16 px-2 md:px-12 min-h-screen lg:min-h-0",
      "md:pt-16"
    )}>
      <button 
        onClick={saveOnboardingStatus}
        className="fixed bottom-12 right-12 z-[500] text-sm font-sans uppercase tracking-widest text-foreground-muted hover:text-foreground transition-colors hidden md:flex items-center gap-3 group bg-noir-bg/90 backdrop-blur-md px-6 py-3 border border-noir-border hover:border-foreground/20 shadow-2xl cursor-pointer rounded-full"
      >
        <span>[ SKIP ONBOARDING ]</span>
      </button>

      <div className="fixed top-[72px] left-0 right-0 z-[480] pointer-events-none p-4 md:p-8 lg:p-12 hidden md:flex justify-end">
        <AnimatePresence mode="wait">
          <motion.div 
            key={stage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex items-center gap-6 md:gap-8 bg-noir-panel/90 backdrop-blur-xl px-4 md:px-6 py-2 md:py-3 border border-noir-border shadow-2xl rounded-2xl"
        >
            <div className="flex items-center gap-6">
                <Target size={24} className="text-foreground-muted opacity-50" />
                <div>
                   <div className="text-[10px] font-sans text-foreground-subtle uppercase tracking-widest leading-none mb-1.5">
                     PROTOCOL::GUIDE
                   </div>
                   <div className={cn(
                     "text-lg font-black uppercase tracking-tighter leading-none flex items-center gap-3",
                     fontFamily === "serif" ? "font-serif italic capitalize" : "font-sans"
                   )}>
                      {stage === "discovery" 
                        ? "Global Discovery" 
                        : "Creation Studio"}
                   </div>
                </div>
            </div>
            
            <div className="h-12 w-px bg-noir-border" />

            <div className="flex flex-col items-start gap-1.5 font-sans text-[9px] text-foreground-subtle">
                <div className="flex items-center gap-2.5">
                  REV.16 / {stage.toUpperCase()}
                </div>
                <div>STEP {currentStep + 1} OF {currentSteps.length}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div 
        data-tour-id="walkthrough-main-block"
        className={cn(
          "flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start relative",
          "justify-between min-h-0 mt-12 md:mt-20 lg:mt-24"
        )}
      >
        <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-accent/20" />
        <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-accent/20" />
        <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b-2 border-l-2 border-accent/20" />
        <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-accent/20" />
        
        {/* Module Controls */}
        <div className={cn(
          "lg:col-span-4 space-y-4 md:space-y-6 lg:space-y-8 lg:sticky lg:top-32 z-[410] pointer-events-auto",
          "fixed top-1 left-0 right-0 px-1 md:px-0 md:relative md:top-auto md:left-auto md:right-auto"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${stage}-${currentStep}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ThemeCard 
                data-tour-id="walkthrough-content-block"
                className="p-3 md:p-8 bg-noir-panel/80 backdrop-blur-xl shadow-2xl relative overflow-hidden group w-full border border-noir-border rounded-2xl"
              >
                <div className="flex items-center justify-between mb-2 md:mb-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="px-2 py-1 border text-[9px] font-bold text-foreground-subtle border-noir-border font-sans uppercase">
                      {stage.toUpperCase()} / 0{currentStep + 1}
                    </div>
                    <div className="h-px flex-1 bg-noir-border hidden md:block" />
                  </div>
                  
                  {/* Mobile Skip Button */}
                  <button 
                    onClick={saveOnboardingStatus}
                    className="md:hidden text-[11px] font-sans uppercase tracking-widest text-foreground hover:text-foreground border border-noir-border px-4 py-1.5 rounded-full bg-noir-bg/50 active:bg-white active:text-black transition-all"
                  >
                    [ SKIP ]
                  </button>
                </div>

                <h2 className={cn(
                  "text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter uppercase mb-2 md:mb-6 leading-none",
                  fontFamily === "serif" ? "font-serif italic capitalize" : "font-sans"
                )}>
                  {currentStepData.title}
                </h2>

                <p className="text-base md:text-lg lg:text-xl text-foreground-muted mb-6 md:mb-8 leading-relaxed font-serif italic">
                  {currentStepData.description}
                </p>

                <div className="space-y-4 md:space-y-6 mb-8 md:mb-12 max-h-[30vh] md:max-h-[40vh] lg:max-h-none overflow-y-auto pr-2 custom-scrollbar hidden md:block">
                   {currentStepData.details.map((detail, idx) => (
                      <div key={idx} className="space-y-2">
                         <div className="text-[10px] uppercase tracking-widest flex items-center gap-2 font-sans text-foreground/40">
                            <ArrowRight size={12} /> {detail.title}
                         </div>
                         <ul className="pl-5 space-y-1 hidden md:block">
                            {detail.items.map((item, j) => (
                               <li key={j} className="text-xs flex items-start gap-2 text-foreground-muted font-serif">
                                  <span className="text-foreground/20 italic">-</span> {item}
                                </li>
                            ))}
                         </ul>
                      </div>
                   ))}
                </div>

                <div className="flex gap-4 pt-4 md:pt-8 border-t border-noir-border">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={stage === "discovery" && currentStep === 0}
                    className="border border-noir-border flex-1 h-10 md:h-16 uppercase tracking-widest group rounded-full font-sans text-[10px] hover:bg-noir-hover"
                  >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Prev
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 h-10 md:h-16 transition-all uppercase tracking-widest gap-2 group rounded-full bg-white text-black hover:bg-gray-200 font-sans text-[10px] font-bold"
                  >
                    {isLastStep ? "Complete" : "Continue"}
                    {!isLastStep && <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </div>
              </ThemeCard>
            </motion.div>
          </AnimatePresence>

          <div className="p-3 md:p-6 border border-noir-border bg-noir-bg/20 backdrop-blur-sm hidden sm:block rounded-2xl">
             <div className="flex items-center justify-between mb-4">
                <span className="uppercase tracking-widest text-[8px] font-sans text-foreground/30">
                  ARCHIVE_STATE
                </span>
                <span className="uppercase text-[8px] font-sans text-foreground/60">
                  {stage === "discovery" ? "01 Discovery" : "02 Creation"}
                </span>
             </div>
             <div className="grid grid-cols-2 gap-2 h-1 relative overflow-hidden rounded-full">
                <div className={cn("h-full transition-all duration-500", stage === "discovery" ? "bg-white" : "bg-white/20")} />
                <div className={cn("h-full transition-all duration-500", stage === "creator" ? "bg-white" : "bg-noir-border")} />
             </div>
          </div>
        </div>

        {/* Visual Engine Output */}
        <div className={cn(
          "lg:col-span-8 lg:mt-0 z-[450]",
          "fixed bottom-24 left-0 right-0 px-2 md:px-0 md:relative md:bottom-auto md:left-auto md:right-auto"
        )}>
            <div className="relative aspect-[16/11] md:aspect-[16/10] bg-black border border-noir-border overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(to right, #445 1px, transparent 1px), linear-gradient(to bottom, #445 1px, transparent 1px)`,
                      backgroundSize: "80px 80px",
                    }}
                />
                
                {isTerminalCopy && <div className="scanlines z-10" />}

                <div className="absolute top-4 right-4 font-mono text-[8px] text-accent/20 uppercase tracking-[0.5em] hidden md:block">
                   LOC_DATA::{currentStepData.location.replace(" ", "_")}
                </div>

                <div 
                    className="absolute inset-0 flex items-center justify-center p-3 md:p-12"
                    id="walkthrough-simulation"
                    data-tour-id="walkthrough-simulation"
                >
                    <motion.div 
                        key={currentStepData.imagePlaceholder}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full h-full border border-noir-border bg-noir-hover/20 flex flex-col items-center justify-center group rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-4 left-4 flex items-center gap-2 z-30">
                           <span className="uppercase font-bold tracking-widest text-[8px] font-sans text-foreground/20">
                             VISUAL_OUTPUT
                           </span>
                        </div>

                        <div className="relative w-full h-full overflow-hidden">
                            
                            {currentStepData.simulationImage ? (
                                <motion.img 
                                    key={`${isMobile ? 'mobile' : 'desktop'}-${currentStepData.simulationImage}`}
                                    src={`/images/walkthrough/${isMobile ? 'mobile' : 'desktop'}/${currentStepData.simulationImage}`}
                                    alt={currentStepData.title}
                                    className={cn(
                                        "w-full h-full object-top",
                                        isMobile ? "object-contain scale-[0.85] transform" : "object-cover"
                                    )}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            ) : (
                                <div className="p-8 border border-accent/20 bg-accent/[0.02] relative h-full flex items-center justify-center">
                                    {(() => {
                                        const Icon = currentStepData.icon;
                                        return (
                                            <>
                                                <Icon size={48} className="text-accent/80 drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] md:hidden" />
                                                <Icon size={80} className="text-accent/80 drop-shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hidden md:block" />
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-4 md:mt-8 text-center animate-pulse">
                           <div className="text-[8px] md:text-[10px] font-mono text-foreground-subtle uppercase tracking-[0.4em] mb-2">{currentStepData.location}</div>
                           <div className="h-[1px] w-12 md:w-24 bg-accent/30 mx-auto" />
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-noir-border" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-noir-border" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-noir-border" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-noir-border" />
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-10 flex items-center gap-4 p-4 hidden md:flex bg-noir-bg/40 border border-noir-border rounded-xl"
            >
                <div className="p-2 border border-noir-border text-foreground-subtle">
                   <Target size={16} />
                </div>
                <div className="text-xs tracking-tight leading-relaxed hidden sm:block font-serif italic text-foreground-muted">
                   The system is currently highlighting the {currentStepData.location} module within your workspace for visual context.
                </div>
            </motion.div>
        </div>
      </div>
    </ThemePage>
  );
}
