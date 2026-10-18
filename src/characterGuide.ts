import type { CharacterStudy, Technique } from './data'
import {
  sanmenCharacters,
  type SanmenCharacterEntry,
} from './sanmenCharacters'

type StrokeGuide = {
  essence: string
  detail: string
  cue: string
}

const strokeGuides: Record<string, StrokeGuide> = {
  横: {
    essence: '逆入平出，中段略提。',
    detail: '横画起笔不要平铺直下，行笔中段略提，收笔再按。注意长短与右上斜势，避免写得像一根直线。',
    cue: '横要稳，不能飘。',
  },
  竖: {
    essence: '中锋下行，力藏画中。',
    detail: '竖画要挺而不僵，锋尖保持在点画中线。收笔略回，不要突然抽离纸面。',
    cue: '像拉弓，不像木棍。',
  },
  撇: {
    essence: '起笔沉，腹部满，尾部扬。',
    detail: '撇画先按后提，中段保持厚度，尾端自然出锋。最忌起笔轻、后段突然甩细。',
    cue: '送到底，不甩尾。',
  },
  捺: {
    essence: '一波三折，铺毫舒展。',
    detail: '捺画先轻后重，行笔要有起伏。到捺脚处驻笔蓄势，再缓缓收锋，尾部不可飘。',
    cue: '捺脚要托住整字。',
  },
  点: {
    essence: '有方向，也有回势。',
    detail: '点不是一团墨。落笔要有明确方向，略按后向下一笔的起处收拢，让点与整体产生呼应。',
    cue: '如高峰坠石。',
  },
  提: {
    essence: '重起轻收，向上提起。',
    detail: '提画起笔略按，行笔逐渐提锋，尾端干脆离开纸面。方向要明确，不要写成短横。',
    cue: '提起笔锋，方向要清。',
  },
  横折: {
    essence: '横轻折重，提笔换锋。',
    detail: '横段保持轻灵，到折点先提笔，再按下转向。折角不可写成软圆角，也不能死板。',
    cue: '折处先提后按。',
  },
  横折钩: {
    essence: '折处换锋，钩前蓄力。',
    detail: '横画略提，折后下行。钩前先驻笔，把力量收住，再短促挑出。',
    cue: '驻得稳，钩得短。',
  },
  竖钩: {
    essence: '竖势到底，钩出有力。',
    detail: '竖画中锋下行，至钩处略向左驻，再向右上提锋。不要把钩写成一条拖尾。',
    cue: '钩是蓄势，不是甩笔。',
  },
  竖弯钩: {
    essence: '弯处圆转，钩处沉着。',
    detail: '竖段先稳住，弯处略提，横向展开后驻笔挑钩。弯的弧度要自然，不能突然折转。',
    cue: '圆中要有骨。',
  },
  横撇: {
    essence: '横短撇长，转处有势。',
    detail: '横段不宜过重，折处提锋后向左下撇出。尾端要有送出感，不能停在半途。',
    cue: '转折要干净。',
  },
  横钩: {
    essence: '横势铺开，钩处回锋。',
    detail: '横画行至末端略按，随后提笔向左下钩出。钩要短而有方向。',
    cue: '横不飘，钩不拖。',
  },
  撇折: {
    essence: '撇后转锋，折处轻提。',
    detail: '撇段顺势下行，至折点提笔改变方向。转折处不宜重压，避免形成墨团。',
    cue: '转锋要轻，落笔要稳。',
  },
  撇点: {
    essence: '撇短点重，方向明确。',
    detail: '撇段简短有力，点处略按收住。两个动作要有连贯的势，不能断开成两团。',
    cue: '短促而有回势。',
  },
  竖提: {
    essence: '竖势下沉，提锋右上。',
    detail: '竖段保持中锋，至转处略驻，再向右上提笔。提的方向要明确。',
    cue: '先沉后提。',
  },
  斜钩: {
    essence: '弧势舒展，收钩含蓄。',
    detail: '斜钩要有弧度，行笔中段不可空怯。钩处略驻后向上挑出，保持力量贯通。',
    cue: '弯而不软。',
  },
  卧钩: {
    essence: '横势承托，钩处回收。',
    detail: '卧钩像一弯托住上方结构。行笔要稳，钩处略顿后向上挑出。',
    cue: '托得住，收得回。',
  },
  竖折: {
    essence: '竖下折横，转折含蓄。',
    detail: '竖段先稳，折处提笔换向。横段不要过长，保持内部空间完整。',
    cue: '折处暗过，不要生硬。',
  },
}

const structureGuides: Record<
  string,
  { essence: string; detail: string; cue: string }
> = {
  左右: {
    essence: '左右相让，主次分明。',
    detail: '先比较左右两部分的高低、宽窄和重心。通常左部收紧、右部舒展；笔画少的一侧要让出空间，笔画多的一侧不可挤成一团。',
    cue: '左让右，右顾左。',
  },
  上下: {
    essence: '上下连贯，重心对齐。',
    detail: '先定上下两部的比例与中轴。上部通常收紧，下部承托；上下相接处不要断气，也不要叠压过重。',
    cue: '上紧下松，中轴贯通。',
  },
  独体: {
    essence: '先定外轮廓与中轴。',
    detail: '独体字没有偏旁可依，先看外轮廓是长、方还是梯形，再定主笔方向。重心要落在稳定的位置，主笔不能同时抢势。',
    cue: '一字一主笔。',
  },
  半包围: {
    essence: '外框包而不闷，内部透气。',
    detail: '先写包围结构的外势，再安排内部。外框要有方向，内部不要顶死边框，留出不均匀的呼吸空间。',
    cue: '包得住，也要透得气。',
  },
  全包围: {
    essence: '外框端正，内部居中。',
    detail: '外框不可写成正方形，左右竖要有轻重变化。内部结构与外框之间要留白，不能塞满。',
    cue: '框有骨，内有空。',
  },
  左中右: {
    essence: '三部分收紧，主次分明。',
    detail: '三个部分不能平均用力。先确定中间部分的位置，再让左右两部分避让穿插，整体仍要合成一个重心。',
    cue: '三部分，一条心。',
  },
  上中下: {
    essence: '三层压缩，纵向贯通。',
    detail: '上中下结构容易写长。三层都要适当压扁，靠中轴把气息串起来，主笔只放在最需要舒展的一层。',
    cue: '层多不散，字长不僵。',
  },
  品字: {
    essence: '三部分呼应，重心聚拢。',
    detail: '三个相同或相近的部分要有大小和方向变化，下部承托上部，不能写成三个孤立的方块。',
    cue: '同形求变，聚而不挤。',
  },
}

const mainStrokePriority = [
  '竖弯钩',
  '横折钩',
  '斜钩',
  '卧钩',
  '竖钩',
  '捺',
  '竖',
  '横',
  '撇',
  '点',
]

function guideForStroke(stroke: string) {
  if (strokeGuides[stroke]) return strokeGuides[stroke]
  if (stroke.includes('钩')) {
    return {
      essence: '折处换锋，钩前驻笔。',
      detail: '带有钩的笔画要先稳后挑。行笔到钩处略作停顿，再短促出锋，避免顺手滑出。',
      cue: '先蓄后发。',
    }
  }
  if (stroke.includes('折')) {
    return {
      essence: '转折处提笔换锋。',
      detail: '折画的关键不在外形，而在锋尖换向。折前略提，折后按笔，转折才既有骨又能连续。',
      cue: '折要暗过。',
    }
  }
  return {
    essence: '起收清楚，笔势不断。',
    detail: '落笔前先看清方向，行笔保持中锋，收笔交代清楚。先求动作完整，再求线条粗细。',
    cue: '一笔有一笔的去处。',
  }
}

function structureGuideFor(structure: string) {
  return (
    structureGuides[structure] ?? {
      essence: '先定重心，再安排疏密。',
      detail: '先看字的大轮廓与中轴，再比较笔画之间的疏密。不要平均分配空间，找出最紧和最松的两处。',
      cue: '计白当黑。',
    }
  )
}

function roleForStroke(
  index: number,
  total: number,
  stroke: string,
  mainIndex: number,
  foldIndex: number,
) {
  if (index === mainIndex) return '主笔'
  if (index === 0) return '首笔'
  if (index === total - 1) return '收笔'
  if (index === foldIndex) return '折笔'
  return `第 ${index + 1} 笔`
}

function roleDetail(
  role: string,
  stroke: string,
  index: number,
  total: number,
) {
  if (role === '首笔') {
    return `这是第 1 笔“${stroke}”，负责确定整字的入笔方向和外轮廓。`
  }
  if (role === '主笔') {
    return `这是第 ${index + 1} 笔“${stroke}”，在本字中最适合承担舒展和支撑作用，不要与其他笔画同时抢势。`
  }
  if (role === '折笔') {
    return `这是第 ${index + 1} 笔“${stroke}”，负责连接上下或左右笔势，转折处尤其要看清提按。`
  }
  if (role === '收笔') {
    return `这是第 ${total} 笔“${stroke}”，要收住全字气息。收笔动作可以含蓄，但不能没有去处。`
  }
  return `这是第 ${index + 1} 笔“${stroke}”，承接前一笔的笔势，并为后面的笔画留出空间。`
}

function makeGeneratedStudy(entry: SanmenCharacterEntry): CharacterStudy {
  const structure = entry.structure || '独体'
  const structureGuide = structureGuideFor(structure)
  const strokes = entry.strokes
  const strokeRank = (stroke: string) => {
    const rank = mainStrokePriority.indexOf(stroke)
    return rank >= 0 ? rank : mainStrokePriority.length
  }
  const mainIndex = strokes.reduce(
    (best, stroke, index) =>
      strokeRank(stroke) < strokeRank(strokes[best]) ? index : best,
    0,
  )
  const foldIndex = strokes.findIndex(
    (stroke) => stroke.includes('折') || stroke.includes('钩'),
  )
  const techniques: Technique[] = []

  if (strokes.length) {
    const first = strokes[0]
    const firstGuide = guideForStroke(first)
    techniques.push({
      name: first,
      alias: '首笔',
      x: 50,
      y: 50,
      essence: firstGuide.essence,
      detail: `${roleDetail('首笔', first, 0, strokes.length)}${firstGuide.detail}`,
      cue: firstGuide.cue,
      path: '',
    })

    if (mainIndex !== 0) {
      const main = strokes[mainIndex]
      const mainGuide = guideForStroke(main)
      techniques.push({
        name: main,
        alias: '主笔',
        x: 50,
        y: 50,
        essence: mainGuide.essence,
        detail: `${roleDetail('主笔', main, mainIndex, strokes.length)}${mainGuide.detail}`,
        cue: mainGuide.cue,
        path: '',
      })
    }

    if (foldIndex >= 0 && foldIndex !== mainIndex && foldIndex !== 0) {
      const fold = strokes[foldIndex]
      const foldGuide = guideForStroke(fold)
      techniques.push({
        name: fold,
        alias: '折笔',
        x: 50,
        y: 50,
        essence: foldGuide.essence,
        detail: `${roleDetail('折笔', fold, foldIndex, strokes.length)}${foldGuide.detail}`,
        cue: foldGuide.cue,
        path: '',
      })
    }

    const lastIndex = strokes.length - 1
    if (lastIndex > 0 && lastIndex !== mainIndex && lastIndex !== foldIndex) {
      const last = strokes[lastIndex]
      const lastGuide = guideForStroke(last)
      techniques.push({
        name: last,
        alias: '收笔',
        x: 50,
        y: 50,
        essence: lastGuide.essence,
        detail: `${roleDetail('收笔', last, lastIndex, strokes.length)}${lastGuide.detail}`,
        cue: lastGuide.cue,
        path: '',
      })
    }
  } else {
    techniques.push({
      name: '读形',
      alias: '原帖',
      x: 50,
      y: 50,
      essence: '先看原帖字形，再定第一笔。',
      detail: `“${entry.char}”是帖中的罕用或异体字形，笔顺资料未完整收录。先对照原帖单字图，确认外轮廓、起笔位置和主笔方向，再下笔。`,
      cue: '先读形，后落笔。',
      path: '',
    })
    techniques.push({
      name: '主势',
      alias: '先立骨架',
      x: 50,
      y: 50,
      essence: '先定主要部件，再补细节。',
      detail: `按${structure}结构处理“${entry.char}”，先写${
        entry.radical ? `“${entry.radical}”部` : '最主要的一组笔画'
      }，用它确定字的高低、宽窄和重心。不要一开始就抠细小笔画。`,
      cue: '骨架先立，细节后补。',
      path: '',
    })
    techniques.push({
      name: '留白',
      alias: '疏密',
      x: 50,
      y: 50,
      essence: '密处收紧，疏处留气。',
      detail: `观察原帖中“${entry.char}”笔画之间的空白：找出最紧的一处，旁边一定有意留出的疏处。临写时不要把空白平均分配。`,
      cue: '空间也是笔画。',
      path: '',
    })
  }

  techniques.push({
    name: '结体',
    alias: `${structure}结构`,
    x: 50,
    y: 50,
    essence: structureGuide.essence,
    detail: `${structureGuide.detail}${
      entry.radical ? `此字部首为“${entry.radical}”。` : ''
    }`,
    cue: structureGuide.cue,
    path: '',
  })

  const mainStroke =
    strokes.length && mainIndex >= 0 ? strokes[mainIndex] : ''
  const summary = `“${entry.char}”在《三门记》中出现 ${entry.occurrences} 次，${
    entry.strokeCount ? `共 ${entry.strokeCount} 画，` : ''
  }${structure}结构${entry.radical ? `，部首为“${entry.radical}”` : ''}。${
    entry.context ? `帖中语境：“${entry.context}”。` : ''
  }`

  return {
    char: entry.char,
    reading: entry.pinyin || '—',
    headline: `${structure}结构${entry.strokeCount ? ` · ${entry.strokeCount}画` : ''}`,
    summary,
    focus: mainStroke
      ? `先定${structure}比例，再把主笔“${mainStroke}”写稳。`
      : `先对照原帖单字图，确认外轮廓和第一笔方向。`,
    techniques,
    generated: true,
    simplified: entry.simplified,
    referenceImage: entry.image || undefined,
    strokeCount: entry.strokeCount,
    structure,
    radical: entry.radical,
    strokeSequence: entry.strokes,
    occurrences: entry.occurrences,
    context: entry.context,
  }
}

export const sanmenCharacterMap = new Map(
  sanmenCharacters.map((entry) => [entry.char, entry]),
)

const studyCache = new Map<string, CharacterStudy>()

export function getSanmenStudy(char: string) {
  const entry = sanmenCharacterMap.get(char)
  if (!entry) return undefined
  const cached = studyCache.get(char)
  if (cached) return cached
  const study = makeGeneratedStudy(entry)
  studyCache.set(char, study)
  return study
}

export { sanmenCharacters }
