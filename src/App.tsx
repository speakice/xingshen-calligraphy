import { useEffect, useState } from 'react'
import { AestheticView } from './components/AestheticView'
import { Header, type View } from './components/Header'
import { PracticeView } from './components/PracticeView'
import { TheoryView } from './components/TheoryView'
import { getSanmenStudy } from './characterGuide'
import { characterStudies, works } from './data'

function App() {
  const [view, setView] = useState<View>('practice')
  const [workId, setWorkId] = useState(works[0].id)
  const [activeChar, setActiveChar] = useState(works[0].char)
  const [selectedTechniqueIndex, setSelectedTechniqueIndex] = useState(0)

  const work = works.find((item) => item.id === workId) ?? works[0]
  const study =
    characterStudies[activeChar] ??
    getSanmenStudy(activeChar) ??
    characterStudies[works[0].char]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  const handleWorkChange = (id: string) => {
    const nextWork = works.find((item) => item.id === id)
    if (!nextWork) return
    setWorkId(id)
    setActiveChar(nextWork.char)
    setSelectedTechniqueIndex(0)
  }

  const handleCharChange = (char: string) => {
    setActiveChar(char)
    setSelectedTechniqueIndex(0)
  }

  return (
    <div className={`app-shell view-${view}`}>
      <div className="paper-grain" aria-hidden="true" />
      <Header view={view} onChangeView={setView} />

      <div key={view} className="view-transition">
        {view === 'practice' && (
          <PracticeView
            work={work}
            works={works}
            onWorkChange={handleWorkChange}
            activeChar={activeChar}
            study={study}
            onCharChange={handleCharChange}
            selectedTechniqueIndex={selectedTechniqueIndex}
            onSelectTechnique={setSelectedTechniqueIndex}
          />
        )}
        {view === 'theory' && <TheoryView />}
        {view === 'aesthetic' && <AestheticView />}
      </div>
    </div>
  )
}

export default App
