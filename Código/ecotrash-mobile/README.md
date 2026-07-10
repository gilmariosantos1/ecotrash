# EcoTrash Mobile 🌱

Aplicativo mobile de gestão de coleta de resíduos, construído com **Ionic + React + TypeScript**.

---

## Stack

| Camada       | Tecnologia                         |
|--------------|------------------------------------|
| Frontend     | Ionic 7 + React 18 + TypeScript    |
| Bundler      | Vite 5                             |
| Roteamento   | React Router DOM v5 (IonReactRouter)|
| HTTP         | Axios                              |
| Backend      | Node.js + Express + SQLite (pasta `ecotrash-backend`) |

---

## Pré-requisitos

- Node.js 18+
- npm 9+
- Backend do EcoTrash rodando na porta **5000**

---

## Instalação e execução

### 1. Frontend (este projeto)

```bash
# Na pasta ecotrash-mobile:
npm install
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

### 2. Backend (pasta `ecotrash-backend`)

```bash
# Na pasta ecotrash-backend:
npm install
node server.js
```

API disponível em: [http://localhost:5000](http://localhost:5000)

---

## Estrutura de pastas

```
ecotrash-mobile/
├── src/
│   ├── App.tsx                  # Roteamento principal (IonReactRouter)
│   ├── main.tsx                 # Entry point + setup Ionic
│   ├── theme/
│   │   └── variables.css        # Tema verde escuro do EcoTrash
│   ├── types/
│   │   └── index.ts             # Todas as interfaces TypeScript
│   ├── services/                # Camada de acesso à API (axios)
│   │   ├── api.ts
│   │   ├── coletaService.ts
│   │   ├── municipioService.ts
│   │   ├── mensagemService.ts
│   │   └── ibgeService.ts
│   ├── controllers/             # Lógica de negócio
│   │   ├── ColetaController.ts
│   │   ├── MunicipioController.ts
│   │   ├── MensagemController.ts
│   │   └── LocalidadeController.ts
│   ├── components/
│   │   └── MenuPopover.tsx      # Menu de navegação (três pontos)
│   └── pages/                   # Telas do app
│       ├── Home.tsx
│       ├── Sobre.tsx
│       ├── Contato.tsx
│       ├── Cadastro.tsx
│       ├── Confirmacao.tsx
│       ├── StatusLogin.tsx
│       ├── StatusLista.tsx
│       ├── StatusDetalhes.tsx
│       ├── PainelMunicipioLogin.tsx
│       ├── PainelMunicipioLista.tsx
│       ├── PainelMunicipioDetalhes.tsx
│       ├── CadastroMunicipio.tsx
│       └── RecuperarSenha.tsx
```

---

## Fluxos do app

### Cidadão
`Home → Solicitar Coleta → Confirmação`
`Home → Status do Requerimento (CPF) → Lista → Detalhes`

### Município
`Home → Painel Município (Login) → Lista de Requerimentos → Detalhes`
`Home → Cadastrar Município`

---

## Migração realizada

| Antes (React + Vite + JSX) | Depois (Ionic + React + TypeScript) |
|----------------------------|--------------------------------------|
| `.jsx`                     | `.tsx` com tipagem forte             |
| `<form onSubmit>`          | `IonButton onClick` + validação manual |
| `<input>`, `<select>`      | `IonInput`, `IonSelect`, `IonTextarea` |
| CSS puro                   | Ionic CSS vars + tema customizado    |
| `<nav>` Navbar             | `IonHeader` + `IonToolbar` + Popover |
| `React Router DOM v7`      | `IonReactRouter` (RRD v5 internamente)|
| Sem tipos                  | Interfaces: `Coleta`, `FormColeta`, `Estado`, `Cidade`, etc. |
