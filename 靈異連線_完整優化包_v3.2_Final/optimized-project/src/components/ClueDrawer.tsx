import React, { useEffect, useRef } from 'react'

export type Clue = { title: string; description: string; time: string; isNew: boolean }

export function ClueDrawer({
  isOpen,
  onClose,
  objective,
  threatLabel,
  clues,
  onSelect,
}: {
  isOpen: boolean
  onClose: () => void
  objective: string
  threatLabel: string
  clues: Clue[]
  onSelect?: (clue: Clue) => void
}) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    setTimeout(() => panelRef.current?.querySelector<HTMLElement>('button')?.focus(), 0)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && (
        <div aria-hidden onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 55, backdropFilter: 'blur(4px)' }} />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="線索紀錄"
        ref={panelRef}
        style={{
          position: 'absolute',
          top: 56,
          right: 0,
          width: 300,
          height: 'calc(100% - 160px)',
          zIndex: 60,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 260ms ease-out',
          background: 'linear-gradient(to bottom, rgba(12,10,9,.98), rgba(28,25,23,.95))',
          borderLeft: '1px solid rgba(120,113,108,.28)',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid rgba(120,113,108,.35)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span aria-hidden>📜</span>
            <div style={{ color: 'rgba(245,158,11,.95)', fontSize: 14, letterSpacing: '.12em' }}>線索紀錄</div>
          </div>
          <button className="btn" onClick={onClose} style={{ padding: '6px 10px', minHeight: 36 }} aria-label="關閉線索抽屜">✕</button>
        </div>

        <div style={{ border: '1px solid rgba(120,113,108,.28)', borderRadius: 10, padding: 10, background: 'rgba(41,37,36,.35)' }}>
          <div className="tiny" style={{ color: 'rgba(168,162,158,.85)' }}>CURRENT OBJECTIVE</div>
          <div style={{ fontFamily: "'Noto Sans TC', sans-serif", fontSize: 14, color: 'rgba(231,229,228,.95)' }}>{objective}</div>
        </div>

        <div style={{ border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, padding: 10, background: 'rgba(69,10,10,.25)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div aria-hidden style={{ width: 8, height: 8, background: 'rgba(239,68,68,.9)', borderRadius: 99, boxShadow: '0 0 14px rgba(239,68,68,.25)' }} />
          <div style={{ fontFamily: "'Noto Sans TC', sans-serif", fontSize: 12, color: 'rgba(248,113,113,.95)' }}>靈異威脅等級：{threatLabel}</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'grid', gap: 8 }}>
          <div className="tiny" style={{ color: 'rgba(168,162,158,.85)' }}>EVIDENCE COLLECTED</div>
          {clues.map((clue, idx) => (
            <button
              key={idx}
              className="btn"
              style={{
                alignItems: 'stretch',
                textAlign: 'left',
                background: clue.isNew ? 'rgba(120,53,15,.25)' : 'rgba(41,37,36,.25)',
                borderColor: clue.isNew ? 'rgba(245,158,11,.35)' : 'rgba(120,113,108,.25)',
              }}
              onClick={() => onSelect?.(clue)}
              aria-label={`線索：${clue.title}`}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                {clue.isNew && <span aria-hidden style={{ marginTop: 2 }}>•</span>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Noto Sans TC', sans-serif", fontSize: 13, color: clue.isNew ? 'rgba(254,243,199,.95)' : 'rgba(214,211,209,.95)' }}>
                    {clue.title}
                  </div>
                  <div style={{ fontFamily: "'Noto Sans TC', sans-serif", fontSize: 11, color: 'rgba(168,162,158,.9)' }}>{clue.description}</div>
                </div>
                <div className="tiny" style={{ color: 'rgba(120,113,108,.95)' }}>{clue.time}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
