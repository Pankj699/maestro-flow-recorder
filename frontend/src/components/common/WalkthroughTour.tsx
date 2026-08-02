import React, { useState } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft, Sparkles, Smartphone, Zap, FileCode, CheckCircle2 } from 'lucide-react';

interface WalkthroughStep {
  title: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  highlights: string[];
}

const steps: WalkthroughStep[] = [
  {
    title: 'Live Device Mirroring & Gestures',
    badge: 'Step 1 of 5',
    icon: <Smartphone className="w-5 h-5 text-brand-cyan" />,
    description: 'Interact with your physical Android device directly from the web browser in real-time.',
    highlights: [
      'Click anywhere on the mirror to tap elements on your phone',
      'Scroll your mouse wheel to scroll up & down on the device',
      'Click & drag across the mirror to execute swipe gestures',
    ],
  },
  {
    title: 'Touch Action Modes (Smart, Tap, Assert)',
    badge: 'Step 2 of 5',
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    description: 'Control how your touch interactions are recorded into the Maestro flow.',
    highlights: [
      '⚡ Smart Auto: Auto-detects buttons for taps & text for assertions',
      '👆 Force Tap: Forces every touch to record a - tapOn: step',
      '👁️ Force Assert: Forces every touch to record an - assertVisible: step',
    ],
  },
  {
    title: 'Conditional Send Text Input',
    badge: 'Step 3 of 5',
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    description: 'Type text directly into active input fields on your phone.',
    highlights: [
      'The Send Text bar automatically appears whenever an input field is active',
      'Types text into your physical phone and records clean - inputText: steps',
      'Soft keyboard key presses are filtered out so your script remains clean',
    ],
  },
  {
    title: 'Auto-Assert Screen & AI Refactor',
    badge: 'Step 4 of 5',
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    description: 'Generate full-screen validations and optimize your test flows with AI.',
    highlights: [
      '✨ Auto-Assert: 1-click auto-generation of assertions for all visible screen texts & images',
      '🪄 AI Refactor: Merges rapid inputs, removes duplicate taps, and adds variables',
      'ASCII Section Banners: Automatically formats script into structured test sections',
    ],
  },
  {
    title: 'Monaco YAML Editor & Cursor Position Insertion',
    badge: 'Step 5 of 5',
    icon: <FileCode className="w-5 h-5 text-blue-400" />,
    description: 'Edit, copy, or export production-ready Maestro YAML automation tests.',
    highlights: [
      'Place your editor cursor anywhere on a line to insert new steps at that position',
      'Full syntax highlighting, copy to clipboard, and 1-click YAML file export',
      'Step over & playback recorded flows in the Flow Player tab',
    ],
  },
];

interface WalkthroughTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalkthroughTour: React.FC<WalkthroughTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-dark-800 border border-dark-600 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-dark-900 border-b border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/30">
              {step.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-brand-cyan">
                {step.badge}
              </span>
              <h3 className="text-sm font-bold text-slate-100">{step.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-dark-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>

          <div className="space-y-2 bg-dark-900/60 border border-dark-700/60 rounded-xl p-3.5">
            {step.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-dark-900 border-t border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStep ? 'w-5 bg-brand-cyan' : 'w-1.5 bg-dark-600 hover:bg-dark-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3 py-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition-colors flex items-center gap-1 shadow-md"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-md"
              >
                Get Started! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
