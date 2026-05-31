import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Lightbulb, BookOpen } from 'lucide-react';

export default function QuestionCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        ...(open && { borderColor: 'var(--border-accent)', boxShadow: '0 0 16px rgba(99,102,241,0.1)' }),
      }}
    >
      {/* Header — always visible */}
      <button
        id={`question-toggle-${index}`}
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.875rem',
          padding: '1rem 1.125rem',
          background: open ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
      >
        {/* Index badge */}
        <span style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.02em',
        }}>
          Q{index + 1}
        </span>

        {/* Question text */}
        <span style={{
          flex: 1,
          color: 'var(--text-primary)',
          fontSize: '0.9375rem',
          fontWeight: 500,
          lineHeight: 1.5,
          paddingTop: '0.125rem',
        }}>
          {item.question}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={18}
          style={{
            flexShrink: 0,
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </button>

      {/* Body — accordion */}
      <div
        ref={bodyRef}
        className={`accordion-body ${open ? 'open' : 'closed'}`}
      >
        <div style={{
          padding: '0 1.125rem 1.125rem 1.125rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          borderTop: '1px solid var(--border)',
          paddingTop: '1rem',
        }}>
          {/* Intention */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Lightbulb size={13} style={{ color: 'var(--warning)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Intention</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.intention}</p>
          </div>

          {/* Answer */}
          <div style={{ background: 'rgba(99,102,241,0.05)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', border: '1px solid rgba(99,102,241,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <BookOpen size={13} style={{ color: 'var(--accent-light)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Model Answer</span>
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
