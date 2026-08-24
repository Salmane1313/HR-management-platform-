import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth, useHasAnyRole } from '../auth/AuthContext'
import { ROLE_LABEL } from '../lib/labels'

export function Layout() {
  const { email, role, unreadCount, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = useHasAnyRole('ADMIN')
  const canManageTeam = useHasAnyRole('MANAGER', 'HR', 'ADMIN')
  const canManageStaff = useHasAnyRole('HR', 'ADMIN')
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="mobile-bar">
        <strong>Plateforme RH</strong>
        <button type="button" className="ghost-button menu-toggle" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? 'Fermer' : 'Menu'}
        </button>
      </header>

      {menuOpen && <button type="button" className="sidebar-backdrop" aria-label="Fermer le menu" onClick={closeMenu} />}

      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <h2>Plateforme RH</h2>
        <p className="sidebar-meta">{email}</p>
        {role && <p className="sidebar-role">{ROLE_LABEL[role]}</p>}

        <nav className="sidebar-nav" onClick={closeMenu}>
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/leaves">Mes congés</NavLink>
          {canManageTeam && <NavLink to="/team-leaves">Équipe</NavLink>}
          {canManageStaff && <NavLink to="/employees">Employés</NavLink>}
          {canManageStaff && <NavLink to="/departments">Départements</NavLink>}
          {isAdmin && <NavLink to="/users">Comptes</NavLink>}
          <NavLink to="/notifications">
            Notifications
            {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
          </NavLink>
          {canManageStaff && <NavLink to="/audit">Audit</NavLink>}
        </nav>

        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          Se déconnecter
        </button>
      </aside>

      <section className="content">
        <Outlet />
      </section>
    </div>
  )
}
