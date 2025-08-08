"use client";

import React from "react";
import Link from "next/link";
import { User } from "@/features/auth/types";

interface TerminalNanoLayoutProps {
  formData: Partial<User>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  isSaving: boolean;
  handleSave: (e: React.FormEvent) => Promise<void>;
}

export function TerminalNanoLayout({
  formData,
  setFormData,
  isSaving,
  handleSave,
}: TerminalNanoLayoutProps) {
  return (
    <div className="font-mono text-sm min-h-[calc(100vh-100px)] bg-black text-foreground flex flex-col max-w-5xl mx-auto border border-accent/20 my-8 shadow-[0_0_20px_rgba(74,246,38,0.1)]">
      {/* Nano Header */}
      <div className="bg-white text-black px-4 py-1 flex justify-between">
        <span>GNU nano 6.2</span>
        <span>File: .config/user_profile.conf</span>
        <span>Modified</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 relative">
        <form onSubmit={handleSave} className="space-y-4 max-w-3xl mx-auto">
          <div className="text-foreground-muted mb-6">
            <p># User Configuration</p>
            <p># Edit variables below to update your profile.</p>
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
            <label className="text-accent">display_name</label>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">=</span>
              <input
                value={formData.displayName || ""}
                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                className="bg-transparent border-b border-foreground-muted focus:border-accent outline-none w-full text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
            <label className="text-accent">tagline</label>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">=</span>
              <input
                value={formData.tagline || ""}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="bg-transparent border-b border-foreground-muted focus:border-accent outline-none w-full text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
            <label className="text-accent">location</label>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">=</span>
              <input
                value={formData.location || ""}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="bg-transparent border-b border-foreground-muted focus:border-accent outline-none w-full text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] gap-4 items-start mt-4">
            <label className="text-accent mt-1">bio_description</label>
            <div className="flex gap-2 w-full">
              <span className="text-foreground-muted mt-1">=</span>
              <textarea
                value={formData.bio || ""}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="bg-transparent border border-foreground-muted/30 focus:border-accent outline-none w-full text-foreground p-2"
              />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-accent/20">
            <p className="text-foreground-muted mb-4"># Social Links</p>
            {(["twitter", "github", "linkedin", "website"] as const).map(key => (
              <div key={key} className="grid grid-cols-[140px_1fr] gap-4 items-center mb-2">
                <label className="text-accent">social_{key}</label>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-muted">=</span>
                  <input
                    value={formData.socialLinks?.[key] || ""}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        socialLinks: { ...(prev.socialLinks || {}), [key]: e.target.value },
                      }))
                    }
                    className="bg-transparent border-b border-foreground-muted focus:border-accent outline-none w-full text-foreground text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="hidden" />
        </form>

        <div className="absolute top-4 right-4 text-xs text-foreground-muted lg:block hidden">[ Line 1/42 (2%) ]</div>
      </div>

      {/* Nano Footer / Message Bar */}
      <div className="mt-auto">
        <div className="text-center py-1 bg-transparent text-foreground min-h-[24px]">
          {isSaving && <span className="bg-accent text-black px-2">[ Writing... ]</span>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-1 gap-y-1 bg-transparent px-2 pb-2 text-xs">
          <div className="flex gap-1">
            <span className="bg-white text-black px-1 font-bold">^G</span> <span>Get Help</span>
          </div>
          <button onClick={handleSave} className="flex gap-1 hover:bg-accent hover:text-black cursor-pointer">
            <span className="bg-white text-black px-1 font-bold">^O</span> <span>Write Out</span>
          </button>
          <div className="flex gap-1">
            <span className="bg-white text-black px-1 font-bold">^W</span> <span>Where Is</span>
          </div>
          <div className="flex gap-1">
            <span className="bg-white text-black px-1 font-bold">^K</span> <span>Cut Text</span>
          </div>
          <div className="flex gap-1">
            <span className="bg-white text-black px-1 font-bold">^J</span> <span>Justify</span>
          </div>
          <div className="flex gap-1">
            <span className="bg-white text-black px-1 font-bold">^C</span> <span>Cur Pos</span>
          </div>
          <Link href="/studio" className="flex gap-1 hover:bg-accent hover:text-black">
            <span className="bg-white text-black px-1 font-bold">^X</span> <span>Exit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
