const { Client } = require('pg')

async function testPostgresConnection() {
  const client = new Client({
    host: '192.168.3.245',
    port: 5432,
    database: 'WorkflowPacienteHED',
    user: 'postgres',
    password: 'super',
    connectionTimeoutMillis: 5000,
  })

  try {
    console.log('Tentando conectar ao PostgreSQL...')
    await client.connect()
    console.log('✅ Conexão estabelecida com sucesso!')
    
    const result = await client.query('SELECT version()')
    console.log('Versão do PostgreSQL:', result.rows[0].version)
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message)
    console.error('Código do erro:', error.code)
  } finally {
    await client.end()
  }
}

testPostgresConnection()