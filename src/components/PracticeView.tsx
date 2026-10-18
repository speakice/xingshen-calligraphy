import { useState } from 'react'
import { Eye, PenLine, Scan } from 'lucide-react'
import type { CharacterStudy, Work } from '../data'
import { CharacterLibraryDialog } from './CharacterLibraryDialog'
import { CharacterStrip } from './CharacterStrip'
import { CopybookViewer } from './CopybookViewer'
import { TechniquePanel } from './TechniquePanel'
import { WritingPad } from './WritingPad'

type WorkspaceMode = 'browse' | 'technique' | 'practice'

const workspaceModes = [
  { id: 'browse' as const, label: '观摩', icon: Eye },
  { id: 'technique' as const, label: '技法', icon: Scan },
  { id: 'practice' as const, label: '练习', icon: PenLine },
]

type PracticeViewProps = {
  work: Work
  works: Work[]
  onWorkChange: (id: string) => void
  activeChar: string
  study: CharacterStudy
  onCharChange: (char: string) => void
  selectedTechniqueIndex: number
  onSelectTechnique: (index: number) => void
}

export function PracticeView({
  work,
  works,
  onWorkChange,
  activeChar,
  study,
  onCharChange,
  selectedTechniqueIndex,
  onSelectTechnique,
}: PracticeViewProps) {
  const [mode, setMode] = useState<WorkspaceMode>('browse')
  const [libraryOpen, setLibraryOpen] = useState(false)

  const selectWork = (id: string) => {
    onWorkChange(id)
    setMode('browse')
  }

  const openPractice = (char = activeChar) => {
    onCharChange(char)
    setLibraryOpen(false)
    setMode('practice')
  }

  const selectCharacter = (char: string) => {
    onCharChange(char)
  }

  const selectFromLibrary = (char: string) => {
    onCharChange(char)
    setLibraryOpen(false)
  }

  return (
    <main className="practice-workbench">
      <header className="workbench-topbar">
        <div className="workbench-copybooks" role="tablist" aria-label="选择法帖">
          {works.map((item) => (
            <button
              type="button"
              role="tab"
              aria-selected={item.id === work.id}
              key={item.id}
              className={
                item.id === work.id
                  ? 'workbench-copybook is-active'
                  : 'workbench-copybook'
              }
              onClick={() => selectWork(item.id)}
            >
              <span className="workbench-copybook-char">{item.char}</span>
              <span className="workbench-copybook-copy">
                <strong>{item.title}</strong>
                <small>
                  {item.dynasty} · {item.style}
                </small>
              </span>
            </button>
          ))}
        </div>
        <div className="workbench-modes" role="tablist" aria-label="习字流程">
          {workspaceModes.map((item) => {
            const Icon = item.icon
            return (
              <button
                type="button"
                role="tab"
                key={item.id}
                aria-selected={mode === item.id}
                className={mode === item.id ? 'is-active' : ''}
                onClick={() =>
                  item.id === 'practice' ? openPractice() : setMode(item.id)
                }
              >
                <Icon size={13} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      <div className={`workbench-stage mode-${mode}`}>
        {mode === 'browse' && (
          <div className="workbench-browse">
            <CopybookViewer
              work={work}
              works={works}
              onWorkChange={selectWork}
              compact
              onOpenTechnique={() => setMode('technique')}
              onOpenPractice={() => openPractice()}
            />
          </div>
        )}

        {mode === 'technique' && (
          <div className="workbench-technique">
            <TechniquePanel
              study={study}
              selectedTechniqueIndex={selectedTechniqueIndex}
              onSelectTechnique={onSelectTechnique}
              onPractice={() => openPractice()}
            />
            <CharacterStrip
              activeChar={activeChar}
              onSelect={selectCharacter}
              onOpenLibrary={() => setLibraryOpen(true)}
              compact
            />
          </div>
        )}

        {mode === 'practice' && (
          <WritingPad
            study={study}
            embedded
            bottomContent={
              <CharacterStrip
                activeChar={activeChar}
                onSelect={selectCharacter}
                onOpenLibrary={() => setLibraryOpen(true)}
                compact
              />
            }
          />
        )}
      </div>

      <CharacterLibraryDialog
        open={libraryOpen}
        activeChar={activeChar}
        onClose={() => setLibraryOpen(false)}
        onSelect={selectFromLibrary}
        onPractice={openPractice}
      />
    </main>
  )
}
