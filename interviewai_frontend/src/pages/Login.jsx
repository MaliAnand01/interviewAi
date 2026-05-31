import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, BrainCircuit, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { parseApiError } from '../utils/parseApiError';

export default function Login() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await handleLogin({ email: data.email, password: data.password });
      navigate('/');
    } catch (err) {
      setApiError(parseApiError(err, 'Invalid email or password. Please try again.'));
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.08) 0%, transparent 60%), var(--bg-base)',
    }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 440, padding: '2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <BrainCircuit size={20} color="#fff" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>PrepAI</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Sign in to your account</p>
        </div>

        {apiError && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div className="input-group">
            <label htmlFor="login-email" className="input-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"><Mail size={16} /></span>
              <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com"
                className={`input-field${errors.email ? ' error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })} />
            </div>
            {errors.email && <span className="input-error"><AlertCircle size={12} />{errors.email.message}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="login-password" className="input-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><Lock size={16} /></span>
              <input id="login-password" type="password" autoComplete="current-password" placeholder="••••••••"
                className={`input-field${errors.password ? ' error' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })} />
            </div>
            {errors.password && <span className="input-error"><AlertCircle size={12} />{errors.password.message}</span>}
          </div>

          <button id="login-submit-btn" type="submit" disabled={isSubmitting} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.8125rem', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            {isSubmitting
              ? <><div className="spinner" style={{ width: 16, height: 16 }} />Signing in…</>
              : <><LogIn size={17} />Sign In</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
