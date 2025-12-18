import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Share2, RefreshCw } from 'lucide-react';
import CursedButton from './CursedButton';

interface TalismanGeneratorProps {
  playerName?: string;
  fearLevel: number;     // 0..100
  survivalTime: number;  // seconds
}

const clamp100 = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const TalismanGenerator: React.FC<TalismanGeneratorProps> = ({
  playerName = '倖存者',
  fearLevel,
  survivalTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const drawTalisman = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // IG Story 9:16
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const fear = clamp100(fearLevel);
    const safeName = (playerName || '倖存者').slice(0, 20);

    // background
    ctx.fillStyle = '#E6C683';
    ctx.fillRect(0, 0, width, height);

    // paper noise (ImageData)
    const noise = ctx.createImageData(width, height);
    const data = noise.data;
    for (let i = 0; i < data.length; i += 4) {
      const tone = Math.random() > 0.5 ? 0 : 1;
      const r = tone ? 0xF0 : 0xD4;
      const g = tone ? 0xD8 : 0xB4;
      const b = tone ? 0x95 : 0x70;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 18;
    }
    ctx.putImageData(noise, 0, 0);

    // borders
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#000';
    ctx.strokeRect(40, 40, width - 80, height - 80);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#8B0000';
    ctx.strokeRect(60, 60, width - 120, height - 120);

    // header glyphs
    ctx.fillStyle = '#000';
    ctx.font = 'bold 180px serif';
    ctx.textAlign = 'center';
    ctx.fillText('敕', width / 2, 300);
    ctx.fillText('令', width / 2, 480);

    // main spell
    ctx.font = 'bold 300px serif';
    ctx.fillStyle = '#8B0000';
    const mainText = ['視', '線', '不', '移'];
    mainText.forEach((char, i) => {
      const jitterX = (Math.random() - 0.5) * 10;
      ctx.fillText(char, width / 2 + jitterX, 850 + i * 300);
    });

    // data stamp
    ctx.font = 'bold 40px monospace';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';

    const now = new Date();
    const date = now.toLocaleDateString('zh-TW');
    const time = now.toLocaleTimeString('zh-TW');

    const startY = 1500;
    ctx.fillText(`ID: ${safeName}`, 100, startY);
    ctx.fillText(`DATE: ${date} ${time}`, 100, startY + 60);
    ctx.fillText(`SURVIVAL: ${Math.max(0, Math.floor(survivalTime))}s`, 100, startY + 120);

    ctx.fillText(`FEAR LEVEL: ${fear}%`, 100, startY + 180);
    ctx.fillStyle = '#333';
    ctx.fillRect(100, startY + 200, 400, 20);
    ctx.fillStyle = fear > 80 ? '#FF0000' : '#00FF41';
    ctx.fillRect(100, startY + 200, 400 * (fear / 100), 20);

    // Anlin stamp
    ctx.save();
    ctx.translate(width - 300, height - 300);
    ctx.rotate(-0.2);
    ctx.strokeStyle = '#D00';
    ctx.lineWidth = 15;
    ctx.strokeRect(0, 0, 200, 200);
    ctx.font = 'bold 80px serif';
    ctx.fillStyle = '#D00';
    ctx.textAlign = 'center';
    ctx.fillText('杏林', 100, 90);
    ctx.fillText('醫院', 100, 170);
    ctx.restore();

    // glitch lines
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = `rgba(0, 255, 65, ${Math.random() * 0.08})`;
      const y = Math.random() * height;
      ctx.fillRect(0, y, width, Math.random() * 5 + 2);
    }

    setImgUrl(canvas.toDataURL('image/png'));
  }, [fearLevel, survivalTime, playerName]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        // @ts-ignore
        if (document?.fonts?.ready) {
          // @ts-ignore
          await document.fonts.ready;
        }
      } catch {}
      if (!cancelled) drawTalisman();
    };
    run();
    return () => { cancelled = true; };
  }, [drawTalisman]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const link = document.createElement('a');
      link.download = `talisman_${Date.now()}.png`;
      link.href = url;
      link.click();
    }, 'image/png');
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `talisman_${Date.now()}.png`, { type: 'image/png' });

      // @ts-ignore
      const canShareFiles = typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] });
      // @ts-ignore
      if (navigator?.share && canShareFiles) {
        try {
          // @ts-ignore
          await navigator.share({
            title: '靈異連線：符咒生成',
            text: '我撐過了杏林醫院…（大概）',
            files: [file],
          });
        } catch {}
      } else {
        await handleDownload();
      }
    }, 'image/png');
  };

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="relative group mb-6">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="Generated Talisman"
            className="w-48 md:w-64 h-auto shadow-[0_0_30px_rgba(0,255,65,0.3)] border-2 border-stone-800 rounded"
          />
        ) : (
          <div className="w-64 h-96 bg-stone-900 animate-pulse flex items-center justify-center text-stone-600">
            繪製符咒中...
          </div>
        )}

        <button
          onClick={drawTalisman}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="重新生成"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="flex gap-3">
        <CursedButton onClick={handleDownload} className="flex items-center gap-2">
          <Download size={18} />
          <span>下載符咒</span>
        </CursedButton>

        <CursedButton onClick={handleShare} className="flex items-center gap-2">
          <Share2 size={18} />
          <span>分享</span>
        </CursedButton>
      </div>

      <p className="mt-4 text-xs text-stone-500 font-mono text-center">
        *圖片已優化為 IG 限時動態尺寸（1080×1920）
      </p>
    </div>
  );
};

export default TalismanGenerator;
