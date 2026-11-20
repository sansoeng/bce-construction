import React, { Suspense, lazy, useEffect, useLayoutEffect, useReducer } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ProjectPage from './ProjectPage'
import ProjectsPage from './ProjectsPage'
import AboutPage from './AboutPage'
import BusinessesPage from './BusinessesPage'
import BusinessDetailPage from './BusinessDetailPage'
import { findBusinessDetail } from './businessDetails'
import QualityPage from './QualityPage'
import CoveragePage from './CoveragePage'
import FleetPage from './FleetPage'
import QuotePage from './QuotePage'
import RecruitmentPage from './RecruitmentPage'
import ResourcesPage from './ResourcesPage'
import ContactPage from './ContactPage'
import BlogPage from './BlogPage'
import { PrivacyPage, TermsPage } from './LegalPage'
import './index.css'
import { initPageTransitions, onRouteChange } from './pageTransition'
import { initImageParallax } from './imageParallax'
import { applyLanguage, getLang, onLangChange, translate } from './i18n'
import { applyPageSeo, applyStructuredData } from './seo'
import { isLegacyAddress, legacyPath } from './routes'
import ArrowButton from './ArrowButton'
import {
  bootstrapContent,
  getRuntimeContentVersion,
  onContentChange,
  syncContentLanguage,
} from './contentStore'

// Clean paths (src/routes.ts): /projects, /about, /quality, /coverage, /quote, /careers, /resources, /contact,
// /privacy, /terms, /blog, /project/<slug>, /business/<slug>. Old query addresses are rewritten to these on load.
// Links between pages navigate in-app with the page transition (src/pageTransition.ts), so the shell re-renders on
// route changes. Switching language remounts the page; in Khmer the translator runs after render and before the text
// reveals split it.
const homeTitle = document.title

// The admin console is a separate chunk so public visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'))

/** Rewrite an old `/projects`-style address to its clean path before anything renders or a crawler reads it. */
function normaliseAddress() {
  if (!isLegacyAddress(location.search)) return
  const next = legacyPath(location.search)
  if (next) history.replaceState(null, '', next + location.hash)
}

function NotFoundPage() {
  useEffect(() => {
    applyPageSeo('Page not found | BCE., Ltd.')
  }, [])
  return (
    <main className="site-pad flex min-h-[70vh] max-w-[900px] flex-col justify-center">
      <p className="font-mono text-[13px] uppercase tracking-[0.06em] text-[#FB290E]">Error 404</p>
      <h1 className="mt-5 text-[clamp(34px,6vw,44px)] font-medium leading-[1.05] tracking-[-.03em]">This page isn’t here.</h1>
      <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-[#111]/55">
        The address may be old or mistyped. Start from the home page, or call 012 932 700.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ArrowButton href="/" label="Home" />
        <ArrowButton href="/projects" label="Projects" theme="outline" />
        <ArrowButton href="/contact" label="Contact us" theme="outline" />
      </div>
    </main>
  )
}

function Page() {
  const path = location.pathname.replace(/\/+$/, '') || '/'
  const [, section, slug] = path.split('/')

  if (path === '/') {
    applyPageSeo(translate(homeTitle))
    return <App />
  }

  switch (section) {
    case 'about':
      return <AboutPage />
    case 'businesses':
      return <BusinessesPage />
    case 'business':
      return slug && findBusinessDetail(decodeURIComponent(slug)) ? (
        <BusinessDetailPage key={slug} slug={decodeURIComponent(slug)} />
      ) : (
        <BusinessesPage />
      )
    case 'projects':
      return <ProjectsPage />
    case 'project':
      return slug ? <ProjectPage key={slug} slug={decodeURIComponent(slug)} /> : <ProjectsPage />
    case 'quality':
      return <QualityPage />
    // The Technical Capabilities page merged into Quality, capability & HSE; its anchors map to the sections that
    // absorbed them, so /capabilities lands on /quality with the hash preserved.
    case 'capabilities':
      return <QualityPage fromCapabilities />
    case 'coverage':
      return <CoveragePage />
    case 'fleet':
      return <FleetPage />
    case 'quote':
      return <QuotePage />
    case 'careers':
    case 'recruitment':
      return <RecruitmentPage />
    case 'resources':
      return <ResourcesPage />
    case 'contact':
      return <ContactPage />
    case 'privacy':
      return <PrivacyPage />
    case 'terms':
      return <TermsPage />
    case 'blog':
    case 'news':
      return <BlogPage />
    default:
      return <NotFoundPage />
  }
}

function Root() {
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  useEffect(() => onRouteChange(() => {
    normaliseAddress()
    rerender()
  }), [])
  useEffect(() => onLangChange(rerender), [])
  useEffect(() => {
    // Live content arrives moments after first paint and remounts the page. If the homepage intro is playing, hold
    // that remount until it releases the page: remounting now would replace the loader's DOM mid-animation, so the
    // black title/countdown would never be seen (which is what happens on hosts where the API answers quickly).
    let observer: MutationObserver | null = null
    let timer: number | undefined
    let pending = false

    const flush = () => {
      pending = false
      observer?.disconnect()
      observer = null
      window.clearTimeout(timer)
      rerender()
    }

    const refresh = () => {
      if (!document.documentElement.classList.contains('is-loading')) {
        flush()
        return
      }
      pending = true
      if (!observer) {
        observer = new MutationObserver(() => {
          if (pending && !document.documentElement.classList.contains('is-loading')) flush()
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      }
      window.clearTimeout(timer)
      timer = window.setTimeout(() => pending && flush(), 9000)
    }

    const off = onContentChange(refresh)
    return () => {
      off()
      observer?.disconnect()
      window.clearTimeout(timer)
    }
  }, [])
  // Child layout effects have run (DOM in place), child effects (text reveals) have not: translate now.
  useLayoutEffect(() => applyLanguage(document.getElementById('root')!))
  const lang = getLang()
  return <Page key={`${lang}-${location.pathname}-${location.search}-${getRuntimeContentVersion()}`} />
}

const isAdminRoute =
  location.hostname.startsWith('admin.') || new URLSearchParams(location.search).has('admin')

const root = ReactDOM.createRoot(document.getElementById('root')!)

if (isAdminRoute) {
  document.title = 'BCE Operations'
  document.documentElement.lang = 'en'
  const robots = document.createElement('meta')
  robots.name = 'robots'
  robots.content = 'noindex,nofollow'
  document.head.appendChild(robots)
  root.render(
    <React.StrictMode>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f1f5f9' }} />}>
        <AdminApp />
      </Suspense>
    </React.StrictMode>,
  )
} else {
  normaliseAddress()
  initPageTransitions()
  applyStructuredData()
  // Bundled content modules have registered by now: layer the Khmer copy when it is the saved language.
  syncContentLanguage()
  root.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>,
  )
  // Every photo on the site drifts against the scroll (src/imageParallax.ts), as on olympic.no.
  initImageParallax()
  // Load live content from D1 in the background; the bundled content renders first.
  void bootstrapContent()
}
