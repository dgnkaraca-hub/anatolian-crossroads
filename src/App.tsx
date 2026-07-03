import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { allSources, dataset } from './data/graph'
import { STORIES } from './data/stories'
import {
  sourcedRecordCount,
  validateBridge,
  validateGraph,
  validateStories,
} from './data/validate'
import { computeVisible, defaultFilters, type FilterState } from './lib/filter'
import { exportCsv, exportJson } from './lib/export'
import { ui, uiText, type DataLang } from './lib/i18n'
import Toolbar from './components/Toolbar'
import TimeSlider from './components/TimeSlider'
import EvidencePanel from './components/EvidencePanel'
import SourcesModal from './components/SourcesModal'
import { StoryBar, StoryPanel } from './components/StoryPanel'
import ListenPanel from './components/ListenPanel'
import MapView from './views/MapView'
import NetworkView from './views/NetworkView'

export default function App() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [lang, setLang] = useState<DataLang>('en')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showSources, setShowSources] = useState(false)
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null)
  const [storyStep, setStoryStep] = useState(0)
  const [showListen, setShowListen] = useState(false)

  // Enforce the sourcing/continuity disciplines at runtime (dev console).
  useEffect(() => {
    const issues = [...validateGraph(), ...validateStories(), ...validateBridge()]
    if (issues.length > 0) {
      console.warn('[dataset] integrity issues:', issues)
    } else {
      console.info(
        `[dataset] OK — ${dataset.nodes.length} nodes, ${dataset.edges.length} edges, ` +
          `${allSources().length} distinct sources, ${STORIES.length} story routes; ` +
          'all records sourced; no continuity relations.',
      )
    }
  }, [])

  const activeStory = activeStoryId
    ? STORIES.find((s) => s.id === activeStoryId) ?? null
    : null

  /** Apply a story step: select its focus, sync time slider + concept filter. */
  function goToStep(story: typeof STORIES[number], index: number) {
    const step = story.steps[index]
    setStoryStep(index)
    setSelectedId(step.focus)
    setFilters((f) => ({
      ...f,
      year: step.year,
      conceptFocus: step.conceptFocus ?? null,
    }))
  }

  function startStory(id: string) {
    const story = STORIES.find((s) => s.id === id)
    if (!story) return
    setActiveStoryId(id)
    goToStep(story, 0)
  }

  function exitStory() {
    setActiveStoryId(null)
    setStoryStep(0)
    setFilters((f) => ({ ...f, year: null, conceptFocus: null }))
  }

  // Keep the document language in sync so CSS text-transform uses Turkish
  // casing rules (i -> İ) in TR mode.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const graph = useMemo(() => computeVisible(filters), [filters])
  const { sourced, total } = sourcedRecordCount()

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>{dataset.meta.title}</h1>
          <span className="subtitle">
            {ui(`${dataset.meta.subtitle} · 9600–700 BCE`, lang)}
          </span>
        </div>
        <div className="header-meta">
          {dataset.nodes.length} {ui('nodes', lang)} · {dataset.edges.length}{' '}
          {ui('edges', lang)} · {allSources().length} {ui('sources', lang)}
          <br />
          <span className="sourced-count">
            {sourced}/{total} {ui('records sourced', lang)}
          </span>
        </div>
      </header>

      <Toolbar
        filters={filters}
        setFilters={setFilters}
        lang={lang}
        setLang={setLang}
        onShowSources={() => setShowSources(true)}
        onExportJson={exportJson}
        onExportCsv={exportCsv}
      />

      <TimeSlider
        year={filters.year}
        lang={lang}
        setYear={(year) => setFilters({ ...filters, year })}
      />

      <StoryBar
        activeStoryId={activeStoryId}
        lang={lang}
        onStart={startStory}
        onExit={exitStory}
      >
        <button
          className={`chip listen-chip${showListen ? ' on' : ''}`}
          onClick={() => setShowListen((v) => !v)}
          title={ui('Sonification: play the atlas as sound', lang)}
        >
          ♫ {ui('listen', lang)}
        </button>
      </StoryBar>

      <div className="app-main">
        <div className="views">
          {activeStory && (
            <StoryPanel
              story={activeStory}
              stepIndex={storyStep}
              lang={lang}
              onStep={(i) => goToStep(activeStory, i)}
              onExit={exitStory}
            />
          )}
          {showListen && (
            <ListenPanel
              lang={lang}
              onYear={(year) => setFilters((f) => ({ ...f, year }))}
              onClose={() => setShowListen(false)}
            />
          )}
          <section className="panel map-panel">
            <div className="panel-title">{ui('Site atlas', lang)}</div>
            <MapView
              graph={graph}
              lang={lang}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
          </section>
          <section className="panel network-panel">
            <div className="panel-title">{ui('Macro network', lang)}</div>
            <NetworkView
              graph={graph}
              lang={lang}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
          </section>
        </div>
        <EvidencePanel selectedId={selectedId} lang={lang} onSelect={setSelectedId} />
      </div>

      <footer className="app-footer">
        {uiText('footerMethod', lang)} {ui('Micro modules:', lang)} Sam'al
        (:5185) · Göbekli Tepe (:5186) · Kültepe-Kaneš (:5191).
      </footer>

      {showSources && (
        <SourcesModal lang={lang} onClose={() => setShowSources(false)} />
      )}
    </div>
  )
}
