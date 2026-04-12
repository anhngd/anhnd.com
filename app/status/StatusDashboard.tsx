'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

// ── Config ──────────────────────────────────────────────
const STATUS_URL = process.env.NEXT_PUBLIC_STATUS_URL || ''
const REFRESH_INTERVAL = 30_000

// ── Types ───────────────────────────────────────────────
interface ServerData {
  name: string
  host: string
  location?: string
  status: 'online' | 'offline' | 'degraded'
  updated_at: string
  uptime: string
  cpu: { cores: number; usage: number }
  ram: { total_mb: number; used_mb: number; usage: number }
  disk: { total_gb: number; used_gb: number; usage: number }
  network: { upload_mbps: number; download_mbps: number; ping_ms: number }
}

interface StatusResponse {
  generated_at: string
  servers: ServerData[]
}

// ── Demo data ───────────────────────────────────────────
const DEMO: StatusResponse = {
  generated_at: new Date().toISOString(),
  servers: [
    {
      name: 'Production', host: 'prod-01.anhnd.com', location: 'Singapore', status: 'online',
      updated_at: new Date().toISOString(), uptime: '45d 12h 03m',
      cpu: { cores: 4, usage: 23 }, ram: { total_mb: 8192, used_mb: 3276, usage: 40 },
      disk: { total_gb: 100, used_gb: 42, usage: 42 },
      network: { upload_mbps: 45.2, download_mbps: 120.8, ping_ms: 1.2 },
    },
    {
      name: 'Staging', host: 'staging-01.anhnd.com', location: 'Hanoi', status: 'online',
      updated_at: new Date().toISOString(), uptime: '12d 05h 47m',
      cpu: { cores: 2, usage: 58 }, ram: { total_mb: 4096, used_mb: 2867, usage: 70 },
      disk: { total_gb: 50, used_gb: 31, usage: 62 },
      network: { upload_mbps: 22.1, download_mbps: 88.4, ping_ms: 3.5 },
    },
    {
      name: 'Database', host: 'db-01.anhnd.com', location: 'Singapore', status: 'degraded',
      updated_at: new Date().toISOString(), uptime: '90d 01h 22m',
      cpu: { cores: 8, usage: 82 }, ram: { total_mb: 32768, used_mb: 28835, usage: 88 },
      disk: { total_gb: 500, used_gb: 340, usage: 68 },
      network: { upload_mbps: 210.5, download_mbps: 450.3, ping_ms: 0.8 },
    },
    {
      name: 'Worker', host: 'worker-01.anhnd.com', location: 'Tokyo', status: 'online',
      updated_at: new Date().toISOString(), uptime: '7d 18h 55m',
      cpu: { cores: 4, usage: 35 }, ram: { total_mb: 16384, used_mb: 6553, usage: 40 },
      disk: { total_gb: 200, used_gb: 78, usage: 39 },
      network: { upload_mbps: 95.0, download_mbps: 230.7, ping_ms: 2.1 },
    },
  ],
}

// ── Helpers ──────────────────────────────────────────────
function fmt(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${Math.round(mb)} MB`
}

function pctColor(p: number): string {
  if (p >= 90) return '#EF4444'
  if (p >= 70) return '#F59E0B'
  return '#10B981'
}

function pctTrack(p: number): string {
  if (p >= 90) return 'rgba(239,68,68,0.1)'
  if (p >= 70) return 'rgba(245,158,11,0.1)'
  return 'rgba(16,185,129,0.1)'
}

function statusColor(s: string) {
  if (s === 'online') return '#10B981'
  if (s === 'degraded') return '#F59E0B'
  return '#EF4444'
}

function timeAgo(iso: string): string {
  const d = Date.now() - new Date(iso).getTime()
  const s = Math.floor(d / 1000)
  if (s < 10) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

// ── SVG Ring Gauge ──────────────────────────────────────
function Ring({ pct, size = 80, stroke = 6, label, sub }: {
  pct: number; size?: number; stroke?: number; label: string; sub: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(pct, 100) / 100) * c
  const color = pctColor(pct)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={pctTrack(pct)} strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg tabular-nums" style={{ fontWeight: 600, color }}>{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-[#1A1A1A]" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-[10px] text-[#B4B2AF]" style={{ fontWeight: 300 }}>{sub}</p>
      </div>
    </div>
  )
}

// ── Inline bar gauge ────────────────────────────────────
function Bar({ pct, label, detail }: { pct: number; label: string; detail: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[11px] text-[#605E5C]" style={{ fontWeight: 500 }}>{label}</span>
        <span className="text-[11px] text-[#8A8886] tabular-nums" style={{ fontWeight: 400 }}>{detail}</span>
      </div>
      <div className="h-[5px] rounded-full overflow-hidden" style={{ backgroundColor: pctTrack(pct) }}>
        <div className="h-full rounded-full" style={{
          width: `${Math.min(pct, 100)}%`,
          backgroundColor: pctColor(pct),
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  )
}

// ── Status dot with pulse ───────────────────────────────
function Dot({ status }: { status: string }) {
  const c = statusColor(status)
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {status === 'online' && (
        <span className="absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping" style={{ backgroundColor: c }} />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
    </span>
  )
}

// ── Main ────────────────────────────────────────────────
export default function StatusDashboard() {
  const [data, setData] = useState<StatusResponse | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    if (!STATUS_URL) {
      setData(DEMO); setIsDemo(true); setLastFetch(new Date()); return
    }
    try {
      const res = await fetch(STATUS_URL, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: StatusResponse = await res.json()
      setData(json); setIsDemo(false); setError(null); setLastFetch(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fetch failed')
      if (!data) { setData(DEMO); setIsDemo(true) }
      setLastFetch(new Date())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData()
    const t = setInterval(fetchData, REFRESH_INTERVAL)
    return () => clearInterval(t)
  }, [fetchData])

  if (!data) return null

  // ── Aggregated stats ─────────────────────────────────
  const servers = data.servers
  const online = servers.filter(s => s.status === 'online').length
  const degraded = servers.filter(s => s.status === 'degraded').length
  const offline = servers.filter(s => s.status === 'offline').length
  const allOk = online === servers.length

  const totalCores = servers.reduce((a, s) => a + s.cpu.cores, 0)
  const avgCpu = Math.round(servers.reduce((a, s) => a + s.cpu.usage, 0) / servers.length)
  const totalRam = servers.reduce((a, s) => a + s.ram.total_mb, 0)
  const usedRam = servers.reduce((a, s) => a + s.ram.used_mb, 0)
  const avgRam = Math.round((usedRam / totalRam) * 100)
  const totalDisk = servers.reduce((a, s) => a + s.disk.total_gb, 0)
  const usedDisk = servers.reduce((a, s) => a + s.disk.used_gb, 0)
  const avgDisk = Math.round((usedDisk / totalDisk) * 100)
  const totalUp = servers.reduce((a, s) => a + s.network.upload_mbps, 0)
  const totalDown = servers.reduce((a, s) => a + s.network.download_mbps, 0)
  const avgPing = +(servers.reduce((a, s) => a + s.network.ping_ms, 0) / servers.length).toFixed(1)

  return (
    <main className="min-h-screen bg-[#0B0E11]"
      style={{ fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif' }}>

      {/* ─── Header ─────────────────────────────────────── */}
      <header className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
                anhnd.com
              </Link>
              <span className="text-white/10">/</span>
              <h1 className="text-sm text-white/90" style={{ fontWeight: 500 }}>System Status</h1>
            </div>
            <div className="flex items-center gap-3">
              {isDemo && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF5F00]/10 text-[#FF5F00]" style={{ fontWeight: 500 }}>
                  Demo
                </span>
              )}
              {error && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400" style={{ fontWeight: 500 }}>
                  Error
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <Dot status={allOk ? 'online' : degraded > 0 ? 'degraded' : 'offline'} />
                <span className="text-[11px] text-white/50" style={{ fontWeight: 400 }}>
                  {allOk ? 'All operational' : `${online}/${servers.length} online`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ─── Overview Panel ───────────────────────────── */}
        <section className="bg-[#12161B] rounded-2xl border border-white/[0.06] overflow-hidden">
          {/* Top row: overall health */}
          <div className="px-6 py-5 border-b border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base text-white/90 mb-0.5" style={{ fontWeight: 500 }}>Infrastructure Overview</h2>
              <p className="text-xs text-white/30" style={{ fontWeight: 300 }}>
                {servers.length} servers across {[...new Set(servers.map(s => s.location).filter(Boolean))].length} regions
                {lastFetch && ` — updated ${timeAgo(lastFetch.toISOString())}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {online > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-white/50">{online} online</span>
                </div>
              )}
              {degraded > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[11px] text-white/50">{degraded} degraded</span>
                </div>
              )}
              {offline > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-[11px] text-white/50">{offline} offline</span>
                </div>
              )}
            </div>
          </div>

          {/* Ring gauges + network totals */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4">
              {/* CPU ring */}
              <Ring pct={avgCpu} label="CPU" sub={`${totalCores} cores total`} />
              {/* RAM ring */}
              <Ring pct={avgRam} label="Memory" sub={`${fmt(usedRam)} / ${fmt(totalRam)}`} />
              {/* Disk ring */}
              <Ring pct={avgDisk} label="Storage" sub={`${usedDisk} / ${totalDisk} GB`} />

              {/* Network summary cards */}
              <div className="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl bg-white/[0.03]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-emerald-400/70">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-lg text-white/90 tabular-nums" style={{ fontWeight: 600 }}>{totalUp.toFixed(0)}</span>
                <span className="text-[10px] text-white/30" style={{ fontWeight: 400 }}>Mbps upload</span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl bg-white/[0.03]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400/70">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
                </svg>
                <span className="text-lg text-white/90 tabular-nums" style={{ fontWeight: 600 }}>{totalDown.toFixed(0)}</span>
                <span className="text-[10px] text-white/30" style={{ fontWeight: 400 }}>Mbps download</span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl bg-white/[0.03]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-violet-400/70">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                </svg>
                <span className="text-lg text-white/90 tabular-nums" style={{ fontWeight: 600 }}>{avgPing}</span>
                <span className="text-[10px] text-white/30" style={{ fontWeight: 400 }}>ms avg ping</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Server Cards ─────────────────────────────── */}
        <section>
          <h2 className="text-xs text-white/30 uppercase tracking-wider mb-4 px-1" style={{ fontWeight: 500 }}>
            Servers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map((s) => (
              <div key={s.host}
                className="bg-[#12161B] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors overflow-hidden">

                {/* Card top */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Server icon */}
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${statusColor(s.status)}15` }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={statusColor(s.status)} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm text-white/90 truncate" style={{ fontWeight: 500 }}>{s.name}</h3>
                        <Dot status={s.status} />
                      </div>
                      <p className="text-[11px] text-white/25 truncate" style={{ fontWeight: 300 }}>
                        {s.host}{s.location ? ` — ${s.location}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-[11px] text-white/40 tabular-nums" style={{ fontWeight: 400 }}>
                      {s.uptime}
                    </p>
                    <p className="text-[10px] text-white/20" style={{ fontWeight: 300 }}>uptime</p>
                  </div>
                </div>

                {/* Resource bars */}
                <div className="px-5 pb-2 space-y-2.5">
                  <Bar pct={s.cpu.usage} label="CPU" detail={`${s.cpu.usage}% of ${s.cpu.cores} cores`} />
                  <Bar pct={s.ram.usage} label="RAM" detail={`${fmt(s.ram.used_mb)} / ${fmt(s.ram.total_mb)}`} />
                  <Bar pct={s.disk.usage} label="Disk" detail={`${s.disk.used_gb} / ${s.disk.total_gb} GB`} />
                </div>

                {/* Network row */}
                <div className="px-5 py-3 mt-1 border-t border-white/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-emerald-400/50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                      </svg>
                      <span className="text-[11px] text-white/50 tabular-nums">{s.network.upload_mbps.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-blue-400/50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                      </svg>
                      <span className="text-[11px] text-white/50 tabular-nums">{s.network.download_mbps.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-white/20">Mbps</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-white/50 tabular-nums">{s.network.ping_ms.toFixed(1)} ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── Footer ─────────────────────────────────────── */}
      <footer className="py-6 px-4 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[10px] text-white/20" style={{ fontWeight: 300 }}>
            © {new Date().getFullYear()} anhnd.com
          </p>
          <p className="text-[10px] text-white/15 tabular-nums" style={{ fontWeight: 300 }}>
            Auto-refresh every 30s
          </p>
        </div>
      </footer>
    </main>
  )
}
