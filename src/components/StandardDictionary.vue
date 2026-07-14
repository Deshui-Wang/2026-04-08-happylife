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
      
      <!-- 64卦象页签 -->
      <el-tab-pane name="sixtyfour">
        <template #label>
          <span class="tab-label-custom">
            <span class="tab-badge-num">64</span>
            <span>64卦象</span>
          </span>
        </template>
        <div class="table-intro">注：六十四卦由八卦两合而成。上卦为天（外卦），下卦为地（内卦），涵盖周易文王卦序之宇宙全息万象。</div>
        
        <!-- 手动选卦快速查询面板 -->
        <div class="manual-lookup-panel">
          <div class="panel-title">
            <span class="symbol-yin-yang">☯</span>
            <span>手动摇卦快速查询</span>
          </div>
          <div class="selectors-row">
            <div class="selector-item">
              <span class="sel-label">上卦 (外/天卦)</span>
              <el-select v-model="filterUpperGua" placeholder="全部上卦" clearable class="gua-custom-select">
                <el-option v-for="g in baguaList" :key="g.id" :label="g.name + '卦 (' + g.nature + ')'" :value="g.id" />
              </el-select>
            </div>
            <div class="selector-item">
              <span class="sel-label">下卦 (内/地卦)</span>
              <el-select v-model="filterLowerGua" placeholder="全部下卦" clearable class="gua-custom-select">
                <el-option v-for="g in baguaList" :key="g.id" :label="g.name + '卦 (' + g.nature + ')'" :value="g.id" />
              </el-select>
            </div>
            <el-button v-if="filterUpperGua || filterLowerGua" type="warning" plain class="reset-btn" @click="clearManualFilter">
              重置卦象筛选
            </el-button>
          </div>
        </div>
        
        <div class="sixtyfour-grid">
          <div v-for="item in filteredSixtyFour" :key="item.id" class="hexagram-card-item" :class="{ highlighted: inputNumber === item.id }">
            <div class="item-id-badge">卦 {{ item.id }}</div>
            <div class="hexagram-layout-row">
              <!-- 卦画视觉叠放 -->
              <div class="hexagram-visual-box">
                <div class="unicode-symbol" :title="item.name + '卦符号'">{{ item.symbol }}</div>
                <div class="trigram-stack">
                  <span class="tri-line upper" :style="{ color: item.upperColor }" :title="'上卦：' + item.upperName + '（' + item.upperNature + '）'">{{ item.upperSymbol }}</span>
                  <span class="tri-line lower" :style="{ color: item.lowerColor }" :title="'下卦：' + item.lowerName + '（' + item.lowerNature + '）'">{{ item.lowerSymbol }}</span>
                </div>
              </div>
              <!-- 卦名与核心参数 -->
              <div class="hexagram-meta-box">
                <h3 class="hexagram-title-name">{{ item.name }}</h3>
                <div class="hexagram-formula-text">
                  <span>{{ item.upperName }}{{ item.lowerName }}</span>
                  <span class="divider">·</span>
                  <span>上{{ item.upperNature }}下{{ item.lowerNature }}</span>
                </div>
              </div>
            </div>
            <div class="item-desc-bubble sixtyfour-desc">{{ item.desc }}</div>
          </div>
          <el-empty v-if="filteredSixtyFour.length === 0" description="没有找到匹配的卦象信息" />
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

// 六十四卦经典组合词典
const sixtyFourGua = {
  "1-1": { name: "乾为天", desc: "至健大吉。天行健，自强不息。名利双收之象。" }, "1-2": { name: "天泽履", desc: "如履薄冰。礼待他人，防微杜渐，谨慎则吉。" }, "1-3": { name: "天火同人", desc: "天下大同。志同道合，团结协作，无往不利。" }, "1-4": { name: "天雷无妄", desc: "顺应天意。坚守正道，切勿妄动，平实无怨。" }, "1-5": { name: "天风姤", desc: "邂逅相遇。防范暗流，女强男弱，顺其自然。" }, "1-6": { name: "天水讼", desc: "争讼克制。防口舌争端，宜和为贵，退一步海阔天空。" }, "1-7": { name: "天山遁", desc: "退避隐遁。蓄势待发，明哲保身，适时隐退为上。" }, "1-8": { name: "天地否", desc: "闭塞不通。上下不合，小人得势，坚守贞固以待黎明。" },
  "2-1": { name: "泽天夬", desc: "决断清除。决而能和，刚柔相济，防小人暗算。" }, "2-2": { name: "兑为泽", desc: "喜悦交流。丽泽对讲，朋友相帮，言谈有度则吉。" }, "2-3": { name: "泽火革", desc: "顺天应人。变革创新，改弦更张，大吉可期。" }, "2-4": { name: "泽雷随", desc: "随遇而安。顺应潮流，择善而从，自得平安。" }, "2-5": { name: "泽风大过", desc: "栋梁折曲。压力过重，需稳健调节，不可强出头。" }, "2-6": { name: "泽水困", desc: "穷困坚守. 龙游浅水，坚守正道，岁寒知松柏。" }, "2-7": { name: "泽山咸", desc: "心灵感应。少男少女，相互吸引，心有灵犀，万事皆吉。" }, "2-8": { name: "泽地萃", desc: "精英汇聚。萃聚一堂，财源大茂，得众力支持。" },
  "3-1": { name: "火天大有", desc: "日丽中天。大有收获，富足宽容，顺天依时。" }, "3-2": { name: "火泽睽", desc: "同而不同。求同存异，防背道而驰，以柔克刚。" }, "3-3": { name: "离为火", desc: "光明附着。明两作照，前途坦荡，宜守中正。" }, "3-4": { name: "火雷噬嗑", desc: "刚正严明。排除万难，赏罚分明，宜快速决断。" }, "3-5": { name: "火风鼎", desc: "三足鼎立。协力图新，贤才得用，基业稳固。" }, "3-6": { name: "火水未济", desc: "黎明前夕。事情尚未完结，虽有困难但大有希望。" }, "3-7": { name: "火山旅", desc: "羁旅漂泊。不安于室，在外奔波，守正防破财。" }, "3-8": { name: "火地晋", desc: "旭日东升。仕途坦荡，步步高升，大受器重。" },
  "4-1": { name: "雷天大壮", desc: "声势浩大。阳气鼎盛，防亢龙有悔，宜中庸稳重。" }, "4-2": { name: "雷泽归妹", desc: "终难长久. 防主次颠倒，宜按部就班，不可急躁功利。" }, "4-3": { name: "雷火丰", desc: "丰盛璀璨。如日中天，宜居安思危，防盛极而衰。" }, "4-4": { name: "震为雷", desc: "春雷炸响。震惊百里，警醒自修，先惊后喜。" }, "4-5": { name: "雷风恒", desc: "持之以恒。雷风相助，恒心能成，夫妻和睦。" }, "4-6": { name: "雷水解", desc: "冰消瓦解。转危为安，排除阻碍，宜快速推进。" }, "4-7": { name: "雷山小过", desc: "小有过越。宜下不宜上，宜静不宜动，小事能成。" }, "4-8": { name: "雷地豫", desc: "喜乐安豫。顺时依势，防玩物丧志，宜居安思危。" },
  "5-1": { name: "风天小畜", desc: "密云不雨。蓄积力量，小有收获，耐心等待时机。" }, "5-2": { name: "风泽中孚", desc: "诚信立身。心中诚信，感化他人，谋望皆能实现。" }, "5-3": { name: "风火家人", desc: "齐家之道。内政井然，各司其职，家和万事兴。" }, "5-4": { name: "风雷益", desc: "损上益下。利涉大川，大有作为，天施地生。" }, "5-5": { name: "巽为风", desc: "顺风渗透。申命行事，随风潜入，宜多用计谋。" }, "5-6": { name: "风水涣", desc: "冰消瓦解。扬帆起航，消解隔阂，重聚人心。" }, "5-7": { name: "风山渐", desc: "鸿渐于陆。循序渐进，积少成多，前途不可限量。" }, "5-8": { name: "风地观", desc: "高瞻远瞩。观摩学习，宜静修反思，以德化人。" },
  "6-1": { name: "水天需", desc: "云行于天。耐心等待，蓄水养息，终能大展宏图。" }, "6-2": { name: "水泽节", desc: "节制有度. 甘节自甘，防奢侈无度，适度调节则吉。" }, "6-3": { name: "水火既济", desc: "功成圆满。诸事皆顺，宜防备松懈，守成防衰。" }, "6-4": { name: "水雷屯", desc: "草创维艰。万事开头难，宜广结善缘，积蓄力量。" }, "6-5": { name: "水风井", desc: "源源不断。养人无方，守常不改，财源细水长流。" }, "6-6": { name: "坎为水", desc: "重重险陷。常德行进，沉淀心智，必能脱困。" }, "6-7": { name: "水山蹇", desc: "雪上加霜。前路受阻，宜反求诸己，宜往西南吉。" }, "6-8": { name: "水地比", desc: "亲密比辅。广结人缘，得众人拥护，先吉后平。" },
  "7-1": { name: "山天大畜", desc: "大有积蓄。藏器于身，广积粮草，大有作为。" }, "7-2": { name: "山泽损", desc: "损己利人。惩忿窒欲，虽有付出，终能有大报。" }, "7-3": { name: "山火贲", desc: "文饰装点。白贲无咎，讲求内外兼修，适度包装。" }, "7-4": { name: "山雷颐", desc: "修身养性。慎言语，节饮食，保重身体则吉。" }, "7-5": { name: "山风蛊", desc: "推陈出新。整治积弊，勇于自我革新，终能重振旗鼓。" }, "7-6": { name: "山水蒙", desc: "启蒙发慧。虚心求教，果行育德，渐入佳境。" }, "7-7": { name: "艮为山", desc: "安如磐石。思不出位，动静得宜，适可而止。" }, "7-8": { name: "山地剥", desc: "剥落衰退。小人势力上升，宜顺应退守，静待冬去春来。" },
  "8-1": { name: "地天泰", desc: "三阳开泰。上下交泰，诸事顺遂，国泰民安，大吉大利。" }, "8-2": { name: "地泽临", desc: "大兵临境。亲自督导，防盛极而衰，宜柔中克刚。" }, "8-3": { name: "地火明夷", desc: "韬光养晦。伤于明处，宜藏锋避祸，心怀正念。" }, "8-4": { name: "地雷复", desc: "一阳复始。重获新生，循环往复，前景渐渐光明。" }, "8-5": { name: "地风升", desc: "步步高升。柔顺上升，得贤才提拔，积少成多。" }, "8-6": { name: "地水师", desc: "行军出征。大众一心，统帅得力，虽有劳累终有成。" }, "8-7": { name: "地山谦", desc: "虚怀若谷。谦谦君子，卑以自牧，万事皆能化险为夷。" }, "8-8": { name: "坤为地", desc: "厚德载物。至柔至顺，包容万物，得主有常。" }
}

// 周易 64 卦文王卦序索引映射（对应 "上卦-下卦"）
const kingWenOrder = [
  "1-1", "8-8", "6-4", "7-6", "6-1", "1-6", "8-6", "6-8",
  "5-1", "1-2", "8-1", "1-8", "1-3", "3-1", "8-7", "4-8",
  "2-4", "7-5", "8-2", "5-8", "3-4", "7-3", "7-8", "8-4",
  "1-4", "7-1", "7-4", "2-5", "6-6", "3-3", "2-7", "4-5",
  "1-7", "4-1", "3-8", "8-3", "5-3", "3-2", "6-7", "4-6",
  "7-2", "5-4", "2-1", "1-5", "2-8", "8-5", "2-6", "6-5",
  "2-3", "3-5", "4-4", "7-7", "5-7", "4-2", "4-3", "3-7",
  "5-5", "2-2", "5-6", "6-2", "5-2", "4-7", "6-3", "3-6"
]

// 64卦象完整列表计算属性
const sixtyFourList = computed(() => {
  return kingWenOrder.map((code, index) => {
    const [upIdStr, downIdStr] = code.split('-')
    const upId = parseInt(upIdStr)
    const downId = parseInt(downIdStr)
    const upGua = props.baguaList.find(b => b.id === upId) || { name: '', trigram: '', nature: '', element: '土' }
    const downGua = props.baguaList.find(b => b.id === downId) || { name: '', trigram: '', nature: '', element: '土' }
    const trigramColors = { '金': '#64748b', '木': '#10b981', '水': '#3b82f6', '火': '#ef4444', '土': '#d97706' }
    
    const info = sixtyFourGua[code] || { name: '未知卦', desc: '' }
    
    return {
      id: index + 1,
      code,
      name: info.name,
      desc: info.desc,
      symbol: String.fromCodePoint(0x4DC0 + index), // 64卦 Unicode 符号
      upperSymbol: upGua.trigram,
      lowerSymbol: downGua.trigram,
      upperName: upGua.name,
      lowerName: downGua.name,
      upperNature: upGua.nature,
      lowerNature: downGua.nature,
      upperColor: trigramColors[upGua.element] || '#64748b',
      lowerColor: trigramColors[downGua.element] || '#64748b',
      trigrams: `${upGua.name}/${downGua.name}`
    }
  })
})

const filterUpperGua = ref(null)
const filterLowerGua = ref(null)

const clearManualFilter = () => {
  filterUpperGua.value = null
  filterLowerGua.value = null
}

// 过滤后的 64 卦列表（支持下拉选卦与搜索框联合过滤）
const filteredSixtyFour = computed(() => {
  let list = sixtyFourList.value
  
  // 1. 手动上下卦关联筛选
  if (filterUpperGua.value) {
    list = list.filter(item => {
      const [upId] = item.code.split('-')
      return parseInt(upId) === filterUpperGua.value
    })
  }
  if (filterLowerGua.value) {
    list = list.filter(item => {
      const [, downId] = item.code.split('-')
      return parseInt(downId) === filterLowerGua.value
    })
  }
  
  // 2. 搜索框过滤
  const q = props.searchQuery.trim().toLowerCase()
  if (!q) return list
  return list.filter(item => 
    item.name.includes(q) || 
    item.desc.includes(q) || 
    item.id.toString() === q || 
    item.code.includes(q) || 
    item.symbol.includes(q) || 
    item.trigrams.includes(q)
  )
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

/* 64卦象网格 */
.sixtyfour-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.hexagram-card-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 18px 20px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hexagram-card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
  border-color: #6366f1;
}
.hexagram-layout-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.hexagram-visual-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
.unicode-symbol {
  font-size: 2.2rem;
  color: #1e1b4b;
  line-height: 1;
}
.trigram-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 0.9;
  font-size: 1.2rem;
  font-weight: bold;
}
.hexagram-meta-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hexagram-title-name {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}
.hexagram-formula-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}
.hexagram-formula-text .divider {
  color: #cbd5e1;
}
.sixtyfour-desc {
  margin-top: auto;
  line-height: 1.5;
  background: #f8fafc;
}

/* 手动摇卦快速查询面板 */
.manual-lookup-panel {
  background: rgba(248, 250, 252, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 18px;
  padding: 16px 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.manual-lookup-panel .panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #1e1b4b;
}
.symbol-yin-yang {
  color: #6366f1;
  font-size: 18px;
}
.selectors-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.selector-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.selector-item .sel-label {
  font-size: 13px;
  color: #475569;
  font-weight: 700;
  white-space: nowrap;
}
.gua-custom-select {
  width: 160px;
}
.gua-custom-select :deep(.el-input__wrapper) {
  border-radius: 10px;
  border-color: rgba(99, 102, 241, 0.1) !important;
}
.reset-btn {
  border-radius: 10px;
  height: 32px;
}

@media (max-width: 768px) {
  .diagram-tab-wrapper { flex-direction: column !important; align-items: center !important; gap: 20px !important; }
  .bagua-plate-col { flex: 0 0 auto !important; width: 100% !important; max-width: 100% !important; padding: 15px !important; box-sizing: border-box; }
  .bagua-plate-outer-container { width: 280px !important; height: 280px !important; }
}
</style>
