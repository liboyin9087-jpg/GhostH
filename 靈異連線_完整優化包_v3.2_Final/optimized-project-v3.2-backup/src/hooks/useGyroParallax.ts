import { useEffect, useState } from 'react';

export function useGyroParallax(enabled: boolean) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    const handler = (e: DeviceOrientationEvent) => {
      if (!active) return;
      const x = (e.gamma ?? 0) / 30; // left-right
      const y = (e.beta ?? 0) / 30;  // up-down
      setOffset({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      });
    };

    const start = async () => {
      // iOS permission flow
      // @ts-ignore
      if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
        try {
          // @ts-ignore
          const res = await DeviceOrientationEvent.requestPermission();
          if (res !== 'granted') return;
        } catch {
          return;
        }
      }
      window.addEventListener('deviceorientation', handler);
    };

    start();

    return () => {
      active = false;
      window.removeEventListener('deviceorientation', handler);
    };
  }, [enabled]);

  return offset; // -1..1
}
