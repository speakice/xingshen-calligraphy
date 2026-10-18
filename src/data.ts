export type Work = {
  id: string
  title: string
  fullTitle: string
  author: string
  dynasty: string
  style: string
  char: string
  lines: string[]
  summary: string
  note: string
  seal: string
  mood: string
  images?: string[]
  sourceUrl?: string
  sourceName?: string
}

const sanmenPages = Array.from(
  { length: 16 },
  (_, index) => `copybooks/sanmen/${String(index + 1).padStart(2, '0')}.jpg`,
)

export const works: Work[] = [
  {
    id: 'sanmen',
    title: '三门记',
    fullTitle: '玄妙观重修三门记 · 局部',
    author: '赵孟頫',
    dynasty: '元',
    style: '楷书',
    char: '門',
    lines: [
      '玄妙觀重修三門記',
      '天地闔闢運乎鴻樞而乾坤',
      '為之戶日月出入經乎黃道',
      '而卯酉為之門是故建設琳宮',
      '摹憲玄象外則周垣之聯屬',
      '靈星之橫陳內則重闥之劃開',
    ],
    summary:
      '赵体楷书代表作之一。法度谨严而不板滞，横画轻灵，转折圆劲，字形温润而有骨力。',
    note: '看赵体楷书，不要只看圆润的外表，转折处的提按和收笔的回锋更值得留意。',
    seal: '三門',
    mood: '温雅',
    images: sanmenPages,
    sourceUrl: 'https://www.sohu.com/a/377921161_163947',
    sourceName: '搜狐 · 书法思考',
  },
  {
    id: 'lanting',
    title: '兰亭序',
    fullTitle: '冯承素摹本 · 局部',
    author: '王羲之',
    dynasty: '东晋',
    style: '行书',
    char: '之',
    lines: [
      '永和九年歲在癸丑暮春之初',
      '會于會稽山陰之蘭亭脩禊事也',
      '群賢畢至少長咸集此地',
      '有崇山峻嶺茂林脩竹',
      '又有清流激湍映帶左右',
      '引以為流觴曲水列坐其次',
    ],
    summary: '二十一个“之”字，无一雷同。笔势从容，字与字之间留有呼吸。',
    note: '看帖时先看字势走向，再看单字内部的轻重变化。',
    seal: '蘭亭',
    mood: '清逸',
  },
  {
    id: 'duobao',
    title: '多宝塔碑',
    fullTitle: '颜真卿书 · 局部',
    author: '颜真卿',
    dynasty: '唐',
    style: '楷书',
    char: '多',
    lines: [
      '大唐西京千福寺多寶佛',
      '塔感應碑文南陽岑勛撰',
      '朝議郎判尚書武部員外郎',
      '琅邪顏真卿書朝散大夫',
      '檢校尚書都官郎中東海',
      '徐浩題額粵妙法蓮華',
    ],
    summary: '端庄宽博，横细竖粗，重心沉稳。适合练习起收笔与结构均称。',
    note: '颜楷不以锋利取胜，重在筋骨内含、气象宽厚。',
    seal: '多寶',
    mood: '雄浑',
  },
  {
    id: 'jiucheng',
    title: '九成宫醴泉铭',
    fullTitle: '欧阳询书 · 局部',
    author: '欧阳询',
    dynasty: '唐',
    style: '楷书',
    char: '泉',
    lines: [
      '九成宮醴泉銘秘書監檢',
      '校侍中鉅鹿郡公臣魏徵',
      '奉敕撰維貞觀六年孟夏',
      '之月皇帝避暑乎九成之',
      '宮此則隋之仁壽宮也',
      '冠山抗殿絕壑為池',
    ],
    summary: '法度森严，险绝中见平正。横画紧结，竖画挺劲，转折处尤其见功力。',
    note: '欧楷的“险”，不是歪斜，而是重心在极小的误差里取得平衡。',
    seal: '九成',
    mood: '峻整',
  },
  {
    id: 'luoshen',
    title: '洛神赋',
    fullTitle: '赵孟頫书 · 局部',
    author: '赵孟頫',
    dynasty: '元',
    style: '行楷',
    char: '神',
    lines: [
      '黃初三年余朝京師還濟洛川',
      '古人有言斯水之神名曰宓妃',
      '感宋玉對楚王神女之事遂作斯賦',
      '其詞曰余從京域言歸東藩',
      '背伊闕越轘轅經通谷陵景山',
      '日既西傾車殆馬煩',
    ],
    summary: '圆润秀雅，气息连贯。线条像春水一样绵延，收笔含蓄而有回锋。',
    note: '赵体宜看其圆转中的骨力，不可只学表面的流利。',
    seal: '洛神',
    mood: '温润',
  },
]

export type Technique = {
  name: string
  alias: string
  x: number
  y: number
  essence: string
  detail: string
  cue: string
  path: string
}

export type CharacterStudy = {
  char: string
  reading: string
  headline: string
  summary: string
  focus: string
  techniques: Technique[]
  generated?: boolean
  simplified?: string
  referenceImage?: string
  strokeCount?: number
  structure?: string
  radical?: string
  strokeSequence?: string[]
  occurrences?: number
  context?: string
}

export const characterStudies: Record<string, CharacterStudy> = {
  門: {
    char: '門',
    reading: 'mén',
    headline: '双门相对，匀中有变',
    summary:
      '“門”字左右相向，最忌写成两边完全镜像。左部略收、右部略放，中轴留出呼吸，字才立得住。',
    focus: '先写左门框定下高度，再让右部略舒展。',
    referenceImage: 'copybooks/sanmen/characters/U+9580.jpg',
    techniques: [
      {
        name: '左竖',
        alias: '努',
        x: 28,
        y: 49,
        essence: '左门框先立骨，竖势要沉。',
        detail: '起笔略藏，中锋向下。竖画不能一味笔直，行至中段稍作提按，收笔回锋。',
        cue: '左竖定住整字的高度。',
        path: 'M 28 18 C 27 41, 27 62, 29 83',
      },
      {
        name: '左横折',
        alias: '折',
        x: 37,
        y: 23,
        essence: '横轻折重，肩部略提。',
        detail: '左部横画不可过重，转折处先提笔再按，竖段向内收，为中间留出空间。',
        cue: '折处要有提按，不要直接抹过去。',
        path: 'M 28 21 C 38 20, 45 21, 47 31 C 47 44, 46 58, 45 69',
      },
      {
        name: '左短横',
        alias: '勒',
        x: 38,
        y: 59,
        essence: '短而不弱，右端留空。',
        detail: '内部短横靠近下段，起笔轻、收笔稳。右端不要碰到门框，让内部保持透气。',
        cue: '短横也有起和收。',
        path: 'M 32 56 C 37 55, 41 55, 44 56',
      },
      {
        name: '右竖',
        alias: '努',
        x: 73,
        y: 50,
        essence: '与左竖相望，略长而舒展。',
        detail: '右竖与左竖共同构成门框。两竖不要机械等长，右部可略向下伸展，形成微妙变化。',
        cue: '对称不等于完全相同。',
        path: 'M 72 19 C 72 41, 72 63, 72 84',
      },
      {
        name: '右横折钩',
        alias: '趯',
        x: 66,
        y: 23,
        essence: '横折承接右势，钩处蓄力。',
        detail: '右侧横折是整字最有姿态的一笔。横画略上扬，折后下行，钩前驻笔再短促挑出。',
        cue: '驻得住，才挑得干净。',
        path: 'M 55 21 C 64 20, 72 21, 74 31 C 74 44, 74 58, 73 68 C 74 74, 80 74, 83 66',
      },
      {
        name: '右短横',
        alias: '勒',
        x: 65,
        y: 59,
        essence: '与左短横呼应，位置略活。',
        detail: '右侧短横可比左侧略长一点，位置也稍高，避免左右内部空间完全重复。',
        cue: '同中求异，字才有生气。',
        path: 'M 56 56 C 62 55, 67 55, 71 56',
      },
    ],
  },
  之: {
    char: '之',
    reading: 'zhī',
    headline: '一笔三折，势在空际',
    summary: '“之”字看似简单，难在三点：起笔的方向、转折的暗过、平捺的舒展。',
    focus: '先慢后快，捺脚不要突然甩出。',
    techniques: [
      {
        name: '点',
        alias: '侧',
        x: 59,
        y: 18,
        essence: '凌空取势，轻入重收。',
        detail: '起笔不要平铺直下。笔尖从右上方斜切入纸，略按后向下方收拢，使点有方向感。',
        cue: '像高峰坠石，落点要准。',
        path: 'M 31 22 C 42 8, 54 9, 59 23',
      },
      {
        name: '横撇',
        alias: '暗过',
        x: 32,
        y: 52,
        essence: '横处铺毫，折处提笔换锋。',
        detail: '横段不要写平，略取右上之势。至折点先驻，再提笔转锋向左下撇出，转折处要有弹性。',
        cue: '折不是停，是提起来换方向。',
        path: 'M 26 61 C 28 43, 38 34, 55 43 C 52 53, 39 69, 26 86',
      },
      {
        name: '平捺',
        alias: '磔',
        x: 67,
        y: 77,
        essence: '一波三折，收笔沉着。',
        detail: '捺画先向右下行，中段略提，再向右铺毫。尾部不必尖细，留住笔锋，才有余味。',
        cue: '捺脚是托住整字的力量。',
        path: 'M 12 82 C 30 80, 52 78, 77 89',
      },
    ],
  },
  永: {
    char: '永',
    reading: 'yǒng',
    headline: '永字八法，笔法总纲',
    summary: '一个字里藏着八种基本笔势。练“永”不是练形，是把起、行、收的动作练成习惯。',
    focus: '八法不必一次求全，今天只看中锋与转折。',
    techniques: [
      {
        name: '点',
        alias: '侧',
        x: 57,
        y: 14,
        essence: '侧锋落纸，险而稳。',
        detail: '点如高峰坠石。入笔有方向，收笔有回势，不能只是一团墨。',
        cue: '落笔要准，收笔要沉。',
        path: 'M 45 13 C 55 5, 66 10, 62 24',
      },
      {
        name: '横',
        alias: '勒',
        x: 29,
        y: 34,
        essence: '逆入平出，如勒马缰。',
        detail: '横画中段略提，两端有控制。力在画中，表面反而轻松。',
        cue: '不要越写越快。',
        path: 'M 20 38 C 37 33, 56 32, 69 36',
      },
      {
        name: '竖',
        alias: '努',
        x: 74,
        y: 48,
        essence: '中锋下行，力藏画中。',
        detail: '竖画要挺而不僵。手腕稳定，笔尖保持在线的中央，收笔略回。',
        cue: '像拉满的弓，不是木棍。',
        path: 'M 70 34 C 76 46, 76 59, 72 73',
      },
      {
        name: '钩',
        alias: '趯',
        x: 80,
        y: 73,
        essence: '驻笔蓄势，迅捷挑出。',
        detail: '钩前先驻，把力量收住，再短促挑出。最忌没有停顿就顺势滑走。',
        cue: '蓄得足，出得短。',
        path: 'M 72 73 C 79 75, 84 70, 84 62',
      },
      {
        name: '提',
        alias: '策',
        x: 28,
        y: 49,
        essence: '重起轻收，向上提起。',
        detail: '提画起笔略重，行笔逐渐提锋，尾端有向上的势，不要写成短横。',
        cue: '方向明确，笔锋要离纸。',
        path: 'M 19 56 C 31 51, 44 45, 52 39',
      },
      {
        name: '撇',
        alias: '掠',
        x: 22,
        y: 62,
        essence: '起笔沉，腹部满，尾部扬。',
        detail: '撇画先按后提，弧线舒展。中段不可空怯，尾端不要拖泥带水。',
        cue: '像梳过水面，轻而有形。',
        path: 'M 37 45 C 33 57, 25 70, 15 80',
      },
      {
        name: '短撇',
        alias: '啄',
        x: 46,
        y: 38,
        essence: '如鸟啄食，峻利果断。',
        detail: '短撇贵在短和快。落笔后迅速向左下出锋，不能迟疑。',
        cue: '短，不等于草率。',
        path: 'M 53 36 C 48 42, 42 47, 37 51',
      },
      {
        name: '捺',
        alias: '磔',
        x: 55,
        y: 74,
        essence: '一波三折，铺毫舒展。',
        detail: '捺画要有送出去的力量。先轻后重，到捺脚处驻笔，再缓缓收锋。',
        cue: '把最后一口气留到捺脚。',
        path: 'M 36 59 C 46 66, 55 78, 74 85',
      },
    ],
  },
  多: {
    char: '多',
    reading: 'duō',
    headline: '重撇叠势，稳住重心',
    summary: '两个“夕”上下相叠，最怕写得一样大。上收下放、上轻下重，字才站得住。',
    focus: '比较两层撇画的斜度，下面一层更舒展。',
    techniques: [
      {
        name: '短撇',
        alias: '啄',
        x: 49,
        y: 22,
        essence: '落笔果断，出锋短促。',
        detail: '上层的短撇决定整字的气势，起笔沉，出锋快，方向略向下。',
        cue: '先定方向再落笔。',
        path: 'M 56 16 C 50 25, 43 33, 34 39',
      },
      {
        name: '横撇',
        alias: '暗过',
        x: 52,
        y: 38,
        essence: '横短折急，转处见骨。',
        detail: '横画不宜长，折处提锋换向，撇出时要送到底。',
        cue: '折处不要写成圆角。',
        path: 'M 35 34 C 47 31, 58 33, 51 43 C 45 53, 36 61, 26 66',
      },
      {
        name: '点',
        alias: '侧',
        x: 61,
        y: 44,
        essence: '承上启下，位置要准。',
        detail: '点在下层起笔附近，既补空，又引向下一个撇画。',
        cue: '小点也有方向。',
        path: 'M 61 39 C 65 45, 62 51, 57 54',
      },
      {
        name: '长撇',
        alias: '掠',
        x: 39,
        y: 70,
        essence: '弧势舒展，尾端提起。',
        detail: '下层长撇最见气象，起笔承住上层，行笔向左下自然打开。',
        cue: '弧度来自腕，不是手腕甩动。',
        path: 'M 59 58 C 48 67, 34 77, 20 84',
      },
    ],
  },
  泉: {
    char: '泉',
    reading: 'quán',
    headline: '上紧下松，水势向下',
    summary: '“白”要收得紧，“水”要放得开。上下之间靠中轴贯通，切忌各自为政。',
    focus: '先找中轴，再安排左右四点。',
    techniques: [
      {
        name: '短撇',
        alias: '啄',
        x: 52,
        y: 14,
        essence: '起笔藏锋，短而有力。',
        detail: '顶端短撇为全字定势，不能飘。落笔后向左下短促出锋。',
        cue: '顶得住，下面才稳。',
        path: 'M 57 10 C 54 16, 49 21, 45 24',
      },
      {
        name: '横折',
        alias: '折',
        x: 70,
        y: 31,
        essence: '横细折重，肩部略提。',
        detail: '横画轻，折处略按。右肩不可塌，转折后竖画向内收。',
        cue: '转折处先提后按。',
        path: 'M 42 24 C 55 23, 67 23, 69 34 C 70 42, 69 50, 68 55',
      },
      {
        name: '竖',
        alias: '努',
        x: 50,
        y: 45,
        essence: '中锋直下，承上启下。',
        detail: '中竖是上下两部分的中轴，要稳，但不要写得像木棍。',
        cue: '让笔尖走在线的中间。',
        path: 'M 54 24 C 54 38, 54 50, 54 63',
      },
      {
        name: '撇',
        alias: '掠',
        x: 26,
        y: 67,
        essence: '左开右合，稳住下方。',
        detail: '下部左撇与右捺形成支撑。撇画先重后轻，尾端自然提起。',
        cue: '向左打开，不要挤在中线。',
        path: 'M 52 61 C 43 69, 33 77, 21 79',
      },
      {
        name: '捺',
        alias: '磔',
        x: 70,
        y: 71,
        essence: '向右铺毫，收尾含蓄。',
        detail: '右捺与左撇相称，尾部不要过于尖锐，留出回锋的余地。',
        cue: '左右像水波一样分开。',
        path: 'M 54 61 C 63 68, 70 76, 82 82',
      },
    ],
  },
  神: {
    char: '神',
    reading: 'shén',
    headline: '左右相让，中竖立骨',
    summary: '“礻”旁收窄，“申”部舒展。左右不是并列，而是左让右、右顾左。',
    focus: '竖画是全字的脊梁，必须挺住。',
    techniques: [
      {
        name: '点',
        alias: '侧',
        x: 25,
        y: 18,
        essence: '位置偏上，取势向下。',
        detail: '首点与横撇形成呼应，不宜孤立。点的收势指向下一笔起笔处。',
        cue: '点虽小，也要管方向。',
        path: 'M 25 11 C 29 17, 28 22, 24 26',
      },
      {
        name: '横撇',
        alias: '暗过',
        x: 31,
        y: 37,
        essence: '横短撇长，收敛右让。',
        detail: '左旁横画不能伸到右边，折后撇出要有姿态，为右部让出空间。',
        cue: '偏旁要有“让”的意识。',
        path: 'M 18 30 C 29 27, 38 29, 33 37 C 28 45, 23 51, 17 55',
      },
      {
        name: '竖',
        alias: '努',
        x: 42,
        y: 52,
        essence: '左旁中竖，短而含蓄。',
        detail: '这一竖收住左部重心，末端回锋，不宜写成悬针。',
        cue: '短竖更要稳住。',
        path: 'M 39 37 C 39 45, 39 51, 40 59',
      },
      {
        name: '横折',
        alias: '折',
        x: 72,
        y: 31,
        essence: '右部取势，转折有肩。',
        detail: '“申”部横折决定右侧轮廓，肩部略提，竖段向下贯通。',
        cue: '肩要提，竖要沉。',
        path: 'M 53 27 C 67 27, 78 27, 79 39 C 79 49, 77 60, 75 66',
      },
      {
        name: '悬针竖',
        alias: '努',
        x: 68,
        y: 78,
        essence: '中锋到底，锋尖收束。',
        detail: '主竖贯穿到底，力量持续送到尖端。不要因为下方无依靠而提前提笔。',
        cue: '一口气送到最后。',
        path: 'M 67 29 C 67 48, 67 66, 67 86',
      },
    ],
  },
}

export type TheoryArticle = {
  id: string
  category: '笔法' | '结体' | '章法' | '书史'
  title: string
  subtitle: string
  readTime: string
  intro: string
  sections: { heading: string; body: string }[]
  quote: string
}

export const theoryArticles: TheoryArticle[] = [
  {
    id: 'center-tip',
    category: '笔法',
    title: '中锋不是把笔杆竖正',
    subtitle: '理解锋毫在纸面上的受力',
    readTime: '5 分钟',
    intro:
      '中锋常被误解为“笔杆必须垂直”。真正的中锋，是笔锋的主毫始终走在点画的中线上，墨从笔心向两侧均匀渗开。',
    sections: [
      {
        heading: '看见中锋',
        body: '写一根长横，观察线条两侧的墨边。如果一侧光滑、一侧毛糙，往往说明锋尖偏向了一侧。中锋的线条不一定细，但边缘会更稳定，转折后也不容易散锋。',
      },
      {
        heading: '手腕要能“让”',
        body: '笔尖改变了方向，手腕也要跟着微调，而不是让笔杆始终死板地立在同一个角度。所谓“笔随腕转”，说的是让锋尖保持在应该走的那条线上。',
      },
      {
        heading: '从一个动作开始',
        body: '今天只练长横：逆入、铺毫、提收。速度放慢，在纸面反光时观察墨线中段。慢，是为了看清，不是为了永远慢。',
      },
    ],
    quote: '锋在画中，力在画外。',
  },
  {
    id: 'start-finish',
    category: '笔法',
    title: '起笔与收笔，决定线条的气质',
    subtitle: '藏露之间，不只是技术动作',
    readTime: '6 分钟',
    intro:
      '起笔定方向，收笔定余韵。同一根横线，起收稍有不同，就会出现温润、峻利、厚重等完全不同的气质。',
    sections: [
      {
        heading: '起笔不是“画一个头”',
        body: '藏锋起笔有逆入的动作，但逆入不是刻意补一个圆头。笔入纸的方向与行笔方向形成一个反向的势，线条自然就厚了。',
      },
      {
        heading: '收笔要交代清楚',
        body: '收笔有回锋、出锋、驻笔等不同方式。无论哪一种，都要让笔势有去处。最怕写到末端突然停住，像话没说完。',
      },
      {
        heading: '对照练习',
        body: '用同一根横画尝试三种收笔：回锋、驻笔、轻出锋。不要评价好坏，先体会每种收笔让线条的气质发生了什么变化。',
      },
    ],
    quote: '起如截铁，收如抽丝。',
  },
  {
    id: 'structure-center',
    category: '结体',
    title: '字的重心，藏在空白里',
    subtitle: '从“看笔画”转向“看空间”',
    readTime: '4 分钟',
    intro:
      '结体不只是把笔画排均匀。一个字稳不稳，常常取决于笔画之间留下的空白是否有序，也就是“计白当黑”。',
    sections: [
      {
        heading: '先看大轮廓',
        body: '眯起眼睛看范字，先忽略细小的起收笔，只观察外轮廓是方、是长、是梯形。大轮廓稳定之后，再进入内部的疏密。',
      },
      {
        heading: '中轴与错位',
        body: '许多字的中轴并不是一根笔直的线。左右部件可以通过轻微错位产生动势，但整体重心仍然落在同一条垂直线上。',
      },
      {
        heading: '一次只改一个关系',
        body: '临写时不要同时纠正十个问题。今天只观察“左收右放”，明天再看“上紧下松”。有选择的观察，比盲目重复更有效。',
      },
    ],
    quote: '计白当黑，知白守黑。',
  },
  {
    id: 'space',
    category: '章法',
    title: '一行字如何呼吸',
    subtitle: '行气、字距与留白',
    readTime: '7 分钟',
    intro:
      '章法不是把字排整齐。优秀的行书里，字的大小、轴线、字距都在变化，但整体气息又能连成一片。',
    sections: [
      {
        heading: '行气来自中轴摆动',
        body: '把一行字的中心点连起来，会看到一条轻微摆动的线。摆动过大会散，完全笔直又会僵。行书的节奏，往往就在这微小的偏移里。',
      },
      {
        heading: '字距不是等距',
        body: '笔画少的字可以收紧，笔画多的字可以放开。字距服务于整体节奏，一味等宽会把行气切断。',
      },
      {
        heading: '留白也是内容',
        body: '整幅作品的四周留白，决定了它是否局促。读帖时不要只看字，看看字与纸边之间的距离，空白也在说话。',
      },
    ],
    quote: '疏可走马，密不透风。',
  },
  {
    id: 'wang-xizhi',
    category: '书史',
    title: '《兰亭序》里的二十一个“之”',
    subtitle: '同字异构与自然书写',
    readTime: '5 分钟',
    intro:
      '《兰亭序》最常被提起的，是二十一个“之”字各不相同。变化的背后不是刻意求奇，而是每一次落笔都处于不同的文气与节奏里。',
    sections: [
      {
        heading: '变化有迹可循',
        body: '有的“之”字形长，有的横向展开；有的捺画舒展，有的收得含蓄。变化主要集中在笔势方向和空间分配，而不是凭空造形。',
      },
      {
        heading: '同字异构的意义',
        body: '重复的字容易让画面单调。通过轻重、大小、欹侧的变化，既保持识别性，又让整篇作品有持续流动的节奏。',
      },
      {
        heading: '学习方式',
        body: '不要一次临写二十一种。选三个差异明显的“之”，比较它们的起笔方向和平捺长度，再各写五遍。',
      },
    ],
    quote: '后之视今，亦犹今之视昔。',
  },
  {
    id: 'yan-style',
    category: '书史',
    title: '颜真卿的“厚”从哪里来',
    subtitle: '筋骨、篆籀气与空间',
    readTime: '6 分钟',
    intro:
      '颜体常被概括为“雄浑宽博”，但厚重不等于臃肿。真正的力量来自中锋用笔、结构的向外舒展，以及转折处的含而不露。',
    sections: [
      {
        heading: '横细竖粗的结构感',
        body: '颜楷的横竖对比明显，但横画并没有因为细而弱。中段仍有厚度，竖画承担骨架，整个字因此像一座有梁柱的建筑。',
      },
      {
        heading: '外拓与内擫',
        body: '与欧阳询的内收不同，颜体多向两侧打开。外轮廓舒展，内部留白也因此更大。写的时候要敢于向外撑，但收笔仍须含蓄。',
      },
      {
        heading: '不要只写“粗”',
        body: '把每一笔都写粗，只会得到墨团。先保证中锋和转折的方向，再逐渐增加厚度。厚度是结果，不是目标。',
      },
    ],
    quote: '筋骨有余，丰腴不剩。',
  },
]

export type AestheticTheme = {
  id: string
  name: string
  english: string
  summary: string
  detail: string
  keywords: string[]
  example: string
  author: string
  color: string
}

export const aestheticThemes: AestheticTheme[] = [
  {
    id: 'balanced',
    name: '中和',
    english: 'BALANCE',
    summary: '不过分，不不足，在收与放之间保持余地。',
    detail:
      '“中和”不是四平八稳，也不是没有个性。它更像一种精确的平衡：险绝之处仍能立住，浓重之处仍能透气。看欧阳询的字，会感到每一个偏移都被另一种力量拉回来。',
    keywords: ['平正', '含蓄', '有余地'],
    example: '泉',
    author: '欧阳询《九成宫醴泉铭》',
    color: '#766e5d',
  },
  {
    id: 'rhythm',
    name: '气韵',
    english: 'RHYTHM',
    summary: '笔断意连，让静止的墨迹保有运动感。',
    detail:
      '气韵不是热闹，而是线条之间看不见的联系。一个收笔的方向、一处字的偏侧，都可能成为下一笔的起点。行书尤其如此，笔画虽断，视线和力量却没有断。',
    keywords: ['连贯', '行气', '生动'],
    example: '之',
    author: '王羲之《兰亭序》',
    color: '#7b5848',
  },
  {
    id: 'bone',
    name: '骨力',
    english: 'STRENGTH',
    summary: '力量藏在内部，不靠夸张的外形。',
    detail:
      '骨力是线条立得住的根本。它来自中锋、来自提按的控制，也来自收笔时的克制。真正有骨力的线条不一定粗，却让人相信它可以承重。',
    keywords: ['中锋', '挺劲', '沉著'],
    example: '神',
    author: '颜真卿《多宝塔碑》',
    color: '#45544c',
  },
]
