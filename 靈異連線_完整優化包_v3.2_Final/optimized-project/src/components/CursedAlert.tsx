import React from "react";

/**
 * CursedAlert
 * - A readable punishment: red wash + security modal
 * - Does NOT block context permanently (pointer-events-none by default)
 */
export default function CursedAlert() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 15–25% weaker than full cover via alpha */}
      <div className="absolute inset-0 bg-red-950/65" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[92%] max-w-lg border border-red-900 bg-black/85 shadow-[0_0_40px_rgba(150,0,0,0.25)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-red-900/60">
            <div className="font-mono text-xs tracking-widest text-red-400">
              SECURITY CONSOLE
            </div>
            <div className="font-mono text-[10px] text-stone-500">
              EVENT_ID: TAB_SWITCH
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="font-serif text-2xl text-red-200 tracking-widest">
              ⚠️ CONNECTION VIOLATION
            </div>

            <div className="mt-3 font-mono text-sm text-stone-300 leading-relaxed">
              TAB SWITCH DETECTED — TIMER RESET
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <div className="font-mono text-xs text-stone-400">
                PROTOCOL: SOUL_BINDING_LOCK / DURATION: 3s
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}