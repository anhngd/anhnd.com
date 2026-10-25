import StatusDashboard from './StatusDashboard'

export const metadata = {
  title: 'Server Status',
  description: 'Real-time server monitoring dashboard.',
  // Unlisted: reachable by URL, never from search.
  robots: { index: false, follow: false },
}

export default function StatusPage() {
  return <StatusDashboard />
}
