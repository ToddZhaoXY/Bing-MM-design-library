import React from 'react'
import { useLocation } from 'react-router-dom'
import './RouteLoading.css'

export function RouteSkeleton() {
  const { pathname } = useLocation()
  const workbench = pathname !== '/'
  return <main className="main aixa-route-loading" id="main-content" role="status" aria-busy="true">
    <span className="aixa-loading-label">Loading view…</span>
    <div className="aixa-skeleton__content" aria-hidden="true">
      <div className="aixa-skeleton__header"><i className="aixa-skeleton__title" /><div className="aixa-skeleton__chips"><i /><i /><i /></div><i className="aixa-skeleton__line" /><i className="aixa-skeleton__line aixa-skeleton__line--short" /></div>
      <div className={'aixa-skeleton__panel' + (workbench ? ' aixa-skeleton__panel--workbench' : '')}>
        <div className="aixa-skeleton__preview"><i className="aixa-skeleton__heading" />{workbench ? <i className="aixa-skeleton__canvas" /> : <div className="aixa-skeleton__rows">{Array.from({ length: 7 }, (_, i) => <i className="aixa-skeleton__line" key={i} />)}</div>}</div>
        {workbench && <div className="aixa-skeleton__controls"><i className="aixa-skeleton__heading" /><i /><i /><i /></div>}
      </div>
    </div>
  </main>
}

class LoadBoundary extends React.Component<{children: React.ReactNode}, {failed: boolean}> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="main aixa-load-error" id="main-content" role="alert"><h2>This view could not load</h2><p>Please try again. Your saved library pages are still available from the navigation.</p><button className="btn" onClick={() => window.location.reload()}>Try again</button></main>
    return this.props.children
  }
}
export function RouteBoundary({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  return <LoadBoundary key={pathname}>{children}</LoadBoundary>
}
