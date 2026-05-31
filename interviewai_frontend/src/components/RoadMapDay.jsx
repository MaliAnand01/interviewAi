import { CheckCircle2 } from 'lucide-react';

export default function RoadMapDay({ day }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.125rem',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        transition: 'border-color 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
        e.currentTarget.style.background = 'rgba(99,102,241,0.04)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
      }}
    >
      {/* Day badge column */}
      <div style={{ flexShrink: 0, paddingTop: '0.125rem' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(124,58,237,0.2) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Day</span>
          <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-light)' }}>{day.day}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.625rem' }}>{day.focus}</h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {(day.tasks || []).map((task, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2 size={14} style={{ flexShrink: 0, color: 'var(--success)', marginTop: '0.2rem' }} />
              <span style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
