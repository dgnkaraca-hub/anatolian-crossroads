/**
 * Story routes UI: a selector strip (one chip per route) and, when a route
 * is active, an overlay card with the step narrative and prev/next controls.
 * Step side-effects (selection, time slider, concept focus) are applied by
 * App so the three views stay coordinated through the normal state flow.
 */

import { STORIES, type StoryRoute, type StoryStep } from '../data/stories'
import { getNode } from '../data/graph'
import { nodeLabel, type DataLang } from '../lib/i18n'

function storyTitle(story: StoryRoute, lang: DataLang): string {
  return lang === 'tr' ? story.title_tr : story.title_en
}

interface BarProps {
  activeStoryId: string | null
  lang: DataLang
  onStart: (id: string) => void
  onExit: () => void
  /** Extra controls rendered at the right edge of the bar (e.g. listen). */
  children?: React.ReactNode
}

export function StoryBar({ activeStoryId, lang, onStart, onExit, children }: BarProps) {
  return (
    <div className="story-bar">
      <span className="toolbar-label">Story routes</span>
      {STORIES.map((story) => {
        const on = story.id === activeStoryId
        return (
          <button
            key={story.id}
            className={`chip story-chip${on ? ' on' : ''}`}
            onClick={() => (on ? onExit() : onStart(story.id))}
          >
            {storyTitle(story, lang)}
          </button>
        )
      })}
      {children && <span className="story-bar-right">{children}</span>}
    </div>
  )
}

interface PanelProps {
  story: StoryRoute
  stepIndex: number
  lang: DataLang
  onStep: (index: number) => void
  onExit: () => void
}

export function StoryPanel({ story, stepIndex, lang, onStep, onExit }: PanelProps) {
  const step: StoryStep = story.steps[stepIndex]
  const focusNode = getNode(step.focus)
  const narrative = lang === 'tr' ? step.narrative_tr : step.narrative_en
  const intro = lang === 'tr' ? story.intro_tr : story.intro_en

  return (
    <div className="story-panel">
      <div className="story-panel-header">
        <div>
          <div className="story-panel-kicker">Story route</div>
          <h3>{storyTitle(story, lang)}</h3>
        </div>
        <button className="chip" onClick={onExit}>
          exit
        </button>
      </div>

      {stepIndex === 0 && <p className="story-intro">{intro}</p>}

      <div className="story-step-focus">
        {focusNode && (
          <>
            <span className={`node-type-tag type-${focusNode.type}`}>
              {focusNode.type}
            </span>{' '}
            <span className="story-focus-label">{nodeLabel(focusNode, lang)}</span>
          </>
        )}
      </div>
      <p className="story-narrative">{narrative}</p>
      <div className="edge-sources">
        {step.sources.map((s) => (
          <span key={s} className="source-key small">
            {s}
          </span>
        ))}
      </div>

      <div className="story-panel-footer">
        <button
          className="chip"
          disabled={stepIndex === 0}
          onClick={() => onStep(stepIndex - 1)}
        >
          ← prev
        </button>
        <div className="story-progress">
          {story.steps.map((_, i) => (
            <button
              key={i}
              className={`story-dot${i === stepIndex ? ' on' : ''}`}
              aria-label={`step ${i + 1}`}
              onClick={() => onStep(i)}
            />
          ))}
        </div>
        <span className="story-counter">
          {stepIndex + 1} / {story.steps.length}
        </span>
        <button
          className="chip"
          disabled={stepIndex === story.steps.length - 1}
          onClick={() => onStep(stepIndex + 1)}
        >
          next →
        </button>
      </div>
    </div>
  )
}
