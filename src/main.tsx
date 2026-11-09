import React, { useEffect, useLayoutEffect, useReducer } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ProjectPage from './ProjectPage'
import ProjectsPage from './ProjectsPage'
import AboutPage from './AboutPage'
import BusinessesPage from './BusinessesPage'
import QualityPage from './QualityPage'
import CapabilitiesPage from './CapabilitiesPage'
import QuotePage from './QuotePage'
import './index.css'
import { initPageTransitions, onRouteChange } from './pageTransition'
import { applyLanguage, getLang, onLangChange, translate } from './i18n'

// Pages: /?project=<slug> (project details), /?projects (project list), /?about (About BCE), /?businesses, /?quality (Quality & HSE), /?capabilities (Technical Capabilities), /?quote, everything else the homepage. Links between
// them navigate in-app with the page transition (src/pageTransition.ts), so the shell re-renders on route changes.
// Switching language remounts the page; in Khmer the translator runs after render and before the text reveals split it.
const homeTitle = document.title

function Page() {
  const params = new URLSearchParams(location.search)
  const slug = params.get('project')
  if (slug !== null) return <ProjectPage key={slug} slug={slug} />
  if (params.has('projects')) return <ProjectsPage />
  if (params.has('about')) return <AboutPage />
  if (params.has('businesses')) return <BusinessesPage />
  if (params.has('quality')) return <QualityPage />
  if (params.has('capabilities')) return <CapabilitiesPage />
  if (params.has('quote')) return <QuotePage />
  document.title = translate(homeTitle)
  return <App />
}

function Root() {
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  useEffect(() => onRouteChange(rerender), [])
  useEffect(() => onLangChange(rerender), [])
  // Child layout effects have run (DOM in place), child effects (text reveals) have not: translate now.
  useLayoutEffect(() => applyLanguage(document.getElementById('root')!))
  const lang = getLang()
  return <Page key={`${lang}-${location.search}`} />
}

initPageTransitions()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
