import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-500.css'
import '@fontsource/roboto/latin-700.css'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Home } from './pages/Home'
import { ComponentPage } from './pages/ComponentPage'
import { Playground } from './pages/Playground'
import { SourceCatalog } from './pages/SourceCatalog'
import { Foundations } from './pages/Foundations'
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/c/:slug" element={<ComponentPage />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/source-catalog" element={<SourceCatalog />} />
          <Route path="/foundations" element={<Foundations />} />
          <Route path="*" element={<main className="main" id="main-content"><h2>Page not found</h2><Link className="text-link" to="/">Return to introduction</Link></main>} />
        </Routes>
      </div>
    </HashRouter>
  </React.StrictMode>,
)
