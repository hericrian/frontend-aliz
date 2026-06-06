import { useEffect, useMemo, useState } from 'react'

const images = {
  hero1: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/9c754a613_generated_4a2aeb8a.png',
  hero2: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/2b2e3b414_generated_3f189283.png',
  milho: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/0a9380086_generated_d441df1d.png',
  soja: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/f88b25f72_generated_0061fb7d.png',
  trigo: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/34a7ecd8f_generated_4729da86.png',
  gado: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/903756b73_generated_30540a2b.png',
  supl: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/e5e41e54e_generated_89cf36f8.png',
  tomate: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/cd888966e_generated_cd3129c5.png',
  uva: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/9dc812acd_generated_bf8f3734.png',
  alface: 'https://media.base44.com/images/public/6a237d6aa17519aa071af5ed/a656bc1f5_generated_5442e97d.png'
}

const slides = [
  {
    image: images.hero1,
    headline: 'Do Campo Direto para o seu Negócio',
    subtitle: 'Grãos premium, pecuária selecionada e hortifrúti frescos com rastreabilidade total.',
    cta: 'Ver Catálogo'
  },
  {
    image: images.hero2,
    headline: 'Qualidade Certificada em Cada Entrega',
    subtitle: 'Logística eficiente e produtos com certificação de origem garantida.',
    cta: 'Explorar Produtos'
  }
]

const priceFactor = {
  SP: 1.12, RJ: 1.15, MG: 1.05, PR: 0.97, RS: 0.95, SC: 0.98,
  GO: 0.93, MT: 0.9, MS: 0.91, BA: 1.08, CE: 1.1, PE: 1.09,
  AM: 1.2, PA: 1.18, DF: 1.14
}

const states = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AM', 'Amazonas'], ['AP', 'Amapá'],
  ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'],
  ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MG', 'Minas Gerais'], ['MS', 'Mato Grosso do Sul'],
  ['MT', 'Mato Grosso'], ['PA', 'Pará'], ['PB', 'Paraíba'], ['PE', 'Pernambuco'],
  ['PI', 'Piauí'], ['PR', 'Paraná'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
  ['RO', 'Rondônia'], ['RR', 'Roraima'], ['RS', 'Rio Grande do Sul'], ['SC', 'Santa Catarina'],
  ['SE', 'Sergipe'], ['SP', 'São Paulo'], ['TO', 'Tocantins']
].map(([uf, name]) => ({ uf, name }))

const freight = { SP: 45, RJ: 55, MG: 48, PR: 38, RS: 42, SC: 40, GO: 52, MT: 65, MS: 60, BA: 72, CE: 80, PE: 78, AM: 120, PA: 110, DF: 50 }

const products = {
  graos: [
    { id: 1, name: 'Milho Premium Tipo 1', unit: 'Saca 60kg', basePrice: 89.9, oldBasePrice: 99.9, rating: 4.7, reviews: 234, origin: 'Mato Grosso do Sul', badge: 'Mais Vendido', image: images.milho },
    { id: 2, name: 'Soja Grão Selecionada', unit: 'Saca 60kg', basePrice: 145, rating: 4.8, reviews: 189, origin: 'Goiás', organic: true, image: images.soja },
    { id: 3, name: 'Trigo Grão Tipo 1', unit: 'Saca 60kg', basePrice: 112.5, oldBasePrice: 125, rating: 4.5, reviews: 156, origin: 'Paraná', badge: '-10%', image: images.trigo },
    { id: 4, name: 'Milho Orgânico Certificado', unit: 'Saca 60kg', basePrice: 98, rating: 4.6, reviews: 112, origin: 'Minas Gerais', organic: true, image: images.milho },
    { id: 13, name: 'Soja Convencional Tipo 2', unit: 'Saca 60kg', basePrice: 128, rating: 4.3, reviews: 97, origin: 'Mato Grosso', image: images.soja },
    { id: 14, name: 'Trigo Orgânico Premium', unit: 'Saca 60kg', basePrice: 138, rating: 4.7, reviews: 143, origin: 'Paraná', organic: true, badge: 'Orgânico', image: images.trigo },
    { id: 15, name: 'Milho Híbrido Alta Produção', unit: 'Saca 60kg', basePrice: 75, rating: 4.2, reviews: 68, origin: 'Goiás', image: images.milho },
    { id: 16, name: 'Arroz Longo Fino Tipo 1', unit: 'Saca 50kg', basePrice: 118, oldBasePrice: 130, rating: 4.5, reviews: 211, origin: 'Rio Grande do Sul', badge: '-9%', image: images.soja }
  ],
  pecuaria: [
    { id: 5, name: 'Ração Bovina Premium', unit: 'Saco 40kg', basePrice: 178, rating: 4.6, reviews: 145, origin: 'São Paulo', badge: 'Premium', image: images.gado },
    { id: 6, name: 'Suplemento Mineral Gado', unit: 'Balde 20kg', basePrice: 210, oldBasePrice: 235, rating: 4.9, reviews: 312, origin: 'Goiás', image: images.supl },
    { id: 7, name: 'Núcleo Proteico Natural', unit: 'Saco 30kg', basePrice: 156, rating: 4.4, reviews: 89, origin: 'Mato Grosso', organic: true, image: images.supl },
    { id: 8, name: 'Sal Mineral Fosfosal', unit: 'Saco 25kg', basePrice: 95, rating: 4.7, reviews: 201, origin: 'Minas Gerais', badge: 'Recomendado', image: images.gado },
    { id: 17, name: 'Ração Suína Crescimento', unit: 'Saco 40kg', basePrice: 142, rating: 4.3, reviews: 78, origin: 'Santa Catarina', image: images.gado },
    { id: 18, name: 'Silagem de Milho Premium', unit: 'Fardo 250kg', basePrice: 390, oldBasePrice: 420, rating: 4.8, reviews: 156, origin: 'Minas Gerais', badge: '-7%', image: images.milho },
    { id: 19, name: 'Probiótico Bovino Líquido', unit: 'Galão 20L', basePrice: 185, rating: 4.6, reviews: 63, origin: 'São Paulo', organic: true, image: images.supl },
    { id: 20, name: 'Ração Avícola Postura', unit: 'Saco 40kg', basePrice: 135, rating: 4.4, reviews: 109, origin: 'Paraná', image: images.gado }
  ],
  hortifruti: [
    { id: 9, name: 'Tomate Italiano Orgânico', unit: 'Caixa 20kg', basePrice: 85, rating: 4.8, reviews: 267, origin: 'São Paulo', organic: true, image: images.tomate },
    { id: 10, name: 'Uva Niágara Selecionada', unit: 'Caixa 8kg', basePrice: 62, oldBasePrice: 72, rating: 4.6, reviews: 143, origin: 'Rio Grande do Sul', image: images.uva },
    { id: 11, name: 'Alface Hidropônica Orgânica', unit: 'Engradado 24un', basePrice: 48, rating: 4.5, reviews: 178, origin: 'Paraná', organic: true, image: images.alface },
    { id: 12, name: 'Tomate Cereja Premium', unit: 'Caixa 10kg', basePrice: 95, rating: 4.9, reviews: 89, origin: 'Minas Gerais', badge: 'Premium', image: images.tomate },
    { id: 21, name: 'Uva Cabernet Sauvignon', unit: 'Caixa 12kg', basePrice: 145, rating: 4.8, reviews: 94, origin: 'Rio Grande do Sul', organic: true, badge: 'Orgânico', image: images.uva },
    { id: 22, name: 'Alface Americana Hidropônica', unit: 'Engradado 24un', basePrice: 52, oldBasePrice: 60, rating: 4.4, reviews: 121, origin: 'São Paulo', badge: '-13%', image: images.alface },
    { id: 23, name: 'Tomate Grape Selecionado', unit: 'Caixa 5kg', basePrice: 68, rating: 4.7, reviews: 76, origin: 'Goiás', image: images.tomate },
    { id: 24, name: 'Mix Folhas Orgânicas', unit: 'Engradado 20un', basePrice: 78, rating: 4.6, reviews: 55, origin: 'Minas Gerais', organic: true, image: images.alface }
  ]
}

const tabs = [
  { id: 'graos', label: 'Grãos', icon: 'ti-wheat' },
  { id: 'pecuaria', label: 'Pecuária', icon: 'ti-cow' },
  { id: 'hortifruti', label: 'Hortifrúti', icon: 'ti-leaf' }
]

const nav = [
  ['Grãos', 'ti-wheat', '#graos', 'graos'],
  ['Pecuária', 'ti-cow', '#pecuaria', 'pecuaria'],
  ['Hortifrúti', 'ti-leaf', '#hortifruti', 'hortifruti'],
  ['Sobre Nós', 'ti-info-circle', '#sobre-nos', null]
]

function money(value) {
  return value.toFixed(2).replace('.', ',')
}

function priceFor(value, uf) {
  return Number((value * (priceFactor[uf] || 1)).toFixed(2))
}

function priceHistory(product) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return months.map((month, index) => ({
    month,
    price: Number((product.price * (0.91 + Math.sin(index * 1.3 + product.id) * 0.045 + index * 0.006)).toFixed(2))
  }))
}

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [activeTab, setActiveTab] = useState('graos')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cartPulse, setCartPulse] = useState(false)
  const [toast, setToast] = useState('')
  const [selectedState, setSelectedState] = useState(null)
  const [historyProduct, setHistoryProduct] = useState(null)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aliz_auth_user'))
    } catch {
      return null
    }
  })

  useEffect(() => {
    const id = setInterval(() => setSlide(current => (current + 1) % slides.length), 6000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('aliz_auth_user')))
      } catch {
        setUser(null)
      }
    }
    window.addEventListener('aliz-auth-change', syncUser)
    window.addEventListener('storage', syncUser)
    return () => {
      window.removeEventListener('aliz-auth-change', syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const currentProducts = useMemo(() => (
    products[activeTab].map(product => ({
      ...product,
      price: selectedState ? priceFor(product.basePrice, selectedState) : product.basePrice,
      oldPrice: product.oldBasePrice ? (selectedState ? priceFor(product.oldBasePrice, selectedState) : product.oldBasePrice) : undefined
    }))
  ), [activeTab, selectedState])

  const addToCart = product => {
    setCart(items => {
      const exists = items.find(item => item.id === product.id)
      if (exists) return items.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
      return [...items, { ...product, qty: 1 }]
    })
    setCartPulse(true)
    setToast(`${product.name} adicionado ao carrinho`)
    window.setTimeout(() => setCartPulse(false), 500)
    window.clearTimeout(addToCart.timer)
    addToCart.timer = window.setTimeout(() => setToast(''), 2400)
  }

  const updateQty = (id, qty) => {
    setCart(items => qty <= 0 ? items.filter(item => item.id !== id) : items.map(item => item.id === id ? { ...item, qty } : item))
  }

  const removeItem = id => {
    setCart(items => items.filter(item => item.id !== id))
    setToast('Item removido do carrinho')
  }

  const changeState = uf => {
    setSelectedState(uf)
    setCart(items => items.map(item => ({
      ...item,
      price: priceFor(item.basePrice, uf),
      oldPrice: item.oldBasePrice ? priceFor(item.oldBasePrice, uf) : undefined
    })))
    setToast(`Localização atualizada para ${uf}`)
  }

  return (
    <main className="base44-page">
      <Header
        cartCount={cartCount}
        cartPulse={cartPulse}
        categoryOpen={categoryOpen}
        onCategoryOpen={setCategoryOpen}
        onCartOpen={() => setCartOpen(true)}
        user={user}
        onLogout={() => {
          localStorage.removeItem('aliz_auth_user')
          window.dispatchEvent(new Event('aliz-auth-change'))
          setToast('Sessão encerrada')
        }}
      />
      <CategoryNav activeTab={activeTab} onChange={setActiveTab} />
      <Hero slide={slide} setSlide={setSlide} />
      <Products
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        items={currentProducts}
        selectedState={selectedState}
        onAdd={addToCart}
        onHistory={setHistoryProduct}
      />
      <Footer />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        selectedState={selectedState}
        onStateChange={changeState}
        onUpdateQty={updateQty}
        onRemove={removeItem}
      />
      {historyProduct && <HistoryModal product={historyProduct} onClose={() => setHistoryProduct(null)} />}
      {toast && <div className="b44-toast">{toast}</div>}
    </main>
  )
}

function Header({ cartCount, cartPulse, categoryOpen, onCategoryOpen, onCartOpen, user, onLogout }) {
  const categories = ['Todos', 'Grãos', 'Pecuária', 'Hortifrúti']
  const [category, setCategory] = useState('Todos')
  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <header className="b44-header">
      <div className="b44-container b44-header-row">
        <a className="b44-logo" href="/">Aliz</a>
        <div className="b44-search">
          <div className="b44-category">
            <button onClick={() => onCategoryOpen(!categoryOpen)}>{category}<i className="ti ti-chevron-down" /></button>
            {categoryOpen && (
              <div className="b44-category-menu">
                {categories.map(item => <button key={item} onClick={() => { setCategory(item); onCategoryOpen(false) }}>{item}</button>)}
              </div>
            )}
          </div>
          <input placeholder="Buscar produtos, grãos, pecuária..." onFocus={() => onCategoryOpen(false)} />
          <button className="b44-search-btn"><i className="ti ti-search" /></button>
        </div>
        <div className="b44-actions">
          {user ? (
            <div className="account-menu">
              <button className="account-avatar" onClick={() => setAccountOpen(!accountOpen)} aria-label="Conta">
                {user.avatar || user.name?.charAt(0) || 'U'}
              </button>
              {accountOpen && (
                <div className="account-popover">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <em>{user.provider === 'google' ? 'Google' : 'Email'} account</em>
                  <button onClick={() => { setAccountOpen(false); onLogout() }}>
                    <i className="ti ti-logout" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" aria-label="Conta"><i className="ti ti-user" /></a>
          )}
          <button className={`b44-cart ${cartPulse ? 'pulse' : ''}`} onClick={onCartOpen}>
            <i className="ti ti-shopping-cart" />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}

function CategoryNav({ activeTab, onChange }) {
  return (
    <nav className="b44-nav">
      <div className="b44-container b44-nav-row">
        {nav.map(([label, icon, href, tab]) => (
          <a
            key={label}
            href={href}
            className={tab === activeTab ? 'active' : ''}
            onClick={event => {
              event.preventDefault()
              if (tab) onChange(tab)
              document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <i className={`ti ${icon}`} /> {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

function Hero({ slide, setSlide }) {
  const item = slides[slide]
  const next = () => setSlide((slide + 1) % slides.length)
  const prev = () => setSlide((slide - 1 + slides.length) % slides.length)

  return (
    <section className="b44-hero">
      <div className="b44-hero-frame">
        <img src={item.image} alt={item.headline} />
        <div className="b44-hero-overlay" />
        <div className="b44-hero-content">
          <h2>{item.headline}</h2>
          <p>{item.subtitle}</p>
          <a href="#graos">{item.cta}</a>
        </div>
        <button className="b44-arrow left" onClick={prev}><i className="ti ti-chevron-left" /></button>
        <button className="b44-arrow right" onClick={next}><i className="ti ti-chevron-right" /></button>
        <div className="b44-dots">{slides.map((s, index) => <button key={s.headline} className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} />)}</div>
      </div>
    </section>
  )
}

function Products({ activeTab, setActiveTab, items, selectedState, onAdd, onHistory }) {
  return (
    <section id="graos" className="b44-products">
      <div className="b44-container">
        <div className="b44-section-head">
          <h2>Nossos Produtos</h2>
          <p>Seleção premium com rastreabilidade e certificação de origem. {selectedState && <strong>Preços para {selectedState}.</strong>}</p>
          <span />
        </div>
        <div className="b44-tabs">
          {tabs.map(tab => (
            <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
              <i className={`ti ${tab.icon}`} /> {tab.label}
            </button>
          ))}
        </div>
        <div id="pecuaria" />
        <div id="hortifruti" />
        <div className="b44-grid">
          {items.map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} onHistory={onHistory} />)}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, onAdd, onHistory }) {
  return (
    <article className="b44-card">
      <div className="b44-card-image">
        <img src={product.image} alt={product.name} />
        <div className="b44-badges">
          {product.organic && <span className="organic"><i className="ti ti-leaf" />Orgânico</span>}
          {product.badge && <span>{product.badge}</span>}
        </div>
        <button className="history" onClick={() => onHistory(product)} title="Ver histórico de preços"><i className="ti ti-chart-line" /></button>
      </div>
      <div className="b44-card-body">
        <p className="origin">{product.origin}</p>
        <h3>{product.name}</h3>
        <p className="unit">{product.unit}</p>
        <div className="stars">
          {Array.from({ length: 5 }).map((_, index) => <i key={index} className={`ti ti-star-filled ${index < Math.floor(product.rating) ? 'filled' : ''}`} />)}
          <span>({product.reviews})</span>
        </div>
        <div className="buy-row">
          <div>
            <strong>R$ {money(product.price)}</strong>
            {product.oldPrice && <em>R$ {money(product.oldPrice)}</em>}
          </div>
          <button onClick={() => onAdd(product)}><i className="ti ti-shopping-cart-plus" />Adicionar</button>
        </div>
      </div>
    </article>
  )
}

function Footer() {
  const columns = {
    Produtos: ['Grãos', 'Pecuária', 'Hortifrúti', 'Novidades'],
    Empresa: ['Sobre Nós', 'Sustentabilidade', 'Carreiras', 'Blog'],
    Suporte: ['Central de Ajuda', 'Termos de Uso', 'Política de Privacidade', 'Devoluções']
  }
  return (
    <footer id="sobre-nos" className="b44-footer">
      <div className="b44-certifications">
        {['ISO 9001', 'Orgânico Brasil', 'Selo Verde'].map((label, index) => (
          <div key={label}><i className={`ti ${index === 0 ? 'ti-certificate' : index === 1 ? 'ti-leaf' : 'ti-shield-check'}`} />{label}</div>
        ))}
      </div>
      <div className="b44-container b44-footer-grid">
        <div>
          <h2>Aliz</h2>
          <p>Conectando o agronegócio brasileiro com excelência, tecnologia e sustentabilidade.</p>
          <a href="mailto:contato@aliz.com.br"><i className="ti ti-mail" /> contato@aliz.com.br</a>
          <a href="tel:+551199999999"><i className="ti ti-phone" /> +55 (11) 9999-9999</a>
          <span><i className="ti ti-map-pin" /> São Paulo, Brasil</span>
        </div>
        {Object.entries(columns).map(([title, links]) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map(link => <a key={link} href="#">{link}</a>)}
          </div>
        ))}
      </div>
      <div className="b44-copy"><span>© 2026 Aliz Agronegócios. Todos os direitos reservados.</span><span>CNPJ: 00.000.000/0001-00</span></div>
    </footer>
  )
}

function CartDrawer({ open, onClose, items, selectedState, onStateChange, onUpdateQty, onRemove }) {
  const [stateMenu, setStateMenu] = useState(false)
  const [cep, setCep] = useState('')
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = selectedState ? (freight[selectedState] ?? 75) : null
  const total = subtotal + (shipping ?? 0)
  const count = items.reduce((sum, item) => sum + item.qty, 0)
  const stateName = states.find(state => state.uf === selectedState)?.name

  if (!open) return null

  return (
    <aside className="b44-cart-drawer">
      <div className="b44-cart-backdrop" onClick={onClose} />
      <div className="b44-cart-panel">
        <div className="b44-cart-head">
          <div><i className="ti ti-shopping-cart" /><strong>Carrinho</strong>{count > 0 && <span>{count}</span>}</div>
          <button onClick={onClose}><i className="ti ti-x" /></button>
        </div>
        <div className="b44-location">
          <label><i className="ti ti-map-pin" />Localização para entrega</label>
          <div className="b44-location-row">
            <div className="b44-state-select">
              <button onClick={() => setStateMenu(!stateMenu)}>{selectedState ? `${selectedState} — ${stateName}` : 'Selecione o estado'}<i className="ti ti-chevron-down" /></button>
              {stateMenu && (
                <div>
                  {states.map(state => <button key={state.uf} onClick={() => { onStateChange(state.uf); setStateMenu(false) }}><strong>{state.uf}</strong>{state.name}{selectedState === state.uf && <i className="ti ti-check" />}</button>)}
                </div>
              )}
            </div>
            <input value={cep} onChange={event => setCep(event.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2'))} placeholder="CEP" maxLength={9} />
          </div>
          {selectedState && <small>Frete estimado para <strong>{stateName}</strong>: R$ {money(shipping)}</small>}
        </div>
        <div className="b44-cart-items">
          {items.length === 0 ? (
            <div className="empty"><i className="ti ti-shopping-cart" /><strong>Seu carrinho está vazio</strong><span>Adicione produtos para continuar</span><button onClick={onClose}>Explorar Produtos</button></div>
          ) : items.map(item => (
            <div className="b44-cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>{item.unit}</span>
                <div className="b44-qty">
                  <button onClick={() => onUpdateQty(item.id, item.qty - 1)}><i className="ti ti-minus" /></button>
                  <span>{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.id, item.qty + 1)}><i className="ti ti-plus" /></button>
                  <em>R$ {money(item.price * item.qty)}</em>
                  <button className="remove" onClick={() => onRemove(item.id)}><i className="ti ti-trash" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="b44-summary">
            <p><span>Subtotal ({count} {count === 1 ? 'item' : 'itens'})</span><strong>R$ {money(subtotal)}</strong></p>
            <p><span>Frete {selectedState ? `(${selectedState})` : ''}</span>{shipping != null ? <strong>R$ {money(shipping)}</strong> : <em>Selecione o estado</em>}</p>
            <p className="total"><span>Total</span><strong>R$ {money(total)}</strong></p>
            <button>Finalizar Pedido <i className="ti ti-arrow-right" /></button>
            <button className="continue" onClick={onClose}>Continuar Comprando</button>
          </div>
        )}
      </div>
    </aside>
  )
}

function HistoryModal({ product, onClose }) {
  const history = priceHistory(product)
  const values = history.map(item => item.price)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const start = values[0]
  const end = values[values.length - 1]
  const delta = ((end - start) / start) * 100
  const stable = Math.abs(delta) < 1

  return (
    <aside className="b44-history" onClick={onClose}>
      <div onClick={event => event.stopPropagation()}>
        <header>
          <div>
            <span>Histórico de Preços — 12 meses</span>
            <h3>{product.name}</h3>
            <p>{product.unit} · {product.origin}</p>
          </div>
          <button onClick={onClose}><i className="ti ti-x" /></button>
        </header>
        <section className="history-stats">
          <div><span>Preço Atual</span><strong>R$ {money(product.price)}</strong></div>
          <div><span>Mínimo (ano)</span><strong className="good">R$ {money(min)}</strong></div>
          <div><span>Máximo (ano)</span><strong className="bad">R$ {money(max)}</strong></div>
        </section>
        <section className="history-chart">
          <span className={stable ? 'stable' : delta > 0 ? 'up' : 'down'}>{stable ? 'Estável' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}% no período`}</span>
          <div className="chart-bars">
            {history.map(item => <div key={item.month}><i style={{ height: `${30 + ((item.price - min) / Math.max(max - min, 1)) * 120}px` }} /><span>{item.month}</span></div>)}
          </div>
        </section>
      </div>
    </aside>
  )
}
