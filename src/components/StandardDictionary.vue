<template>
  <div class="glass-card tables-section-card">
    <el-tabs :model-value="activeTableTab" @update:model-value="$emit('update:activeTableTab', $event)" class="custom-tabs dictionary-tabs">
      <!-- 表三：八卦 -->
      <el-tab-pane name="bagua">
        <template #label>
          <span class="tab-label-custom">
            <span class="tab-badge-num">8</span>
            <span>八卦</span>
          </span>
        </template>

        <div class="table-intro">
          这是梅花易数算法里最关键的"解密密钥"，算出的余数直接对应这 8 个卦。如果计算结果整除，余数 is 0，映射中直接当作 8（坤卦）来用。
        </div>

        <div class="bagua-grid">
          <div
            v-for="item in filteredBagua"
            :key="item.id"
            class="bagua-card-item"
            :class="['gua-bg-' + item.id, { highlighted: guaResult.id === item.id }]"
            @click="$emit('update:inputNumber', item.id)"
          >
            <div class="gua-id-badge">{{ item.id === 8 ? '8 / 0' : item.id }}</div>
            <div class="gua-header-row" style="display: flex; align-items: center; gap: 16px;">
              <div class="gua-symbol-large" style="margin-top: -4px;">{{ item.trigram }}</div>
              <div class="gua-meta">
                <h3 style="font-size: 18px; font-weight: 800; color: #1e293b; margin: 0;">{{ item.name }}卦 ({{ item.pinyin }})</h3>
                <div class="gua-nature-row" style="font-size: 12px; color: #64748b; display: flex; gap: 16px; margin-top: 6px; flex-wrap: wrap;">
                  <span>意象：<span style="color: #334155; font-weight: 600;">{{ item.nature }}</span></span>
                  <span>五行：<span :style="{ color: item.element === '金' ? '#71717a' : item.element === '木' ? '#10b981' : item.element === '水' ? '#3b82f6' : item.element === '火' ? '#ef4444' : '#d97706', fontWeight: '600' }">{{ item.element }}</span></span>
                  <span>方位：<span style="color: #3b82f6; font-weight: 600;">{{ item.direction }}</span></span>
                </div>
              </div>
            </div>
            <div class="gua-code-detail" style="margin-top: 4px;">{{ item.code }}</div>
            <div class="gua-extended-desc" style="font-size: 12px; line-height: 1.5; color: #475569; margin-top: 4px;">
              <strong>象解：</strong>{{ getGuaExtendedDesc(item.id) }}
            </div>
          </div>
          <el-empty v-if="filteredBagua.length === 0" description="没有找到匹配的八卦信息" />
        </div>
      </el-tab-pane>

      <!-- 10天干基础映射表 -->
      <el-tab-pane name="stems">
        <template #label>
          <span class="tab-label-custom">
            <span class="tab-badge-num">10</span>
            <span>10天干</span>
          </span>
        </template>
        <div class="table-intro">注：天干代表天之气，共有十个，循环往复。它们分别对应着不同的阴阳五行属性和物象。</div>
        <div class="stems-grid">
          <div v-for="item in heavenlyStemsList" :key="item.id" class="branch-card-item" :class="[item.element, { highlighted: activeStem === item.name }]" @click="$emit('update:activeStem', item.name)">
            <div class="item-id-badge">ID: {{ item.id }}</div>
            <div class="item-main-row">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-pinyin">({{ item.pinyin }})</span>
              <span class="item-zodiac-tag" :style="{ background: item.polar === '阳' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(244, 63, 94, 0.08)', color: item.polar === '阳' ? '#4f46e5' : '#e11d48' }">{{ item.polar }}</span>
            </div>
            <div class="item-details-row">
              <div class="detail-sub"><span class="lbl">五行:</span><span class="val bold-val" :class="item.element">{{ item.elementName }}</span></div>
            </div>
            <div class="item-desc-bubble">{{ item.desc }}</div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 12地支基础映射表 -->
      <el-tab-pane name="branches">
        <template #label>
          <span class="tab-label-custom">
            <span class="tab-badge-num">12</span>
            <span>12地支</span>
          </span>
        </template>
        <div class="table-intro">注：这里的月份是农历。古人认为正月（一月）是一年的开始，对应的是"寅"。</div>
        <div class="branches-grid">
          <div v-for="item in filteredBranches" :key="item.id" class="branch-card-item" :class="[item.element, { highlighted: simulatedBranchName === item.name }]" @click="$emit('select-branch', item.name)">
            <div class="item-id-badge">ID: {{ item.id }}</div>
            <div class="item-main-row">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-pinyin">({{ item.pinyin }})</span>
              <span class="item-zodiac-tag">{{ item.zodiac }}</span>
            </div>
            <div class="item-details-row">
              <div class="detail-sub"><span class="lbl">月份:</span><span class="val">{{ item.month }}</span></div>
              <div class="detail-sub"><span class="lbl">能量:</span><span class="val bold-val" :class="item.element">{{ item.elementName }}</span></div>
            </div>
            <div class="item-desc-bubble">{{ item.elementDesc }}</div>
          </div>
          <el-empty v-if="filteredBranches.length === 0" description="没有找到匹配的地支信息" />
        </div>
      </el-tab-pane>

      <!-- 24小时与时辰映射表 -->
      <el-tab-pane name="hours">
        <template #label>
          <span class="tab-label-custom">
            <span class="tab-badge-num">24</span>
            <span>24小时与时辰</span>
          </span>
        </template>
        <div class="table-intro">古人把一天 24 小时平均分成了 12 个时辰，每个时辰跨度为 2 小时。</div>
        <div class="hours-grid">
          <div v-for="item in filteredHours" :key="item.id" class="hour-grid-item" :class="{ highlighted: simulatedBranchName === item.name }" @click="$emit('select-branch', item.name)">
            <div class="hour-time-header">{{ item.timeSpan }}</div>
            <div class="hour-main-row">
              <span class="hour-title">{{ item.name }}时</span>
              <span class="hour-zodiac-tag">{{ getBranchZodiac(item.name) }}</span>
            </div>
            <div class="hour-badge-row"><el-tag size="small" type="warning" effect="dark">ID: {{ item.id }}</el-tag></div>
            <div class="hour-slogan-box">{{ item.rhyme }}</div>
          </div>
          <el-empty v-if="filteredHours.length === 0" description="没有找到匹配的时辰时间信息" />
        </div>
      </el-tab-pane>

      <!-- 八卦方位图 -->
      <el-tab-pane name="diagram">
        <template #label>
          <span class="tab-label-custom">
            <span class="tab-badge-num">☯</span>
            <span>八卦方位图</span>
          </span>
        </template>
        <div class="table-intro">先天八卦方位基于"天南地北"的宇宙空间法则（上南下北，左东右西）。点击八卦扇区可直接同步左上方的起卦余数。</div>
        <div class="diagram-tab-wrapper">
          <div class="bagua-plate-col">
            <div class="bagua-plate-outer-container">
              <svg viewBox="0 0 400 400" class="bagua-svg" :class="{ 'spinning-slowly': autoRotatePlate }">
                <polygon points="127.3,24.5 272.7,24.5 375.5,127.3 375.5,272.7 272.7,375.5 127.3,375.5 24.5,272.7 24.5,127.3" class="bagua-octagon-border" />
                <polygon points="161.7,107.6 238.3,107.6 292.4,161.7 292.4,238.3 238.3,292.4 161.7,292.4 107.6,238.3 107.6,161.7" class="bagua-octagon-inner" />
                <circle cx="200" cy="200" r="50" class="bagua-center-circle" />
                <g v-for="item in diagramTrigrams" :key="item.id" :transform="`rotate(${item.angle}, 200, 200)`" class="bagua-sector-group" :class="{ active: inputNumber === item.id || hoveredTrigramId === item.id }" @click="onSelectBaguaFromDiagram(item)" @mouseenter="hoveredTrigramId = item.id" @mouseleave="hoveredTrigramId = null">
                  <path d="M 131.1 33.7 A 180 180 0 0 1 268.9 33.7 L 219.1 153.8 A 50 50 0 0 0 180.9 153.8 Z" class="wedge-bg" :style="{ '--hover-color': item.color }" />
                  <line x1="238.3" y1="107.6" x2="270.8" y2="29.1" class="radial-line" />
                  <text x="200" y="70" class="trigram-symbol" :fill="item.color">{{ item.symbol }}</text>
                  <text x="200" y="32" class="trigram-direction-eng" :fill="item.color">{{ item.direction }}</text>
                </g>
                <g class="taiji-center-group">
                  <path d="M 200 150 A 50 50 0 0 0 200 250 A 25 25 0 0 0 200 200 A 25 25 0 0 1 200 150" fill="#1e1b4b" />
                  <path d="M 200 150 A 50 50 0 0 1 200 250 A 25 25 0 0 0 200 200 A 25 25 0 0 1 200 150" fill="#fffbeb" />
                  <circle cx="200" cy="175" r="7" fill="#1e1b4b" />
                  <circle cx="200" cy="225" r="7" fill="#fffbeb" />
                </g>
                <g v-for="item in diagramTrigrams" :key="'text-' + item.id" class="bagua-name-static" :class="{ active: inputNumber === item.id || hoveredTrigramId === item.id }" :style="{ '--active-color': item.color }" @click="onSelectBaguaFromDiagram(item)" @mouseenter="hoveredTrigramId = item.id" @mouseleave="hoveredTrigramId = null">
                  <text :x="getStaticTextX(item.angle)" :y="getStaticTextY(item.angle)" text-anchor="middle" dominant-baseline="central" class="trigram-chinese-char" :fill="item.color">{{ item.name }}</text>
                </g>
              </svg>
            </div>
            <div class="rotate-control-bar">
              <el-switch v-model="autoRotatePlate" active-text="开启太极盘慢旋转" inactive-text="静止盘面" inline-prompt style="--el-switch-on-color: #6366f1; --el-switch-off-color: #94a3b8;" />
              <span class="control-tip">* 鼠标悬浮在盘面上时会自动暂停旋转，方便准确点击。</span>
            </div>
          </div>
          <div class="bagua-info-col">
            <div class="glass-card hologram-gua-detail" :style="{ '--detail-theme-color': currentDetailGua.color }">
              <div class="hologram-header">
                <div class="hologram-symbol-box"><span class="symbol-large animate-breath">{{ currentDetailGua.symbol }}</span></div>
                <div class="hologram-title-box">
                  <h2 class="gua-fullname">{{ currentDetailGua.name }}卦 ({{ currentDetailGua.pinyin }})</h2>
                  <div class="gua-meta-badges">
                    <el-tag size="small" effect="dark" :color="currentDetailGua.color" style="border: none;">五行：{{ getGuaElementCN(currentDetailGua.nature) }} ({{ currentDetailGua.nature }})</el-tag>
                    <el-tag size="small" type="warning" effect="plain" class="gua-val-badge">起卦数：{{ currentDetailGua.id }}</el-tag>
                  </div>
                </div>
              </div>
              <div class="hologram-body">
                <div class="hologram-info-grid">
                  <div class="grid-item"><span class="grid-label">自然意象</span><strong class="grid-value">{{ currentDetailGua.symbolNature }}</strong></div>
                  <div class="grid-item"><span class="grid-label">宇宙方位</span><strong class="grid-value">{{ currentDetailGua.direction }} ({{ currentDetailGua.engDir }})</strong></div>
                  <div class="grid-item"><span class="grid-label">代号编码</span><strong class="grid-value">{{ currentDetailGua.code }}</strong></div>
                </div>
                <div class="hologram-description-section">
                  <h4>卦义象解</h4>
                  <p class="gua-meaning-desc">{{ getGuaExtendedDesc(currentDetailGua.id) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  activeTableTab: { type: String, required: true },
  activeStem: { type: String, required: true },
  inputNumber: { type: Number, required: true },
  searchQuery: { type: String, default: '' },
  guaResult: { type: Object, required: true },
  simulatedBranchName: { type: String, required: true },
  diagramTrigrams: { type: Array, required: true },
  heavenlyStemsList: { type: Array, required: true },
  baguaList: { type: Array, required: true },
  branchesList: { type: Array, required: true },
  hoursList: { type: Array, required: true }
})

const emit = defineEmits([
  'update:activeTableTab',
  'update:activeStem',
  'update:inputNumber',
  'select-branch'
])

const autoRotatePlate = ref(false)
const hoveredTrigramId = ref(null)

const onSelectBaguaFromDiagram = (item) => {
  emit('update:inputNumber', item.id)
}

const getBranchZodiac = (branchName) => {
  const match = props.branchesList.find(b => b.name === branchName)
  return match ? `${match.zodiacEmoji} ${match.zodiac}` : ''
}

const filteredBranches = computed(() => {
  const q = props.searchQuery.trim().toLowerCase()
  if (!q) return props.branchesList
  return props.branchesList.filter(item => item.name.includes(q) || item.pinyin.includes(q) || item.zodiac.includes(q) || item.elementName.includes(q) || item.elementDesc.includes(q))
})

const filteredHours = computed(() => {
  const q = props.searchQuery.trim().toLowerCase()
  if (!q) return props.hoursList
  return props.hoursList.filter(item => item.name.includes(q) || item.timeSpan.includes(q) || item.rhyme.includes(q) || getBranchZodiac(item.name).includes(q))
})

const filteredBagua = computed(() => {
  const q = props.searchQuery.trim().toLowerCase()
  if (!q) return props.baguaList
  return props.baguaList.filter(item => item.name.includes(q) || item.pinyin.includes(q) || item.nature.includes(q) || item.code.includes(q) || item.trigram.includes(q) || item.id.toString() === q)
})

const currentDetailGua = computed(() => {
  const id = hoveredTrigramId.value || props.inputNumber || 1
  const trigram = props.diagramTrigrams.find(t => t.id === id)
  if (!trigram) return props.diagramTrigrams[0]
  const standardGua = props.baguaList.find(b => b.id === id)
  return { ...trigram, code: standardGua ? standardGua.code : '', symbolNature: standardGua ? standardGua.nature : trigram.nature }
})

const getStaticTextX = (angle) => { const rad = (angle * Math.PI) / 180; return 200 + 72 * Math.sin(rad) }
const getStaticTextY = (angle) => { const rad = (angle * Math.PI) / 180; return 200 - 72 * Math.cos(rad) }

const getGuaExtendedDesc = (id) => {
  const descriptions = {
    1: '乾为天，至健至刚。象征天道运转，自强不息。在玄学推演中代表一把手、领头羊、核心头部以及坚不可摧的本源能量。',
    2: '兑为泽，喜悦柔顺。象征水之润泽与欢愉。在实践字典中代表开口说话、情感沟通、外部缺口，亦可对应互联网软件的技术接口与交互体验。',
    3: '离为火，光明美丽。象征烈火之炽热与依赖附着。在周易预测中代表核心视觉、光明前景、科技媒体，五行属火，主智慧与激情运转。',
    4: '震为雷，动荡爆发。象征春雷一声万物萌芽。代表速度、创新、变动、勇敢出发。在项目开发中主导架构突破与业务快速起飞。',
    5: '巽为风，无孔不入。象征春风之柔和渗透。代表卓越的传播渠道、品牌运营以及长线渗透。在五行中属木，主顺从与生机盎然。',
    6: '坎为水，坎坷险陷。象征深渊之危机与沉淀。代表核心算法的深度突破、危机管理和重重考验，五行属水，暗藏智慧与坚韧。',
    7: '艮为山，静止稳定。象征重峦叠嶂之稳固与止步。在现代系统中代表底座硬件、稳定基建、停步反思，五行属土，主厚德载物与安如磐石。',
    8: '坤为地，至顺至柔。象征大地之宽广包容，承载万物。在数据管理中代表底层庞大的用户数据库、强大的包容承载力，德合无疆。'
  }
  return descriptions[id] || ''
}

const getGuaElementCN = (nature) => {
  const elements = { '天': '金', '泽': '金', '火': '火', '雷': '木', '风': '木', '水': '水', '山': '土', '地': '土' }
  return elements[nature] || ''
}
</script>

<style scoped>
.glass-card { border-radius: 24px; background: rgba(255, 255, 255, 0.75) !important; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.05); padding: 24px; position: relative; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.glass-card:hover { transform: translateY(-2px); box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08); }
.tables-section-card { padding: 30px; }
.table-intro { font-size: 13px; color: #64748b; margin-bottom: 20px; background: #f8fafc; padding: 10px 18px; border-radius: 10px; border-left: 3px solid #cbd5e1; }
.tab-label-custom { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.tab-badge-num { background: #f1f5f9; color: #64748b; font-size: 10px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.el-tabs__item.is-active .tab-badge-num { background: #6366f1; color: white; }

/* 八卦网格 */
.bagua-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.bagua-card-item { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px 24px; position: relative; overflow: hidden; cursor: pointer; transition: all 0.25s ease; display: flex; flex-direction: column; gap: 12px; }
.bagua-card-item:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(0,0,0,0.05); }
.bagua-card-item.highlighted { border-color: #fbbf24 !important; background: #fffdf5; box-shadow: 0 12px 24px rgba(251,191,36,0.15); }
.gua-id-badge { position: absolute; top: 15px; right: 20px; font-size: 11px; font-weight: 800; color: #94a3b8; background: #f1f5f9; padding: 2px 10px; border-radius: 30px; }
.bagua-card-item.highlighted .gua-id-badge { background: #fbbf24; color: #1e1b4b; }
.gua-symbol-large { font-size: 3.5rem; color: #cbd5e1; font-family: monospace; line-height: 1; transition: color 0.3s; }
.bagua-card-item:hover .gua-symbol-large, .bagua-card-item.highlighted .gua-symbol-large { color: #f59e0b; }
.gua-code-detail { background: #f8fafc; border-radius: 10px; padding: 8px 12px; font-size: 12px; color: #475569; line-height: 1.5; font-weight: 500; border-left: 3px solid #cbd5e1; }
.bagua-card-item.highlighted .gua-code-detail { background: #fffbeb; border-left-color: #fbbf24; }

/* 天干网格 */
.stems-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
@media (max-width: 1200px) { .stems-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); } }

/* 地支网格 */
.branches-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }

/* 卡片通用 */
.branch-card-item { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 16px 20px; position: relative; overflow: hidden; cursor: pointer; transition: all 0.25s ease; }
.branch-card-item:hover { transform: translateY(-3px); box-shadow: 0 10px 18px rgba(0,0,0,0.04); }
.branch-card-item.highlighted { border-color: #f59e0b !important; box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2), 0 10px 20px rgba(0,0,0,0.05) !important; background: #fffcf0; }
.item-id-badge { position: absolute; top: 12px; right: 15px; font-size: 10px; font-weight: 800; color: #94a3b8; }
.item-main-row { display: flex; align-items: baseline; gap: 6px; margin-top: 5px; }
.item-name { font-size: 22px; font-weight: 800; color: #1e293b; }
.item-pinyin { font-size: 12px; color: #64748b; }
.item-zodiac-tag { font-size: 11px; font-weight: 700; background: #f1f5f9; padding: 2px 8px; border-radius: 30px; color: #475569; margin-left: auto; }
.item-details-row { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 10px; }
.detail-sub { display: flex; align-items: center; gap: 4px; }
.detail-sub .lbl { font-size: 11px; color: #94a3b8; font-weight: bold; }
.detail-sub .val { font-size: 12px; color: #475569; font-weight: 600; }
.bold-val { font-weight: bold !important; }
.branch-card-item.water .bold-val { color: #0284c7; }
.branch-card-item.wood .bold-val { color: #10b981; }
.branch-card-item.earth .bold-val { color: #d97706; }
.branch-card-item.flame .bold-val { color: #ef4444; }
.branch-card-item.gold .bold-val { color: #71717a; }
.item-desc-bubble { margin-top: 10px; background: #f8fafc; padding: 6px 12px; border-radius: 8px; font-size: 11px; color: #64748b; font-weight: 500; }

/* 时辰网格 */
.hours-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
@media (max-width: 1200px) { .hours-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 768px) { .hours-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .hours-grid { grid-template-columns: 1fr; } }
.hour-grid-item { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 16px; cursor: pointer; transition: all 0.25s ease; display: flex; flex-direction: column; gap: 10px; position: relative; overflow: hidden; }
.hour-grid-item:hover { transform: translateY(-3px); box-shadow: 0 10px 18px rgba(99, 102, 241, 0.08); border-color: #6366f1; }
.hour-grid-item.highlighted { background: #f5f3ff; border-color: #818cf8 !important; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.1) !important; }
.hour-time-header { font-size: 13px; font-weight: 800; color: #4f46e5; font-family: 'Outfit', sans-serif; text-align: center; background: rgba(99, 102, 241, 0.06); padding: 4px 8px; border-radius: 8px; letter-spacing: 0.5px; }
.hour-main-row { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.hour-title { font-size: 18px; font-weight: 800; color: #1e293b; }
.hour-zodiac-tag { font-size: 12px; font-weight: 700; background: #f1f5f9; padding: 2px 8px; border-radius: 30px; color: #475569; }
.hour-grid-item.highlighted .hour-zodiac-tag { background: #fff; }
.hour-badge-row { display: flex; gap: 5px; }
.hour-slogan-box { font-size: 11px; color: #64748b; font-weight: 500; background: #f8fafc; padding: 8px 12px; border-radius: 8px; line-height: 1.4; flex: 1; display: flex; align-items: center; }
.hour-grid-item.highlighted .hour-slogan-box { background: rgba(255, 255, 255, 0.7); }

/* 八卦方位图 */
.diagram-tab-wrapper { display: flex; gap: 32px; margin-top: 24px; align-items: stretch; min-height: 480px; }
.bagua-plate-col { flex: 0 0 450px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.45); border-radius: 24px; padding: 30px 24px; border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); }
.bagua-plate-outer-container { width: 360px; height: 360px; position: relative; display: flex; align-items: center; justify-content: center; }
.bagua-svg { width: 100%; height: 100%; overflow: visible; transform-origin: 200px 200px; }
.bagua-svg.spinning-slowly { animation: spinTaijiPlate 60s linear infinite; }
.bagua-svg:hover { animation-play-state: paused !important; }
@keyframes spinTaijiPlate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.bagua-octagon-border { fill: rgba(255, 255, 255, 0.65); stroke: #fbbf24; stroke-width: 2; stroke-linejoin: round; filter: drop-shadow(0 4px 10px rgba(245, 158, 11, 0.15)); transition: all 0.3s ease; }
.bagua-octagon-inner { fill: none; stroke: rgba(251, 191, 36, 0.55); stroke-width: 1.2; stroke-linejoin: round; stroke-dasharray: 4 4; }
.bagua-center-circle { fill: none; stroke: #fbbf24; stroke-width: 2; filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.1)); }
.bagua-sector-group { cursor: pointer; transition: all 0.3s ease; }
.wedge-bg { fill: transparent; transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.bagua-sector-group:hover .wedge-bg { fill: var(--hover-color); opacity: 0.08; }
.bagua-sector-group.active .wedge-bg { fill: var(--hover-color); opacity: 0.15; }
.radial-line { stroke: rgba(251, 191, 36, 0.4); stroke-width: 1; stroke-dasharray: 2 3; }
.trigram-symbol { font-size: 32px; font-weight: 800; text-anchor: middle; dominant-baseline: central; cursor: pointer; filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.08)); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-origin: 200px 70px; }
.bagua-sector-group:hover .trigram-symbol { transform: scale(1.18); filter: drop-shadow(0 0 10px var(--hover-color)); }
.bagua-sector-group.active .trigram-symbol { transform: scale(1.22); filter: drop-shadow(0 0 12px var(--hover-color)); }
.trigram-direction-eng { font-size: 9px; font-weight: 800; text-anchor: middle; letter-spacing: 0.8px; opacity: 0.5; transition: all 0.3s ease; }
.bagua-sector-group:hover .trigram-direction-eng { opacity: 0.95; font-weight: 900; }
.taiji-center-group { transform-origin: 200px 200px; animation: spinTaijiCenter 15s linear infinite; cursor: pointer; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)); }
@keyframes spinTaijiCenter { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.bagua-name-static { cursor: pointer; transition: all 0.3s ease; }
.trigram-chinese-char { font-size: 17px; font-weight: 800; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.bagua-name-static:hover .trigram-chinese-char { font-size: 21px; filter: drop-shadow(0 0 8px var(--active-color)); }
.bagua-name-static.active .trigram-chinese-char { font-size: 23px; filter: drop-shadow(0 0 12px var(--active-color)); font-weight: 900; }
.rotate-control-bar { margin-top: 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.control-tip { font-size: 12px; color: #64748b; text-align: center; font-style: italic; opacity: 0.85; }
.bagua-info-col { flex: 1; display: flex; flex-direction: column; }
.hologram-gua-detail { flex: 1; background: rgba(255, 255, 255, 0.88) !important; border: 1px solid rgba(255, 255, 255, 0.7); box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.06) !important; border-radius: 28px; padding: 36px; display: flex; flex-direction: column; position: relative; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); overflow: hidden; }
.hologram-gua-detail::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: var(--detail-theme-color); border-radius: 28px 28px 0 0; transition: background 0.4s ease; }
.hologram-header { display: flex; align-items: center; gap: 28px; margin-bottom: 28px; border-bottom: 1px dashed rgba(0, 0, 0, 0.06); padding-bottom: 24px; }
.hologram-symbol-box { width: 88px; height: 88px; background: var(--detail-theme-color); border-radius: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -5px var(--detail-theme-color); transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
.hologram-gua-detail:hover .hologram-symbol-box { transform: translateY(-4px) rotate(5deg); box-shadow: 0 15px 30px -5px var(--detail-theme-color); }
.symbol-large { font-size: 3.5rem; color: white; line-height: 1; font-weight: 800; }
.animate-breath { animation: breathGua 4s ease-in-out infinite; }
@keyframes breathGua { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
.hologram-title-box { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.gua-fullname { font-size: 26px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: 1px; }
.gua-meta-badges { display: flex; gap: 12px; align-items: center; }
.gua-val-badge { border-color: #fbbf24 !important; color: #b45309 !important; font-weight: 800; background: #fffbeb !important; font-size: 12px; padding: 2px 10px; border-radius: 6px; }
.hologram-body { flex: 1; display: flex; flex-direction: column; gap: 24px; }
.hologram-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; background: rgba(0, 0, 0, 0.015); border-radius: 20px; padding: 20px; border: 1px solid rgba(0, 0, 0, 0.025); }
.grid-item { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; border-right: 1px solid rgba(0, 0, 0, 0.05); }
.grid-item:last-child { border-right: none; }
.grid-label { font-size: 12px; color: #64748b; font-weight: 600; letter-spacing: 0.5px; }
.grid-value { font-size: 15px; color: #1e293b; font-weight: 800; }
.hologram-description-section { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.hologram-description-section h4 { font-size: 15px; font-weight: 800; color: #334155; margin: 0; display: flex; align-items: center; gap: 6px; }
.hologram-description-section h4::before { content: '⚡'; color: #fbbf24; }
.gua-meaning-desc { font-size: 14.5px; line-height: 1.7; color: #334155; background: #f8fafc; padding: 20px 24px; border-radius: 16px; border: 1px solid #f1f5f9; margin: 0; text-indent: 2em; min-height: 100px; box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.01); }

@media (max-width: 768px) {
  .diagram-tab-wrapper { flex-direction: column !important; align-items: center !important; gap: 20px !important; }
  .bagua-plate-col { flex: 0 0 auto !important; width: 100% !important; max-width: 100% !important; padding: 15px !important; box-sizing: border-box; }
  .bagua-plate-outer-container { width: 280px !important; height: 280px !important; }
}
</style>
