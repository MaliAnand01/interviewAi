import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Code2, MessageSquare, Navigation, Sparkles,
  ArrowLeft, BrainCircuit, AlertTriangle, Target,
  Calendar, ChevronRight, FileText, ChevronDown,
} from 'lucide-react';
import { useInterview } from '../hooks/useInterview';
import QuestionCard from '../components/QuestionCard';
import RoadMapDay from '../components/RoadMapDay';
import { parseApiError } from '../utils/parseApiError';

// ─── Score Ring ────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const size = 96;
  const sw = 9;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const c = Math.max(0, Math.min(100, score ?? 0));
  const offset = circ - (c / 100) * circ;

  const [color, glow, label, sublabel] =
    c >= 80 ? ['#10b981', 'rgba(16,185,129,0.28)', 'Strong Match',  'You\'re a great fit for this role']
    : c >= 60 ? ['#f59e0b', 'rgba(245,158,11,0.28)', 'Good Match',  'Bridge a few gaps to stand out']
    :           ['#ef4444', 'rgba(239,68,68,0.28)',   'Needs Work',  'Focus on the roadmap below'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {/* Ring — no outer box-shadow glow per user request */}
      <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, position: 'relative' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw + 4}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" opacity={0.12}
            style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease, stroke 0.4s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.375rem', fontWeight: 900, lineHeight: 1, color }}>{c}</span>
          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 600 }}>/100</span>
        </div>
      </div>

      {/* Text beside ring */}
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Match Score</p>
        <p style={{ fontSize: '1rem', fontWeight: 800, color, lineHeight: 1.2, marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{sublabel}</p>
      </div>
    </div>
  );
}

// ─── Skill Gap Row — clickable accordion ──────────────────────────────────
// Collapsed: dot + truncated name + severity badge + chevron
// Expanded (on click): full name shown wrapped, no truncation ever
function SkillRow({ skill, severity }) {
  const [open, setOpen] = useState(false);

  const cfg = {
    high:   { dot: '#ef4444', pill: 'rgba(239,68,68,0.12)',   text: '#fca5a5', border: 'rgba(239,68,68,0.22)',   label: 'High',   bg: 'rgba(239,68,68,0.05)'   },
    medium: { dot: '#f59e0b', pill: 'rgba(245,158,11,0.12)',  text: '#fcd34d', border: 'rgba(245,158,11,0.22)',  label: 'Med',    bg: 'rgba(245,158,11,0.05)'  },
    low:    { dot: '#3b82f6', pill: 'rgba(59,130,246,0.10)',  text: '#93c5fd', border: 'rgba(59,130,246,0.18)',  label: 'Low',    bg: 'rgba(59,130,246,0.04)'  },
  }[severity] || { dot: '#64748b', pill: 'rgba(100,116,139,0.1)', text: '#94a3b8', border: 'rgba(100,116,139,0.18)', label: '—', bg: 'transparent' };

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
      {/* Clickable header row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '0.45rem',
          padding: '0.425rem 0.375rem', background: open ? cfg.bg : 'transparent',
          border: 'none', cursor: 'pointer', textAlign: 'left',
          borderRadius: open ? '6px 6px 0 0' : '6px',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        {/* Severity dot */}
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
        {/* Truncated name (collapsed) */}
        <span style={{
          flex: 1, fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500,
          minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {skill}
        </span>
        {/* Severity badge */}
        <span style={{
          fontSize: '0.62rem', fontWeight: 700, padding: '0.12rem 0.4rem', borderRadius: '4px',
          background: cfg.pill, color: cfg.text, border: `1px solid ${cfg.border}`,
          flexShrink: 0, letterSpacing: '0.03em',
        }}>{cfg.label}</span>
        {/* Chevron */}
        <ChevronDown size={12} style={{
          color: 'var(--text-muted)', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }} />
      </button>

      {/* Expanded: full text, wraps naturally */}
      {open && (
        <div style={{
          padding: '0.5rem 0.875rem 0.625rem 1.375rem',
          background: cfg.bg,
          borderRadius: '0 0 6px 6px',
          animation: 'fadeIn 0.15s ease',
        }}>
          <p style={{
            fontSize: '0.8125rem', color: cfg.text, fontWeight: 600,
            lineHeight: 1.55,
            wordBreak: 'break-word',   // handles any edge-case long words
          }}>
            {skill}
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Severity: <span style={{ color: cfg.text, fontWeight: 600 }}>{cfg.label === 'Med' ? 'Medium' : cfg.label}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Stat Row (sidebar summary) ────────────────────────────────────────────
function StatLine({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: color || 'var(--accent-light)' }}>{value}</span>
    </div>
  );
}

// ─── Sidebar Card ──────────────────────────────────────────────────────────
function SideCard({ title, icon: Icon, children, accentColor, maxHeight }) {
  return (
    <div style={{ background: 'rgba(17,24,39,0.7)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
        <Icon size={13} style={{ color: accentColor || 'var(--accent-light)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</span>
      </div>
      <div style={{
        padding: '0.75rem 1rem',
        ...(maxHeight ? { maxHeight, overflowY: 'auto', overflowX: 'hidden' } : {}),
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Nav config ────────────────────────────────────────────────────────────
const NAV = [
  { id: 'technical',  label: 'Technical Questions',  Icon: Code2,         color: '#818cf8', desc: 'Core tech & problem solving' },
  { id: 'behavioral', label: 'Behavioral Questions', Icon: MessageSquare, color: '#a78bfa', desc: 'Soft skills & STAR responses' },
  { id: 'roadmap',    label: 'Preparation Plan',     Icon: Navigation,    color: '#34d399', desc: 'Day-by-day study roadmap' },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { getReportById, getResumePdf, report, loading } = useInterview();
  const [activeNav, setActiveNav] = useState('technical');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [showMobileAnalysis, setShowMobileAnalysis] = useState(false);

  useEffect(() => {
    if (interviewId) getReportById(interviewId).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const handleDownloadPdf = async () => {
    setPdfError('');
    setPdfLoading(true);
    try { await getResumePdf(interviewId); }
    catch (err) { setPdfError(parseApiError(err, 'PDF download failed. Please try again.')); }
    finally { setPdfLoading(false); }
  };

  if (loading || !report) {
    return (
      <div className="page-loading">
        <div className="spinner spinner-lg" />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Loading your interview plan…</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Fetching personalised report</p>
        </div>
      </div>
    );
  }

  const techQ   = report.technicalQuestions  || [];
  const behavQ  = report.behavioralQuestions || [];
  const roadmap = report.preparationPlan     || [];
  const gaps    = report.skillGaps           || [];

  // Sort: high → medium → low
  const sortedGaps = [
    ...gaps.filter(g => g.severity === 'high'),
    ...gaps.filter(g => g.severity === 'medium'),
    ...gaps.filter(g => g.severity === 'low'),
    ...gaps.filter(g => !['high','medium','low'].includes(g.severity)),
  ];

  const activeSection = NAV.find(n => n.id === activeNav);
  const count = activeNav === 'technical' ? techQ.length : activeNav === 'behavioral' ? behavQ.length : roadmap.length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

      {/* ═══ HEADER ═══════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        height: 54, display: 'flex', alignItems: 'center',
        padding: '0 1.5rem', gap: '0.875rem', flexShrink: 0,
      }}>
        <button id="back-btn" onClick={() => navigate('/')} className="btn btn-ghost"
          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem', flexShrink: 0 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="interview-header-divider" />
        <div className="interview-header-logo">
          <div style={{ width: 24, height: 24, borderRadius: '6px', background: 'linear-gradient(135deg,#6366f1,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BrainCircuit size={12} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>PrepAI</span>
        </div>
        <div style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0 }} />
        <p style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
          {report.title || 'Interview Plan'}
        </p>
        {report.createdAt && (
          <div className="interview-header-date">
            <Calendar size={12} />
            {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </header>

      {/* ═══ BODY — responsive layout ════════════════════════════════════════ */}
      <div className="interview-layout">

        {/* ── LEFT NAV ──────────────────────────────────────────────────────── */}
        <aside className="interview-sidebar-left">
          <p style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '0.625rem', marginBottom: '0.5rem' }}>
            Sections
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {NAV.map(({ id, label, Icon, color, desc }) => {
              const isActive = activeNav === id;
              const cnt = id === 'technical' ? techQ.length : id === 'behavioral' ? behavQ.length : roadmap.length;
              return (
                <button key={id} id={`nav-${id}`} onClick={() => setActiveNav(id)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0.625rem', width: '100%', textAlign: 'left',
                  borderRadius: '8px', cursor: 'pointer',
                  border: isActive ? `1px solid ${color}35` : '1px solid transparent',
                  background: isActive ? `${color}10` : 'transparent',
                  color: isActive ? color : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                >
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>{label}</div>
                    <div style={{ fontSize: '0.68rem', opacity: 0.65, marginTop: '0.1rem' }}>{desc}</div>
                  </div>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, borderRadius: '4px', padding: '0.1rem 0.35rem',
                    background: isActive ? `${color}20` : 'rgba(255,255,255,0.05)',
                    color: isActive ? color : 'var(--text-muted)', flexShrink: 0,
                  }}>{cnt}</span>
                </button>
              );
            })}
          </div>

          {/* Download PDF */}
          <div style={{ marginTop: 'auto', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
            {pdfError && (
              <div style={{ fontSize: '0.72rem', color: 'var(--danger)', marginBottom: '0.5rem', display: 'flex', gap: '0.3rem', alignItems: 'flex-start', padding: '0.5rem', borderRadius: '6px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <AlertTriangle size={11} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{pdfError}</span>
              </div>
            )}
            <button id="download-resume-btn" onClick={handleDownloadPdf} disabled={pdfLoading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.575rem' }}>
              {pdfLoading
                ? <><div className="spinner" style={{ width: 12, height: 12 }} />Generating…</>
                : <><Sparkles size={13} />Download Resume</>}
            </button>
          </div>
        </aside>

        {/* ── CENTER CONTENT ────────────────────────────────────────────────── */}
        <main style={{ padding: '1.25rem 1.125rem', overflowY: 'auto', minWidth: 0 }}>
          
          {/* Mobile Swipable Tabs Navigation (visible only on mobile) */}
          <div className="mobile-section-nav">
            {NAV.map(({ id, label, Icon, color }) => {
              const isActive = activeNav === id;
              const cnt = id === 'technical' ? techQ.length : id === 'behavioral' ? behavQ.length : roadmap.length;
              return (
                <button
                  key={id}
                  id={`mobile-nav-${id}`}
                  onClick={() => setActiveNav(id)}
                  className={`mobile-section-btn${isActive ? ' active' : ''}`}
                  style={isActive ? { borderLeft: `3px solid ${color}` } : {}}
                >
                  <Icon size={13} style={{ color: isActive ? color : 'inherit' }} />
                  <span>{label} ({cnt})</span>
                </button>
              );
            })}
          </div>

          {/* Expandable Match Analysis Summary for Mobile (visible only on mobile) */}
          <div className="mobile-analysis-panel">
            <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={16} style={{ color: (report.matchScore ?? 0) >= 80 ? '#10b981' : (report.matchScore ?? 0) >= 60 ? '#f59e0b' : '#ef4444' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                    Profile Match:{' '}
                    <span style={{ color: (report.matchScore ?? 0) >= 80 ? '#10b981' : (report.matchScore ?? 0) >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {report.matchScore ?? 0}%
                    </span>
                  </span>
                </div>
                <button 
                  onClick={() => setShowMobileAnalysis(!showMobileAnalysis)}
                  className="btn btn-ghost"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', gap: '0.2rem' }}
                >
                  {showMobileAnalysis ? 'Hide Match Details' : 'View Match Details'}
                  <ChevronDown size={12} style={{ transform: showMobileAnalysis ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
              </div>
              
              {showMobileAnalysis && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeIn 0.2s ease' }}>
                  <ScoreRing score={report.matchScore ?? 0} />
                  
                  <div style={{ marginTop: '0.25rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>
                      Skill Gaps ({gaps.length})
                    </p>
                    {gaps.length === 0 ? (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No gaps identified 🎉</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {sortedGaps.map((g, i) => (
                          <SkillRow key={i} skill={g.skill} severity={g.severity} />
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    id="mobile-download-resume-btn"
                    onClick={handleDownloadPdf} 
                    disabled={pdfLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.775rem', padding: '0.5rem', marginTop: '0.25rem' }}
                  >
                    {pdfLoading
                      ? <><div className="spinner" style={{ width: 12, height: 12 }} />Generating…</>
                      : <><Sparkles size={13} />Download Resume PDF</>}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.375rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '9px', flexShrink: 0,
              background: `${activeSection.color}14`, border: `1px solid ${activeSection.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <activeSection.Icon size={16} style={{ color: activeSection.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
                {activeSection.label}
              </h1>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                {activeNav === 'technical'  && `${count} questions — expand each to reveal intent & model answer`}
                {activeNav === 'behavioral' && `${count} questions — practise your STAR-method responses`}
                {activeNav === 'roadmap'    && `${count}-day plan — structured focus areas & daily tasks`}
              </p>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '6px',
              background: `${activeSection.color}14`, color: activeSection.color, border: `1px solid ${activeSection.color}30`, flexShrink: 0 }}>
              {count} {activeNav === 'roadmap' ? 'days' : 'questions'}
            </span>
          </div>

          {activeNav === 'technical' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {techQ.length === 0 ? <EmptyState /> : techQ.map((item, i) => <QuestionCard key={i} item={item} index={i} />)}
            </div>
          )}
          {activeNav === 'behavioral' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {behavQ.length === 0 ? <EmptyState /> : behavQ.map((item, i) => <QuestionCard key={i} item={item} index={i} />)}
            </div>
          )}
          {activeNav === 'roadmap' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {roadmap.length === 0 ? <EmptyState /> : roadmap.map((day, i) => <RoadMapDay key={i} day={day} />)}
            </div>
          )}
        </main>

        {/* ── RIGHT SIDEBAR ─────────────────────────────────────────────────── */}
        <aside className="interview-sidebar-right">

          {/* Match Score */}
          <SideCard title="Match Score" icon={FileText} accentColor="#818cf8">
            <ScoreRing score={report.matchScore ?? 0} />
          </SideCard>

          {/* Skill Gaps — LIST rows, full text always readable */}
          <SideCard title={`Skill Gaps  ·  ${gaps.length}`} icon={Target} accentColor="#f87171" maxHeight="220px">
            {gaps.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No gaps identified 🎉</p>
            ) : (
              <div>
                {sortedGaps.map((g, i) => (
                  <SkillRow key={i} skill={g.skill} severity={g.severity} />
                ))}
              </div>
            )}
          </SideCard>

          {/* Summary */}
          <SideCard title="Report Summary" icon={ChevronRight} accentColor="#34d399">
            <StatLine label="Technical Qs"  value={techQ.length}   color="#818cf8" />
            <StatLine label="Behavioral Qs" value={behavQ.length}  color="#a78bfa" />
            <StatLine label="Roadmap Days"  value={roadmap.length} color="#34d399" />
            <StatLine label="Skill Gaps"    value={gaps.length}    color={gaps.length === 0 ? '#34d399' : '#f87171'} />
          </SideCard>
        </aside>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '3rem 1.5rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
      Nothing generated for this section.
    </div>
  );
}
