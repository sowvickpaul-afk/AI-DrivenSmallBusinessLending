'use client'

import { useState, type FormEvent } from 'react'

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M4 10h11M11 6l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Plus = ({ open }: { open: boolean }) => (
  <svg className={open ? 'is-open' : ''} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const Check = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="m5 10 3 3 7-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Logo = () => (
  <a href="#top" className="logo" aria-label="CreditDibe home">
    <span className="logo-mark">
      <i />
      <i />
      <i />
    </span>
    Credit<span>Dibe</span>
  </a>
)

const products = [
  {
    name: 'Line of Credit',
    label: 'WORKING CAPITAL',
    title: 'Flexible capital, ready when business calls.',
    copy: 'Give businesses revolving access to funds they can draw, repay, and use again—without starting over every time.',
    facts: [
      'Draw only what is needed',
      'Limits informed by live performance',
      'Simple, transparent repayment',
    ],
    stat: '$150K',
    statLabel: 'example maximum line',
  },
  {
    name: 'Term Loan',
    label: 'GROWTH CAPITAL',
    title: 'One clear amount for the next big move.',
    copy: 'Offer predictable financing for equipment, expansion, hiring, and other investments with a defined repayment schedule.',
    facts: ['Predictable payments', 'Fast digital decisioning', 'Built for planned investments'],
    stat: '24 mo.',
    statLabel: 'example term options',
  },
  {
    name: 'Invoice Financing',
    label: 'RECEIVABLES CAPITAL',
    title: 'Turn unpaid invoices into forward motion.',
    copy: 'Help businesses bridge the gap between completing the work and getting paid, directly inside the tools they already use.',
    facts: [
      'Connected invoice data',
      'Capital matched to receivables',
      'No manual paperwork chase',
    ],
    stat: 'B2B',
    statLabel: 'cash-flow support',
  },
  {
    name: 'Purchase Financing',
    label: 'SPEND CAPITAL',
    title: 'Put inventory and purchasing within reach.',
    copy: 'Embed financing at the point of purchase so businesses can stock up, seize discounts, and keep operations moving.',
    facts: ['At-checkout experience', 'Supplier-friendly flows', 'Real-time eligibility signals'],
    stat: '1 click',
    statLabel: 'embedded experience',
  },
]

const faqs = [
  {
    q: 'What is embedded capital?',
    a: 'Embedded capital brings financing directly into the software, marketplace, or payment experience a business already uses. CreditDibe provides the decisioning, capital workflows, and servicing layer behind that experience.',
  },
  {
    q: 'How does CreditDibe evaluate a business?',
    a: 'With permission, CreditDibe analyzes connected bank, accounting, payments, and platform data. This creates a current view of cash flow and business performance rather than relying only on static documents.',
  },
  {
    q: 'Can the experience match our platform?',
    a: 'Yes. Modular APIs and configurable user flows let partners shape placement, messaging, and product availability while keeping the capital experience consistent with their brand.',
  },
  {
    q: 'How quickly can a platform integrate?',
    a: 'Timing depends on the integration and products selected. Our team starts with the data and customer journey, then maps a launch path from a focused pilot to a broader rollout.',
  },
]

function CapitalNetwork() {
  return (
    <div
      className="network"
      aria-label="CreditDibe connects platform data, underwriting, and capital"
    >
      <div className="network-orbit orbit-one" />
      <div className="network-orbit orbit-two" />
      <div className="network-center">
        <span className="logo-mark">
          <i />
          <i />
          <i />
        </span>
        <small>CAPITAL CORE</small>
      </div>
      <div className="network-node node-commerce">
        <span>01</span>
        <b>Commerce</b>
        <small>Order signals</small>
      </div>
      <div className="network-node node-accounting">
        <span>02</span>
        <b>Accounting</b>
        <small>Cash flow</small>
      </div>
      <div className="network-node node-banking">
        <span>03</span>
        <b>Banking</b>
        <small>Transactions</small>
      </div>
      <div className="network-node node-decision">
        <i>
          <Check />
        </i>
        <b>Decision ready</b>
        <small>Live data verified</small>
      </div>
      <svg className="network-lines" viewBox="0 0 620 560" fill="none" aria-hidden="true">
        <path d="M305 280 135 115M305 280 500 145M305 280 480 420M305 280 112 405" />
      </svg>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const product = products[activeProduct]

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <main id="top">
      <div className="announcement">
        <span>Capital infrastructure for the small business economy</span>
        <a href="#platform">
          Explore the platform <Arrow />
        </a>
      </div>

      <header>
        <Logo />
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">
          <a href="#platform" onClick={() => setMenuOpen(false)}>
            For platforms
          </a>
          <a href="#businesses" onClick={() => setMenuOpen(false)}>
            For businesses
          </a>
          <a href="#products" onClick={() => setMenuOpen(false)}>
            Products
          </a>
          <a href="#resources" onClick={() => setMenuOpen(false)}>
            Resources
          </a>
          <a className="mobile-login-link" href="/login" onClick={() => setMenuOpen(false)}>
            Log in
          </a>
        </nav>
        <div className="header-actions">
          <a className="btn btn-login" href="/login">
            Log in
          </a>
          <a className="btn btn-dark" href="/apply">
            Apply <Arrow />
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">THE CAPITAL LAYER FOR MODERN PLATFORMS</span>
          <h1>
            Power the next move for <em>small business.</em>
          </h1>
          <p>
            Embed fast, flexible working capital into the platforms businesses rely on every
            day—powered by real-time data and intelligent underwriting.
          </p>
          <div className="hero-actions">
            <a className="btn btn-lime" href="#contact">
              Launch with CreditDibe <Arrow />
            </a>
            <a className="text-link" href="#products">
              Explore products <Arrow />
            </a>
          </div>
          <div className="hero-proof">
            <div>
              <b>Real-time</b>
              <span>cash-flow intelligence</span>
            </div>
            <div>
              <b>Modular</b>
              <span>capital products</span>
            </div>
            <div>
              <b>Embedded</b>
              <span>inside your platform</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <CapitalNetwork />
        </div>
      </section>

      <section className="partner-strip">
        <span>BUILT TO CONNECT ACROSS THE BUSINESS STACK</span>
        <div>
          <b>Payments</b>
          <b>Accounting</b>
          <b>Marketplaces</b>
          <b>Vertical SaaS</b>
          <b>Banking</b>
        </div>
      </section>

      <section className="products" id="products">
        <div className="section-heading">
          <span className="section-index">01 — MODULAR CAPITAL</span>
          <h2>
            Fast, flexible funding.
            <br />
            <em>One powerful platform.</em>
          </h2>
          <p>
            Choose the products that fit your customers and add more as your capital program grows.
          </p>
        </div>
        <div className="product-tabs" role="tablist" aria-label="Capital products">
          {products.map((item, index) => (
            <button
              key={item.name}
              className={activeProduct === index ? 'active' : ''}
              onClick={() => setActiveProduct(index)}
              role="tab"
              aria-selected={activeProduct === index}
            >
              <span>0{index + 1}</span>
              {item.name}
            </button>
          ))}
        </div>
        <div className="product-stage">
          <div className="product-copy">
            <span className="card-label">{product.label}</span>
            <h3>{product.title}</h3>
            <p>{product.copy}</p>
            <ul>
              {product.facts.map((fact) => (
                <li key={fact}>
                  <span>
                    <Check />
                  </span>
                  {fact}
                </li>
              ))}
            </ul>
            <a className="text-link" href="#contact">
              Talk to our team <Arrow />
            </a>
          </div>
          <div className="product-visual">
            <div className="capital-card">
              <div className="card-top">
                <Logo />
                <span>•••• 2841</span>
              </div>
              <small>{product.label}</small>
              <strong>{product.stat}</strong>
              <p>{product.statLabel}</p>
              <div className="mini-chart">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="card-bottom">
                <span>LIVE PERFORMANCE</span>
                <b>
                  <i /> Connected
                </b>
              </div>
            </div>
            <div className="float-decision">
              <span>
                <Check />
              </span>
              <div>
                <b>Capital ready</b>
                <small>Cash-flow signals verified</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="platform-section" id="platform">
        <div className="platform-intro">
          <span className="section-index">02 — FOR PLATFORMS</span>
          <h2>
            Make capital a <em>core offering</em> in your platform.
          </h2>
          <p>
            Help businesses move forward while keeping your platform at the center of every
            decision, transaction, and growth moment.
          </p>
        </div>
        <div className="platform-grid">
          <article className="platform-feature feature-large">
            <div className="feature-num">01</div>
            <div className="api-window">
              <div className="api-dots">
                <i />
                <i />
                <i />
              </div>
              <code>
                <span>POST</span> /v1/capital/eligibility
              </code>
              <code className="code-line">
                {'{'} "business_id": <b>"your_customer"</b> {'}'}
              </code>
              <div className="api-result">
                <span>
                  <Check />
                </span>
                <div>
                  <small>ELIGIBILITY</small>
                  <b>Offer available</b>
                </div>
              </div>
            </div>
            <h3>One connection. Multiple capital products.</h3>
            <p>
              Launch through modular APIs and use connected platform data to create a smoother
              customer experience.
            </p>
          </article>
          <article className="platform-feature">
            <div className="feature-num">02</div>
            <div className="signal-graphic">
              <i />
              <i />
              <i />
              <span>LIVE</span>
            </div>
            <h3>Decisioning that sees the whole business.</h3>
            <p>
              Real-time transaction and accounting signals support smarter, more responsive capital
              decisions.
            </p>
          </article>
          <article className="platform-feature">
            <div className="feature-num">03</div>
            <div className="brand-graphic">
              <span>Your brand</span>
              <i>+</i>
              <b>CreditDibe</b>
            </div>
            <h3>Your customer. Your experience.</h3>
            <p>
              Configure the journey to fit your brand, workflow, and the moments where capital
              matters most.
            </p>
          </article>
        </div>
      </section>

      <section className="business-section" id="businesses">
        <div className="business-photo">
          <img
            src="https://images.unsplash.com/photo-1753351052617-62818ffc9173?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400"
            alt="Two small business owners in their cafe"
          />
          <div className="photo-callout">
            <span>AVAILABLE CAPITAL</span>
            <b>$42,000</b>
            <small>Ready when the opportunity is</small>
          </div>
        </div>
        <div className="business-copy">
          <span className="section-index">03 — FOR BUSINESSES</span>
          <h2>
            Capital that moves at the speed of <em>opportunity.</em>
          </h2>
          <p>
            No stacks of paperwork. No waiting weeks for an answer. Businesses connect their data,
            review available options, and move forward with clarity.
          </p>
          <div className="benefit-list">
            <div>
              <span>01</span>
              <section>
                <b>Apply in minutes</b>
                <small>A focused digital experience, not a paperwork marathon.</small>
              </section>
            </div>
            <div>
              <span>02</span>
              <section>
                <b>Use what you need</b>
                <small>Capital designed around real operating needs and timing.</small>
              </section>
            </div>
            <div>
              <span>03</span>
              <section>
                <b>Keep growing</b>
                <small>
                  Connected data helps the capital relationship evolve with the business.
                </small>
              </section>
            </div>
          </div>
          <a className="btn btn-lime" href="#contact">
            See how it works <Arrow />
          </a>
        </div>
      </section>

      <section className="proof-section">
        <span className="section-index">THE CREDITDIBE DIFFERENCE</span>
        <h2>
          Built for the way business
          <br />
          <em>actually happens.</em>
        </h2>
        <div className="proof-grid">
          <div>
            <strong>01</strong>
            <b>Live data, not static snapshots</b>
            <p>See current cash-flow patterns across connected business systems.</p>
          </div>
          <div>
            <strong>02</strong>
            <b>Capital in context</b>
            <p>Present offers inside the workflow where the need becomes clear.</p>
          </div>
          <div>
            <strong>03</strong>
            <b>One platform, room to grow</b>
            <p>Start with a focused product and expand as customer needs evolve.</p>
          </div>
          <div>
            <strong>04</strong>
            <b>Designed for momentum</b>
            <p>Reduce friction from first signal through decision and funding.</p>
          </div>
        </div>
      </section>

      <section className="use-cases" id="resources">
        <div className="section-heading">
          <span className="section-index">04 — CAPITAL IN ACTION</span>
          <h2>
            Meet businesses at the
            <br />
            <em>moment of need.</em>
          </h2>
        </div>
        <div className="case-grid">
          <article>
            <span>MARKETPLACES</span>
            <h3>Help sellers stock up before demand spikes.</h3>
            <p>Surface purchase capital from marketplace and sales signals.</p>
            <a href="#contact">
              <Arrow />
            </a>
          </article>
          <article>
            <span>VERTICAL SAAS</span>
            <h3>Turn software insights into business growth.</h3>
            <p>Offer working capital alongside the workflows customers use daily.</p>
            <a href="#contact">
              <Arrow />
            </a>
          </article>
          <article>
            <span>PAYMENTS</span>
            <h3>Make revenue history work harder.</h3>
            <p>Use connected payment performance to create more relevant offers.</p>
            <a href="#contact">
              <Arrow />
            </a>
          </article>
        </div>
      </section>

      <section className="faq-section">
        <div>
          <span className="section-index">05 — COMMON QUESTIONS</span>
          <h2>
            Frequently asked
            <br />
            <em>questions.</em>
          </h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <article key={faq.q} className={openFaq === index ? 'open' : ''}>
              <button
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                aria-expanded={openFaq === index}
              >
                <span>0{index + 1}</span>
                <b>{faq.q}</b>
                <Plus open={openFaq === index} />
              </button>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <span className="section-index">READY TO BUILD?</span>
        <h2>
          Put capital at the center of
          <br />
          <em>what comes next.</em>
        </h2>
        <p>
          Tell us where your customers need more flexibility. We’ll show you how CreditDibe can fit.
        </p>
        {submitted ? (
          <div className="success-message">
            <span>
              <Check />
            </span>
            <div>
              <b>Thanks for reaching out.</b>
              <small>We’ll follow up at {email}.</small>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="sr-only" htmlFor="email">
              Work email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email address"
              required
            />
            <button className="btn btn-lime" type="submit">
              Partner with us <Arrow />
            </button>
          </form>
        )}
      </section>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              Capital infrastructure for the
              <br />
              small business economy.
            </p>
          </div>
          <div>
            <b>FOR PLATFORMS</b>
            <a href="#platform">Platform overview</a>
            <a href="#products">Capital products</a>
            <a href="#contact">Partner with us</a>
          </div>
          <div>
            <b>FOR BUSINESSES</b>
            <a href="#businesses">How it works</a>
            <a href="#products">Line of credit</a>
            <a href="#resources">Resources</a>
          </div>
          <div>
            <b>COMPANY</b>
            <a href="#top">About</a>
            <a href="#top">Careers</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="footer-note">
          All financing is subject to credit approval, eligibility requirements, and applicable
          terms. Product availability may vary.
        </div>
        <div className="footer-bottom">
          <span>© 2026 CreditDibe, Inc.</span>
          <div>
            <a href="#top">Privacy</a>
            <a href="#top">Terms</a>
            <a href="#top">Disclosures</a>
          </div>
          <span className="status">
            <i /> Systems operational
          </span>
        </div>
      </footer>
    </main>
  )
}
