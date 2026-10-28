import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Home } from './pages/Home'
import { ComponentPage } from './pages/ComponentPage'
import { Playground } from './pages/Playground'
import './styles.css'

// HashRouter: the Web Hub serves static files with no SPA rewrite rule.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <div className="app">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/c/:slug" element={<ComponentPage />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </div>
    </HashRouter>
  </React.StrictMode>,
)
