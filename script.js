

const STORAGE_KEY = 'diario_entradas'

// Elementos do DOM
const form = document.getElementById('form-entrada')
const inputTitulo = document.getElementById('titulo')
const inputData = document.getElementById('data')
const inputDescricao = document.getElementById('descricao')
const listaEntradas = document.getElementById('lista-entradas')
const emptyState = document.getElementById('empty-state')
const contador = document.getElementById('contador')
const offlineBadge = document.getElementById('offline-badge')
const installBanner = document.getElementById('install-banner')
const btnInstall = document.getElementById('btn-install')
const btnDismiss = document.getElementById('btn-dismiss')

// ==========================================
// SERVICE WORKER
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registrado:', reg.scope))
      .catch(err => console.error('Erro ao registrar SW:', err))
  })
}

let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  installBanner.classList.remove('hidden')
})

btnInstall.addEventListener('click', async () => {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  console.log('Instalação:', outcome)
  deferredPrompt = null
  installBanner.classList.add('hidden')
})

btnDismiss.addEventListener('click', () => {
  installBanner.classList.add('hidden')
})


function atualizarStatusOnline() {
  if (!navigator.onLine) {
    offlineBadge.classList.add('visible')
  } else {
    offlineBadge.classList.remove('visible')
  }
}

window.addEventListener('online', atualizarStatusOnline)
window.addEventListener('offline', atualizarStatusOnline)
atualizarStatusOnline()


function carregarEntradas() {
  const dados = localStorage.getItem(STORAGE_KEY)
  return dados ? JSON.parse(dados) : []
}

function salvarEntradas(entradas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entradas))
}

function adicionarEntrada(titulo, data, descricao) {
  const entradas = carregarEntradas()
  const nova = {
    id: Date.now(),
    titulo,
    data,
    descricao,
    criadaEm: new Date().toISOString()
  }
  entradas.unshift(nova) 
  salvarEntradas(entradas)
  return nova
}

function removerEntrada(id) {
  const entradas = carregarEntradas().filter(e => e.id !== id)
  salvarEntradas(entradas)
}


function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split('-')
  return `${dia}/${mes}/${ano}`
}

function criarCard(entrada) {
  const card = document.createElement('div')
  card.classList.add('card')
  card.dataset.id = entrada.id

  card.innerHTML = `
    <div class="card-header">
      <div>
        <div class="card-titulo">${entrada.titulo}</div>
        <div class="card-data">✦ ${formatarData(entrada.data)}</div>
      </div>
      <button class="btn-remover" data-id="${entrada.id}">Remover</button>
    </div>
    <div class="card-descricao">${entrada.descricao}</div>
  `

  card.querySelector('.btn-remover').addEventListener('click', () => {
    removerEntrada(entrada.id)
    renderizarLista()
  })

  return card
}

function renderizarLista() {
  const entradas = carregarEntradas()

 
  listaEntradas.innerHTML = ''

  if (entradas.length === 0) {
    listaEntradas.appendChild(emptyState)
    emptyState.style.display = 'flex'
    contador.textContent = '0 registros'
    return
  }

  emptyState.style.display = 'none'
  contador.textContent = `${entradas.length} ${entradas.length === 1 ? 'registro' : 'registros'}`

  entradas.forEach(entrada => {
    listaEntradas.appendChild(criarCard(entrada))
  })
}


inputData.value = new Date().toISOString().split('T')[0]

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const titulo = inputTitulo.value.trim()
  const data = inputData.value
  const descricao = inputDescricao.value.trim()

  if (!titulo || !data || !descricao) return

  adicionarEntrada(titulo, data, descricao)
  renderizarLista()

 
  inputTitulo.value = ''
  inputDescricao.value = ''
  inputData.value = new Date().toISOString().split('T')[0]
  inputTitulo.focus()
})


renderizarLista()
