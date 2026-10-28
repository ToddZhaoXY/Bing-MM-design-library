import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { byTier, partsOf } from '../data/components'

const TIERS = ['Molecule', 'Cell', 'Organism'] as const

export function Nav() {
  /**
   * Collapse the whole site nav to a 44px rail. The Playground canvas renders at
   * real Figma pixels (1200 SERP / 1360 IRP) and can't shrink, so 260px of nav
   * is 260px of design you don't see. Local state on purpose — not persisted,
   * not in the URL; it's a viewing posture, not part of the page identity.
   */
  const [open, setOpen] = useState(true)

  return (
    <nav className={'nav' + (open ? '' : ' nav--collapsed')}>
      <button
        className="nav__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Collapse navigation' : 'Expand navigation'}
        title={open ? 'Collapse navigation' : 'Expand navigation'}
      >
        {open ? '‹' : '›'}
      </button>

      <div className="nav__brand">
        <h1>MMACF</h1>
        <p>Multimedia ACF · component library</p>
      </div>

      <div className="nav__group">
        <div className="nav__group-title">Overview</div>
        <NavLink
          to="/"
          end
          className={({ isActive }) => 'nav__item' + (isActive ? ' nav__item--active' : '')}
        >
          Introduction
        </NavLink>
        <NavLink
          to="/playground"
          className={({ isActive }) => 'nav__item' + (isActive ? ' nav__item--active' : '')}
        >
          Playground
        </NavLink>
      </div>

      {TIERS.map((tier) => {
        const items = byTier(tier)
        return (
          <div className="nav__group" key={tier}>
            <div className="nav__group-title">{tier}s</div>
            {items.length === 0 ? (
              <span className="nav__item nav__item--empty">coming in the next slice</span>
            ) : (
              items.map((c) => (
                <div key={c.slug}>
                  <NavLink
                    to={`/c/${c.slug}`}
                    className={({ isActive }) => 'nav__item' + (isActive ? ' nav__item--active' : '')}
                  >
                    {c.name}
                  </NavLink>
                  {partsOf(c.slug).map((p) => (
                    <NavLink
                      key={p.slug}
                      to={`/c/${p.slug}`}
                      style={{ paddingLeft: 28, opacity: 0.75 }}
                      className={({ isActive }) => 'nav__item' + (isActive ? ' nav__item--active' : '')}
                    >
                      ↳ {p.name}
                    </NavLink>
                  ))}
                </div>
              ))
            )}
          </div>
        )
      })}
    </nav>
  )
}
