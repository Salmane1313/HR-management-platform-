import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { login } from '../api/client'
import { useAuth } from '../auth/AuthContext'

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@hr.com', password: 'admin123' },
  { label: 'RH', email: 'rh@entreprise.com', password: 'rh123456' },
  { label: 'Manager', email: 'karim.manager@entreprise.com', password: 'manager123' },
  { label: 'Employé', email: 'sara.employe@entreprise.com', password: 'employe123' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, loginSuccess } = useAuth()
  const [email, setEmail] = useState('admin@hr.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      await loginSuccess()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <p className="eyebrow">Gestion des ressources humaines</p>
        <h1>Plateforme RH</h1>
        <p className="login-subtitle">Connectez-vous pour gérer les employés, congés et validations.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="demo-accounts">
          <p>Comptes de démonstration</p>
          <p className="muted">
            Seul <strong>admin@hr.com</strong> est créé au démarrage du backend. Les autres comptes se créent
            depuis Employés ou Comptes.
          </p>
          <div className="demo-buttons">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                className="ghost-button"
                onClick={() => {
                  setEmail(account.email)
                  setPassword(account.password)
                  setError('')
                }}
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
