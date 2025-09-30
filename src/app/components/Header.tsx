'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/pacientes', label: 'Pacientes' },
    { href: '/processos', label: 'Processos' },
    { href: '/workflow', label: 'Workflow BPM' }
  ]

  return (
    <header className="bpm-header">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="bpm-logo">BPM Internamento</div>
          </Link>

          <nav style={{ display: 'flex', gap: '30px' }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: pathname === item.href ? 'white' : 'var(--primary-blue)',
                  background: pathname === item.href ? 'var(--primary-blue)' : 'transparent',
                  border: '1px solid var(--primary-blue)',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}