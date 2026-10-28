import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { byTier, partsOf } from '../data/components'

const TIERS = ['Molecule', 'Cell', 'Organism'] as const
const itemClass = ({ isActive }: { isActive: boolean }) =>
  'nav__item' + (isActive ? ' nav__item--active' : '')

export function Nav() {
  const [open, setOpen] = useState(true)

  return (
    <nav className={'nav' + (open ? '' : ' nav--collapsed')} aria-label="Component library">
      <button
        className="nav__toggle"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Collapse navigation' : 'Expand navigation'}
        aria-expanded={open}
        aria-controls="library-navigation"
        title={open ? 'Collapse navigation' : 'Expand navigation'}
        type="button"
      >{open ? '‹' : '›'}</button>
      <div id="library-navigation" hidden={!open}>
        <div className="nav__brand">
          <h1>VIDEO ACF</h1>
          <p>MM Video · component library</p>
        </div>
        <div className="nav__group">
          <div className="nav__group-title">Overview</div>
          <NavLink to="/" end className={itemClass}>Introduction</NavLink>
          <NavLink to="/foundations" className={itemClass}>Video-specific rules</NavLink>
          <NavLink to="/playground" className={itemClass}>Playground</NavLink>
          <NavLink to="/source-catalog" className={itemClass}>Components · source catalog</NavLink>
        </div>
        {TIERS.map((tier) => (
          <div className="nav__group" key={tier}>
            <div className="nav__group-title">{tier}s</div>
            {byTier(tier).map((component) => (
              <div key={component.slug}>
                <NavLink to={`/c/${component.slug}`} className={itemClass}>{component.name}</NavLink>
                {partsOf(component.slug).map((part) => (
                  <NavLink key={part.slug} to={`/c/${part.slug}`} className={itemClass} style={{ paddingLeft: 28 }}>
                    ↳ {part.name}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        ))}
        <div className="nav__source">
          <a href="https://www.figma.com/design/fRSRroY4YFgJSeqLLE0Y38/MM-ACF" target="_blank" rel="noreferrer">Open source Figma ↗</a>
        </div>
      </div>
    </nav>
  )
}
