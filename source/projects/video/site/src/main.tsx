import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-500.css'
import '@fontsource/roboto/latin-700.css'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Home } from './pages/Home'
const ComponentPage = React.lazy(() => import('./pages/ComponentPage').then(module => ({ default: module.ComponentPage })))
const Playground = React.lazy(() => import('./pages/Playground').then(module => ({ default: module.Playground })))
const SourceCatalog = React.lazy(() => import('./pages/SourceCatalog').then(module => ({ default: module.SourceCatalog })))
const Foundations = React.lazy(() => import('./pages/Foundations').then(module => ({ default: module.Foundations })))
import { RouteBoundary, RouteSkeleton } from './components/RouteLoading'
import './styles.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  React.useLayoutEffect(() => { window.scrollTo({ top: 0, left: 0 }) }, [pathname])
  return null
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <ScrollToTop />
      <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); const main = document.getElementById('main-content'); main?.setAttribute('tabindex', '-1'); main?.focus(); main?.scrollIntoView() }}>Skip to content</a>
      <div className="app">
        <Nav />
        <RouteBoundary><React.Suspense fallback={<RouteSkeleton />}><Routes>
          <Route path="/" element={<Home />} />
          <Route path="/c/:slug" element={<ComponentPage />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/source-catalog" element={<SourceCatalog />} />
          <Route path="/foundations" element={<Foundations />} />
          <Route path="*" element={<main className="main" id="main-content"><h2>Page not found</h2><Link className="text-link" to="/">Return to introduction</Link></main>} />
        </Routes></React.Suspense></RouteBoundary>
      </div>
    </HashRouter>
  </React.StrictMode>,
)
