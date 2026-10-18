import { useMemo, useState } from 'react'
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import { sanmenCharacters } from '../characterGuide'

type CharacterLibraryProps = {
  activeChar: string
  onSelect: (char: string) => void
  onPractice: (char: string) => void
}

const structureFilters = ['全部', '左右', '上下', '独体', '包围', '其他'] as const

function matchesStructure(structure: string, filter: string) {
  if (filter === '全部') return true
  if (filter === '包围') return structure.includes('包围')
  if (filter === '其他') {
    return (
      !structure.includes('包围') &&
      !['左右', '上下', '独体'].includes(structure)
    )
  }
  return structure === filter
}

export function CharacterLibrary({
  activeChar,
  onSelect,
  onPractice,
}: CharacterLibraryProps) {
  const [query, setQuery] = useState('')
  const [structure, setStructure] = useState<(typeof structureFilters)[number]>(
    '全部',
  )
  const [sort, setSort] = useState<'document' | 'strokes'>('document')

  const filteredCharacters = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return sanmenCharacters
      .filter((entry) => {
        const matchesKeyword =
          !keyword ||
          entry.char.includes(keyword) ||
          entry.simplified.includes(keyword) ||
          entry.pinyin.toLowerCase().includes(keyword) ||
          entry.context.includes(keyword)
        return (
          matchesKeyword && matchesStructure(entry.structure, structure)
        )
      })
      .sort((a, b) => {
        if (sort === 'strokes') {
          const aCount = a.strokeCount || 999
          const bCount = b.strokeCount || 999
          return aCount - bCount || a.firstIndex - b.firstIndex
        }
        return a.firstIndex - b.firstIndex
      })
  }, [query, sort, structure])

  const activeEntry = sanmenCharacters.find((entry) => entry.char === activeChar)

  return (
    <section className="panel character-library" aria-labelledby="library-heading">
      <div className="panel-heading library-panel-heading">
        <div>
          <span className="section-kicker">03 · 全帖字库</span>
          <div className="heading-line">
            <h2 id="library-heading">《三门记》逐字检索</h2>
            <span className="heading-aside">每个字都有技法拆解与临写入口</span>
          </div>
        </div>
        <div className="library-total">
          <strong>{sanmenCharacters.length}</strong>
          <span>个不重复字</span>
          <small>含题目与落款 · 以帖序排列</small>
        </div>
      </div>

      <div className="library-toolbar">
        <label className="library-search">
          <Search size={15} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜字、拼音或简体，例如：门 / mén"
            aria-label="搜索字库"
          />
        </label>
        <div className="library-filters" role="group" aria-label="按结构筛选">
          {structureFilters.map((item) => (
            <button
              type="button"
              key={item}
              className={structure === item ? 'is-active' : ''}
              onClick={() => setStructure(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="library-sort">
          <SlidersHorizontal size={13} />
          <button
            type="button"
            className={sort === 'document' ? 'is-active' : ''}
            onClick={() => setSort('document')}
          >
            帖序
          </button>
          <button
            type="button"
            className={sort === 'strokes' ? 'is-active' : ''}
            onClick={() => setSort('strokes')}
          >
            笔画
          </button>
        </div>
      </div>

      <div className="library-result-line">
        <span>找到 {filteredCharacters.length} 字</span>
        <span>点击字卡查看原帖单字、笔顺和技法</span>
      </div>

      <div className="library-grid-wrap">
        <div className="library-grid">
          {filteredCharacters.map((entry) => (
            <button
              type="button"
              key={entry.char}
              className={
                entry.char === activeChar
                  ? 'library-char-card is-active'
                  : 'library-char-card'
              }
              onClick={() => onSelect(entry.char)}
              aria-pressed={entry.char === activeChar}
              title={`${entry.char} · ${entry.pinyin || '读音待补'} · ${
                entry.structure
              }结构 · ${entry.strokeCount || '—'}画 · 出现 ${entry.occurrences} 次`}
            >
              <span className="library-char-main">{entry.char}</span>
              <span className="library-char-meta">
                <small>{entry.pinyin || '—'}</small>
                <i>{entry.strokeCount || '—'}画</i>
              </span>
              {entry.simplified !== entry.char && (
                <span className="library-char-simple">简 {entry.simplified}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {!filteredCharacters.length && (
        <div className="library-empty">
          <span>没有找到匹配的字</span>
          <small>试试输入简体字、繁体字或拼音</small>
        </div>
      )}

      <div className="library-footer">
        <div className="library-current">
          <span>当前范字</span>
          <strong>{activeChar}</strong>
          <p>
            {activeEntry
              ? `${activeEntry.structure}结构 · 部首 ${activeEntry.radical || '—'} · 帖中出现 ${activeEntry.occurrences} 次`
              : '选择任意字开始逐字练习'}
          </p>
        </div>
        <button
          type="button"
          className="library-practice-button"
          onClick={() => onPractice(activeChar)}
        >
          临写「{activeChar}」
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  )
}
