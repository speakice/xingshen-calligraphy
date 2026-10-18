import { BookOpen, Brush, Flower2 } from 'lucide-react'

export type View = 'theory' | 'practice' | 'aesthetic'

type HeaderProps = {
  view: View
  onChangeView: (view: View) => void
}

const navItems = [
  { id: 'practice' as const, label: '练习', icon: Brush },
  { id: 'theory' as const, label: '书法理论', icon: BookOpen },
  { id: 'aesthetic' as const, label: '审美', icon: Flower2 },
]

export function Header({ view, onChangeView }: HeaderProps) {
  return (
    <header className="site-header">
      <button
        className="brand"
        onClick={() => onChangeView('practice')}
        aria-label="回到练习首页"
      >
        <span className="brand-seal" aria-hidden="true">
          行
        </span>
        <span className="brand-copy">
          <strong>行深书法</strong>
          <small>XINGSHEN</small>
        </span>
      </button>

      <nav className="main-nav" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={view === item.id ? 'nav-item is-active' : 'nav-item'}
              onClick={() => onChangeView(item.id)}
              aria-label={item.label}
              aria-current={view === item.id ? 'page' : undefined}
            >
              <Icon size={15} strokeWidth={1.7} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="header-progress" aria-label="连续习字 18 天">
        <span className="progress-orbit">
          <span>18</span>
        </span>
        <span className="progress-copy">
          <small>连续习字</small>
          <strong>第 18 日</strong>
        </span>
      </div>
    </header>
  )
}
