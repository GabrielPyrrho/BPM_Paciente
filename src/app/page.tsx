export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* Header com barra superior */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px 0',
        marginBottom: '60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                🏥
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: '#1a202c',
                  margin: '0',
                  letterSpacing: '-0.5px'
                }}>
                  MedFlow BPM
                </h1>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#718096', 
                  margin: '0',
                  fontWeight: '500'
                }}>
                  Sistema de Gestão Hospitalar
                </p>
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #48bb78, #38a169)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Online
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ 
            fontSize: '42px', 
            fontWeight: '800', 
            color: 'white',
            marginBottom: '20px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '-1px'
          }}>
            Workflow de Internamento
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(255, 255, 255, 0.9)', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Gerencie todo o processo de internamento com workflow automatizado,<br/>
            controle total das atividades e acompanhamento em tempo real
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <a href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '35px',
              textAlign: 'center',
              height: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ 
                fontSize: '52px', 
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>📊</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>Dashboard</h3>
              <p style={{ fontSize: '15px', color: '#718096', lineHeight: '1.5' }}>Visualize estatísticas e indicadores do processo</p>
            </div>
          </a>

          <a href="/pacientes" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '35px',
              textAlign: 'center',
              height: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ 
                fontSize: '52px', 
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #48bb78, #38a169)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>👥</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>Pacientes</h3>
              <p style={{ fontSize: '15px', color: '#718096', lineHeight: '1.5' }}>Cadastro e gerenciamento de pacientes</p>
            </div>
          </a>

          <a href="/processos" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '35px',
              textAlign: 'center',
              height: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ 
                fontSize: '52px', 
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>⚙️</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>Processos</h3>
              <p style={{ fontSize: '15px', color: '#718096', lineHeight: '1.5' }}>Configuração de workflows e complexidades</p>
            </div>
          </a>

          <a href="/workflow" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '35px',
              textAlign: 'center',
              height: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ 
                fontSize: '52px', 
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #9f7aea, #805ad5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>📋</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>Workflow BPM</h3>
              <p style={{ fontSize: '15px', color: '#718096', lineHeight: '1.5' }}>Acompanhamento em tempo real das atividades</p>
            </div>
          </a>
        </div>
        
        {/* Rodapé */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '80px', 
          paddingTop: '40px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '14px',
            margin: '0'
          }}>
            © 2024 MedFlow BPM - Sistema de Gestão Hospitalar
          </p>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.5)', 
            fontSize: '12px',
            margin: '5px 0 0 0'
          }}>
            Desenvolvido para otimizar processos de internamento
          </p>
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-5%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '-5%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0
      }}></div>
    </div>
  )
}