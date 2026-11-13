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
import CapabilitiesPage from './CapabilitiesPage'
import QuotePage from './QuotePage'
import RecruitmentPage from './RecruitmentPage'
import ResourcesPage from './ResourcesPage'
import BlogPage from './BlogPage'
import './index.css'
import { initPageTransitions, onRouteChange } from './pageTransition'
import { applyLanguage, getLang, onLangChange, translate } from './i18n'
import {
  bootstrapContent,
  getRuntimeContentVersion,
  onContentChange,
} from './contentStore'

// Pages: /?project=<slug> (project details), /?projects (project list), /?about (About BCE), /?businesses, /?quality (Quality & HSE), /?capabilities (Technical Capabilities), /?quote, everything else the homepage. Links between
// them navigate in-app with the page transition (src/pageTransition.ts), so the shell re-renders on route changes.
// Switching language remounts the page; in Khmer the translator runs after render and before the text reveals split it.
const homeTitle = document.title

// The admin console is a separate chunk so public visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'))

function Page() {
  const params = new URLSearchParams(location.search)
  const slug = params.get('project')
  if (slug !== null) return <ProjectPage key={slug} slug={slug} />
  if (params.has('projects')) return <ProjectsPage />
  if (params.has('about')) return <AboutPage />
  if (params.has('businesses')) return <BusinessesPage />
  if (params.has('business')) {
    const slug = params.get('business')!
    return findBusinessDetail(slug) ? <BusinessDetailPage key={slug} slug={slug} /> : <BusinessesPage />
  }
  if (params.has('quality')) return <QualityPage />
  if (params.has('capabilities')) return <CapabilitiesPage />
  if (params.has('quote')) return <QuotePage />
  if (params.has('recruitment') || params.has('careers')) return <RecruitmentPage />
  if (params.has('resources')) return <ResourcesPage />
  if (params.has('blog') || params.has('news')) return <BlogPage />
  document.title = translate(homeTitle)
  return <App />
}

function Root() {
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  useEffect(() => onRouteChange(rerender), [])
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
  return <Page key={`${lang}-${location.search}-${getRuntimeContentVersion()}`} />
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
  initPageTransitions()
  root.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>,
  )
  // Load live content from D1 in the background; the bundled content renders first.
  void bootstrapContent()
}
