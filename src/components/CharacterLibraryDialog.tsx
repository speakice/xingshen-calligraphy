import { useEffect } from 'react'
import { X } from 'lucide-react'
import { CharacterLibrary } from './CharacterLibrary'

type CharacterLibraryDialogProps = {
  open: boolean
  activeChar: string
  onClose: () => void
  onSelect: (char: string) => void
  onPractice: (char: string) => void
}

export function CharacterLibraryDialog({
  open,
  activeChar,
  onClose,
  onSelect,
  onPractice,
}: CharacterLibraryDialogProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <div
      className="character-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="character-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="三门记全字库"
      >
        <button
          type="button"
          className="character-dialog-close"
          onClick={onClose}
          aria-label="关闭全字库"
        >
          <X size={18} />
        </button>
        <CharacterLibrary
          activeChar={activeChar}
          onSelect={onSelect}
          onPractice={onPractice}
        />
      </div>
    </div>
  )
}
