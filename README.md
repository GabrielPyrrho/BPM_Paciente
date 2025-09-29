# BPM - Internamento de Paciente

Sistema de workflow para gerenciar o processo de internamento de pacientes.

## Funcionalidades

- Cadastro de pacientes
- Criação de processos com complexidades (HC24, HC48)
- Geração automática de workflow baseado na complexidade
- Acompanhamento e atualização do status das atividades

## Como executar

1. Instalar dependências:
```bash
npm install
```

2. Configurar banco de dados:
```bash
npx prisma generate
npx prisma db push
```

3. Executar em desenvolvimento:
```bash
npm run dev
```

## Estrutura

- `/src/app/api` - APIs REST
- `/src/app/components` - Componentes React
- `/src/app/pacientes` - Página de gerenciamento de pacientes
- `/src/app/processos` - Página de criação de processos
- `/prisma` - Schema do banco de dados