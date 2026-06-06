import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'

const AUTH_KEY = 'aliz_auth_user'
const REGISTER_CODE = '123456'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function saveSession(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('aliz-auth-change'))
}

function decodeJwtPayload(token) {
  const payload = token.split('.')[1]
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
  return JSON.parse(decodeURIComponent([...json].map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')))
}

function loadGoogleIdentity() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve(window.google)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function GoogleIcon() {
  return (
    <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export default function AuthPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [verifyMode, setVerifyMode] = useState(false)

  const resetToken = params.get('token')

  const copy = useMemo(() => {
    if (pathname === '/register') {
      return {
        icon: 'ti-user-plus',
        title: verifyMode ? 'Verify your email' : 'Create your account',
        subtitle: verifyMode ? `We sent a code to ${email}` : 'Sign up to get started',
        footer: <>Already have an account? <Link to="/login">Log in</Link></>
      }
    }
    if (pathname === '/forgot-password') {
      return {
        icon: 'ti-mail',
        title: 'Reset password',
        subtitle: "We'll send you a link to reset it",
        footer: <Link to="/login"><i className="ti ti-arrow-left" /> Back to log in</Link>
      }
    }
    if (pathname === '/reset-password') {
      return resetToken ? {
        icon: 'ti-lock',
        title: 'New password',
        subtitle: 'Enter your new password below'
      } : {
        icon: 'ti-alert-circle',
        title: 'Invalid reset link',
        subtitle: 'This password reset link is missing or invalid',
        footer: <Link to="/forgot-password">Request a new link</Link>
      }
    }
    return {
      icon: 'ti-login',
      title: 'Welcome back',
      subtitle: 'Log in to your account',
      footer: <>Don&apos;t have an account? <Link to="/register">Create one</Link></>
    }
  }, [pathname, verifyMode, email, resetToken])

  const finishLogin = user => {
    saveSession({ ...user, loggedAt: new Date().toISOString() })
    navigate('/')
  }

  const loginWithGoogle = async () => {
    setError('')
    setLoading(true)
    if (!GOOGLE_CLIENT_ID) {
      await new Promise(resolve => setTimeout(resolve, 700))
      finishLogin({
        name: 'Google User',
        email: 'google.user@aliz.com.br',
        provider: 'google',
        avatar: 'G',
        demo: true
      })
      return
    }

    try {
      const google = await loadGoogleIdentity()
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: response => {
          const profile = decodeJwtPayload(response.credential)
          finishLogin({
            name: profile.name,
            email: profile.email,
            provider: 'google',
            avatar: profile.picture || profile.name?.charAt(0) || 'G'
          })
        }
      })
      google.accounts.id.prompt(notification => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          google.accounts.id.renderButton(document.getElementById('google-real-button'), {
            theme: 'outline',
            size: 'large',
            width: 384
          })
          setLoading(false)
          setMessage('Escolha sua conta Google no botão abaixo.')
        }
      })
    } catch {
      setLoading(false)
      setError('Google login is unavailable right now. Check your client id or network.')
    }
  }

  const submitLogin = async event => {
    event.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 650))
    finishLogin({
      name: email.split('@')[0] || 'Aliz User',
      email,
      provider: 'email',
      avatar: email.charAt(0).toUpperCase()
    })
  }

  const submitRegister = async event => {
    event.preventDefault()
    setError('')
    if (!email || !password || !confirm) {
      setError('Fill all fields to continue')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 650))
    setLoading(false)
    setVerifyMode(true)
    setMessage(`Use code ${REGISTER_CODE} to verify this local demo account.`)
  }

  const verifyEmail = async () => {
    setError('')
    if (otp !== REGISTER_CODE) {
      setError('Invalid verification code')
      return
    }
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    finishLogin({
      name: email.split('@')[0] || 'Aliz User',
      email,
      provider: 'email',
      avatar: email.charAt(0).toUpperCase()
    })
  }

  const submitForgot = async event => {
    event.preventDefault()
    setError('')
    if (!email) {
      setError('Email address is required')
      return
    }
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 650))
    setLoading(false)
    setMessage("If an account exists with that email, you'll receive a password reset link shortly.")
  }

  const submitReset = async event => {
    event.preventDefault()
    setError('')
    if (!resetToken) return
    if (!password || !confirm) {
      setError('Fill both password fields')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    navigate('/login')
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-head">
          <Link className="auth-logo" to="/">Aliz</Link>
          <div className="auth-icon"><i className={`ti ${copy.icon}`} /></div>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>

        <div className="auth-card">
          {pathname !== '/forgot-password' && pathname !== '/reset-password' && !verifyMode && (
            <>
              <button className="google" onClick={loginWithGoogle} disabled={loading}>
                <GoogleIcon /> Continue with Google
              </button>
              <div id="google-real-button" className="google-real-button" />
              <div className="or"><span />or<span /></div>
            </>
          )}

          {error && <div className="auth-alert error">{error}</div>}
          {message && <div className="auth-alert success">{message}</div>}

          {pathname === '/register' && verifyMode ? (
            <div className="otp-box">
              <div className="otp-slots">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span key={index} className={otp[index] ? 'filled' : ''}>{otp[index] || ''}</span>
                ))}
              </div>
              <input
                value={otp}
                onChange={event => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoFocus
                aria-label="Verification code"
              />
              <button className="submit" onClick={verifyEmail} disabled={loading || otp.length < 6}>
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <p className="resend">Didn&apos;t receive the code? <button onClick={() => setMessage(`New code sent. Use ${REGISTER_CODE}.`)}>Resend</button></p>
            </div>
          ) : pathname === '/register' ? (
            <form onSubmit={submitRegister}>
              <Field label="Email" icon="ti-mail" type="email" value={email} onChange={setEmail} autoComplete="email" autoFocus />
              <Field label="Password" icon="ti-lock" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
              <Field label="Confirm Password" icon="ti-lock" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
              <button className="submit" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
            </form>
          ) : pathname === '/forgot-password' ? (
            message ? (
              <p className="auth-message">{message}</p>
            ) : (
              <form onSubmit={submitForgot}>
                <Field label="Email address" icon="ti-mail" type="email" value={email} onChange={setEmail} autoComplete="email" autoFocus />
                <button className="submit" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
              </form>
            )
          ) : pathname === '/reset-password' ? (
            resetToken ? (
              <form onSubmit={submitReset}>
                <Field label="New Password" icon="ti-lock" type="password" value={password} onChange={setPassword} autoComplete="new-password" autoFocus />
                <Field label="Confirm Password" icon="ti-lock" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
                <button className="submit" type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</button>
              </form>
            ) : (
              <p className="auth-message">The link you used appears to be incomplete. Please request a new password reset email.</p>
            )
          ) : (
            <form onSubmit={submitLogin}>
              <Field label="Email" icon="ti-mail" type="email" value={email} onChange={setEmail} autoComplete="email" autoFocus />
              <div>
                <div className="field-line">
                  <span>Password</span>
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
                <Field icon="ti-lock" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
              </div>
              <button className="submit" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
            </form>
          )}
        </div>

        {copy.footer && <p className="auth-foot">{copy.footer}</p>}
      </section>
    </main>
  )
}

function Field({ label, icon, type, value, onChange, autoComplete, autoFocus }) {
  return (
    <label className="auth-field">
      {label && <span>{label}</span>}
      <div>
        <i className={`ti ${icon}`} />
        <input
          type={type}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={type === 'password' ? '••••••••' : 'you@example.com'}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required
        />
      </div>
    </label>
  )
}
