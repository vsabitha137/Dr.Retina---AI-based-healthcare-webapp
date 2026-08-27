import React, { useState } from 'react';
import { Sparkles, Scan, CheckCircle2, AlertCircle, Info, Activity } from 'lucide-react';

export default function RetinaViewer3D() {
  const [activeHotspot, setActiveHotspot] = useState(null);

  const hotspots = [
    {
      id: 'optic-disc',
      title: 'Optic Disc Assessment',
      x: '28%',
      y: '48%',
      status: 'Normal CDR 0.35',
      desc: 'Optic nerve head boundary segmentation & cup-to-disc ratio analysis for secondary glaucoma triage.',
      color: 'teal'
    },
    {
      id: 'macula',
      title: 'Macular Zone & Fovea',
      x: '62%',
      y: '52%',
      status: 'High Sensitivity Zone',
      desc: 'Deep learning assessment for diabetic macular edema (DME) and hard exudates in central vision.',
      color: 'cyan'
    },
    {
      id: 'superior-arcade',
      title: 'Superior Vascular Arcade',
      x: '46%',
      y: '22%',
      status: 'Vessel Caliber 1:1',
      desc: 'Arteriovenous ratio (AVR) calculation and automated microaneurysm cluster identification.',
      color: 'emerald'
    },
    {
      id: 'inferior-arcade',
      title: 'Inferior Arcade & Triage',
      x: '42%',
      y: '78%',
      status: 'AI Quad-Scan Clear',
      desc: 'Four-quadrant automated lesion detection adhering to International Clinical DR Grading standard.',
      color: 'teal'
    }
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center select-none">
      {/* Ambient background glow & radial gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/20 via-cyan-400/15 to-emerald-400/20 blur-3xl transform -rotate-12 animate-pulse-slow"></div>
      
      {/* Main Glass Outer Ring */}
      <div className="relative w-full h-full rounded-full p-6 bg-gradient-to-b from-slate-900/5 to-slate-900/10 backdrop-blur-sm border border-teal-500/20 shadow-2xl flex items-center justify-center overflow-hidden">
        
        {/* Retinal Fundus Graphic Base */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-teal-950 via-slate-950 to-teal-900 shadow-inner flex items-center justify-center overflow-hidden border border-teal-400/30">
          
          {/* Animated AI Scanning Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d948815_1px,transparent_1px),linear-gradient(to_bottom,#0d948815_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Fundus Radial Illumination */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_50%,rgba(20,184,166,0.35)_0%,rgba(15,23,42,0.85)_70%,rgba(13,148,136,0.4)_100%)]"></div>

          {/* Retinal Blood Vessel Patterns SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-70 pointer-events-none" viewBox="0 0 400 400" fill="none">
            {/* Optic Disc Glow */}
            <circle cx="125" cy="200" r="32" fill="url(#opticGlow)" />
            <circle cx="125" cy="200" r="18" fill="#fef08a" fillOpacity="0.4" />
            <circle cx="125" cy="200" r="8" fill="#ffffff" fillOpacity="0.8" />

            {/* Macular Glow */}
            <circle cx="260" cy="210" r="28" fill="url(#maculaGlow)" />
            <circle cx="260" cy="210" r="4" fill="#38bdf8" fillOpacity="0.8" />

            {/* Vascular Branches (Superior / Inferior) */}
            <path d="M125 200 C 135 150, 160 110, 220 85 C 280 60, 330 75, 370 120" stroke="#14b8a6" strokeWidth="3.5" strokeLinecap="round" opacity="0.85"/>
            <path d="M125 200 C 145 160, 185 130, 250 115 C 310 100, 360 130, 390 170" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
            <path d="M220 85 C 240 70, 270 50, 310 45" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M125 200 C 135 250, 160 290, 220 315 C 280 340, 335 325, 375 280" stroke="#14b8a6" strokeWidth="3.5" strokeLinecap="round" opacity="0.85"/>
            <path d="M125 200 C 145 240, 185 270, 250 285 C 310 300, 360 270, 390 230" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
            <path d="M220 315 C 240 330, 270 350, 310 355" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M125 200 C 90 180, 60 170, 20 180" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            <path d="M125 200 C 90 220, 60 230, 20 220" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

            {/* Concentric AI Target Rings */}
            <circle cx="200" cy="200" r="140" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 6" opacity="0.3"/>
            <circle cx="200" cy="200" r="95" stroke="#14b8a6" strokeWidth="1" strokeDasharray="3 5" opacity="0.4"/>
            <circle cx="200" cy="200" r="45" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 4" opacity="0.5"/>

            <defs>
              <radialGradient id="opticGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="maculaGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#0284c7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* AI Laser Scan Vertical Bar Animation */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan pointer-events-none"></div>

          {/* Interactive Diagnostic Hotspots */}
          {hotspots.map((spot) => {
            const isSelected = activeHotspot?.id === spot.id;
            return (
              <div
                key={spot.id}
                style={{ left: spot.x, top: spot.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                onClick={() => setActiveHotspot(isSelected ? null : spot)}
              >
                {/* Pulsing Beacon */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-teal-400/30 animate-ping"></span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-125 ${
                    isSelected ? 'bg-cyan-400 border-white scale-125' : 'bg-slate-900/80 border-teal-300 text-teal-300'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>

                {/* Always-Visible Compact Pill Label */}
                <div className="absolute left-1/2 -translate-x-1/2 top-7 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-teal-500/40 text-[10px] font-semibold text-teal-200 shadow-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  {spot.title.split(' ')[0]}
                </div>
              </div>
            );
          })}

          {/* Active Hotspot Info Card Popup */}
          {activeHotspot && (
            <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-teal-400/50 shadow-2xl text-left text-white z-20 animate-fade-in">
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-teal-200">{activeHotspot.title}</h4>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {activeHotspot.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{activeHotspot.desc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Status Badges around the eye (as seen in Dribbble reference) */}
      <div className="absolute -top-3 -right-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-teal-200 shadow-lg text-xs font-semibold text-teal-900 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>AI Precision: 99.4% AUC</span>
      </div>

      <div className="absolute -bottom-2 -left-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-xs font-medium text-slate-800 flex items-center gap-2">
        <Scan className="w-3.5 h-3.5 text-teal-600" />
        <span>Dual-Eye Fundus Analysis</span>
      </div>
    </div>
  );
}
