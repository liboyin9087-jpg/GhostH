import React, { useEffect, useMemo, useState } from "react";
import { OBJECTS } from "../game/db";
import type { GameObject } from "../types/game";

type Row = {
  id: string;
  name: string;
  cutoutUrl: string;
  foundUrl: string;
  cutoutOk: boolean | null;
  foundOk: boolean | null;
};

async function checkUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url + (url.includes("?") ? "&" : "?") + "v=" + Date.now();
  });
}

export default function AssetChecker() {
  const objects = useMemo(() => OBJECTS as GameObject[], []);
  const [rows, setRows] = useState<Row[]>(
    objects.map((o) => ({
      id: o.id,
      name: o.name,
      cutoutUrl: o.assets.cutout,
      foundUrl: o.assets.found,
      cutoutOk: null,
      foundOk: null,
    }))
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = [...rows];
      for (let i = 0; i < next.length; i++) {
        const r = next[i];
        const cutoutOk = await checkUrl(r.cutoutUrl);
        const foundOk = await checkUrl(r.foundUrl);
        if (cancelled) return;
        next[i] = { ...r, cutoutOk, foundOk };
        setRows([...next]);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const missing = rows.filter((r) => r.cutoutOk === false || r.foundOk === false);

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4">
      <div className="text-lg font-bold tracking-wider mb-2">Asset Checker</div>
      <div className="text-sm text-zinc-400 mb-4">
        檢查 {rows.length} 個物件的 cutout / found 是否可載入（檔名、大小寫、路徑錯就會紅）
      </div>

      <div className="mb-4 p-3 rounded border border-zinc-800 bg-zinc-950">
        <div className="font-bold">缺漏總數：{missing.length}</div>
        <div className="text-xs text-zinc-500 mt-1">
          標準：17 物件 × 2 張 = 34 張；缺漏必須為 0 才算封版
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((r) => {
          const cutoutColor =
            r.cutoutOk === null ? "text-zinc-500" : r.cutoutOk ? "text-emerald-400" : "text-red-400";
          const foundColor =
            r.foundOk === null ? "text-zinc-500" : r.foundOk ? "text-emerald-400" : "text-red-400";

          return (
            <div key={r.id} className="p-3 rounded border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between">
                <div className="font-bold">
                  {r.name} <span className="text-xs text-zinc-500 ml-2">{r.id}</span>
                </div>
                <div className="text-xs text-zinc-500">cutout / found</div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="rounded border border-zinc-800 p-2">
                  <div className={`text-xs mb-2 ${cutoutColor}`}>
                    CUTOUT: {r.cutoutOk === null ? "checking..." : r.cutoutOk ? "OK" : "MISSING"}
                  </div>
                  <img src={r.cutoutUrl} alt="" className="w-full h-auto block rounded bg-black" />
                  <div className="text-[10px] text-zinc-500 break-all mt-2">{r.cutoutUrl}</div>
                </div>

                <div className="rounded border border-zinc-800 p-2">
                  <div className={`text-xs mb-2 ${foundColor}`}>
                    FOUND: {r.foundOk === null ? "checking..." : r.foundOk ? "OK" : "MISSING"}
                  </div>
                  <img src={r.foundUrl} alt="" className="w-full h-auto block rounded bg-black" />
                  <div className="text-[10px] text-zinc-500 break-all mt-2">{r.foundUrl}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
