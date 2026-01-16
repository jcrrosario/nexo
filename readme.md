# NEXO

Plataforma web multi-tenant para gestão, diagnósticos e análises, com foco em padronização de CRUD, métricas e relatórios.

Este repositório contém **frontend e backend** do projeto NEXO.

---

## 📌 Visão geral

O NEXO foi projetado desde o início como um **produto**, não como um protótipo.
A arquitetura prioriza:
- isolamento por tenant
- segurança por padrão
- reutilização de componentes
- clareza de código
- facilidade de onboarding

Qualquer desenvolvedor deve conseguir clonar o projeto, configurar o ambiente e sair programando em poucos minutos.

---

## 🧱 Arquitetura

### Backend
- Node.js
- TypeScript
- NestJS
- PostgreSQL
- TypeORM
- JWT (access + refresh)
- Puppeteer (PDF)
- ExcelJS (Excel)

### Frontend
- React
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Fetch API

---

## 📂 Estrutura do repositório

```
root
├─ backend/api
│  ├─ src
│  │  ├─ modules
│  │  ├─ shared
│  │  ├─ app.module.ts
│  │  └─ main.ts
│  └─ package.json
│
├─ frontend/web
│  ├─ app
│  ├─ components
│  ├─ public
│  ├─ package.json
│  └─ .env.local
│
└─ README.md
```

---

## 🧠 Conceitos-chave

### Multi-tenant

- Todo dado pertence a um tenant
- Nenhuma consulta retorna dados sem tenant
- O tenant é enviado via header:

```
x-tenant-id: <tenant>
```

---

### Autenticação

- JWT obrigatório em rotas protegidas
- Header padrão:

```
Authorization: Bearer <token>
```

---

## ⚙️ Setup do Backend

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

Banco local sugerido:

```
DB_NAME=dbnexo
DB_USER=postgres
DB_PASS=postgres
```

---

### Instalação

```bash
cd backend/api
npm install
```

---

### Variáveis de ambiente

Crie o arquivo:

```
backend/api/.env
```

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=dbnexo
JWT_SECRET=chave_local
```

---

### CORS (obrigatório)

No arquivo `src/main.ts`:

```ts
app.enableCors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','x-tenant-id'],
  credentials: true,
});
```

---

### Subir o backend

```bash
npm run start:dev
```

Se aparecer:

```
Nest application successfully started
```

O backend está pronto.

---

## 💻 Setup do Frontend

### Instalação

```bash
cd frontend/web
npm install
```

---

### Variáveis de ambiente

Crie o arquivo:

```
frontend/web/.env.local
```

Conteúdo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### Subir o frontend

```bash
npm run dev
```

Acesse:

```
http://localhost:3000
```

---

## 🧩 Padrão de CRUD

Todos os cadastros seguem o mesmo padrão.

### Componentes base

- CrudLayout
- CrudTable
- CrudModal
- CrudConfirmModal
- CrudLogModal
- CrudExportButtons

### Regras

- Listagem sempre paginada
- Busca via `search`
- Logs disponíveis
- Exportação fiel ao grid
- Nenhuma tela inventa layout próprio

---

## 📄 Relatórios

### PDF
- Gerado via Puppeteer
- HTML + CSS
- Usa os mesmos filtros do grid
- Protegido por JWT + tenant

### Excel
- Gerado via ExcelJS
- Mesma fonte de dados do grid

---

## ➕ Criando um novo CRUD

Checklist:

1. Criar módulo no backend
2. Entidade com `tenant_id`
3. `findAll` com paginação
4. Controller protegido
5. Tela no frontend usando componentes CRUD
6. Exportação habilitada

---

## ✅ Boas práticas

- Nunca acessar banco sem tenant
- Nunca duplicar lógica de CRUD
- Código claro > código esperto
- Erros estranhos normalmente são infra

---

## 🚀 Estado atual do projeto

- CRUD de Times completo
- Dashboard funcional
- Autenticação estável
- Multi-tenant validado
- Exportação PDF pronta
- Base pronta para Excel

---

## 👋 Para quem está chegando agora

Sugestão de leitura:
1. CRUD de Times (frontend e backend)
2. TeamService
3. CrudLayout
4. Fluxo de exportação

Com isso você entende 80% do projeto.

---

Fim do README.

