<template>
  <div class="luoshu-flying-stars-container glass-card">
    <!-- 面板头部，支持折叠 -->
    <div class="panel-header" @click="toggleCollapse" style="cursor: pointer;">
      <div class="header-left">
        <span class="taiji-badge animate-spin-slow">☯</span>
        <div class="title-meta">
          <h3 class="panel-title">洛书九宫飞星推演盘</h3>
          <span class="panel-subtitle">流年神煞 · 九运大盘 · 风水方位吉凶生克推演</span>
        </div>
      </div>
      <div class="header-right">
        <el-button type="primary" size="small" class="toggle-btn" text>
          {{ isCollapsed ? '点击展开推演盘' : '点击收起推演盘' }}
          <el-icon class="arrow-icon" :class="{ rotated: !isCollapsed }">
            <ArrowDown />
          </el-icon>
        </el-button>
      </div>
    </div>

    <!-- 折叠内容区域 -->
    <el-collapse-transition>
      <div v-show="!isCollapsed" class="panel-body">
        <el-row :gutter="24" class="layout-row">
          
          <!-- 左侧：参数控制与卦象解析 -->
          <el-col :xs="24" :md="10" class="control-column">
            <div class="control-box-inner">
              <div class="mode-tabs">
                <div 
                  class="mode-tab-item" 
                  :class="{ active: playMode === 'year' }" 
                  @click="changeMode('year')"
                >
                  🕒 流年飞星
                </div>
                <div 
                  class="mode-tab-item" 
                  :class="{ active: playMode === '运' }" 
                  @click="changeMode('运')"
                >
                  🌌 九紫离运
                </div>
                <div 
                  class="mode-tab-item" 
                  :class="{ active: playMode === 'manual' }" 
                  @click="changeMode('manual')"
                >
                  ✍️ 自由推演
                </div>
              </div>

              <!-- 模式表单 -->
              <div class="form-container">
                <!-- 流年模式 -->
                <div v-if="playMode === 'year'" class="form-group animate-fade-in-quick">
                  <div class="group-title">选择公历流年</div>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <el-select v-model="selectedYear" placeholder="请选择年份" style="flex: 1;">
                      <el-option 
                        v-for="y in yearOptions" 
                        :key="y" 
                        :label="`${y}年 (${getYearGanzhi(y)}年)`" 
                        :value="y" 
                      />
                    </el-select>
                    <el-button type="primary" @click="startDeduction" :loading="isAnimating">
                      开始推演
                    </el-button>
                  </div>
                  <div class="mode-desc">
                    ※ 自动根据三元九运历法，计算当年入中宫之飞星，并以顺飞轨迹排布九宫。
                  </div>
                </div>

                <!-- 九紫大运模式 -->
                <div v-if="playMode === '运'" class="form-group animate-fade-in-quick">
                  <div class="group-title">当前元运：三元九运 · 下元九运</div>
                  <div class="運-info-box">
                    <div class="運-badge">九紫离运 (2024 - 2043)</div>
                    <p class="運-para">
                      下元九运由<strong>九紫右弼星</strong>主事，五行属火。火运当值，代表着科技、变革、文化、美学及虚拟产业的全面升华。
                    </p>
                  </div>
                  <el-button type="primary" style="width: 100%;" @click="startDeduction" :loading="isAnimating">
                    生成九运大运盘
                  </el-button>
                </div>

                <!-- 手动自由推演 -->
                <div v-if="playMode === 'manual'" class="form-group animate-fade-in-quick">
                  <div class="group-title">配置手动参数</div>
                  <el-row :gutter="12" style="margin-bottom: 12px;">
                    <el-col :span="12">
                      <span class="label-txt">入中宫飞星：</span>
                      <el-select v-model="manualCenterStar" style="width: 100%;">
                        <el-option v-for="n in 9" :key="n" :label="`${n} - ${getStarShort(n)}`" :value="n" />
                      </el-select>
                    </el-col>
                    <el-col :span="12">
                      <span class="label-txt">飞行轨迹：</span>
                      <el-select v-model="manualDirection" style="width: 100%;">
                        <el-option label="顺飞 (递增)" value="forward" />
                        <el-option label="逆飞 (递减)" value="backward" />
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-button type="primary" style="width: 100%;" @click="startDeduction" :loading="isAnimating">
                    自由飞星排盘
                  </el-button>
                </div>
              </div>

              <!-- 选中的方位与生克解密 -->
              <div class="palace-details-panel">
                <div class="panel-section-title">
                  <span class="indicator-dot"></span>
                  方位吉凶与五行生克解密
                </div>

                <div v-if="selectedPalaceIndex !== null" class="details-content animate-fade-in-quick">
                  <div class="palace-meta-row">
                    <span class="palace-pos-badge">{{ currentPalace.position }}（{{ currentPalace.name }}）</span>
                    <span class="palace-el-tag" :class="currentPalace.element">五行属{{ currentPalace.element }}</span>
                    <span class="star-nature-badge" :class="currentStarInfo.nature">
                      {{ getStarShort(currentStarNum) }} ({{ currentStarInfo.nature }}星)
                    </span>
                  </div>

                  <h4 class="star-full-name">{{ currentStarNum }} · {{ currentStarInfo.fullName }}</h4>
                  
                  <div class="shengke-relation-box" :class="shengkeRelation.type">
                    <div class="relation-title">生克局势：{{ shengkeRelation.title }}</div>
                    <p class="relation-desc">{{ shengkeRelation.desc }}</p>
                  </div>

                  <div class="wind-water-guide">
                    <div class="guide-item">
                      <strong>🎯 流年影响：</strong>
                      <span>{{ currentStarInfo.detailDesc }}</span>
                    </div>
                    <div class="guide-item" style="margin-top: 8px;">
                      <strong>🛠️ 调和调理建议：</strong>
                      <span class="highlight-advice">{{ shengkeRelation.advice }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-detail-tip">
                  <el-icon><Pointer /></el-icon>
                  <span>请在右侧洛书盘中点击任意宫格，查看该方位的风水生克吉凶与开运建议。</span>
                </div>
              </div>

            </div>
          </el-col>

          <!-- 右侧：3D质感洛书飞星九宫格 -->
          <el-col :xs="24" :md="14" class="grid-column">
            <div class="grid-wrapper">
              <!-- 太极星空背景装饰 -->
              <div class="cosmos-bg">
                <div class="stars-particle"></div>
                <div class="taiji-watermark">☯</div>
              </div>

              <!-- 3x3 九宫格盘面 -->
              <div class="luoshu-grid">
                <div 
                  v-for="gridIdx in gridOrder" 
                  :key="gridIdx"
                  class="luoshu-cell"
                  :class="[
                    palaceConfigs[gridIdx].element,
                    { 
                      active: selectedPalaceIndex === gridIdx,
                      'animating-now': isAnimating && activeAnimIndex === gridIdx,
                      'anim-revealed': !isAnimating || animRevealedPalaces.includes(gridIdx)
                    }
                  ]"
                  @click="selectPalace(gridIdx)"
                >
                  <!-- 1. 顶角八卦方位 -->
                  <div class="cell-top-meta">
                    <span class="cell-position">{{ palaceConfigs[gridIdx].position }}</span>
                    <span class="cell-bagua">{{ getPalaceBagua(gridIdx) }}</span>
                  </div>

                  <!-- 2. 中间：洛书原始点图 (SVG绘制) -->
                  <div class="cell-dots-wrap">
                    <svg class="luoshu-dots-svg" viewBox="0 0 50 50">
                      <g v-if="palaceConfigs[gridIdx].originNum === 1">
                        <circle cx="25" cy="25" r="4" class="dot-white" />
                      </g>
                      <g v-else-if="palaceConfigs[gridIdx].originNum === 2">
                        <circle cx="15" cy="15" r="4" class="dot-black" />
                        <circle cx="35" cy="35" r="4" class="dot-black" />
                        <line x1="15" y1="15" x2="35" y2="35" class="dot-line" />
                      </g>
                      <g v-else-if="palaceConfigs[gridIdx].originNum === 3">
                        <circle cx="12" cy="12" r="4" class="dot-white" />
                        <circle cx="25" cy="25" r="4" class="dot-white" />
                        <circle cx="38" cy="38" r="4" class="dot-white" />
                        <line x1="12" y1="12" x2="38" y2="38" class="dot-line" />
                      </g>
                      <g v-else-if="palaceConfigs[gridIdx].originNum === 4">
                        <circle cx="15" cy="15" r="4" class="dot-black" />
                        <circle cx="35" cy="15" r="4" class="dot-black" />
                        <circle cx="15" cy="35" r="4" class="dot-black" />
                        <circle cx="35" cy="35" r="4" class="dot-black" />
                        <rect x="15" y="15" width="20" height="20" fill="none" class="dot-line" />
                      </g>
                      <g v-else-if="palaceConfigs[gridIdx].originNum === 5">
                        <circle cx="15" cy="15" r="4" class="dot-white" />
                        <circle cx="35" cy="15" r="4" class="dot-white" />
                        <circle cx="25" cy="25" r="4" class="dot-white" />
                        <circle cx="15" cy="35" r="4" class="dot-white" />
                        <circle cx="35" cy="35" r="4" class="dot-white" />
                        <line x1="15" y1="15" x2="35" y2="35" class="dot-line" />
                        <line x1="15" y1="35" x2="35" y2="15" class="dot-line" />
                      </g>
                      <g v-else-if="palaceConfigs[gridIdx].originNum === 6">
                        <circle cx="15" cy="10" r="4" class="dot-black" />
                        <circle cx="15" cy="25" r="4" class="dot-black" />
                        <circle cx="15" cy="40" r="4" class="dot-black" />
                        <circle cx="35" cy="10" r="4" class="dot-black" />
                        <circle cx="35" cy="25" r="4" class="dot-black" />
                        <circle cx="35" cy="40" r="4" class="dot-black" />
                        <line x1="15" y1="10" x2="15" y2="40" class="dot-line" />
                        <line x1="35" y1="10" x2="35" y2="40" class="dot-line" />
                      </g>
                      <g v-else-if="palaceConfigs[gridIdx].originNum === 7">
                        <circle cx="15" cy="12" r="4" class="dot-white" />
                        <circle cx="15" cy="25" r="4" class="dot-white" />
                        <circle cx="15" cy="38" r="4" class="dot-white" />
                        <circle cx="35" cy="12" r="4" class="dot-white" />
                        <circle cx="35" cy="25" r="4" class="dot-white" />
                        <circle cx="35" cy="38" r="4" class="dot-white" />
                        <circle cx="25" cy="25" r="4" class="dot-white" />
                        <line x1="15" y1="12" x2="15" y2="38" class="dot-line" />
                        <line x1="35" y1="12" x2="35" y2="38" class="dot-line" />
                      </g>
                      <g v-else-if="palaceConfigs[gridIdx].originNum === 8">
                        <rect x="12" y="12" width="26" height="26" fill="none" class="dot-line" />
                        <circle cx="12" cy="12" r="4" class="dot-black" />
                        <circle cx="25" cy="12" r="4" class="dot-black" />
                        <circle cx="38" cy="12" r="4" class="dot-black" />
                        <circle cx="12" cy="25" r="4" class="dot-black" />
                        <circle cx="38" cy="25" r="4" class="dot-black" />
                        <circle cx="12" cy="38" r="4" class="dot-black" />
                        <circle cx="25" cy="38" r="4" class="dot-black" />
                        <circle cx="38" cy="38" r="4" class="dot-black" />
                      </g>
                      <g v-else-if="palaceConfigs[gridIdx].originNum === 9">
                        <circle cx="12" cy="12" r="4" class="dot-white-red" />
                        <circle cx="25" cy="12" r="4" class="dot-white-red" />
                        <circle cx="38" cy="12" r="4" class="dot-white-red" />
                        <circle cx="12" cy="25" r="4" class="dot-white-red" />
                        <circle cx="25" cy="25" r="4" class="dot-white-red" />
                        <circle cx="38" cy="25" r="4" class="dot-white-red" />
                        <circle cx="12" cy="38" r="4" class="dot-white-red" />
                        <circle cx="25" cy="38" r="4" class="dot-white-red" />
                        <circle cx="38" cy="38" r="4" class="dot-white-red" />
                        <line x1="12" y1="12" x2="38" y2="12" class="dot-line-red" />
                        <line x1="12" y1="25" x2="38" y2="25" class="dot-line-red" />
                        <line x1="12" y1="38" x2="38" y2="38" class="dot-line-red" />
                      </g>
                    </svg>
                  </div>

                  <!-- 3. 当前飞到的飞星 (动画时渐进显现) -->
                  <div class="cell-star-area" :class="{ 'visible': !isAnimating || animRevealedPalaces.includes(gridIdx) }">
                    <span 
                      class="star-number-display" 
                      :class="[
                        getStarNature(getPalaceStarNum(gridIdx)),
                        getStarShortName(getPalaceStarNum(gridIdx))
                      ]"
                    >
                      {{ getPalaceStarNum(gridIdx) }}
                    </span>
                    <span class="star-name-display">{{ getStarShort(getPalaceStarNum(gridIdx)) }}</span>
                  </div>

                  <!-- 4. 底部原始洛书数标记 -->
                  <div class="cell-footer-num">
                    洛书: {{ palaceConfigs[gridIdx].originNum }}
                  </div>
                </div>
              </div>

              <!-- 动画轨迹连接线 (叠在最上层) -->
              <svg v-if="isAnimating" class="anim-track-overlay" viewBox="0 0 360 360">
                <defs>
                  <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#8b5cf6" />
                    <stop offset="50%" stop-color="#ec4899" />
                    <stop offset="100%" stop-color="#f59e0b" />
                  </linearGradient>
                  <filter id="glowFilter">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <!-- 绘制动态轨迹线 -->
                <path 
                  :d="animTrackPath" 
                  fill="none" 
                  stroke="url(#laserGrad)" 
                  stroke-width="3" 
                  filter="url(#glowFilter)"
                  class="laser-track-path"
                />
                <!-- 游走的光球粒子 -->
                <circle 
                  v-if="laserPoint" 
                  :cx="laserPoint.x" 
                  :cy="laserPoint.y" 
                  r="6" 
                  fill="#ffffff" 
                  filter="url(#glowFilter)"
                  class="laser-glow-point"
                />
              </svg>
            </div>
          </el-col>
          
        </el-row>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ArrowDown, Pointer } from '@element-plus/icons-vue'

// 展开/折叠状态
const isCollapsed = ref(true)

// 推演玩法模式：'year' | '运' | 'manual'
const playMode = ref('year')

// 当前选择的年份 (默认 2026 丙午年)
const selectedYear = ref(2026)

// 手动配置参数
const manualCenterStar = ref(5)
const manualDirection = ref('forward') // 'forward' | 'backward'

// 当前选中的九宫格索引 (0-8)
const selectedPalaceIndex = ref(null)

// 动画状态
const isAnimating = ref(false)
const activeAnimIndex = ref(-1) // 当前点亮的宫格 index
const animRevealedPalaces = ref([]) // 已经展示出来的宫格列表
const animStep = ref(0) // 0-8

// 下拉年份选项
const yearOptions = computed(() => {
  const currentY = new Date().getFullYear()
  const arr = []
  for (let y = currentY - 15; y <= currentY + 15; y++) {
    arr.push(y)
  }
  return arr
})

// 静态九宫格基本信息配置（按洛书轨迹顺序排列：中、乾、兑、艮、离、坎、坤、震、巽）
const palaceConfigs = [
  { id: 0, name: '中宫', position: '中宫', originNum: 5, element: '土', bagua: '太极' },
  { id: 1, name: '乾宫', position: '西北', originNum: 6, element: '金', bagua: '乾' },
  { id: 2, name: '兑宫', position: '正西', originNum: 7, element: '金', bagua: '兑' },
  { id: 3, name: '艮宫', position: '东北', originNum: 8, element: '土', bagua: '艮' },
  { id: 4, name: '离宫', position: '正南', originNum: 9, element: '火', bagua: '离' },
  { id: 5, name: '坎宫', position: '正北', originNum: 1, element: '水', bagua: '坎' },
  { id: 6, name: '坤宫', position: '西南', originNum: 2, element: '土', bagua: '坤' },
  { id: 7, name: '震宫', position: '正东', originNum: 3, element: '木', bagua: '震' },
  { id: 8, name: '巽宫', position: '东南', originNum: 4, element: '木', bagua: '巽' }
]

// 3x3 渲染时的九宫格排布（从左上到右下：巽、离、坤 / 震、中、兑 / 艮、坎、乾）
const gridOrder = [8, 4, 6, 7, 0, 2, 3, 5, 1]

// 9星特征库
const starsInfo = {
  1: { fullName: '一白贪狼星', element: '水', nature: '吉', detailDesc: '主官运、职位、考试、文昌、人缘桃花。2026年此星入中宫，代表全民在内心层面回归冷静、注重精神成长和人际关系的重塑。' },
  2: { fullName: '二黑巨门星', element: '土', nature: '凶', detailDesc: '病符星，主疾病、慢性伤痛、忧郁。此方宜静不宜动，忌黄、红色，防脾胃及皮肤疾患。' },
  3: { fullName: '三碧禄存星', element: '木', nature: '凶', detailDesc: '蚩尤星，主口舌是非、争斗诉讼、小人觊觎。此方不宜有过多绿色植物，忌木克土引起肝胆受制。' },
  4: { fullName: '四绿文曲星', element: '木', nature: '吉', detailDesc: '文昌星，主学业、名气、考试、文职晋升、灵感。此方位极佳，可摆放水生植物或四支毛笔催旺文运。' },
  5: { fullName: '五黄廉贞星', element: '土', nature: '凶', detailDesc: '灾厄星，又称五黄煞，为流年最凶之方位，极易感召意外、病灾、财运受挫。忌动土、忌红色。' },
  6: { fullName: '六白武曲星', element: '金', nature: '吉', detailDesc: '武曲星，主偏财、权力、军警武职、贵人提携、变动升迁。适合在此方位工作或布局金融开运物。' },
  7: { fullName: '七赤破军星', element: '金', nature: '凶', detailDesc: '退气星，主口舌、争执、破财、盗窃。不宜堆放杂物，应防范言行不当招致的金钱损失。' },
  8: { fullName: '八白左辅星', element: '土', nature: '吉', detailDesc: '左辅星，主财运、置业、薪资增长。虽在下元九运中气力稍退，但仍是代表稳定收益的正财大吉星。' },
  9: { fullName: '九紫右弼星', element: '火', nature: '吉', detailDesc: '喜庆星，在下元九运（2024-2043）中正值最旺的“当运旺星”，主桃花、喜事、婚姻、添丁、科技创新。此方位大吉，宜多见光点亮。' }
}

// 卦象名称转换
const getPalaceBagua = (idx) => {
  return palaceConfigs[idx].bagua
}

// 星名简写
const getStarShort = (num) => {
  const map = {
    1: '一白', 2: '二黑', 3: '三碧', 4: '四绿', 5: '五黄', 6: '六白', 7: '七赤', 8: '八白', 9: '九紫'
  }
  return map[num] || ''
}

// 星的吉凶属性
const getStarNature = (num) => {
  return starsInfo[num]?.nature === '吉' ? 'lucky' : 'unlucky'
}

// 星名称对应类名
const getStarShortName = (num) => {
  const map = {
    1: 'yibai', 2: 'erhei', 3: 'sanbi', 4: 'silu', 5: 'wuhuang', 6: 'liubai', 7: 'qichi', 8: 'babai', 9: 'jiuzi'
  }
  return map[num] || ''
}

// 计算某年份的天干地支
const getYearGanzhi = (year) => {
  const stems = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己']
  const branches = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未']
  const stem = stems[(year - 4) % 10]
  const branch = branches[(year - 4) % 12]
  return stem + branch
}

// 依据年份计算入中宫的星数字 (2000年后算法为 9 - (Year-2000)%9，并对结果归约至1-9)
const calculateYearCenterStar = (year) => {
  if (year >= 2000) {
    const diff = (year - 2000) % 9
    const res = (9 - diff) % 9
    return res === 0 ? 1 : res === 1 ? 9 : res === 2 ? 8 : res === 3 ? 7 : res === 4 ? 6 : res === 5 ? 5 : res === 6 ? 4 : res === 7 ? 3 : 2
  } else {
    // 1900 - 1999 年公式
    const diff = (1999 - year) % 9
    const res = (1 + diff) % 9
    return res === 0 ? 9 : res
  }
}

// 飞星中宫计算结果
const currentCenterStar = computed(() => {
  if (playMode.value === 'year') {
    return calculateYearCenterStar(selectedYear.value)
  } else if (playMode.value === '运') {
    return 9 // 九紫运以 9 入中宫
  } else {
    return manualCenterStar.value
  }
})

// 飞星顺逆方向
const currentDirection = computed(() => {
  if (playMode.value === 'year' || playMode.value === '运') {
    return 'forward' // 流年与元运统一为顺飞
  } else {
    return manualDirection.value
  }
})

// 核心：推导九个宫位对应的飞星值 (数组包含9个元素，index 0-8 分别对应 中、乾、兑、艮、离、坎、坤、震、巽)
const calculatedStars = computed(() => {
  const center = currentCenterStar.value
  const dir = currentDirection.value
  const stars = new Array(9)
  
  // 顺飞轨迹顺序：中宫(0) -> 乾(1) -> 兑(2) -> 艮(3) -> 离(4) -> 坎(5) -> 坤(6) -> 震(7) -> 巽(8)
  for (let i = 0; i < 9; i++) {
    let starNum
    if (dir === 'forward') {
      starNum = (center - 1 + i) % 9 + 1
    } else {
      starNum = (center - 1 - i + 18) % 9 + 1
    }
    stars[i] = starNum
  }
  return stars
})

// 获取某个宫格在当前状态下的飞星数字
const getPalaceStarNum = (idx) => {
  return calculatedStars.value[idx] || 5
}

// 选中的宫位数据
const currentPalace = computed(() => {
  if (selectedPalaceIndex.value === null) return null
  return palaceConfigs[selectedPalaceIndex.value]
})

// 选中的飞星数字
const currentStarNum = computed(() => {
  if (selectedPalaceIndex.value === null) return null
  return getPalaceStarNum(selectedPalaceIndex.value)
})

// 选中的星数据
const currentStarInfo = computed(() => {
  if (currentStarNum.value === null) return null
  return starsInfo[currentStarNum.value]
})

// 计算五行生克关系与开运解说
const shengkeRelation = computed(() => {
  if (selectedPalaceIndex.value === null || currentStarNum.value === null) return null
  
  const palaceEl = currentPalace.value.element
  const starEl = currentStarInfo.value.element
  const starName = getStarShort(currentStarNum.value)
  const isLucky = starsInfo[currentStarNum.value].nature === '吉'
  
  // 五行生克字典
  const relations = {
    // 同气比和
    '金金': { type: 'bihe', title: '金气齐聚，比和双旺', desc: `星属金，宫属金。双方五行相同，为比和格局。此方位金气充盈，肃杀之气与财气同在。` },
    '木木': { type: 'bihe', title: '木气生发，同心协力', desc: `星属木，宫属木。比和同气，此方气机活跃，主生机、成长与创新活力，但也需防木旺折断。` },
    '水水': { type: 'bihe', title: '双水交融，润下智谋', desc: `星属水，宫属水。水气激荡，思维极其活跃，极利于创意、玄学悟道，但也防波折浮沉。` },
    '火火': { type: 'bihe', title: '双火共燃，文明绚烂', desc: `星属火，宫属火。火势熊熊，极旺喜庆与声名，但气场燥烈，需注重谦逊平和。` },
    '土土': { type: 'bihe', title: '双土累积，厚德载物', desc: `星属土，宫属土。土气厚重安稳，代表根基牢固，但过于板结也易导致因循守旧、停滞不前。` },

    // 星生宫 (泄星)
    '金水': { type: 'star-sheng-palace', title: '金生水流，星力被泄', desc: `星属金，宫属水。金生水，星的力量泄入宫位。如果是吉星则吉力稍泄，凶星则凶性被化解泄去。` },
    '木火': { type: 'star-sheng-palace', title: '木旺生火，火势熊熊', desc: `星属木，宫属火。木生火，星生助宫位。火气大旺，如果是九紫火星飞入木宫，则是大吉；若凶星被泄亦是好事。` },
    '水木': { type: 'star-sheng-palace', title: '水润木长，生生不息', desc: `星属水，宫属木。水生木，星之力滋养宫位。文昌木星得到水润，能极大地激发学业和事业运。` },
    '火土': { type: 'star-sheng-palace', title: '火生土厚，生助燥烈', desc: `星属火，宫属土。火生土，星生助宫位。如果是五黄土煞或二黑病符飞临此土位，火会助长凶星的恶性，需要防范！` },
    '土金': { type: 'star-sheng-palace', title: '土里藏金，星力泄气', desc: `星属土，宫属金。土生金，星生助宫位。财星土气泄气于金位，吉力受阻，需用火或同属土的力量加持。` },

    // 宫生星 (星受生而旺)
    '水金': { type: 'palace-sheng-star', title: '金生水旺，源远流长', desc: `星属水，宫属金。金生水，宫位生助星宿。水星在此力量极其强劲，若为一白贪狼，则是桃花人缘极为旺盛之时。` },
    '火木': { type: 'palace-sheng-star', title: '木助火威，光耀门楣', desc: `星属火，宫属木。木生火，宫位生助星宿。九紫吉星得到东方木之生助，此方位喜庆连连，贵人频现。` },
    '木水': { type: 'palace-sheng-star', title: '水生木茂，吉星饱满', desc: `星属木，宫属水。水生木，宫生助星宿。四绿文昌或三碧凶星得到水生，力量充沛，文昌大吉，小人亦防。` },
    '土火': { type: 'palace-sheng-star', title: '火源源生土，吉凶倍增', desc: `星属土，宫属火。火生土，宫生助星宿。土星（八白、二黑、五黄）在此力量被宫位大大催旺，吉则大财，凶则大病。` },
    '金土': { type: 'palace-sheng-star', title: '土生金灿，财宝生光', desc: `星属金，宫属土。土生金，宫生助星宿。六白武曲、七赤破军在此受生，利在升职和权利增长，但也易防金旺伤人。` },

    // 星克宫 (战克，不稳)
    '金木': { type: 'star-ke-palace', title: '金刀伐木，星克宫位', desc: `星属金，宫属木。金克木，代表战克之象。宫位受克，主该方位所代表的人事容易发生变动、损伤和意外。` },
    '木土': { type: 'star-ke-palace', title: '木根扎土，宫位受制', desc: `星属木，宫属土。木克土，星克宫位。若八白财星土受克，则代表求财艰难，财气受堵，需以火通关化解。` },
    '水火': { type: 'star-ke-palace', title: '水火相激，战克之局', desc: `星属水，宫属火。水克火，水火不容。此方位多是非口舌，运势动荡起伏，家庭成员关系易生焦躁摩擦。` },
    '火金': { type: 'star-ke-palace', title: '烈火炼金，金受销熔', desc: `星属火，宫属金。火克金，星克宫位。西北乾金受克，对家中长辈或行政管理不利，需用水润通关。` },
    '土水': { type: 'star-ke-palace', title: '土挡水流，水利受阻', desc: `星属土，宫属水。土克水，水受泥沙之浊。一白水星受克，代表桃花及思考力受阻，易判断失误。` },

    // 宫克星 (反克，星受制)
    '木金': { type: 'palace-ke-star', title: '金克木星，星宿折翼', desc: `星属木，宫属金。金反克木，木星（四绿、三碧）被宫位克制。四绿文昌吉星若受克，对求学求职将大打折扣。` },
    '土木': { type: 'palace-ke-star', title: '木克土星，土星被囚', desc: `星属土，宫属木。木反克土。五黄、二黑凶星如果飞到木宫（震、巽），会被木克制囚禁，凶星威力被削减，是为吉兆。` },
    '水火': { type: 'palace-ke-star', title: '火克水星，星力消散', desc: `星属水，宫属火。火克水，水反受克。一白星在此难以显威，容易精力透支。` },
    '金火': { type: 'palace-ke-star', title: '火反克金，金星受熔', desc: `星属金，宫属火。火克金，六白、七赤在此被离火熔炼，偏财运受动荡，易遭破财口舌。` },
    '水土': { type: 'palace-ke-star', title: '土克水星，星陷淤泥', desc: `星属水，宫属土。土克水，一白水星受到艮、坤土克，主贵人受阻，行事拖延不畅。` }
  }

  const key = starEl + palaceEl
  const rel = relations[key] || { type: 'normal', title: '五行相生相伴', desc: '星宫气场融合，无明显战克之象。' }

  // 动态解算生克避凶调和药方
  let advice = '气场和谐，保持整洁开朗即可。'
  if (starName === '五黄' && palaceEl === '火') {
    advice = '【极度警惕】火生土（宫生星），助长了五黄大煞的毒性！正南方流年大凶，绝对不可动土、装修，可在此位挂一串纯铜的“六帝钱”或摆放铜制“风水葫芦”，以金泄去土气，使火生土、土生金，转危为安。'
  } else if (starName === '五黄') {
    advice = '五黄大煞降临，最忌动土和红色。建议在方位放置重金属工艺摆件（如铜麒麟、纯铜金蟾）以金泄土气，并保持此方位光线柔和安宁。'
  } else if (starName === '二黑' && palaceEl === '火') {
    advice = '火生土助病符星。必须在此方避免过多红色装饰，挂金属风铃或六帝铜钱以化泄二黑病符的土气，保障家人脾胃健康。'
  } else if (starName === '八白' && palaceEl === '木') {
    advice = '八白财星（土）受到木宫克制（木克土，财星被夺）。建议在此方位摆放一盏暖光台灯或红色挂饰（火），使木生火、火生土，以火化敌为友，畅通求财路径。'
  } else if (starName === '一白' && palaceEl === '土') {
    advice = '一白水星（桃花、人缘）受土克制。可以在此方摆放铜质摆件（金）进行生水，形成土生金、金生水的顺畅生局，催旺人际桃花。'
  } else if (starName === '四绿' && palaceEl === '金') {
    advice = '文昌木星受金宫克（金克木）。可在此方位养四支富贵竹（水），以水通关，金生水、水生木，可使文昌星力大放异彩。'
  } else if (rel.type.includes('ke')) {
    // 通用战克化解建议
    if (palaceEl === '金' && starEl === '木') advice = '金克木，宜用水（黑、蓝色）饰品进行缓冲，金生水、水生木以解战克。'
    else if (palaceEl === '木' && starEl === '土') advice = '木克土，宜用火（红、粉色或长明灯）进行缓冲，木生火、火生土通关。'
    else if (palaceEl === '水' && starEl === '火') advice = '水克火，宜用木（绿植、木雕）缓冲，水生木、木生火，化解口舌。'
    else if (palaceEl === '火' && starEl === '金') advice = '火克金，宜用土（陶器、黄色摆件）缓冲，火生土、土生金，财库稳固。'
    else if (palaceEl === '土' && starEl === '水') advice = '土克水，宜用金（铜风铃、白瓷）缓冲，土生金、金生水，开泰财源。'
  } else if (isLucky) {
    advice = `此方飞入${starName}吉星，星宫相生，运势极佳。宜保持采光充足，可在此方常驻办公或休养，摆放绿植或水晶球以生助吉气。`
  } else {
    advice = `此方飞入${starName}凶星，但星宫有情克泄适度，凶力已被抵消部分。只需保持此方位干净整洁、不堆积杂物即可保平安。`
  }

  return {
    type: rel.type,
    title: rel.title,
    desc: rel.desc,
    advice: advice
  }
})

// 改变玩法模式
const changeMode = (mode) => {
  if (isAnimating.value) return
  playMode.value = mode
  selectedPalaceIndex.value = null
  animRevealedPalaces.value = [0, 1, 2, 3, 4, 5, 6, 7, 8] // 静态切换时默认全部展示
}

// 展开/折叠切换
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  if (!isCollapsed.value && selectedPalaceIndex.value === null) {
    // 首次展开时，执行一次推演动画以烘托视觉
    startDeduction()
  }
}

// 选择某一个宫格
const selectPalace = (idx) => {
  if (isAnimating.value) return
  selectedPalaceIndex.value = idx
}

// SVG 动效轨迹各点在 viewBox (0 - 360) 下的 2D 坐标
// 3x3 布局格子的行列中心坐标如下（以 360 x 360 SVG画布而言）
// 第一行（巽 8, 离 4, 坤 6）： (60, 60),  (180, 60),  (300, 60)
// 第二行（震 7, 中 0, 兑 2）： (60, 180), (180, 180), (300, 180)
// 第三行（艮 3, 坎 5, 乾 1）： (60, 300), (180, 300), (300, 300)
const palaceCoords = {
  0: { x: 180, y: 180 }, // 中宫
  1: { x: 300, y: 300 }, // 乾 (西北)
  2: { x: 300, y: 180 }, // 兑 (正西)
  3: { x: 60,  y: 300 }, // 艮 (东北)
  4: { x: 180, y: 60  }, // 离 (正南)
  5: { x: 180, y: 300 }, // 坎 (正北)
  6: { x: 300, y: 60  }, // 坤 (西南)
  7: { x: 60,  y: 180 }, // 震 (正东)
  8: { x: 60,  y: 60  }  // 巽 (东南)
}

// 动画飞星轨迹路径 (中宫0 -> 乾1 -> 兑2 -> 艮3 -> 离4 -> 坎5 -> 坤6 -> 震7 -> 巽8)
const animTrackOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8]
const backwardTrackOrder = [0, 8, 7, 6, 5, 4, 3, 2, 1] // 逆飞轨迹

const activeTrackOrder = computed(() => {
  return currentDirection.value === 'forward' ? animTrackOrder : backwardTrackOrder
})

// 生成 SVG 贝塞尔曲线或折线路径
const animTrackPath = computed(() => {
  const order = activeTrackOrder.value
  let pathStr = ''
  // 仅绘制到当前已经执行动画到的步数
  for (let i = 0; i <= animStep.value && i < 9; i++) {
    const pt = palaceCoords[order[i]]
    if (i === 0) {
      pathStr += `M ${pt.x} ${pt.y}`
    } else {
      // 采用稍微弯曲的贝塞尔曲线让线条更优雅流动，也可以直接折线
      const prevPt = palaceCoords[order[i - 1]]
      const cx = (prevPt.x + pt.x) / 2 + (pt.y - prevPt.y) * 0.15
      const cy = (prevPt.y + pt.y) / 2 - (pt.x - prevPt.x) * 0.15
      pathStr += ` Q ${cx} ${cy} ${pt.x} ${pt.y}`
    }
  }
  return pathStr
})

// 光球粒子的当前物理坐标
const laserPoint = ref(null)

// 启动洛书飞星动画推演
const startDeduction = () => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  selectedPalaceIndex.value = null
  animRevealedPalaces.value = []
  animStep.value = 0
  activeAnimIndex.value = activeTrackOrder.value[0]
  
  // 第一步立即亮起中宫
  animRevealedPalaces.value.push(activeTrackOrder.value[0])
  laserPoint.value = { ...palaceCoords[activeTrackOrder.value[0]] }

  let step = 0
  const intervalTime = 400 // 每隔 400ms 飞向下一个宫位

  const runStep = () => {
    if (step >= 8) {
      // 动画结束，默认点亮中宫作为选中解析
      setTimeout(() => {
        isAnimating.value = false
        activeAnimIndex.value = -1
        selectedPalaceIndex.value = 0 // 默认选择中宫展示解析
      }, 300)
      return
    }
    
    step++
    animStep.value = step
    const nextPalaceIdx = activeTrackOrder.value[step]
    activeAnimIndex.value = nextPalaceIdx
    
    // 平滑插值计算出光球移动轨迹 (让光球飞过去)
    const startPt = palaceCoords[activeTrackOrder.value[step - 1]]
    const endPt = palaceCoords[nextPalaceIdx]
    let progress = 0
    const duration = 250 // 光球飞行时长 ms
    const frames = 15
    const stepTime = duration / frames
    
    const animatePoint = () => {
      progress += 1 / frames
      if (progress >= 1) {
        laserPoint.value = { ...endPt }
        animRevealedPalaces.value.push(nextPalaceIdx)
        // 下一步
        setTimeout(runStep, intervalTime - duration)
      } else {
        laserPoint.value = {
          x: startPt.x + (endPt.x - startPt.x) * progress,
          y: startPt.y + (endPt.y - startPt.y) * progress
        }
        setTimeout(animatePoint, stepTime)
      }
    }
    animatePoint()
  }

  setTimeout(runStep, intervalTime)
}

// 自动监听年份变化重置
watch(selectedYear, () => {
  if (playMode.value === 'year') {
    selectedPalaceIndex.value = null
    animRevealedPalaces.value = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  }
})

// 挂载时初始化一次
onMounted(() => {
  animRevealedPalaces.value = [0, 1, 2, 3, 4, 5, 6, 7, 8]
})
</script>

<style scoped>
/* 容器及基础样式 */
.luoshu-flying-stars-container {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;
}

.luoshu-flying-stars-container:hover {
  border-color: rgba(99, 102, 241, 0.25);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.08);
}

/* 面板头部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.taiji-badge {
  font-size: 24px;
  color: #4f46e5;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.15));
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: inset 0 0 8px rgba(99, 102, 241, 0.2);
}

.animate-spin-slow {
  animation: spin 10s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.title-meta {
  display: flex;
  flex-direction: column;
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.panel-subtitle {
  font-size: 11.5px;
  color: #64748b;
  margin-top: 2px;
}

.arrow-icon {
  transition: transform 0.3s;
  margin-left: 4px;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

/* 面板展开内容 */
.panel-body {
  padding-top: 20px;
}

.layout-row {
  align-items: stretch;
}

/* 左侧控制栏 */
.control-column {
  display: flex;
  flex-direction: column;
}

.control-box-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mode-tabs {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 16px;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.mode-tab-item {
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  padding: 8px 0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-tab-item.active {
  background: #ffffff;
  color: #4f46e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.form-container {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 14px;
  border: 1px solid rgba(0, 0, 0, 0.02);
  margin-bottom: 16px;
}

.group-title {
  font-size: 12.5px;
  font-weight: 800;
  color: #334155;
  margin-bottom: 10px;
}

.mode-desc {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 8px;
  line-height: 1.4;
}

.label-txt {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 4px;
  display: block;
}

/* 九运大盘特殊样式 */
.運-info-box {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.04), rgba(245, 158, 11, 0.04));
  border: 1px dashed rgba(239, 68, 68, 0.15);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
}

.運-badge {
  display: inline-block;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 6px;
}

.運-para {
  margin: 0;
  font-size: 11.5px;
  color: #475569;
  line-height: 1.5;
}

/* 解密看板 */
.palace-details-panel {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(99, 102, 241, 0.08);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-section-title {
  font-size: 13px;
  font-weight: bold;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  padding-bottom: 8px;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  background: #4f46e5;
  border-radius: 50%;
  box-shadow: 0 0 8px #4f46e5;
}

.empty-detail-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
  gap: 10px;
  flex: 1;
  padding: 20px 0;
}

.empty-detail-tip .el-icon {
  font-size: 20px;
  color: #cbd5e1;
}

.palace-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.palace-pos-badge {
  background: #f1f5f9;
  color: #334155;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 6px;
}

.palace-el-tag {
  font-size: 11px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 6px;
}

.palace-el-tag.金 { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.palace-el-tag.木 { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
.palace-el-tag.水 { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.palace-el-tag.火 { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.palace-el-tag.土 { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }

.star-nature-badge {
  font-size: 11px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 6px;
}

.star-nature-badge.吉 { background: #f0fdf4; color: #15803d; }
.star-nature-badge.凶 { background: #fff5f5; color: #e11d48; }

.star-full-name {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

/* 生克盒子样式 */
.shengke-relation-box {
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-left: 4px solid #cbd5e1;
}

.shengke-relation-box.bihe { background: rgba(99, 102, 241, 0.03); border-left-color: #6366f1; }
.shengke-relation-box.star-sheng-palace { background: rgba(16, 185, 129, 0.03); border-left-color: #10b981; }
.shengke-relation-box.palace-sheng-star { background: rgba(59, 130, 246, 0.03); border-left-color: #3b82f6; }
.shengke-relation-box.star-ke-palace { background: rgba(244, 63, 94, 0.03); border-left-color: #f43f5e; }
.shengke-relation-box.palace-ke-star { background: rgba(245, 158, 11, 0.03); border-left-color: #f59e0b; }

.relation-title {
  font-size: 12px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 4px;
}

.relation-desc {
  margin: 0;
  font-size: 11.5px;
  color: #475569;
  line-height: 1.4;
}

.wind-water-guide {
  font-size: 11.5px;
  line-height: 1.5;
  color: #475569;
}

.highlight-advice {
  color: #b45309;
  font-weight: bold;
  background: #fffbeb;
  padding: 2px 4px;
  border-radius: 4px;
}

/* 右侧九宫格盘面 */
.grid-column {
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-wrapper {
  position: relative;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle at 50% 50%, #1e1e38, #0e0e18);
  border-radius: 24px;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), inset 0 0 30px rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

/* 太极星宿图装饰 */
.cosmos-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.15;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stars-particle {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(1px 1px at 40px 60px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 120px 240px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 280px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 200px 300px, #fff, rgba(0,0,0,0));
  background-repeat: repeat;
}

.taiji-watermark {
  font-size: 260px;
  color: rgba(99, 102, 241, 0.15);
  user-select: none;
}

/* 九宫格 Grid 排布 */
.luoshu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

/* 单个九宫格单元 */
.luoshu-cell {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.luoshu-cell:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.luoshu-cell.active {
  background: rgba(99, 102, 241, 0.08) !important;
  border-color: rgba(99, 102, 241, 0.6) !important;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.25), inset 0 0 10px rgba(99, 102, 241, 0.15);
}

.luoshu-cell.animating-now {
  background: rgba(236, 72, 153, 0.15) !important;
  border-color: #ec4899 !important;
  box-shadow: 0 0 20px #ec4899, inset 0 0 10px #ec4899;
}

/* 各五行底色调和 */
.luoshu-cell.金 { border-bottom: 2px solid rgba(226, 232, 240, 0.2); }
.luoshu-cell.木 { border-bottom: 2px solid rgba(16, 185, 129, 0.2); }
.luoshu-cell.水 { border-bottom: 2px solid rgba(59, 130, 246, 0.2); }
.luoshu-cell.火 { border-bottom: 2px solid rgba(239, 68, 68, 0.2); }
.luoshu-cell.土 { border-bottom: 2px solid rgba(245, 158, 11, 0.2); }

/* 元件结构 */
.cell-top-meta {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.cell-position {
  font-size: 10px;
  color: #94a3b8;
  font-weight: bold;
}

.cell-bagua {
  font-size: 10px;
  color: #38bdf8;
  font-weight: bold;
}

/* 原始洛书点图 */
.cell-dots-wrap {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.35;
  transition: opacity 0.3s;
}

.luoshu-cell:hover .cell-dots-wrap {
  opacity: 0.65;
}

.luoshu-dots-svg {
  height: 100%;
}

.dot-white {
  fill: #f8fafc;
  stroke: rgba(255, 255, 255, 0.4);
  stroke-width: 1;
}

.dot-black {
  fill: #475569;
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 1;
}

.dot-white-red {
  fill: #f43f5e;
  stroke: rgba(244, 63, 94, 0.4);
  stroke-width: 1;
}

.dot-line {
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 1;
  stroke-dasharray: 1, 1;
}

.dot-line-red {
  stroke: rgba(244, 63, 94, 0.25);
  stroke-width: 1;
  stroke-dasharray: 1, 1;
}

/* 飞星显示区域 */
.cell-star-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 2px 0;
  opacity: 0;
  transform: scale(0.7);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.cell-star-area.visible {
  opacity: 1;
  transform: scale(1);
}

.star-number-display {
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
  font-family: 'Outfit', sans-serif;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

/* 针对不同星发光不同 */
.star-number-display.yibai { color: #3b82f6; text-shadow: 0 0 12px rgba(59, 130, 246, 0.6); }
.star-number-display.erhei { color: #8a8d91; text-shadow: 0 0 12px rgba(138, 141, 145, 0.4); }
.star-number-display.sanbi { color: #059669; text-shadow: 0 0 12px rgba(5, 150, 105, 0.6); }
.star-number-display.silu { color: #10b981; text-shadow: 0 0 12px rgba(16, 185, 129, 0.6); }
.star-number-display.wuhuang { color: #ef4444; text-shadow: 0 0 15px rgba(239, 68, 68, 0.8); }
.star-number-display.liubai { color: #ffffff; text-shadow: 0 0 12px rgba(255, 255, 255, 0.8); }
.star-number-display.qichi { color: #94a3b8; text-shadow: 0 0 10px rgba(148, 163, 184, 0.4); }
.star-number-display.babai { color: #f59e0b; text-shadow: 0 0 15px rgba(245, 158, 11, 0.8); }
.star-number-display.jiuzi { color: #c084fc; text-shadow: 0 0 15px rgba(192, 132, 252, 0.8); }

.star-name-display {
  font-size: 11.5px;
  font-weight: bold;
  color: #e2e8f0;
}

.cell-footer-num {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.15);
  text-align: right;
  width: 100%;
}

/* 轨迹覆盖层 */
.anim-track-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.laser-track-path {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: drawLine 2s forwards ease-in-out;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

.laser-glow-point {
  box-shadow: 0 0 15px #fff;
}

/* 渐显动画 */
.animate-fade-in-quick {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 移动自适应 */
@media (max-width: 768px) {
  .luoshu-flying-stars-container {
    padding: 14px;
  }
  .layout-row {
    flex-direction: column-reverse; /* 手机端表盘在上，控制台在下 */
  }
  .grid-column {
    margin-bottom: 20px;
  }
  .grid-wrapper {
    width: 290px;
    height: 290px;
  }
  .taiji-watermark {
    font-size: 200px;
  }
  .cell-dots-wrap {
    height: 18px;
  }
  .star-number-display {
    font-size: 20px;
  }
  .star-name-display {
    font-size: 10px;
  }
}
</style>
