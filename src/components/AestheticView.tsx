import { useState } from 'react'
import { ArrowUpRight, Eye, Feather, Layers3, Wind } from 'lucide-react'
import { aestheticThemes } from '../data'

const observations = [
  {
    index: '01',
    title: '先看整体',
    text: '退远一点，感受作品给你的第一印象：安静、飞扬、厚重，还是清冷？',
    icon: Eye,
  },
  {
    index: '02',
    title: '再看关系',
    text: '把视线放在笔画之间。大小、疏密、正欹，关系决定作品的节奏。',
    icon: Layers3,
  },
  {
    index: '03',
    title: '最后看气息',
    text: '沿着笔势读完整幅。真正动人的作品，气息会从第一字贯穿到落款。',
    icon: Wind,
  },
]

export function AestheticView() {
  const [activeThemeId, setActiveThemeId] = useState('rhythm')
  const activeTheme =
    aestheticThemes.find((theme) => theme.id === activeThemeId) ?? aestheticThemes[0]

  return (
    <main className="page aesthetic-page">
      <section className="aesthetic-hero">
        <span className="eyebrow">AESTHETICS · 审美</span>
        <h1>
          美不是玄学，<em>是看见变化。</em>
        </h1>
        <p>
          同一条线，有的像春水，有的像屋漏痕。审美的训练，是让眼睛从“像不像”，
          慢慢走向“为什么动人”。
        </p>
        <div className="aesthetic-hero-line" aria-hidden="true" />
        <span className="hero-vertical-note" aria-hidden="true">
          观
        </span>
      </section>

      <section className="aesthetic-stage" aria-labelledby="aesthetic-theme-heading">
        <div className="theme-list" role="tablist" aria-label="审美主题">
          {aestheticThemes.map((theme, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={theme.id === activeTheme.id}
              key={theme.id}
              className={theme.id === activeTheme.id ? 'theme-tab is-active' : 'theme-tab'}
              onClick={() => setActiveThemeId(theme.id)}
            >
              <span className="theme-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="theme-name">
                <strong>{theme.name}</strong>
                <small>{theme.english}</small>
              </span>
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>

        <div className="theme-artwork" style={{ '--theme-color': activeTheme.color } as React.CSSProperties}>
          <div className="artwork-lines" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="theme-character" aria-hidden="true">
            {activeTheme.example}
          </span>
          <span className="theme-watermark">{activeTheme.english}</span>
          <div className="theme-artwork-caption">
            <span>{activeTheme.author}</span>
            <small>以一字观其气</small>
          </div>
        </div>

        <div className="theme-detail">
          <div className="theme-detail-heading">
            <span className="section-kicker">审美关键词</span>
            <h2 id="aesthetic-theme-heading">{activeTheme.name}</h2>
            <span>{activeTheme.english}</span>
          </div>
          <p className="theme-summary">{activeTheme.summary}</p>
          <p className="theme-detail-copy">{activeTheme.detail}</p>
          <div className="keyword-list">
            {activeTheme.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
          <div className="theme-practice-note">
            <Feather size={16} />
            <p>今天的观察练习：在上面的法帖中，找到一处能印证“{activeTheme.name}”的细节。</p>
          </div>
        </div>
      </section>

      <section className="observation-section">
        <div className="observation-heading">
          <span className="section-kicker">观字三步</span>
          <h2>把“好看”说清楚</h2>
          <p>审美判断不是凭感觉下结论，而是有顺序地观察，再回到具体的关系里。</p>
        </div>
        <div className="observation-grid">
          {observations.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.index} className="observation-card">
                <span className="observation-index">{item.index}</span>
                <Icon size={20} strokeWidth={1.4} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
