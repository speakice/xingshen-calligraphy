import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, BookMarked, Clock3, X } from 'lucide-react'
import { theoryArticles, type TheoryArticle } from '../data'

const categories = ['全部', '笔法', '结体', '章法', '书史'] as const

export function TheoryView() {
  const [category, setCategory] = useState<(typeof categories)[number]>('全部')
  const [activeArticle, setActiveArticle] = useState<TheoryArticle | null>(null)

  const filteredArticles = useMemo(
    () =>
      category === '全部'
        ? theoryArticles
        : theoryArticles.filter((article) => article.category === category),
    [category],
  )

  useEffect(() => {
    if (!activeArticle) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveArticle(null)
    }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeArticle])

  return (
    <main className="page theory-page">
      <section className="theory-hero">
        <div className="theory-hero-mark" aria-hidden="true">
          法
        </div>
        <div className="theory-hero-copy">
          <span className="eyebrow">FOUNDATIONS · 书法理论</span>
          <h1>
            写字之前，<em>先学会看。</em>
          </h1>
          <p>
            理论不是悬在纸上的概念。它帮你看见锋毫如何受力、空白如何托住笔画，
            也帮你在下一次落笔时，知道该注意什么。
          </p>
        </div>
        <div className="theory-quote">
          <span>一</span>
          <blockquote>“凡书贵乎沉静，令意在笔前，字居心后。”</blockquote>
          <small>—— 王羲之《书论》</small>
        </div>
      </section>

      <section className="theory-library">
        <div className="library-heading">
          <div>
            <span className="section-kicker">理论库</span>
            <h2>从一根线条开始</h2>
          </div>
          <div className="filter-tabs" role="tablist" aria-label="文章分类">
            {categories.map((item) => (
              <button
                type="button"
                role="tab"
                aria-selected={category === item}
                key={item}
                className={category === item ? 'is-active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="theory-layout">
          <div className="article-grid">
            {filteredArticles.map((article, index) => (
              <button
                type="button"
                className={`article-card article-card-${index % 4}`}
                key={article.id}
                onClick={() => setActiveArticle(article)}
              >
                <span className="article-index">
                  {String(theoryArticles.indexOf(article) + 1).padStart(2, '0')}
                </span>
                <span className="article-category">{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.subtitle}</p>
                <span className="article-bottom">
                  <span>
                    <Clock3 size={13} />
                    {article.readTime}
                  </span>
                  <ArrowUpRight size={17} />
                </span>
                <span className="article-brush-line" aria-hidden="true" />
              </button>
            ))}
          </div>

          <aside className="reading-guide">
            <div className="reading-guide-top">
              <BookMarked size={18} />
              <span>读帖三问</span>
            </div>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <strong>它在往哪里走？</strong>
                  <p>先看整行与单字的笔势方向，不要急着临摹细节。</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>哪里最紧，哪里最松？</strong>
                  <p>找出空间的疏密关系，字的呼吸就出现了。</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>哪一笔最有力量？</strong>
                  <p>每帖找一根主线，练习时先把它写稳。</p>
                </div>
              </li>
            </ol>
            <div className="guide-footer">
              <span>今日建议</span>
              <p>用三分钟读完一篇，再回到法帖中寻找对应细节。</p>
            </div>
          </aside>
        </div>
      </section>

      {activeArticle && (
        <div
          className="article-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveArticle(null)
          }}
        >
          <article
            className="article-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
          >
            <div className="article-modal-head">
              <button
                type="button"
                className="modal-back"
                onClick={() => setActiveArticle(null)}
              >
                <ArrowLeft size={16} />
                返回理论库
              </button>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveArticle(null)}
                aria-label="关闭文章"
              >
                <X size={18} />
              </button>
            </div>
            <span className="article-modal-category">{activeArticle.category}</span>
            <h2 id="article-modal-title">{activeArticle.title}</h2>
            <p className="article-modal-subtitle">{activeArticle.subtitle}</p>
            <div className="article-modal-meta">
              <span>行深书法编辑部</span>
              <span>{activeArticle.readTime}阅读</span>
            </div>
            <div className="article-modal-rule" />
            <p className="article-modal-intro">{activeArticle.intro}</p>
            {activeArticle.sections.map((section) => (
              <section key={section.heading}>
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
              </section>
            ))}
            <blockquote>{activeArticle.quote}</blockquote>
          </article>
        </div>
      )}
    </main>
  )
}
