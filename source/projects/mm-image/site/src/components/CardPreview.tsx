import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export function CardPreview({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null)
  const [available, setAvailable] = useState(width)
  const [fit, setFit] = useState(true)
  useEffect(() => {
    if (!host.current) return
    const observer = new ResizeObserver(() => setAvailable(host.current?.clientWidth ?? width))
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  const scale = fit ? Math.min(1, Math.max(1, available - 48) / width) : 1
  return <div style={{ minWidth: 0 }}>
    <div className="preview-toolbar">
      <span>{width} × {height} px · {Math.round(scale * 100)}%</span>
      <div><button type="button" aria-pressed={fit} onClick={() => setFit(true)}>Fit</button><button type="button" aria-pressed={!fit} onClick={() => setFit(false)}>100%</button></div>
    </div>
    <div ref={host} className="preview" style={{ display: 'block', minWidth: 0, padding: 24, minHeight: 300, overflowX: 'auto' }}>
      <div style={{ width: width * scale, height: height * scale, margin: '0 auto', flex: '0 0 auto' }}>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
      </div>
    </div>
  </div>
}
