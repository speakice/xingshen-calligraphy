import { useEffect, useRef } from 'react'
import { LayoutGrid } from 'lucide-react'
import { sanmenCharacters } from '../characterGuide'

type CharacterStripProps = {
  activeChar: string
  onSelect: (char: string) => void
  onOpenLibrary: () => void
  compact?: boolean
}

export function CharacterStrip({
  activeChar,
  onSelect,
  onOpenLibrary,
  compact = false,
}: CharacterStripProps) {
  const activeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollRef.current
    const active = activeRef.current
    if (!container || !active) return
    const containerRect = container.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    container.scrollTo({
      left:
        container.scrollLeft +
        activeRect.left -
        containerRect.left -
        (container.clientWidth - activeRect.width) / 2,
      behavior: 'smooth',
    })
  }, [activeChar])

  return (
    <section
      className={`character-strip${compact ? ' is-compact' : ''}`}
      aria-label="单行范字列表"
    >
      <div className="character-strip-head">
        <span>范字</span>
        <small>{sanmenCharacters.length} 字</small>
        <button type="button" onClick={onOpenLibrary}>
          <LayoutGrid size={13} />
          全字库
        </button>
      </div>
      <div className="character-strip-scroll" ref={scrollRef}>
        {sanmenCharacters.map((entry) => (
          <button
            type="button"
            key={entry.char}
            ref={entry.char === activeChar ? activeRef : undefined}
            className={
              entry.char === activeChar
                ? 'strip-character is-active'
                : 'strip-character'
            }
            onClick={() => onSelect(entry.char)}
            aria-pressed={entry.char === activeChar}
            title={`${entry.char} · ${entry.pinyin || '读音待补'} · ${
              entry.structure
            }结构 · ${entry.strokeCount || '—'}画`}
          >
            <span className="strip-character-glyph">
              {entry.image ? (
                <img
                  src={entry.image}
                  alt={entry.char}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="strip-character-fallback">{entry.char}</span>
              )}
            </span>
            <small>{entry.pinyin || '—'}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
