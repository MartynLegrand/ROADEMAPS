# Jestfly Web App

Frontend da plataforma Jestfly construído com Astro.build, seguindo padrões Orbit UI e dark mode por padrão.

## 🚀 Stack Tecnológica

- **Framework:** Astro 4.0
- **Styling:** Tailwind CSS
- **Design System:** Orbit-inspired patterns
- **Theme:** Dark mode por padrão
- **TypeScript:** Strict mode
- **Shared Packages:** @jestfly/types, @jestfly/api-client

## 📁 Estrutura

```
apps/web/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ModuleCard.astro
│   ├── layouts/         # Layouts base
│   │   └── BaseLayout.astro
│   ├── pages/           # Páginas (rotas)
│   │   ├── index.astro
│   │   └── modules.astro
│   └── styles/          # Estilos globais
│       └── global.css
├── public/              # Assets estáticos
├── astro.config.mjs     # Configuração Astro
├── tailwind.config.mjs  # Configuração Tailwind
└── package.json
```

## 🎨 Design System

### Cores (Orbit-inspired)

```css
/* Primary */
primary-500: #0ea5e9
primary-600: #0284c7
primary-700: #0369a1

/* Dark Mode */
dark-900: #0f172a (background)
dark-800: #1e293b (cards)
dark-700: #334155 (borders)
dark-50: #f8fafc (text)
```

### Componentes

#### Button
```astro
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
```

#### Card
```astro
<div class="card">
  <!-- conteúdo -->
</div>
```

#### Input
```astro
<input class="input" type="text" placeholder="Email" />
```

### Orbit Patterns

- **Border Radius:** `rounded-orbit` (12px)
- **Shadow:** `shadow-orbit` e `shadow-orbit-lg`
- **Transitions:** 200ms ease-in-out
- **Typography:** Inter font family

## 🚀 Desenvolvimento

### Instalar Dependências

```bash
npm install
```

### Iniciar Dev Server

```bash
npm run dev
```

Servidor disponível em `http://localhost:4321`

### Build para Produção

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## 🌙 Dark Mode

Dark mode está ativado por padrão através da classe `dark` no elemento `<html>`.

### Configuração

```css
/* global.css */
:root {
  color-scheme: dark;
}

html {
  @apply dark;
}

body {
  @apply bg-dark-900 text-dark-50;
}
```

### Customização

Para adicionar modo claro:

```typescript
// Toggle function
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
}
```

## 🔌 Integração com Backend

### API Client

```typescript
import { createApiClient } from '@jestfly/api-client';

const client = createApiClient({
  baseURL: 'http://localhost:3000'
});

// Fazer requisições
const response = await client.get('/api/users/me');
```

### Types

```typescript
import type { User, Content } from '@jestfly/types';

const user: User = {
  id: '...',
  email: 'user@example.com',
  // ...
};
```

## 📱 Responsive Design

Mobile-first approach com breakpoints:

```css
/* Tailwind breakpoints */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

Exemplo:
```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- conteúdo -->
</div>
```

## 🎯 Páginas Disponíveis

- `/` - Homepage com hero e features
- `/modules` - Lista de todos os 13 módulos
- `/features` - Features da plataforma (TODO)
- `/docs` - Documentação (TODO)
- `/about` - Sobre o projeto (TODO)

## 📦 Shared Packages

### @jestfly/types
```typescript
import type { User, Content, Community } from '@jestfly/types';
```

### @jestfly/api-client
```typescript
import { createApiClient } from '@jestfly/api-client';
```

## 🧪 Testing (TODO)

```bash
npm test
```

## 📝 Código de Exemplo

### Criar Nova Página

```astro
---
// src/pages/about.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout title="About - Jestfly">
  <Header />
  <main class="container mx-auto px-4 py-20">
    <h1 class="text-4xl font-bold text-dark-50">About Us</h1>
  </main>
  <Footer />
</BaseLayout>
```

### Criar Novo Componente

```astro
---
// src/components/Feature.astro
interface Props {
  title: string;
  description: string;
  icon: string;
}

const { title, description, icon } = Astro.props;
---

<div class="card">
  <div class="text-4xl mb-4">{icon}</div>
  <h3 class="text-xl font-semibold text-dark-50 mb-2">{title}</h3>
  <p class="text-dark-400">{description}</p>
</div>
```

## 🔧 Configuração Avançada

### Adicionar Nova Integração

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react'; // Nova integração

export default defineConfig({
  integrations: [tailwind(), react()],
  // ...
});
```

### Customizar Tailwind

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        custom: {
          500: '#custom-color'
        }
      }
    }
  }
}
```

## 🚀 Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload pasta dist/
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

## 📚 Recursos

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [Orbit Design System](https://orbit.kiwi)

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](../../docs/CONTRIBUTING.md)

## 📄 Licença

MIT License - veja [LICENSE](../../LICENSE)

---

**Desenvolvido com ❤️ pela equipe Jestfly**
