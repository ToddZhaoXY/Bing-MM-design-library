import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Home } from './pages/Home'
const ComponentPage = React.lazy(() => import('./pages/ComponentPage').then(module => ({ default: module.ComponentPage })))
const Playground = React.lazy(() => import('./pages/Playground').then(module => ({ default: module.Playground })))
import { RouteBoundary, RouteSkeleton } from './components/RouteLoading'
import './styles.css'

// HashRouter: the Web Hub serves static files with no SPA rewrite rule.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <div className="app">
        <Nav />
        <RouteBoundary><React.Suspense fallback={<RouteSkeleton />}><Routes>
          <Route path="/" element={<Home />} />
          <Route path="/c/:slug" element={<ComponentPage />} />
          <Route path="/playground" element={<Playground />} />
        </Routes></React.Suspense></RouteBoundary>
      </div>
    </HashRouter>
  </React.StrictMode>,
)
