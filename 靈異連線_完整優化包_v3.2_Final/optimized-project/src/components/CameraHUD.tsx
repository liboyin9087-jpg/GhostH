import React from 'react'

export function CameraHUD({
  signalStrength,
  batteryLevel,
  isoValue,
  status,
  cameraId,
}: {
  signalStrength: number
  batteryLevel: number
  isoValue: number
  status: 'stable' | 'unstable'
  cameraId: string
}) {
  const sig = Math.max(0, Math.min(100, signalStrength))
  const bat = Math.max(0, Math.min(100, batteryLevel))
  const barColor = (v: number) => (v > 60 ? 'rgba(16,185,129,.95)' : v > 30 ? 'rgba(245,158,11,.95)' : 'rgba(239,68,68,.95)')

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 60, padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: 'rgba(239,68,68,.9)',
                boxShadow: status === 'unstable' ? '0 0 0 6px rgba(239,68,68,.18)' : 'none',
              }}
            />
            <div style={{ color: 'rgba(239,68,68,.9)', fontSize: 18, letterSpacing: '.12em' }}>REC</div>
            <div style={{ color: 'rgba(239,68,68,.45)', fontSize: 12 }}>●</div>
          </div>
          <div className="small" style={{ color: 'rgba(255,255,255,.55)' }}>AK</div>
          <div className="small" style={{ color: 'rgba(255,255,255,.55)' }}>{cameraId}</div>
        </div>

        <div style={{ textAlign: 'right', display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
            <span className="tiny" style={{ color: 'rgba(255,255,255,.45)' }}>SIGNAL</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 16 }} aria-hidden>
              {[1,2,3,4,5].map((i) => {
                const on = sig / 20 >= i
                return (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: `${30 + i * 14}%`,
                      borderRadius: 2,
                      background: on ? barColor(sig) : 'rgba(68,64,60,.85)',
                    }}
                  />
                )
              })}
            </div>
          </div>

          <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 16, letterSpacing: '.10em' }}>ISO {isoValue}</div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
            <div aria-hidden style={{ width: 28, height: 12, border: '1px solid rgba(255,255,255,.35)', borderRadius: 2, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  bottom: 2,
                  width: `${Math.max(2, bat)}%`,
                  borderRadius: 2,
                  background: bat > 50 ? 'rgba(16,185,129,.95)' : bat > 20 ? 'rgba(245,158,11,.95)' : 'rgba(239,68,68,.95)',
                }}
              />
            </div>
            <div aria-hidden style={{ width: 3, height: 7, background: 'rgba(255,255,255,.35)', borderRadius: 1 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
