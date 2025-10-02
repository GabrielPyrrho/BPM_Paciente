# BPM - Sistema de Workflow Genérico

Sistema de workflow genérico para gerenciar processos de qualquer natureza.

## Funcionalidades

- Cadastro de entidades (pessoas, empresas, documentos)
- Criação de tipos de workflow personalizados
- Configuração de etapas customizáveis
- Geração automática de workflow baseado no tipo
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
- `/src/app/entidades` - Página de gerenciamento de entidades
- `/src/app/processos` - Página de criação de processos
- `/src/app/etapas` - Configuração de etapas
- `/src/app/tipos-workflow` - Configuração de tipos de workflow
- `/prisma` - Schema do banco de dados