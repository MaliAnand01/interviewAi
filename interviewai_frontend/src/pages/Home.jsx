import { useState, useRef, useEffect } from 'react';
import { parseApiError } from '../utils/parseApiError';
import { useNavigate } from 'react-router';
import {
  Briefcase, User, UploadCloud, FileText, Info,
  Sparkles, LogOut, BrainCircuit, TrendingUp, Calendar,
  AlertCircle, X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInterview } from '../hooks/useInterview';

function ScoreBadge({ score }) {
  if (score >= 80) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700,
      padding: '0.25rem 0.625rem', borderRadius: '6px',
      background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)',
      whiteSpace: 'nowrap', flexShrink: 0 }}>
      {score}% match
    </span>
  );
  if (score >= 60) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700,
      padding: '0.25rem 0.625rem', borderRadius: '6px',
      background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)',
      whiteSpace: 'nowrap', flexShrink: 0 }}>
      {score}% match
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700,
      padding: '0.25rem 0.625rem', borderRadius: '6px',
      background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)',
      whiteSpace: 'nowrap', flexShrink: 0 }}>
      {score}% match
    </span>
  );
}

function ReportCard({ report, onClick }) {
  const date = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Unknown date';

  return (
    <div id={`report-card-${report.id}`} onClick={onClick} style={{
      padding: '1.125rem',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer', transition: 'all 0.2s ease',
      display: 'flex', flexDirection: 'column', gap: '0.625rem',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, minWidth: 0 }}>
          {report.title || 'Untitled Position'}
        </h4>
        <ScoreBadge score={report.matchScore ?? 0} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
        <Calendar size={12} />
        <span>Generated on {date}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { generateReport, getReports, reports, loading } = useInterview();

  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    getReports().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { setGenerateError('Only PDF files are accepted.'); return; }
    if (file.size > 3 * 1024 * 1024) { setGenerateError('File size must be under 3MB.'); return; }
    setGenerateError('');
    setResumeFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files[0]); };

  const handleGenerate = async () => {
    setGenerateError('');
    if (!jobDescription.trim()) { setGenerateError('Job description is required.'); return; }
    if (!resumeFile && !selfDescription.trim()) { setGenerateError('Please provide either a resume or a self-description.'); return; }
    try {
      const report = await generateReport({ jobDescription, selfDescription, resumeFile });
      navigate(`/interview/${report.id}`);
    } catch (err) {
      setGenerateError(parseApiError(err, 'Failed to generate report. Please try again.'));
    }
  };

  const onLogout = async () => { await handleLogout(); navigate('/login'); };

  if (loading) {
    return (
      <div className="page-loading">
        <div style={{ position: 'relative' }}>
          <div className="spinner spinner-lg" />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: '0 0 40px rgba(99,102,241,0.4)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
            Analyzing your profile and generating interview strategy…
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>This usually takes 20–30 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.1) 0%, transparent 50%), var(--bg-base)', paddingBottom: '3rem' }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '2.5rem 0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '9px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
              <BrainCircuit size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>PrepAI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Signed in as</p>
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>Hello, {user?.username}</p>
            </div>
            <button id="logout-btn" onClick={onLogout} className="btn btn-ghost" style={{ padding: '0.5rem 0.75rem' }} title="Logout">
              <LogOut size={16} />
              <span style={{ fontSize: '0.8125rem' }}>Logout</span>
            </button>
          </div>
        </header>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', animation: 'fadeIn 0.5s ease' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
            Create Your Custom{' '}
            <span className="gradient-text">Interview Plan</span>
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            Let our AI analyze the job requirements and your unique profile to build a winning strategy.
          </p>
        </div>

        {/* Error Alert */}
        {generateError && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem', maxWidth: 900, margin: '0 auto 1.5rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{generateError}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0 }}>
            {/* Left: Job Description */}
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.125rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={16} style={{ color: 'var(--accent-light)' }} />
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Target Job Description</h2>
                <span className="badge badge-red" style={{ marginLeft: 'auto' }}>Required</span>
              </div>
              <textarea id="job-description-input" value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                maxLength={5000} placeholder="Paste the full job description here..."
                className="textarea-field" style={{ minHeight: 360, resize: 'vertical' }} />
              <p style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {jobDescription.length} / 5000 chars
              </p>
            </div>

            {/* Divider */}
            <div style={{ background: 'var(--border)', alignSelf: 'stretch' }} />

            {/* Right: Profile */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} style={{ color: 'var(--success)' }} />
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Your Profile</h2>
              </div>

              {/* Resume Upload */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Upload Resume</label>
                  <span className="badge badge-green">Best Results</span>
                </div>
                <label htmlFor="resume-upload" style={{ display: 'block', cursor: 'pointer' }}>
                  <div className={`drop-zone${isDragging ? ' dragging' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} style={{ transition: 'all 0.2s ease' }}>
                    {resumeFile ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem' }}>
                        <FileText size={28} style={{ color: 'var(--success)' }} />
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{resumeFile.name}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Click to change file</p>
                        <button id="remove-resume-btn" type="button"
                          onClick={e => { e.preventDefault(); setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="btn btn-danger" style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}>
                          <X size={13} /> Remove
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <UploadCloud size={32} style={{ color: isDragging ? 'var(--accent-light)' : 'var(--text-muted)' }} />
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: isDragging ? 'var(--accent-light)' : 'var(--text-primary)' }}>
                          Click to upload or drag &amp; drop
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>PDF (Max 3MB)</p>
                      </div>
                    )}
                  </div>
                  <input id="resume-upload" ref={fileInputRef} type="file" accept="application/pdf"
                    style={{ display: 'none' }} onChange={e => handleFileChange(e.target.files[0])} />
                </label>
              </div>

              <div className="divider">OR</div>

              {/* Self Description */}
              <div>
                <label htmlFor="self-description-input" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>
                  Quick Self-Description
                </label>
                <textarea id="self-description-input" value={selfDescription} onChange={e => setSelfDescription(e.target.value)}
                  placeholder="Briefly describe your experience, key skills, and years of experience..."
                  className="textarea-field" style={{ minHeight: 100, resize: 'vertical' }} />
              </div>

              <div className="alert alert-info">
                <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: '0.8125rem' }}>
                  Either a Resume or a Self Description is required to generate a personalized plan.
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <TrendingUp size={13} />
              AI-Powered Strategy Generation • Approx 30s
            </p>
            <button id="generate-btn" onClick={handleGenerate} disabled={loading} className="btn btn-primary"
              style={{ fontSize: '0.9375rem', padding: '0.75rem 1.5rem' }}>
              <Sparkles size={17} />
              Generate My Interview Strategy
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        {reports.length > 0 && (
          <section style={{ animation: 'fadeIn 0.5s ease 0.2s both' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} style={{ color: 'var(--accent-light)' }} />
              My Recent Interview Plans
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {reports.map(report => (
                <ReportCard key={report.id} report={report} onClick={() => navigate(`/interview/${report.id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Help Center'].map(link => (
              <a key={link} href="#" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{link}</a>
            ))}
          </div>
          <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} PrepAI. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
