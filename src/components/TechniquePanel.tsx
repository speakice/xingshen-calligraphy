import { useEffect, useState } from 'react'
import { MoveUpRight, PenLine } from 'lucide-react'
import type { CharacterStudy } from '../data'

type TechniquePanelProps = {
  study: CharacterStudy
  selectedTechniqueIndex: number
  onSelectTechnique: (index: number) => void
  onPractice: () => void
}

export function TechniquePanel({
  study,
  selectedTechniqueIndex,
  onSelectTechnique,
  onPractice,
}: TechniquePanelProps) {
  const [pathKey, setPathKey] = useState(0)
  const selected =
    study.techniques[selectedTechniqueIndex] ?? study.techniques[0]

  useEffect(() => {
    setPathKey((value) => value + 1)
  }, [selectedTechniqueIndex, study.char])

  return (
    <aside
      id="technique-panel"
      className="panel technique-panel is-workspace"
      aria-labelledby="technique-heading"
    >
      <div className="technique-visual-column">
        <div className="panel-heading technique-heading">
          <div>
            <span className="section-kicker">02 · 拆解</span>
            <div className="heading-line">
              <h2 id="technique-heading">技法分析</h2>
              <span className="heading-aside">{study.headline}</span>
            </div>
          </div>
          <div className="technique-heading-actions">
            <span className="reading-badge">{study.reading}</span>
            <button
              type="button"
              className="technique-practice-button"
              onClick={onPractice}
            >
              <PenLine size={14} />
              练习
            </button>
          </div>
        </div>

        <div className="character-study">
          <div className="study-grid" aria-hidden="true" />
          {study.generated ? (
            study.referenceImage ? (
              <img
                className="study-character-image"
                src={study.referenceImage}
                alt={`《三门记》中的“${study.char}”字`}
                draggable={false}
              />
            ) : (
              <span className="study-character" aria-hidden="true">
                {study.char}
              </span>
            )
          ) : (
            <>
              <span className="study-character" aria-hidden="true">
                {study.char}
              </span>
              <svg
                className="study-path"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path key={pathKey} d={selected.path} pathLength="1" />
              </svg>
              {study.techniques.map((technique, index) => (
                <button
                  type="button"
                  key={`${study.char}-${technique.name}`}
                  className={`stroke-marker${
                    index === selectedTechniqueIndex ? ' is-active' : ''
                  }`}
                  style={{ left: `${technique.x}%`, top: `${technique.y}%` }}
                  onClick={() => onSelectTechnique(index)}
                  aria-label={`第 ${index + 1} 笔，${technique.name}，${technique.alias}`}
                  title={`${technique.name} · ${technique.alias}`}
                >
                  {index + 1}
                </button>
              ))}
            </>
          )}
          {study.generated && (
            <span className="study-image-badge">
              原帖单字
              {study.simplified && study.simplified !== study.char
                ? ` · 简 ${study.simplified}`
                : ''}
            </span>
          )}
          <div className="study-focus">
            <span>本期要点</span>
            <strong>{study.focus}</strong>
          </div>
        </div>

        <p className="study-summary">{study.summary}</p>
      </div>

      <div className="technique-strokes-column">
        <span className="technique-column-label">笔画</span>

        <div className="stroke-list" aria-label="笔画列表">
          {study.techniques.map((technique, index) => (
            <button
              type="button"
              key={`${study.char}-list-${technique.name}`}
              className={
                index === selectedTechniqueIndex ? 'stroke-pill is-active' : 'stroke-pill'
              }
              onClick={() => onSelectTechnique(index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{technique.name}</strong>
              <small>{technique.alias}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="technique-explanation-column">
        <span className="technique-column-label">说明</span>
        <div className="technique-detail">
          <div className="detail-topline">
            <span className="detail-number">
              {String(selectedTechniqueIndex + 1).padStart(2, '0')}
            </span>
            <span className="detail-title">
              {selected.name}
              <small>· {selected.alias}</small>
            </span>
            <MoveUpRight size={16} />
          </div>
          <p className="detail-essence">{selected.essence}</p>
          <p className="detail-copy">{selected.detail}</p>
          <div className="detail-cue">
            <span>口诀</span>
            <em>{selected.cue}</em>
          </div>
        </div>
      </div>
    </aside>
  )
}
