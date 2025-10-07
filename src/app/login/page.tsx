'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      
      if (res.ok) {
        const usuario = await res.json()
        localStorage.setItem('usuario', JSON.stringify(usuario))
        router.push('/')
      } else {
        const error = await res.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Erro no login')
    } finally {
      setLoading(false)
    }
  }

  const loginRapido = (email: string, senha: string) => {
    setCredentials({ email, senha })
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/images/LOGO-INSTA.png" 
              alt="Logo" 
              style={{ 
                width: '80px', 
                height: '80px', 
                objectFit: 'contain',
                borderRadius: '20px'
              }}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '20px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px'
            }}>🏥</div>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Sistema BPM
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', margin: '10px 0 0 0' }}>
            Acesse o sistema de workflow
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              placeholder="seu.email@hospital.com"
              style={{ 
                width: '100%',
                padding: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Senha
            </label>
            <input
              type="password"
              value={credentials.senha}
              onChange={(e) => setCredentials({...credentials, senha: e.target.value})}
              placeholder="••••••••"
              style={{ 
                width: '100%',
                padding: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '15px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* Usuários de Exemplo */}
        <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 15px 0', textAlign: 'center' }}>
            Usuários de Exemplo
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => loginRapido('joao.silva@hospital.com', 'senha123')}
              style={{
                padding: '10px 12px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f0f9ff'}
              onMouseLeave={(e) => e.target.style.background = 'white'}
            >
              👨‍⚕️ Dr. João Silva - Médico
            </button>
            <button
              onClick={() => loginRapido('maria.santos@hospital.com', 'senha123')}
              style={{
                padding: '10px 12px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f0f9ff'}
              onMouseLeave={(e) => e.target.style.background = 'white'}
            >
              👩‍⚕️ Enf. Maria Santos - Enfermagem
            </button>
            <button
              onClick={() => loginRapido('supervisor@hospital.com', 'senha123')}
              style={{
                padding: '10px 12px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f0f9ff'}
              onMouseLeave={(e) => e.target.style.background = 'white'}
            >
              👔 Supervisor Geral - Supervisão
            </button>
          </div>
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: '10px 0 0 0', textAlign: 'center' }}>
            Clique para preencher automaticamente
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
            ← Voltar ao início
          </a>
        </div>
      </div>
    </div>
  )
}