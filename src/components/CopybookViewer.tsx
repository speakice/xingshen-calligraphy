import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  ExternalLink,
  Minus,
  PenLine,
  Plus,
  Scan,
} from 'lucide-react'
import type { Work } from '../data'

type CopybookViewerProps = {
  work: Work
  works: Work[]
  onWorkChange: (id: string) => void
  compact?: boolean
  onOpenTechnique?: () => void
  onOpenPractice?: () => void
}

const MIN_ZOOM = 0.85
const MAX_ZOOM = 2.4
const PAGES_PER_VIEW = 4

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function CopybookViewer({
  work,
  works,
  onWorkChange,
  compact = false,
  onOpenTechnique,
  onOpenPractice,
}: CopybookViewerProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    panX: number
    panY: number
  } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const pages = work.images ?? []
  const pageGroups = Array.from(
    { length: Math.ceil(pages.length / PAGES_PER_VIEW) },
    (_, index) =>
      pages.slice(index * PAGES_PER_VIEW, (index + 1) * PAGES_PER_VIEW),
  )
  const currentPages = pageGroups[pageIndex] ?? []
  const pageCount = pageGroups.length

  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setPageIndex(0)
  }, [work.id])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      setZoom((current) =>
        clamp(current * Math.exp(-event.deltaY * 0.006), MIN_ZOOM, MAX_ZOOM),
      )
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', handleWheel)
  }, [])

  const changeZoom = (nextZoom: number) => {
    const bounded = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM)
    setZoom(bounded)
    if (bounded <= 1) setPan({ x: 0, y: 0 })
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const constrainPan = (x: number, y: number, nextZoom = zoom) => {
    const viewport = viewportRef.current
    if (!viewport || nextZoom <= 1) return { x: 0, y: 0 }
    const maxX = (viewport.clientWidth * (nextZoom - 1)) / 2
    const maxY = (viewport.clientHeight * (nextZoom - 1)) / 2
    return {
      x: clamp(x, -maxX, maxX),
      y: clamp(y, -maxY, maxY),
    }
  }

  useEffect(() => {
    const nextPan = constrainPan(pan.x, pan.y)
    if (nextPan.x !== pan.x || nextPan.y !== pan.y) setPan(nextPan)
    // Pan is intentionally re-bounded only when the zoom level changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setPan(
      constrainPan(
        drag.panX + event.clientX - drag.startX,
        drag.panY + event.clientY - drag.startY,
      ),
    )
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
      setIsDragging(false)
    }
  }

  const currentIndex = works.findIndex((item) => item.id === work.id)
  const goToOffset = (offset: number) => {
    const nextIndex = (currentIndex + offset + works.length) % works.length
    onWorkChange(works[nextIndex].id)
  }

  const changePage = (offset: number) => {
    if (!pageCount) return
    setPageIndex((current) => clamp(current + offset, 0, pageCount - 1))
    resetView()
  }

  const navigateByArrow = (offset: number) => {
    if (pageCount) {
      changePage(offset)
      return
    }
    goToOffset(offset)
  }

  const previousDisabled = pageCount ? pageIndex === 0 : false
  const nextDisabled = pageCount ? pageIndex === pageCount - 1 : false

  return (
    <section
      className={`panel copybook-panel${compact ? ' is-compact' : ''}`}
      aria-labelledby="copybook-heading"
    >
      <div className="panel-heading">
        <div>
          <span className="section-kicker">01 · 读帖</span>
          <div className="heading-line">
            <h2 id="copybook-heading">法帖观摩</h2>
            <span className="heading-aside">{work.fullTitle}</span>
          </div>
        </div>
        <div className="copybook-heading-actions">
          {onOpenTechnique && (
            <button
              type="button"
              className="copybook-action-button"
              onClick={onOpenTechnique}
            >
              <Scan size={14} />
              技法
            </button>
          )}
          {onOpenPractice && (
            <button
              type="button"
              className="copybook-action-button is-primary"
              onClick={onOpenPractice}
            >
              <PenLine size={14} />
              练习
            </button>
          )}
          <div className="zoom-controls" aria-label="书帖缩放控制">
            <button
              type="button"
              onClick={() => changeZoom(zoom - 0.15)}
              aria-label="缩小"
              disabled={zoom <= MIN_ZOOM}
            >
              <Minus size={15} />
            </button>
            <span className="zoom-value">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => changeZoom(zoom + 0.15)}
              aria-label="放大"
              disabled={zoom >= MAX_ZOOM}
            >
              <Plus size={15} />
            </button>
            <button type="button" onClick={resetView} aria-label="还原视图">
              <Scan size={15} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`art-viewport${zoom > 1 ? ' can-pan' : ''}${
          isDragging ? ' is-dragging' : ''
        }`}
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => zoom > 1 && resetView()}
      >
        <div className="art-ambient" aria-hidden="true">
          <span>{work.mood}</span>
          <span>觀</span>
        </div>

        <div
          className="art-zoom-layer"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          }}
        >
          {pageCount ? (
            <div
              className={`scan-art${
                currentPages.length > 1 ? ' is-spread' : ''
              }`}
              style={
                currentPages.length > 1
                  ? ({
                      '--spread-ratio': currentPages.length * 0.54,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {currentPages.map((page, index) => (
                <img
                  key={`${work.id}-${page}`}
                  src={page}
                  alt={`${work.fullTitle}，第 ${
                    pageIndex * PAGES_PER_VIEW + index + 1
                  } 页`}
                  draggable={false}
                />
              ))}
            </div>
          ) : (
            <div className={`art-paper art-${work.id}`}>
              <div className="scroll-rod scroll-rod-top" aria-hidden="true">
                <span />
              </div>
              <div className="art-sheet">
                <div className="art-header">
                  <span className="art-dynasty">{work.dynasty}</span>
                  <span className="art-title">{work.title}</span>
                  <span className="art-author">{work.author} 书</span>
                </div>
                <div className="art-columns" aria-label={`${work.title}文字局部`}>
                  {work.lines.map((line, index) => (
                    <span
                      key={`${work.id}-${index}`}
                      style={{ '--line-index': index } as React.CSSProperties}
                    >
                      {line}
                    </span>
                  ))}
                </div>
                <div className="art-seals" aria-hidden="true">
                  <span className="seal-main">{work.seal}</span>
                  <span className="seal-small">行深</span>
                </div>
                <span className="art-watermark" aria-hidden="true">
                  {work.mood}
                </span>
              </div>
              <div className="scroll-rod scroll-rod-bottom" aria-hidden="true">
                <span />
              </div>
            </div>
          )}
        </div>

        {pageCount > 1 && (
          <div className="page-indicator" aria-live="polite">
            第 {pageIndex + 1} / {pageCount} 页
          </div>
        )}

        <div className="viewer-hint">
          <Expand size={13} />
          <span>
            {zoom > 1
              ? '拖动画面平移 · 双击还原'
              : pageCount
                ? '⌘ / Ctrl + 滚轮缩放 · 用左右箭头翻页'
                : '⌘ / Ctrl + 滚轮缩放'}
          </span>
        </div>

        <button
          type="button"
          className="viewer-arrow viewer-arrow-left"
          onClick={() => navigateByArrow(-1)}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={pageCount ? '上一页法帖' : '上一幅法帖'}
          disabled={previousDisabled}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="viewer-arrow viewer-arrow-right"
          onClick={() => navigateByArrow(1)}
          onPointerDown={(event) => event.stopPropagation()}
          aria-label={pageCount ? '下一页法帖' : '下一幅法帖'}
          disabled={nextDisabled}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="copybook-caption">
        <p>{work.summary}</p>
        <div className="copybook-note">
          <span>{work.note}</span>
          {work.sourceUrl && (
            <a href={work.sourceUrl} target="_blank" rel="noreferrer">
              图像来源 · {work.sourceName}
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {!compact && (
        <div className="copybook-strip" aria-label="法帖选择">
          {works.map((item) => (
            <button
              type="button"
              key={item.id}
              className={item.id === work.id ? 'copybook-chip is-active' : 'copybook-chip'}
              onClick={() => onWorkChange(item.id)}
            >
              <span className="chip-char">{item.char}</span>
              <span className="chip-copy">
                <strong>{item.title}</strong>
                <small>
                  {item.dynasty} · {item.style}
                </small>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
