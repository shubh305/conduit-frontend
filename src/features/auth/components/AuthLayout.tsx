"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  cyberSideContent?: React.ReactNode;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  cyberSideContent, 
}: AuthLayoutProps) {
  const { theme } = useTheme();

  // CYBER THEME
  if (theme === 'cyber') {
    return (
      <main className="min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-noir-panel border-r border-noir-border relative overflow-hidden">
             {/* Cyber Background elements */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
             />
             
             <div className="relative z-10">
                <Link href="/" className="text-2xl font-sans font-bold tracking-tight uppercase hover:text-signal-green transition-colors">Conduit</Link>
             </div>
             
             <div className="font-mono text-sm text-gray-500 relative z-10">
               {cyberSideContent || (
                 <>
                   {`// SYSTEM ACCESS`}<br/>
                   {`// SECURE CONNECTION ESTABLISHED`}
                 </>
               )}
             </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-8 bg-noir-bg relative">
          <div className="w-full max-w-sm mb-12 lg:hidden">
             <Link href="/" className="text-2xl font-sans font-bold tracking-tight uppercase mb-2 block">Conduit</Link>
          </div>
          
          <div className="w-full max-w-sm relative z-10">
            <h1 className="text-3xl font-sans font-black tracking-tight mb-2 uppercase text-white">{title}</h1>
            <p className="font-mono text-sm text-gray-500 mb-8 uppercase">{subtitle}</p>
            {children}
          </div>
        </div>
      </main>
    );
  }

  // CLASSIC THEME
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#121212] text-white p-4">
       <div className="w-full max-w-md">
          <div className="text-center mb-12">
             <Link href="/" className="text-4xl font-serif font-bold tracking-tight text-white hover:text-gray-300 transition-colors">Conduit</Link>
          </div>
          
          <div className="text-center mb-8">
             <h1 className="text-3xl font-serif font-medium mb-3">{title}</h1>
             <p className="text-gray-400 font-sans">{subtitle}</p>
          </div>

          <div className="bg-[#121212]">
             {children}
          </div>
       </div>
    </main>
  );
}
