<template>
  <div class="practice-dictionary animate-fade-in">
    <!-- 1. 玄学修行页眉 -->
    <div class="spiritual-header glass-card">
      <div class="header-overlay"></div>
      <div class="header-info">
        <div class="title-wrap">
          <span class="taiji-icon">☯</span>
          <h2 class="section-title">修行字典</h2>
        </div>
        <p class="section-subtitle">
          天干地支 · 八卦方位 · 探寻万物互联的宇宙常数编码
        </p>
      </div>
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索地支、生肖、五行、八卦或意象..."
          class="custom-search"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 2. 首屏交互面板：时辰地支实时换算与梅花易数全息起卦 -->
    <el-row :gutter="24" class="control-row">
      <!-- 上半部分：时辰地支实时换算 -->
      <el-col :xs="24" :span="24" class="flex-column" style="margin-bottom: 24px;">
        <DialClockDeduce
          v-model:simulatedHour="simulatedHour"
          v-model:isAutoTime="isAutoTime"
          :liveTime="liveTime"
          :liveMinute="liveMinute"
          :liveSecond="liveSecond"
          :simulatedBranchInfo="simulatedBranchInfo"
          :currentBranchInfo="currentBranchInfo"
          :diagramTrigrams="diagramTrigrams"
          :dialNumbers="dialNumbers"
          :dialBranches="dialBranches"
          @resume-auto-time="resumeAutoTime"
        />
      </el-col>

      <!-- 下半部分：全息起卦与八字推算平台 -->
      <el-col :xs="24" :span="24" class="flex-column">
        <PlumBaziDeduce />
      </el-col>
    </el-row>

    <!-- 2.3 洛书九宫飞星推演盘 -->
    <LuoShuFlyingStars style="margin-bottom: 24px;" />

    <!-- 2.4 三大标准映射数据字典 -->
    <StandardDictionary
      v-model:activeTableTab="activeTableTab"
      v-model:activeStem="activeStem"
      v-model:inputNumber="inputNumber"
      :searchQuery="searchQuery"
      :guaResult="guaResult"
      :simulatedBranchName="simulatedBranchInfo.name"
      :diagramTrigrams="diagramTrigrams"
      :heavenlyStemsList="heavenlyStemsList"
      :baguaList="baguaList"
      :branchesList="branchesList"
      :hoursList="hoursList"
      @select-branch="selectBranchByName"
    />

    <!-- 2.5 三大掐指掌诀指诀图 -->
    <ThreePalmKnuckles
      v-model:activeStem="activeStem"
      v-model:activeBagua="activeBagua"
      :simulatedBranchInfo="simulatedBranchInfo"
      :heavenlyStemsList="heavenlyStemsList"
      :baguaList="baguaList"
      @select-branch="selectBranchByName"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

import LuoShuFlyingStars from '@/components/LuoShuFlyingStars.vue'
import DialClockDeduce from '@/components/DialClockDeduce.vue'
import PlumBaziDeduce from '@/components/PlumBaziDeduce.vue'
import StandardDictionary from '@/components/StandardDictionary.vue'
import ThreePalmKnuckles from '@/components/ThreePalmKnuckles.vue'

// 搜索过滤与 Tab 状态
const searchQuery = ref('')
const activeTableTab = ref('bagua')

// 实时时间计算
const liveTime = ref(dayjs().format('HH:mm:ss'))
const liveMinute = ref(dayjs().minute())
const liveSecond = ref(dayjs().second())
const isAutoTime = ref(true)
const simulatedHour = ref(dayjs().hour())

// 起卦数输入
const inputNumber = ref(5)

// 天干与八卦状态及常量
const activeStem = ref('甲')
const activeBagua = ref('乾')

let timer = null

onMounted(() => {
  // 每秒更新实时时间
  timer = setInterval(() => {
    const now = dayjs()
    liveTime.value = now.format('HH:mm:ss')
    liveMinute.value = now.minute()
    liveSecond.value = now.second()
    if (isAutoTime.value) {
      simulatedHour.value = now.hour()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const resumeAutoTime = () => {
  isAutoTime.value = true
  const now = dayjs()
  simulatedHour.value = now.hour()
  liveMinute.value = now.minute()
  liveSecond.value = now.second()
}

// 三大标准映射表常量定义
const branchesList = [
  { id: 1, name: '子', pinyin: 'zǐ', zodiac: '鼠', zodiacEmoji: '🐭', month: '十一月', element: 'water', elementName: '水', elementDesc: '水（寒冬冰冻）' },
  { id: 2, name: '丑', pinyin: 'chǒu', zodiac: '牛', zodiacEmoji: '🐮', month: '十二月', element: 'earth', elementName: '土', elementDesc: '土（湿土、冬末）' },
  { id: 3, name: '寅', pinyin: 'yín', zodiac: '虎', zodiacEmoji: '🐯', month: '正月（一月）', element: 'wood', elementName: '木', elementDesc: '木（初春萌芽）' },
  { id: 4, name: '卯', pinyin: 'mǎo', zodiac: '兔', zodiacEmoji: '🐰', month: '二月', element: 'wood', elementName: '木', elementDesc: '木（仲春茂盛）' },
  { id: 5, name: '辰', pinyin: 'chén', zodiac: '龙', zodiacEmoji: '🐲', month: '三月', element: 'earth', elementName: '土', elementDesc: '土（水库、春末）' },
  { id: 6, name: '巳', pinyin: 'sì', zodiac: '蛇', zodiacEmoji: '🐍', month: '四月', element: 'flame', elementName: '火', elementDesc: '火（初夏渐热）' },
  { id: 7, name: '午', pinyin: 'wǔ', zodiac: '马', zodiacEmoji: '🐴', month: '五月', element: 'flame', elementName: '火', elementDesc: '火（仲夏大热）' },
  { id: 8, name: '未', pinyin: 'wèi', zodiac: '羊', zodiacEmoji: '🐑', month: '六月', element: 'earth', elementName: '土', elementDesc: '土（木库、夏末）' },
  { id: 9, name: '申', pinyin: 'shēn', zodiac: '猴', zodiacEmoji: '🐵', month: '七月', element: 'gold', elementName: '金', elementDesc: '金（初秋转凉）' },
  { id: 10, name: '酉', pinyin: 'yǒu', zodiac: '鸡', zodiacEmoji: '🐔', month: '八月', element: 'gold', elementName: '金', elementDesc: '金（仲秋肃杀）' },
  { id: 11, name: '戌', pinyin: 'xū', zodiac: '狗', zodiacEmoji: '🐶', month: '九月', element: 'earth', elementName: '土', elementDesc: '土（火库、秋末）' },
  { id: 12, name: '亥', pinyin: 'hài', zodiac: '猪', zodiacEmoji: '🐷', month: '十月', element: 'water', elementName: '水', elementDesc: '水（初冬水旺）' }
]

const hoursList = [
  { id: 1, name: '子', timeSpan: '23:00 ~ 01:00', rhyme: '夜深人静，老鼠出没' },
  { id: 2, name: '丑', timeSpan: '01:00 ~ 03:00', rhyme: '牛开始倒嚼、反刍' },
  { id: 3, name: '寅', timeSpan: '03:00 ~ 05:00', rhyme: '黎明前夕，老虎最凶猛' },
  { id: 4, name: '卯', timeSpan: '05:00 ~ 07:00', rhyme: '太阳升起，兔子出窝（古人上班点卯）' },
  { id: 5, name: '辰', timeSpan: '07:00 ~ 09:00', rhyme: '容易起雾，群龙行雨' },
  { id: 6, name: '巳', timeSpan: '09:00 ~ 11:00', rhyme: '艳阳当空，蛇伏草丛' },
  { id: 7, name: '午', timeSpan: '11:00 ~ 13:00', rhyme: '阳气最盛，烈马奔腾（午休）' },
  { id: 8, name: '未', timeSpan: '13:00 ~ 15:00', rhyme: '太阳偏西，羊吃草最肥' },
  { id: 9, name: '申', timeSpan: '15:00 ~ 17:00', rhyme: '日落西山，猴子啼叫' },
  { id: 10, name: '酉', timeSpan: '17:00 ~ 19:00', rhyme: '鸡啼归巢，夜幕降临' },
  { id: 11, name: '戌', timeSpan: '19:00 ~ 21:00', rhyme: '华灯初上，狗看家护院' },
  { id: 12, name: '亥', timeSpan: '21:00 ~ 23:00', rhyme: '人定时刻，猪熟睡打呼' }
]

const baguaList = [
  { id: 1, name: '乾', pinyin: 'qián', nature: '天', trigram: '☰', direction: '正南', element: '金', code: '强健、一把手、头部。类象：圆形的、金属 of 头部、马、头、君父。' },
  { id: 2, name: '兑', pinyin: 'duì', nature: '泽', trigram: '☱', direction: '东南', element: '金', code: '喜悦、开口、缺口、软件接口。类象：有口的、破损的、软原生、喜悦之物、羊、口、少女。' },
  { id: 3, name: '离', pinyin: 'lí', nature: '火', trigram: '☲', direction: '正东', element: '火', code: '光明、美丽、依赖、外刚内柔。类象：红色的、发光的、中空的、文书、雉、目、中女。' },
  { id: 4, name: '震', pinyin: 'zhèn', nature: '雷', trigram: '☳', direction: '东北', element: '木', code: '变动、出发、速度、创新。类象：有声响的、能动的、植物、龙、足、长子。' },
  { id: 5, name: '巽', pinyin: 'xùn', nature: '风', trigram: '☴', direction: '西南', element: '木', code: '渗透、无孔不入、渠道、运营。类象：长条的、有气味的、可入的、鸡、股、长女。' },
  { id: 6, name: '坎', pinyin: 'kǎn', nature: '水', trigram: '☵', direction: '正西', element: '水', code: '坎坷、陷阱、危机、核心算法。类象：液体的、凹陷的、隐藏的、猪、耳、中男。' },
  { id: 7, name: '艮', pinyin: 'gèn', nature: '山', trigram: '☶', direction: '西北', element: '土', code: '停止、阻碍、稳定、硬件底座。类象：静止的、坚硬的、山石之物、狗、手、少男。' },
  { id: 8, name: '坤', pinyin: 'kūn', nature: '地', trigram: '☷', direction: '正北', element: '土', code: '包容、承载、配合、用户数据库。类象：方形的、柔软的、盛物之器、牛、腹、母。' }
]

const heavenlyStemsList = [
  { id: 1, name: '甲', pinyin: 'jiǎ', element: 'wood', elementName: '木', polar: '阳', desc: '甲木为参天大树，领袖、栋梁之才，正直向上。' },
  { id: 2, name: '乙', pinyin: 'yǐ', element: 'wood', elementName: '木', polar: '阴', desc: '乙木为花草灌木，柔顺、适应力强，具有韧性。' },
  { id: 3, name: '丙', pinyin: 'bǐng', element: 'flame', elementName: '火', polar: '阳', desc: '丙火为太阳之火，热情、光明磊落，普照万物。' },
  { id: 4, name: '丁', pinyin: 'dīng', element: 'flame', elementName: '火', polar: '阴', desc: '丁火为灯烛之火，温和、内敛、照亮他人，具有奉献精神。' },
  { id: 5, name: '戊', pinyin: 'wù', element: 'earth', elementName: '土', polar: '阳', desc: '戊土为高山厚土，稳重、忠厚、保护力强，讲信用。' },
  { id: 6, name: '己', pinyin: 'jǐ', element: 'earth', elementName: '土', polar: '阴', desc: '己土为田园湿土，包容、孕育、乐于助人，多才多艺。' },
  { id: 7, name: '庚', pinyin: 'gēng', element: 'gold', elementName: '金', polar: '阳', desc: '庚金为刀剑斧刃，刚强、果断、有正义感，讲究规矩。' },
  { id: 8, name: '辛', pinyin: 'xīn', element: 'gold', elementName: '金', polar: '阴', desc: '辛金为珠玉首饰，精致、温润、独特，追求完美。' },
  { id: 9, name: '壬', pinyin: 'rén', element: 'water', elementName: '水', polar: '阳', desc: '壬水为江河大水，奔涌、智慧、有远见，大局观强。' },
  { id: 10, name: '癸', pinyin: 'guǐ', element: 'water', elementName: '水', polar: '阴', desc: '癸水为雨露之水，滋润、灵动、温柔，富有创意。' }
]

const diagramTrigrams = [
  { id: 1, name: '乾', pinyin: 'qián', symbol: '☰', nature: '天', direction: '正南', engDir: 'SOUTH', color: '#64748b', angle: 0 },
  { id: 5, name: '巽', pinyin: 'xùn', symbol: '☴', nature: '风', direction: '西南', engDir: 'SOUTHWEST', color: '#a855f7', angle: 45 },
  { id: 6, name: '坎', pinyin: 'kǎn', symbol: '☵', nature: '水', direction: '正西', engDir: 'WEST', color: '#1e3a8a', angle: 90 },
  { id: 7, name: '艮', pinyin: 'gèn', symbol: '☶', nature: '山', direction: '西北', engDir: 'NORTHWEST', color: '#0284c7', angle: 135 },
  { id: 8, name: '坤', pinyin: 'kūn', symbol: '☷', nature: '地', direction: '正北', engDir: 'NORTH', color: '#db2777', angle: 180 },
  { id: 4, name: '震', pinyin: 'zhèn', symbol: '☳', nature: '雷', direction: '东北', engDir: 'NORTHEAST', color: '#16a34a', angle: 225 },
  { id: 3, name: '离', pinyin: 'lí', symbol: '☲', nature: '火', direction: '正东', engDir: 'EAST', color: '#dc2626', angle: 270 },
  { id: 2, name: '兑', pinyin: 'duì', symbol: '☱', nature: '泽', direction: '东南', engDir: 'SOUTHEAST', color: '#94a3b8', angle: 315 },
]

// 掐指神算点击切换地支
const selectBranchByName = (branchName) => {
  isAutoTime.value = false
  const match = hoursList.find(h => h.name === branchName)
  if (match) {
    const hourStartStr = match.timeSpan.split(' ~ ')[0]
    const hour = parseInt(hourStartStr.split(':')[0])
    simulatedHour.value = hour
  }
}

// 时间转换算法
const getBranchByHour = (hour) => {
  if (hour >= 23 || hour < 1) return '子'
  if (hour >= 1 && hour < 3) return '丑'
  if (hour >= 3 && hour < 5) return '寅'
  if (hour >= 5 && hour < 7) return '卯'
  if (hour >= 7 && hour < 9) return '辰'
  if (hour >= 9 && hour < 11) return '巳'
  if (hour >= 11 && hour < 13) return '午'
  if (hour >= 13 && hour < 15) return '未'
  if (hour >= 15 && hour < 17) return '申'
  if (hour >= 17 && hour < 19) return '酉'
  if (hour >= 19 && hour < 21) return '戌'
  if (hour >= 21 && hour < 23) return '亥'
  return '子'
}

// 计算属性：当前实时时间的时辰
const currentBranchInfo = computed(() => {
  const hour = dayjs().hour()
  const branchName = getBranchByHour(hour)
  return branchesList.find(b => b.name === branchName) || branchesList[0]
})

// 计算属性：模拟/选中的时间的时辰全量信息
const simulatedBranchInfo = computed(() => {
  const branchName = getBranchByHour(simulatedHour.value)
  const base = branchesList.find(b => b.name === branchName) || branchesList[0]
  const hourInfo = hoursList.find(h => h.name === branchName) || hoursList[0]
  return {
    ...base,
    timeSpan: hourInfo.timeSpan,
    rhyme: hourInfo.rhyme
  }
})

// 计算属性：表盘上的1-12数字刻度坐标计算
const dialNumbers = computed(() => {
  const nums = []
  for (let h = 1; h <= 12; h++) {
    const angle = h * 30 * Math.PI / 180
    nums.push({
      val: h,
      x: 100 + 78 * Math.sin(angle),
      y: 100 - 78 * Math.cos(angle)
    })
  }
  return nums
})

// 计算属性：表盘上的12时辰刻度坐标计算
const dialBranches = computed(() => {
  const branches = [
    { name: '子', angle: 0, r: 48, element: 'water' },
    { name: '丑', angle: 60, r: 48, element: 'earth' },
    { name: '寅', angle: 120, r: 48, element: 'wood' },
    { name: '卯', angle: 180, r: 48, element: 'wood' },
    { name: '辰', angle: 240, r: 48, element: 'earth' },
    { name: '巳', angle: 300, r: 48, element: 'fire' },
    { name: '午', angle: 0, r: 62, element: 'fire' },
    { name: '未', angle: 60, r: 62, element: 'earth' },
    { name: '申', angle: 120, r: 62, element: 'metal' },
    { name: '酉', angle: 180, r: 62, element: 'metal' },
    { name: '戌', angle: 240, r: 62, element: 'earth' },
    { name: '亥', angle: 300, r: 62, element: 'water' }
  ]
  return branches.map(b => {
    const rad = b.angle * Math.PI / 180
    return {
      name: b.name,
      x: 100 + b.r * Math.sin(rad),
      y: 100 - b.r * Math.cos(rad),
      isActive: simulatedBranchInfo.value.name === b.name,
      element: b.element
    }
  })
})

// 起卦数余数与卦象计算
const guaRemainder = computed(() => {
  if (!inputNumber.value) return 0
  const rem = inputNumber.value % 8
  return rem
})

const guaResult = computed(() => {
  const rem = guaRemainder.value
  const targetId = rem === 0 ? 8 : rem
  return baguaList.find(g => g.id === targetId) || baguaList[7]
})
</script>

<style scoped>
.practice-dictionary {
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 0 40px 0;
}

.control-row :deep(.flex-column) {
  display: flex !important;
  flex-direction: column;
  gap: 24px;
}

/* 玻璃卡片 */
.glass-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
}

/* 修行头图 */
.spiritual-header {
  min-height: 140px;
  background: linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #1e1b4b 100%) !important;
  border: 1px solid rgba(245, 158, 11, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 30px 40px;
  margin-bottom: 24px;
  color: white;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.15), transparent 60%);
  pointer-events: none;
}

.header-info {
  z-index: 1;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 15px;
}

.taiji-icon {
  font-size: 2.4rem;
  color: #f59e0b;
  animation: spinTaiji 12s linear infinite;
  display: inline-block;
  line-height: 1;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 2px;
  background: linear-gradient(to right, #ffffff 30%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.search-box {
  z-index: 1;
  width: 320px;
}

.custom-search :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: none !important;
  padding: 8px 16px;
}

.custom-search :deep(.el-input__inner) {
  color: white !important;
}

.custom-search :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.45);
}

.custom-search :deep(.el-input__icon) {
  color: rgba(255, 255, 255, 0.6);
}

/* 控制面板双栏 */
.control-row {
  margin-bottom: 24px;
  display: flex;
  align-items: stretch;
}

@keyframes spinTaiji {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

<style>
/* ==========================================================================
   全局传统地支掌诀弹窗样式 (Global Dialog Styles for append-to-body)
   ========================================================================== */
.traditional-hand-dialog {
  border-radius: 28px !important;
  background: rgba(255, 255, 255, 0.94) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.22) !important;
  overflow: hidden !important;
}

.traditional-hand-dialog .el-dialog__header {
  margin-right: 0 !important;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.08) !important;
  padding: 24px 24px 16px 24px !important;
}

.traditional-hand-dialog .el-dialog__title {
  font-weight: 900 !important;
  color: #0f172a !important;
  font-size: 20px !important;
  letter-spacing: 0.5px !important;
}

.traditional-hand-dialog .el-dialog__body {
  padding: 24px !important;
}

.dialog-img-container {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 20px !important;
}

.traditional-hand-img {
  max-width: 100% !important;
  max-height: 280px !important;
  border-radius: 20px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  border: 5px solid white !important;
  transition: all 0.4s ease !important;
}

.traditional-hand-img:hover {
  transform: scale(1.03) translateY(-2px) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
}

.traditional-hand-tip {
  font-size: 13.5px !important;
  line-height: 1.7 !important;
  color: #334155 !important;
  background: rgba(251, 191, 36, 0.06) !important;
  border: 1px solid rgba(251, 191, 36, 0.15) !important;
  padding: 18px !important;
  border-radius: 16px !important;
  text-align: justify !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

@media (max-width: 768px) {
  .practice-dictionary-view {
    padding: 10px;
  }
  
  /* 移动端三大手掌自适应优化 */
  .hand-outline {
    padding: 20px 10px 15px 10px !important;
    max-width: 340px !important;
  }
  .finger-joints-grid {
    gap: 8px !important;
  }
  .joint-cell {
    padding: 8px 4px !important;
    border-radius: 10px !important;
  }
  .joint-name {
    font-size: 15px !important;
  }
  .joint-pinyin {
    font-size: 9px !important;
    margin-top: 1px !important;
  }
  .joint-badge {
    font-size: 8px !important;
    padding: 1px 3px !important;
    margin-top: 2px !important;
  }
  .taiji-mini-spin {
    font-size: 24px !important;
  }
  .branch-detail-panel {
    padding: 15px !important;
    border-radius: 16px !important;
  }
  .zodiac-pic {
    width: 54px !important;
    height: 54px !important;
    font-size: 2rem !important;
  }
  .info-text h3 {
    font-size: 16px !important;
  }
}
</style>
