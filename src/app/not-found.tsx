export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '500px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>404</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
          Página não encontrada
        </h2>
        <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '24px' }}>
          A página que você está procurando não existe.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Voltar ao início
        </a>
      </div>
    </div>
  )
}