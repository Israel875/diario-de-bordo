# 📖 Diário de Bordo — PWA Otimizado

Aplicativo Web Progressivo para registro de atividades diárias. Desenvolvido como tarefa do curso **Full Stack Java** da **EBAC**, com foco em performance e boas práticas web.

---

## Descrição do Projeto

O Diário de Bordo permite registrar, listar e remover atividades diárias com título, descrição e data. Funciona offline via Service Worker, é instalável na tela inicial e persiste os dados com localStorage.

---

## 🔍 Análise Inicial — Gargalos Identificados

Relatório gerado com **Lighthouse (Mobile)** antes das otimizações:

![Lighthouse Antes](img/ligth-house-antes.png)

| Métrica | Valor | Status |
|---|---|---|
| Desempenho | 95 | 🟡 |
| FCP | 1,6s | ✅ |
| LCP | 2,9s | 🟡 |
| TBT | 0ms | ✅ |
| CLS | 0,032 | ✅ |

**Gargalos encontrados pelo Lighthouse:**
- ⚠️ **Renderizar solicitações de bloqueio** — economia estimada de 800ms. A fonte do Google Fonts era carregada via `@import` no CSS, bloqueando a renderização antes de qualquer conteúdo aparecer.
- ⚠️ **Árvore de dependência da rede** — requisições encadeadas aumentando o tempo de carregamento.
- 🟡 **Ciclos de vida de cache** — economia estimada de 4 KiB.

---

## ✅ Otimizações Aplicadas

### 1. Preconnect para fontes externas
Adicionado `preconnect` para os domínios do Google Fonts, permitindo que o browser abra a conexão antecipadamente.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### 2. Carregamento assíncrono da fonte
Substituído o `@import` no CSS por `preload` com carregamento não bloqueante via `onload`.

```html
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap"
  onload="this.onload=null;this.rel='stylesheet'" />
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?..." />
</noscript>
```

### 3. Remoção do @import bloqueante do CSS
O `@import url(...)` no topo do `style.css` foi removido — é a forma mais lenta de carregar fontes externas pois bloqueia o parsing do CSS inteiro.

---

## 📊 Comparativo Antes × Depois

![Lighthouse Depois](img/ligth-house-depois.png)

| Métrica | Antes | Depois | Melhoria |
|---|---|---|---|
| **Desempenho** | 95 | **100** | +5 pontos |
| **FCP** | 1,6s | **0,9s** | -43% |
| **LCP** | 2,9s | **0,9s** | -69% |
| **TBT** | 0ms | **0ms** | — |
| **CLS** | 0,032 | **0,028** | -12% |
| **Speed Index** | 1,6s | **0,9s** | -43% |

---

## 💡 Técnica de Maior Impacto

A maior melhoria veio da **substituição do `@import` por `preload` assíncrono**. O LCP caiu de 2,9s para 0,9s — redução de 69% — com apenas essa mudança. O `@import` no CSS é bloqueante: o browser precisa baixar o CSS, encontrar o import, fazer nova requisição e só então renderizar. Com `preload`, o download da fonte acontece em paralelo sem bloquear nada.

---

## 🚀 Como Rodar

```bash
npx serve .
# Acesse: http://localhost:3000
```

---

## Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- Service Worker API + Cache API
- Web App Manifest
- localStorage API
- `beforeinstallprompt` para instalação PWA

---

Desenvolvido por **Israel** — EBAC Full Stack Java
