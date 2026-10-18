import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Check,
  Eraser,
  Eye,
  EyeOff,
  Grid3X3,
  Hand,
  MousePointer2,
  RotateCcw,
  SlidersHorizontal,
  Undo2,
} from 'lucide-react'
import type { CharacterStudy } from '../data'

type PracticeMode = 'copy' | 'blind'
type InputMode = 'hover' | 'press'

type StrokePoint = {
  x: number
  y: number
  pressure: number
  time: number
}

type Stroke = {
  points: StrokePoint[]
  size: number
  opacity: number
}

type WritingPadProps = {
  study: CharacterStudy
  bottomContent?: React.ReactNode
  embedded?: boolean
}

type CanvasSize = {
  width: number
  height: number
}

const HOVER_START_DELAY = 220
const HOVER_LIFT_DELAY = 320

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

function renderStroke(
  context: CanvasRenderingContext2D,
  stroke: Stroke,
  width: number,
  height: number,
) {
  const points = stroke.points
  if (!points.length) return

  context.save()
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.strokeStyle = `rgba(24, 22, 18, ${stroke.opacity})`
  context.fillStyle = `rgba(24, 22, 18, ${stroke.opacity})`

  if (points.length === 1) {
    const point = points[0]
    const radius = (stroke.size * (0.56 + point.pressure * 0.75)) / 2
    context.beginPath()
    context.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2)
    context.fill()
    context.restore()
    return
  }

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]
    const point = points[index]
    const dx = (point.x - previous.x) * width
    const dy = (point.y - previous.y) * height
    const distance = Math.hypot(dx, dy)
    if (distance < 0.15) continue
    const elapsed = Math.max(1, point.time - previous.time)
    const speed = distance / elapsed
    const pressure = (point.pressure + previous.pressure) / 2
    const speedFactor = 1 - Math.min(0.3, speed * 0.1)
    const lineWidth = stroke.size * (0.58 + pressure * 0.78) * speedFactor

    context.beginPath()
    context.lineWidth = Math.max(0.8, lineWidth)
    context.moveTo(previous.x * width, previous.y * height)
    context.lineTo(point.x * width, point.y * height)
    context.stroke()
  }

  context.restore()
}

export function WritingPad({
  study,
  bottomContent,
  embedded = false,
}: WritingPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeStrokeRef = useRef<Stroke | null>(null)
  const drawingPointerRef = useRef<number | null>(null)
  const clearTimerRef = useRef<number | null>(null)
  const hoverPauseTimerRef = useRef<number | null>(null)
  const hoverDwellTimerRef = useRef<number | null>(null)
  const hoverStartPointRef = useRef<StrokePoint | null>(null)
  const [sessions, setSessions] = useState<Record<PracticeMode, Stroke[]>>({
    copy: [],
    blind: [],
  })
  const [mode, setMode] = useState<PracticeMode>('copy')
  const [brushSize, setBrushSize] = useState(8)
  const [inkTone, setInkTone] = useState<'rich' | 'light'>('rich')
  const [guideOpacity, setGuideOpacity] = useState(0.2)
  const [showGuide, setShowGuide] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [revealReference, setRevealReference] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 0, height: 0 })
  const [clearArmed, setClearArmed] = useState(false)
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<InputMode>('hover')
  const [brushArmed, setBrushArmed] = useState(false)
  const [brushMessage, setBrushMessage] = useState('点击砚台蘸墨')
  const [hoverCursor, setHoverCursor] = useState<{ x: number; y: number } | null>(
    null,
  )
  const storageKey = `yaoshu-writing-v1-${study.char}`
  const legacyStorageKey = `moxu-writing-v1-${study.char}`

  const strokes = sessions[mode]

  const setCurrentStrokes = (next: Stroke[] | ((current: Stroke[]) => Stroke[])) => {
    setSessions((currentSessions) => {
      const currentModeStrokes = currentSessions[mode]
      return {
        ...currentSessions,
        [mode]:
          typeof next === 'function' ? next(currentModeStrokes) : next,
      }
    })
  }

  const commitActiveStroke = useCallback(() => {
    const stroke = activeStrokeRef.current
    if (!stroke) return
    activeStrokeRef.current = null
    drawingPointerRef.current = null
    setIsDrawing(false)
    setSessions((currentSessions) => ({
      ...currentSessions,
      [mode]: [...currentSessions[mode], stroke],
    }))
  }, [mode])

  const stopBrush = useCallback(
    (message = '已搁笔 · 点砚台可重新蘸墨') => {
      setBrushArmed(false)
      setBrushMessage(message)
      setHoverCursor(null)
      hoverStartPointRef.current = null
      if (hoverDwellTimerRef.current) {
        window.clearTimeout(hoverDwellTimerRef.current)
        hoverDwellTimerRef.current = null
      }
      if (hoverPauseTimerRef.current) {
        window.clearTimeout(hoverPauseTimerRef.current)
        hoverPauseTimerRef.current = null
      }
      commitActiveStroke()
    },
    [commitActiveStroke],
  )

  const dipBrush = () => {
    if (hoverPauseTimerRef.current) {
      window.clearTimeout(hoverPauseTimerRef.current)
      hoverPauseTimerRef.current = null
    }
    commitActiveStroke()
    setInputMode('hover')
    setBrushArmed(true)
    hoverStartPointRef.current = null
    if (hoverDwellTimerRef.current) {
      window.clearTimeout(hoverDwellTimerRef.current)
      hoverDwellTimerRef.current = null
    }
    setBrushMessage('墨已蘸 · 停驻起笔')
  }

  useEffect(() => {
    if (!brushArmed) return
    const handlePageIntent = () =>
      stopBrush('已搁笔 · 可继续滚动页面或点砚重蘸')
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handlePageIntent()
    }
    window.addEventListener('wheel', handlePageIntent, { passive: true })
    window.addEventListener('scroll', handlePageIntent, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('wheel', handlePageIntent)
      window.removeEventListener('scroll', handlePageIntent)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [brushArmed, stopBrush])

  useEffect(() => {
    setRevealReference(false)
    setClearArmed(false)
    setBrushArmed(false)
    setBrushMessage('点击砚台蘸墨')
    setHoverCursor(null)
    activeStrokeRef.current = null
    hoverStartPointRef.current = null
    if (hoverDwellTimerRef.current) {
      window.clearTimeout(hoverDwellTimerRef.current)
      hoverDwellTimerRef.current = null
    }
    if (hoverPauseTimerRef.current) {
      window.clearTimeout(hoverPauseTimerRef.current)
      hoverPauseTimerRef.current = null
    }
    try {
      const saved =
        window.localStorage.getItem(storageKey) ??
        window.localStorage.getItem(legacyStorageKey)
      const parsed = saved ? JSON.parse(saved) : null
      setSessions({
        copy: Array.isArray(parsed?.copy) ? parsed.copy : [],
        blind: Array.isArray(parsed?.blind) ? parsed.blind : [],
      })
      setLoadedStorageKey(storageKey)
    } catch {
      setSessions({ copy: [], blind: [] })
      setLoadedStorageKey(storageKey)
    }
  }, [legacyStorageKey, storageKey])

  useEffect(() => {
    if (loadedStorageKey !== storageKey) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(sessions))
    } catch {
      // The writing pad still works when storage is unavailable.
    }
  }, [sessions, storageKey, loadedStorageKey])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      setCanvasSize({ width: rect.width, height: rect.height })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvasSize.width || !canvasSize.height) return
    const context = canvas.getContext('2d')
    if (!context) return
    const dpr = canvas.width / canvasSize.width
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, canvasSize.width, canvasSize.height)
    strokes.forEach((stroke) =>
      renderStroke(context, stroke, canvasSize.width, canvasSize.height),
    )
  }, [canvasSize, strokes])

  useEffect(
    () => () => {
      if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current)
      if (hoverPauseTimerRef.current) {
        window.clearTimeout(hoverPauseTimerRef.current)
      }
      if (hoverDwellTimerRef.current) {
        window.clearTimeout(hoverDwellTimerRef.current)
      }
    },
    [],
  )

  const pointFromEvent = (
    event: Pick<PointerEvent, 'clientX' | 'clientY' | 'pressure' | 'pointerType'>,
    rect: DOMRect,
  ): StrokePoint => ({
    x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
    y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
    pressure: event.pointerType === 'pen' && event.pressure > 0 ? event.pressure : 0.55,
    time: performance.now(),
  })

  const drawNewSegment = (stroke: Stroke) => {
    const canvas = canvasRef.current
    if (!canvas || stroke.points.length < 2) return
    const context = canvas.getContext('2d')
    if (!context || !canvasSize.width) return
    const dpr = canvas.width / canvasSize.width
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    const previous = stroke.points[stroke.points.length - 2]
    const point = stroke.points[stroke.points.length - 1]
    const dx = (point.x - previous.x) * canvasSize.width
    const dy = (point.y - previous.y) * canvasSize.height
    const distance = Math.hypot(dx, dy)
    if (distance < 0.1) return
    const elapsed = Math.max(1, point.time - previous.time)
    const speed = distance / elapsed
    const pressure = (point.pressure + previous.pressure) / 2
    const speedFactor = 1 - Math.min(0.3, speed * 0.1)

    context.save()
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = `rgba(24, 22, 18, ${stroke.opacity})`
    context.lineWidth = Math.max(
      0.8,
      stroke.size * (0.58 + pressure * 0.78) * speedFactor,
    )
    context.beginPath()
    context.moveTo(previous.x * canvasSize.width, previous.y * canvasSize.height)
    context.lineTo(point.x * canvasSize.width, point.y * canvasSize.height)
    context.stroke()
    context.restore()
  }

  const beginStroke = (point: StrokePoint, pointerId: number | null) => {
    // A stroke may dwell before the user actually starts moving. Do not start
    // the auto-lift countdown until movement occurs, otherwise the brush can be
    // lifted while the user is still preparing the first point of a new stroke.
    if (hoverPauseTimerRef.current) {
      window.clearTimeout(hoverPauseTimerRef.current)
      hoverPauseTimerRef.current = null
    }
    if (hoverDwellTimerRef.current) {
      window.clearTimeout(hoverDwellTimerRef.current)
      hoverDwellTimerRef.current = null
    }
    const stroke: Stroke = {
      points: [point],
      size: brushSize,
      opacity: inkTone === 'rich' ? 0.93 : 0.68,
    }
    activeStrokeRef.current = stroke
    drawingPointerRef.current = pointerId
    setIsDrawing(true)
    setClearArmed(false)

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (canvas && context && canvasSize.width) {
      const dpr = canvas.width / canvasSize.width
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const radius = (stroke.size * (0.56 + point.pressure * 0.75)) / 2
      context.fillStyle = `rgba(24, 22, 18, ${stroke.opacity})`
      context.beginPath()
      context.arc(
        point.x * canvasSize.width,
        point.y * canvasSize.height,
        radius,
        0,
        Math.PI * 2,
      )
      context.fill()
    }
    return stroke
  }

  const scheduleHoverLift = () => {
    if (hoverPauseTimerRef.current) {
      window.clearTimeout(hoverPauseTimerRef.current)
    }
    hoverPauseTimerRef.current = window.setTimeout(() => {
      if (activeStrokeRef.current) {
        commitActiveStroke()
        setBrushMessage('已收笔 · 停驻或单击起笔')
      }
      hoverPauseTimerRef.current = null
    }, HOVER_LIFT_DELAY)
  }

  const clearHoverDwell = () => {
    hoverStartPointRef.current = null
    if (hoverDwellTimerRef.current) {
      window.clearTimeout(hoverDwellTimerRef.current)
      hoverDwellTimerRef.current = null
    }
  }

  const scheduleHoverStart = (point: StrokePoint) => {
    hoverStartPointRef.current = point
    if (hoverDwellTimerRef.current) {
      window.clearTimeout(hoverDwellTimerRef.current)
    }
    hoverDwellTimerRef.current = window.setTimeout(() => {
      hoverDwellTimerRef.current = null
      const start = hoverStartPointRef.current
      if (!start || activeStrokeRef.current) return
      hoverStartPointRef.current = null
      beginStroke(start, null)
      setBrushMessage('已起笔 · 移动鼠标运笔')
    }, HOVER_START_DELAY)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (inputMode === 'hover' && event.pointerType === 'mouse') {
      event.preventDefault()
      clearHoverDwell()
      if (activeStrokeRef.current) {
        if (hoverPauseTimerRef.current) {
          window.clearTimeout(hoverPauseTimerRef.current)
          hoverPauseTimerRef.current = null
        }
        commitActiveStroke()
        setBrushMessage('已收笔 · 停驻或单击起笔')
      } else if (brushArmed) {
        const rect = event.currentTarget.getBoundingClientRect()
        beginStroke(pointFromEvent(event.nativeEvent, rect), null)
        setBrushMessage('已起笔 · 移动鼠标运笔')
      }
      return
    }
    event.preventDefault()
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    const point = pointFromEvent(event.nativeEvent, rect)
    beginStroke(point, event.pointerId)
    canvas.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (inputMode === 'hover' && event.pointerType === 'mouse') {
      setHoverCursor({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
      if (!brushArmed) return
      event.preventDefault()
      const nativeEvents =
        typeof event.nativeEvent.getCoalescedEvents === 'function'
          ? event.nativeEvent.getCoalescedEvents()
          : [event.nativeEvent]

      const stroke = activeStrokeRef.current
      if (!stroke) {
        const lastEvent = nativeEvents[nativeEvents.length - 1] ?? event.nativeEvent
        scheduleHoverStart(pointFromEvent(lastEvent, rect))
        return
      }

      nativeEvents.forEach((nativeEvent) => {
        const point = pointFromEvent(nativeEvent, rect)
        stroke.points.push(point)
        drawNewSegment(stroke)
      })
      scheduleHoverLift()
      return
    }

    const stroke = activeStrokeRef.current
    if (!stroke || drawingPointerRef.current !== event.pointerId) return
    event.preventDefault()
    const nativeEvents =
      typeof event.nativeEvent.getCoalescedEvents === 'function'
        ? event.nativeEvent.getCoalescedEvents()
        : [event.nativeEvent]

    nativeEvents.forEach((nativeEvent) => {
      stroke.points.push(pointFromEvent(nativeEvent, rect))
      drawNewSegment(stroke)
    })
  }

  const finishStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = activeStrokeRef.current
    if (!stroke || drawingPointerRef.current !== event.pointerId) return
    activeStrokeRef.current = null
    drawingPointerRef.current = null
    setIsDrawing(false)
    setCurrentStrokes((current) => [...current, stroke])
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const cancelStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (drawingPointerRef.current !== event.pointerId) return
    activeStrokeRef.current = null
    drawingPointerRef.current = null
    setIsDrawing(false)
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (canvas && context && canvasSize.width) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      const dpr = canvas.width / canvasSize.width
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      strokes.forEach((item) =>
        renderStroke(context, item, canvasSize.width, canvasSize.height),
      )
    }
  }

  const handlePointerLeave = () => {
    setHoverCursor(null)
    clearHoverDwell()
    if (inputMode === 'hover') {
      if (hoverPauseTimerRef.current) {
        window.clearTimeout(hoverPauseTimerRef.current)
        hoverPauseTimerRef.current = null
      }
      commitActiveStroke()
    }
  }

  const changePracticeMode = (nextMode: PracticeMode) => {
    if (nextMode === mode) return
    stopBrush('已搁笔 · 已切换书写模式')
    setMode(nextMode)
  }

  const undo = () => {
    setCurrentStrokes((current) => current.slice(0, -1))
    setClearArmed(false)
  }

  const clearPad = () => {
    if (!strokes.length) return
    if (!clearArmed) {
      setClearArmed(true)
      clearTimerRef.current = window.setTimeout(() => setClearArmed(false), 2600)
      return
    }
    setCurrentStrokes([])
    setClearArmed(false)
    if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current)
  }

  const referenceVisible = mode === 'copy' || revealReference
  const guideVisible = mode === 'copy' && showGuide
  const brushActive = isDrawing || (inputMode === 'hover' && brushArmed)

  return (
    <section
      className={`panel writing-panel${embedded ? ' is-embedded' : ''}`}
      aria-labelledby="writing-heading"
    >
      <div className="panel-heading writing-heading">
        <div>
          <span className="section-kicker">04 · 临池</span>
          <div className="heading-line">
            <h2 id="writing-heading">落笔</h2>
            <span className="heading-aside">蘸墨后停驻起笔，空中移动不落墨</span>
          </div>
        </div>
        <div className="mode-switch" role="tablist" aria-label="书写模式">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'copy'}
            className={mode === 'copy' ? 'is-active' : ''}
            onClick={() => changePracticeMode('copy')}
          >
            临写
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'blind'}
            className={mode === 'blind' ? 'is-active' : ''}
            onClick={() => changePracticeMode('blind')}
          >
            盲写
          </button>
        </div>
      </div>

      <div className="writing-layout">
        <div className={`pad-column${brushActive ? ' is-drawing' : ''}`}>
          <div className="pad-toolbar">
            <span className="pad-toolbar-label">
              {inputMode === 'hover' ? (
                <MousePointer2 size={14} />
              ) : (
                <Hand size={14} />
              )}
              {inputMode === 'hover'
                ? brushArmed
                  ? '停驻起笔 · 移动运笔 · 停顿收笔'
                  : '点砚蘸墨后，停驻起笔'
                : '按住鼠标或单指拖动书写'}
            </span>
            <span className="stroke-count">
              已落 {strokes.length} 笔
              {isDrawing && <i> · 运笔中</i>}
            </span>
          </div>

          <div
            className={`writing-paper${showGrid ? '' : ' no-grid'}${
              brushArmed && inputMode === 'hover' ? ' is-brush-armed' : ''
            }`}
          >
            <div className="paper-rule paper-rule-v" aria-hidden="true" />
            <div className="paper-rule paper-rule-h" aria-hidden="true" />
            <div className="paper-diagonal paper-diagonal-a" aria-hidden="true" />
            <div className="paper-diagonal paper-diagonal-b" aria-hidden="true" />
            <span className="paper-corner corner-tl" aria-hidden="true" />
            <span className="paper-corner corner-tr" aria-hidden="true" />
            <span className="paper-corner corner-bl" aria-hidden="true" />
            <span className="paper-corner corner-br" aria-hidden="true" />

            {guideVisible &&
              (study.referenceImage ? (
                <img
                  className="guide-character-image"
                  src={study.referenceImage}
                  alt=""
                  draggable={false}
                  style={{ opacity: guideOpacity }}
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="guide-character"
                  style={{ opacity: guideOpacity }}
                  aria-hidden="true"
                >
                  {study.char}
                </span>
              ))}

            <canvas
              ref={canvasRef}
              className="writing-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishStroke}
              onPointerCancel={cancelStroke}
              onPointerLeave={handlePointerLeave}
              onContextMenu={(event) => event.preventDefault()}
              aria-label={`${study.char}字书写画布`}
            />

            {hoverCursor && brushArmed && inputMode === 'hover' && (
              <span
                className={`hover-brush-cursor${isDrawing ? ' is-drawing' : ''}`}
                style={{ left: hoverCursor.x, top: hoverCursor.y }}
                aria-hidden="true"
              >
                <i />
              </span>
            )}

            <div className="pad-corner-note">
              <span>{mode === 'copy' ? '对临' : '盲写'}</span>
              <strong>{study.char}</strong>
            </div>

            {!strokes.length && !isDrawing && (
              <div className="pad-empty-hint" aria-hidden="true">
                <span
                  className={`touch-ring${brushArmed ? ' is-armed' : ''}`}
                />
                <p>
                  {inputMode === 'hover'
                    ? brushArmed
                      ? '停驻一下起笔，移动运笔'
                      : '先点砚台蘸墨'
                    : '按住鼠标，拖动书写'}
                </p>
                <small>
                  {inputMode === 'hover'
                    ? '也可单击起笔/提笔 · 停顿自动收笔'
                    : '松开即提笔 · 支持触控板与手写笔'}
                </small>
              </div>
            )}
          </div>

          <div className={`desk-tools${brushArmed ? ' is-armed' : ''}`}>
            <button
              type="button"
              className="inkstone-control"
              onClick={dipBrush}
              aria-pressed={brushArmed}
            >
              <span className="inkstone-visual" aria-hidden="true">
                <i className="inkstone-rim" />
                <i className="ink-pool" />
                <i className="ink-glint" />
              </span>
              <span className="desk-tool-copy">
                <strong>{brushArmed ? '墨已蘸' : '砚台'}</strong>
                <small>{brushArmed ? '点击再蘸' : '点击蘸墨'}</small>
              </span>
            </button>

            <div className="brush-desk-status" aria-live="polite">
              <span className={brushArmed ? 'desk-dot is-armed' : 'desk-dot'} />
              <div>
                <strong>
                  {brushArmed
                    ? isDrawing
                      ? '落笔中 · 停顿或单击提笔'
                      : '墨已蘸 · 停驻或单击起笔'
                    : brushMessage}
                </strong>
                <small>
                  {brushArmed
                    ? '空中移动不落墨 · 滚轮滚动、按 Esc 或点搁笔台即停'
                    : inputMode === 'hover'
                      ? '不会因为按住触控板而产生手部压力'
                      : '当前为按住书写模式'}
                </small>
              </div>
            </div>

            <button
              type="button"
              className="brush-rest-control"
              onClick={() => stopBrush()}
              disabled={!brushArmed}
            >
              <span className="brush-rest-visual" aria-hidden="true">
                <i className="rest-base" />
                <i className="rest-brush" />
              </span>
              <span className="desk-tool-copy">
                <strong>搁笔台</strong>
                <small>点击停笔</small>
              </span>
            </button>
          </div>

          <div className="pad-footer">
            <div className="pad-tip">
              <span className="status-dot" />
              <span>
                {inputMode === 'hover'
                  ? '蘸墨后在空中移动不会落墨；停驻片刻起笔，移动运笔，停顿或单击提笔。'
                  : '按住鼠标或触控板拖动书写，松开即提笔。'}
              </span>
            </div>
            <span className="auto-note">本次练习 · 自动保存在本机</span>
          </div>

          {bottomContent}
        </div>

        <aside className="writing-sidebar">
          <div
            className={`reference-card${
              mode === 'blind' && !revealReference ? ' is-sealed' : ''
            }`}
          >
            <div className="reference-topline">
              <span>范字</span>
              <small>{mode === 'copy' ? '对照观察' : '凭记忆书写'}</small>
            </div>
            <div className="reference-character">
              {referenceVisible ? (
                study.referenceImage ? (
                  <img
                    src={study.referenceImage}
                    alt={`《三门记》中的“${study.char}”字`}
                    draggable={false}
                  />
                ) : (
                  <span>{study.char}</span>
                )
              ) : (
                <div className="sealed-reference">
                  <EyeOff size={21} strokeWidth={1.4} />
                  <span>掩卷</span>
                </div>
              )}
            </div>
            <p>{referenceVisible ? study.focus : '写完后，再展开范字，对照结构与重心。'}</p>
            {mode === 'blind' && (
              <button
                type="button"
                className="reference-reveal"
                onClick={() => setRevealReference((value) => !value)}
              >
                {revealReference ? <EyeOff size={14} /> : <Eye size={14} />}
                {revealReference ? '收起原作' : '对照原作'}
              </button>
            )}
          </div>

          <div className="brush-settings">
            <div className="settings-heading">
              <SlidersHorizontal size={15} />
              <span>笔触</span>
            </div>

            <div className="input-mode-options" role="group" aria-label="书写方式">
              <button
                type="button"
                className={inputMode === 'hover' ? 'is-active' : ''}
                onClick={() => {
                  stopBrush('点击砚台蘸墨')
                  setInputMode('hover')
                }}
              >
                <MousePointer2 size={13} />
                蘸墨悬写
              </button>
              <button
                type="button"
                className={inputMode === 'press' ? 'is-active' : ''}
                onClick={() => {
                  stopBrush('按住书写模式')
                  setInputMode('press')
                }}
              >
                <Hand size={13} />
                按住书写
              </button>
            </div>

            <label className="range-control" htmlFor="brush-size">
              <span>
                笔锋粗细
                <em>{brushSize}px</em>
              </span>
              <input
                id="brush-size"
                type="range"
                min="2"
                max="20"
                step="1"
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
                style={{ '--range-value': `${((brushSize - 2) / 18) * 100}%` } as React.CSSProperties}
              />
            </label>

            <div className="ink-options" role="group" aria-label="墨色">
              <button
                type="button"
                className={inkTone === 'rich' ? 'is-active' : ''}
                onClick={() => setInkTone('rich')}
              >
                <span className="ink-swatch ink-rich" />
                浓墨
              </button>
              <button
                type="button"
                className={inkTone === 'light' ? 'is-active' : ''}
                onClick={() => setInkTone('light')}
              >
                <span className="ink-swatch ink-light" />
                淡墨
              </button>
            </div>

            <div className="toggle-list">
              <button
                type="button"
                className={showGrid ? 'toggle-row is-on' : 'toggle-row'}
                onClick={() => setShowGrid((value) => !value)}
              >
                <span>
                  <Grid3X3 size={15} />
                  米字格
                </span>
                <i>{showGrid ? <Check size={12} /> : null}</i>
              </button>
              {mode === 'copy' && (
                <button
                  type="button"
                  className={showGuide ? 'toggle-row is-on' : 'toggle-row'}
                  onClick={() => setShowGuide((value) => !value)}
                >
                  <span>
                    <Eye size={15} />
                    透字辅助
                  </span>
                  <i>{showGuide ? <Check size={12} /> : null}</i>
                </button>
              )}
            </div>

            {mode === 'copy' && showGuide && (
              <label className="range-control guide-range" htmlFor="guide-opacity">
                <span>
                  辅助清晰度
                  <em>{Math.round(guideOpacity * 100)}%</em>
                </span>
                <input
                  id="guide-opacity"
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={guideOpacity * 100}
                  onChange={(event) => setGuideOpacity(Number(event.target.value) / 100)}
                  style={
                    {
                      '--range-value': `${((guideOpacity * 100 - 5) / 55) * 100}%`,
                    } as React.CSSProperties
                  }
                />
              </label>
            )}
          </div>

          <div className="pad-actions">
            <button type="button" onClick={undo} disabled={!strokes.length}>
              <Undo2 size={15} />
              撤回
            </button>
            <button
              type="button"
              onClick={clearPad}
              disabled={!strokes.length}
              className={clearArmed ? 'is-armed' : ''}
            >
              {clearArmed ? <Eraser size={15} /> : <RotateCcw size={15} />}
              {clearArmed ? '确定清空' : '清空'}
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
