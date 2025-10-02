# 🎯 Exemplo Prático: Sistema de Workflow Genérico

## Cenário: Internamento Hospitalar + Processamento de Nota Fiscal

### 1️⃣ **ETAPAS** (já criadas automaticamente)
✅ **Hospitalares:**
- CAPTACAO (Captação inicial)
- PRE_INTERNAMENTO (Pré-internamento) 
- INTERNADO (Internado)

✅ **Financeiras:**
- RECEBIMENTO (Recebimento)
- VALIDACAO (Validação)
- APROVACAO (Aprovação)
- PAGAMENTO (Pagamento)

---

### 2️⃣ **ATIVIDADES** - Vá em `/atividades` e cadastre:

**Para Processo Hospitalar:**
```
Nome: "Orçamento"          | Setor: "Captação"      | Ordem: 1 | Etapa: CAPTACAO
Nome: "Viabilidade"        | Setor: "Captação"      | Ordem: 2 | Etapa: CAPTACAO
Nome: "Autorização"        | Setor: "Pré-intern"    | Ordem: 3 | Etapa: PRE_INTERNAMENTO
Nome: "Agendamento"        | Setor: "Pré-intern"    | Ordem: 4 | Etapa: PRE_INTERNAMENTO
Nome: "Internação"         | Setor: "Enfermagem"    | Ordem: 5 | Etapa: INTERNADO
Nome: "Alta Médica"        | Setor: "Médico"        | Ordem: 6 | Etapa: INTERNADO
```

**Para Processo Financeiro:**
```
Nome: "Receber NF"         | Setor: "Financeiro"    | Ordem: 1 | Etapa: RECEBIMENTO
Nome: "Conferir Dados"     | Setor: "Financeiro"    | Ordem: 2 | Etapa: VALIDACAO
Nome: "Aprovar Pagamento"  | Setor: "Gerência"      | Ordem: 3 | Etapa: APROVACAO
Nome: "Efetuar Pagamento"  | Setor: "Tesouraria"    | Ordem: 4 | Etapa: PAGAMENTO
```

---

### 3️⃣ **TIPOS DE WORKFLOW** - Vá em `/complexidades` e cadastre:

**Tipo 1: HC24**
- Nome: "HC24"
- Selecione atividades: ✅ Orçamento, ✅ Viabilidade, ✅ Autorização, ✅ Agendamento, ✅ Internação, ✅ Alta Médica

**Tipo 2: HC48** 
- Nome: "HC48"
- Selecione atividades: ✅ Orçamento, ✅ Viabilidade, ✅ Autorização, ✅ Agendamento, ✅ Internação, ✅ Alta Médica

**Tipo 3: Nota Fiscal**
- Nome: "Processo NF"
- Selecione atividades: ✅ Receber NF, ✅ Conferir Dados, ✅ Aprovar Pagamento, ✅ Efetuar Pagamento

---

### 4️⃣ **ENTIDADES** - Vá em `/pacientes` e cadastre:

**Entidade 1:**
```
Nome: "João Silva"
Tipo: PESSOA
Campos: { telefone: "11999999999", convenio: "Unimed" }
```

**Entidade 2:**
```
Nome: "Fornecedor ABC Ltda"
Tipo: EMPRESA  
Campos: { cnpj: "12.345.678/0001-90", contato: "vendas@abc.com" }
```

**Entidade 3:**
```
Nome: "NF 001234"
Tipo: DOCUMENTO
Campos: { valor: "R$ 5.000,00", vencimento: "2024-02-15" }
```

---

### 5️⃣ **PROCESSOS** - Vá em `/processos` e crie:

**Processo 1:**
- Entidade: "João Silva"
- Tipo: "HC24"
- ✅ Sistema cria automaticamente: Orçamento → Viabilidade → Autorização → Agendamento → Internação → Alta Médica

**Processo 2:**
- Entidade: "NF 001234" 
- Tipo: "Processo NF"
- ✅ Sistema cria automaticamente: Receber NF → Conferir Dados → Aprovar Pagamento → Efetuar Pagamento

---

## 🎉 Resultado Final:

Você terá workflows completos e automáticos para:
- **Internamento hospitalar** com todas as etapas
- **Processamento de nota fiscal** com fluxo financeiro
- **Sistema genérico** que pode ser expandido para qualquer processo

## 📊 Acompanhamento:

No dashboard você verá:
- Processos ativos
- Atividades pendentes por setor
- Status de cada workflow
- Relatórios de performance