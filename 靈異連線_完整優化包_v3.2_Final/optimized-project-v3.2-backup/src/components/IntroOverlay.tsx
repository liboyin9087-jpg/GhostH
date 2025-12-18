import React, { useEffect, useState } from "react";

/**
 * IntroOverlay
 * - Unlocks audio on mobile (requires user gesture)
 * - Provides a clean "START" ritual gate so HUD can show STABLE before start
 */
export default function IntroOverlay(props: {
  onStart: () => void;
  storageKey?: string;
  title?: string;
}) {
  const storageKey = props.storageKey ?? "xgl_anklin_intro_seen";
  const title = props.title ?? "連線請求：杏林醫院";
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey);
      if (seen === "1") setOpen(false);
    } catch {}
  }, [storageKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
      <div className="w-[92%] max-w-xl border border-stone-800 bg-black/90 p-6 shadow-[0_0_40px_rgba(150,0,0,0.25)]">
        <h2 className="text-stone-200 font-serif text-2xl tracking-widest">{title}</h2>

        <p className="mt-4 text-stone-400 text-sm leading-relaxed">
          這不是普通的網頁。為了確保聲音與畫面同步，請點擊「開始連線」。
          <br />
          <span className="text-stone-500 font-mono text-xs">
            *手機瀏覽器需要使用者互動才能播放音效
          </span>
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            className="px-5 py-3 bg-red-900 text-red-100 font-serif tracking-widest border border-red-700 hover:bg-red-800 transition"
            onClick={() => {
              try { localStorage.setItem(storageKey, "1"); } catch {}
              setOpen(false);
              props.onStart();
            }}
          >
            開始連線
          </button>

          <button
            className="px-4 py-3 bg-transparent text-stone-500 border border-stone-800 hover:text-stone-300 hover:border-stone-700 transition"
            onClick={() => setOpen(false)}
          >
            稍後
          </button>
        </div>
      </div>
    </div>
  );
}