# 📖 Diário de Bordo — PWA

Aplicativo Web Progressivo para registro de atividades diárias. Desenvolvido como tarefa do curso **Full Stack Java** da **EBAC**.

---

## Funcionalidades

- Criar entradas com título, descrição e data
- Listar todas as entradas registradas
- Remover entradas
- Funciona **offline** com Service Worker
- Instalável na tela inicial (PWA)
- Dados persistidos com **localStorage**
- Interface responsiva (mobile e desktop)

---

## Estrutura do Projeto

```
├── index.html         # Estrutura da aplicação
├── style.css          # Estilos e responsividade
├── script.js          # Lógica, localStorage e SW registro
├── manifest.json      # Configuração do PWA
├── service-worker.js  # Cache e funcionamento offline
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## Como rodar localmente

> **Importante:** PWAs precisam de um servidor HTTP para funcionar corretamente (não abrir o arquivo direto no browser).

### Com VS Code
Instale a extensão **Live Server**, clique com botão direito no `index.html` → **Open with Live Server**.

### Com Node.js
```bash
npx serve .
```

### Com Python
```bash
python -m http.server 8080
```

Acesse: `http://localhost:8080`

---

## Testar como PWA

1. Abra no Chrome
2. Acesse **DevTools → Lighthouse**
3. Selecione **Progressive Web App** e rode a auditoria
4. Para testar offline: **DevTools → Network → Offline**

---

## Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- Service Worker API
- Web App Manifest
- localStorage API
- `beforeinstallprompt` event

---

Desenvolvido por **Israel** — EBAC Full Stack Java
