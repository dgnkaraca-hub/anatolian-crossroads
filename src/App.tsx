import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { allSources, dataset } from './data/graph'
import { STORIES } from './data/stories'
import { sourcedRecordCount, validateGraph, validateStories } from './data/validate'
import { computeVisible, defaultFilters, type FilterState } from './lib/filter'
import { exportCsv, exportJson } from './lib/export'
import type { DataLang } from './lib/i18n'
import Toolbar from './components/Toolbar'
import TimeSlider from './components/TimeSlider'
import EvidencePanel from './components/EvidencePanel'
import SourcesModal from './components/SourcesModal'
import { StoryBar, StoryPanel } from './components/StoryPanel'
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

  // Enforce the sourcing/continuity disciplines at runtime (dev console).
  useEffect(() => {
    const issues = [...validateGraph(), ...validateStories()]
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

  const graph = useMemo(() => computeVisible(filters), [filters])
  const { sourced, total } = sourcedRecordCount()

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>{dataset.meta.title}</h1>
          <span className="subtitle">{dataset.meta.subtitle} · 9600–700 BCE</span>
        </div>
        <div className="header-meta">
          {dataset.nodes.length} nodes · {dataset.edges.length} edges ·{' '}
          {allSources().length} sources
          <br />
          <span className="sourced-count">
            {sourced}/{total} records sourced
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
        setYear={(year) => setFilters({ ...filters, year })}
      />

      <StoryBar
        activeStoryId={activeStoryId}
        lang={lang}
        onStart={startStory}
        onExit={exitStory}
      />

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
          <section className="panel map-panel">
            <div className="panel-title">Site atlas</div>
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
            <div className="panel-title">Macro network</div>
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
        Comparative network — corridors, concepts and comparisons only; no
        continuity claims. Micro modules: Sam'al (:5185) · Göbekli Tepe
        (:5186) · Kültepe-Kaneš (:5191).
      </footer>

      {showSources && <SourcesModal onClose={() => setShowSources(false)} />}
    </div>
  )
}
