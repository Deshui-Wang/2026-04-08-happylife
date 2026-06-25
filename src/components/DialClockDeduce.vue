<template>
  <div class="glass-card calculator-card">
    <div class="card-glow-title">
      <el-icon class="glow-icon"><Clock /></el-icon>
      <span>时辰 / 地支 实时换算与推演</span>
    </div>

    <div class="calculator-inner">
      <el-row :gutter="24">
        <!-- 左侧：时间与模拟 -->
        <el-col :xs="24" :md="16">
          <div class="live-clock-section" style="display: flex; flex-direction: row; gap: 15px; height: 100%; align-items: stretch; width: 100%; box-sizing: border-box; flex-wrap: wrap;">
            <!-- 新增：左侧八卦方位图卡片 -->
            <div class="dial-clock-card dial-bagua-card">
              <svg viewBox="0 0 400 400" class="bagua-svg" style="transform-origin: 200px 200px;">
                <!-- 1. 最外层八角黄框 -->
                <polygon
                  points="127.3,24.5 272.7,24.5 375.5,127.3 375.5,272.7 272.7,375.5 127.3,375.5 24.5,272.7 24.5,127.3"
                  class="bagua-octagon-border"
                />
                <!-- 2. 内层八角黄框 -->
                <polygon
                  points="161.7,107.6 238.3,107.6 292.4,161.7 292.4,238.3 238.3,292.4 161.7,292.4 107.6,238.3 107.6,161.7"
                  class="bagua-octagon-inner"
                />
                <!-- 3. 最内层黄框太极圆 -->
                <circle cx="200" cy="200" r="50" class="bagua-center-circle" />

                <!-- 4. 8个扇区组（乾巽坎艮坤震离兑） -->
                <g
                  v-for="item in diagramTrigrams"
                  :key="'mini-gua-' + item.id"
                  :transform="`rotate(${item.angle}, 200, 200)`"
                  class="bagua-sector-group"
                >
                  <!-- 放射分割线 -->
                  <line x1="238.3" y1="107.6" x2="270.8" y2="29.1" class="radial-line" />

                  <!-- 卦象符号 (☰) -->
                  <text x="200" y="70" class="trigram-symbol" :fill="item.color">{{ item.symbol }}</text>

                  <!-- 中文方向 (正南, etc.) -->
                  <text x="200" y="32" class="trigram-direction-eng" :fill="item.color" style="font-size: 14px; font-weight: 800;">{{ item.direction }}</text>
                </g>

                <!-- 5. 中心旋转太极图 (Yin-Yang) -->
                <g class="taiji-center-group">
                  <!-- 左侧阴鱼 (深蓝/黑色) -->
                  <path d="M 200 150 A 50 50 0 0 0 200 250 A 25 25 0 0 0 200 200 A 25 25 0 0 1 200 150" fill="#1e1b4b" />
                  <!-- 右侧阳鱼 (乳白/黄色) -->
                  <path d="M 200 150 A 50 50 0 0 1 200 250 A 25 25 0 0 0 200 200 A 25 25 0 0 1 200 150" fill="#fffbeb" />
                  <!-- 阴阳眼 -->
                  <circle cx="200" cy="175" r="7" fill="#1e1b4b" />
                  <circle cx="200" cy="225" r="7" fill="#fffbeb" />
                </g>

                <!-- 6. 中文卦名 (乾巽坎艮坤震离兑) -->
                <g
                  v-for="item in diagramTrigrams"
                  :key="'mini-text-' + item.id"
                  class="bagua-name-static"
                >
                  <text
                    :x="getStaticTextX(item.angle)"
                    :y="getStaticTextY(item.angle)"
                    text-anchor="middle"
                    dominant-baseline="central"
                    class="trigram-chinese-char"
                    :fill="item.color"
                    style="font-size: 26px; font-weight: 900;"
                  >
                    {{ item.name }}
                  </text>
                </g>
              </svg>
            </div>

            <!-- 表盘圆盘卡片 -->
            <div class="dial-clock-card">
              <svg viewBox="0 0 200 200" class="dial-svg-plate">
                <!-- 1. 表盘外圈渐变与阴影 -->
                <defs>
                  <radialGradient id="clockPlateGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="70%" stop-color="rgba(255, 255, 255, 0.9)" />
                    <stop offset="100%" stop-color="rgba(99, 102, 241, 0.08)" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="94" fill="url(#clockPlateGrad)" stroke="rgba(99, 102, 241, 0.2)" stroke-width="2" />
                <!-- 装饰环 -->
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(99, 102, 241, 0.08)" stroke-width="1" stroke-dasharray="3, 3" />
                
                <!-- 2. 数字刻度 1-12 -->
                <text
                  v-for="num in dialNumbers"
                  :key="'num-' + num.val"
                  :x="num.x"
                  :y="num.y"
                  text-anchor="middle"
                  dominant-baseline="central"
                  class="dial-num-text"
                >
                  {{ num.val }}
                </text>
                
                <!-- 3. 十二地支时辰字样 -->
                <text
                  v-for="branch in dialBranches"
                  :key="'branch-' + branch.name"
                  :x="branch.x"
                  :y="branch.y"
                  text-anchor="middle"
                  dominant-baseline="central"
                  class="dial-branch-text"
                  :class="[branch.element, { active: branch.isActive }]"
                >
                  {{ branch.name }}
                </text>
                
                <!-- 4. 指针组合 -->
                <!-- 时针（时辰针） -->
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="62"
                  class="dial-hand-hour"
                  :transform="`rotate(${(simulatedHour % 12) * 30 + (isAutoTime ? liveMinute * 0.5 : 0)}, 100, 100)`"
                />
                <!-- 分针 -->
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="50"
                  class="dial-hand-minute"
                  :transform="`rotate(${(isAutoTime ? liveMinute * 6 : 0)}, 100, 100)`"
                />
                <!-- 秒针（仅在同步实时时显示） -->
                <line
                  v-if="isAutoTime"
                  x1="100"
                  y1="112"
                  x2="100"
                  y2="40"
                  class="dial-hand-second"
                  :transform="`rotate(${(liveSecond * 6)}, 100, 100)`"
                />
                <!-- 中心圆扣 -->
                <circle cx="100" cy="100" r="5" fill="#6366f1" />
                <circle cx="100" cy="100" r="2.5" fill="#ffffff" />
              </svg>
            </div>
            
            <!-- 右侧时间与模拟器（垂直排列） -->
            <div style="display: flex; flex-direction: column; gap: 15px; flex: 1.2; justify-content: space-between; max-width: 440px; min-width: 260px; width: 100%;">
              <!-- 现代时间卡片 -->
              <div class="clock-display combined-clock-card" style="margin: 0; width: 100%; box-sizing: border-box;">
                <span class="time-num">
                  {{ liveTime }}<span class="branch-paren"><!-- -->{{ currentBranchInfo.name }}时)</span>
                </span>
                <span class="time-label">现代时间 (对应地支时辰)</span>
              </div>
              <!-- 手动模拟卡片 -->
              <div class="branch-display simulation-control-card" style="margin: 0; width: 100%; box-sizing: border-box; flex: 1; display: flex; flex-direction: column; justify-content: center;">
                <div class="sim-header-row">
                  <span class="sim-title">手动模拟一天时间</span>
                  <el-button
                    type="success"
                    size="small"
                    :plain="!isAutoTime"
                    class="sync-btn-compact"
                    @click="$emit('resume-auto-time')"
                  >
                    同步实时
                  </el-button>
                </div>
                <div class="sim-body-row">
                  <el-input-number
                    :model-value="simulatedHour"
                    :min="0"
                    :max="23"
                    :step="1"
                    size="default"
                    class="simulation-input-field"
                    @change="onHourChange"
                  />
                  <span class="sim-unit-text">点 (24时制)</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧：详细解读 -->
        <el-col :xs="24" :md="8">
          <div class="branch-detail-panel" :class="simulatedBranchInfo.element" style="height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
            <div class="detail-badge-row">
              <el-tag effect="dark" :class="'element-tag ' + simulatedBranchInfo.element">
                五行：{{ simulatedBranchInfo.elementName }}
              </el-tag>
              <el-tag type="info" effect="plain" style="color: #475569; border-color: #cbd5e1;">
                农历月份：{{ simulatedBranchInfo.month }}
              </el-tag>
              <el-tag type="warning" effect="dark" class="id-badge">
                ID: {{ simulatedBranchInfo.id }}
              </el-tag>
            </div>

            <div class="detail-content" style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 15px; margin-top: 10px; margin-bottom: 10px;">
              <div class="main-info">
                <span class="zodiac-pic">{{ simulatedBranchInfo.zodiacEmoji }}</span>
                <div class="info-text">
                  <h3 style="margin: 0; font-size: 18px;">
                    {{ simulatedBranchInfo.name }} ({{ simulatedBranchInfo.pinyin }}) · {{ simulatedBranchInfo.zodiac }}
                  </h3>
                  <p class="modern-time" style="margin: 5px 0 0 0;">时间段：{{ simulatedBranchInfo.timeSpan }}</p>
                </div>
              </div>
              <div class="rhyme-box" style="margin: 0;">
                <span class="quote-mark">"</span>
                <span class="rhyme-text">{{ simulatedBranchInfo.rhyme }}</span>
                <span class="quote-mark">"</span>
              </div>
            </div>

            <!-- 换日点警告提示 -->
            <transition name="el-zoom-in-top">
              <div v-if="simulatedHour === 23" class="midnight-warning" style="margin-top: 10px; margin-bottom: 0;">
                <el-icon><WarningFilled /></el-icon>
                <span style="font-size: 12px;"><strong>⚠️ 换日点：</strong>在周易系统中，子时（23:00）一到，就已经切换到第二天了。</span>
              </div>
            </transition>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock, WarningFilled } from '@element-plus/icons-vue'

const props = defineProps({
  simulatedHour: { type: Number, required: true },
  isAutoTime: { type: Boolean, required: true },
  liveTime: { type: String, required: true },
  liveMinute: { type: Number, required: true },
  liveSecond: { type: Number, required: true },
  simulatedBranchInfo: { type: Object, required: true },
  currentBranchInfo: { type: Object, required: true },
  diagramTrigrams: { type: Array, required: true },
  dialNumbers: { type: Array, required: true },
  dialBranches: { type: Array, required: true }
})

const emit = defineEmits([
  'update:simulatedHour',
  'update:isAutoTime',
  'resume-auto-time'
])

const onHourChange = (val) => {
  emit('update:isAutoTime', false)
  emit('update:simulatedHour', val)
}

const getStaticTextX = (angle) => {
  const rad = (angle * Math.PI) / 180
  return 200 + 72 * Math.sin(rad)
}

const getStaticTextY = (angle) => {
  const rad = (angle * Math.PI) / 180
  return 200 - 72 * Math.cos(rad)
}
</script>

<style scoped>
/* 卡片标题发光效果 */
.card-glow-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 15px;
}

.glow-icon {
  color: #6366f1;
  font-size: 18px;
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

.calculator-card {
  display: flex;
  flex-direction: column;
}

.calculator-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.live-clock-section {
  display: flex;
  gap: 15px;
}

/* 十二时辰地支圆盘表盘卡片 */
.dial-clock-card {
  flex: 1;
  max-width: 260px;
  min-width: 220px;
  height: 100%;
  min-height: 220px;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 16px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
}

.dial-svg-plate {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.dial-num-text {
  font-size: 11px;
  font-weight: 800;
  fill: #475569;
}

.dial-branch-text {
  font-size: 11px;
  font-weight: bold;
  fill: #94a3b8;
  opacity: 0.6;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dial-branch-text.active {
  font-size: 15px;
  font-weight: 900;
  opacity: 1;
  filter: drop-shadow(0 0 4px var(--theme-shadow, rgba(99, 102, 241, 0.5)));
}

.dial-branch-text.active.wood { fill: #10b981; --theme-shadow: rgba(16, 185, 129, 0.5); }
.dial-branch-text.active.fire { fill: #ef4444; --theme-shadow: rgba(239, 68, 68, 0.5); }
.dial-branch-text.active.earth { fill: #d97706; --theme-shadow: rgba(217, 119, 6, 0.5); }
.dial-branch-text.active.metal { fill: #64748b; --theme-shadow: rgba(100, 116, 139, 0.5); }
.dial-branch-text.active.water { fill: #3b82f6; --theme-shadow: rgba(59, 130, 246, 0.5); }

.dial-hand-hour {
  stroke: #4f46e5;
  stroke-width: 3.5;
  stroke-linecap: round;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.15);
}

.dial-hand-minute {
  stroke: #64748b;
  stroke-width: 2;
  stroke-linecap: round;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.15);
}

.dial-hand-second {
  stroke: #ef4444;
  stroke-width: 1;
  stroke-linecap: round;
  transition: transform 0.15s cubic-bezier(0.1, 0.8, 0.2, 1.0);
}

@media (max-width: 768px) {
  .live-clock-section {
    flex-direction: column !important;
    align-items: center !important;
  }
  .dial-clock-card {
    width: 220px !important;
    min-width: 220px !important;
    height: 220px !important;
  }
}

.clock-display,
.branch-display {
  flex: 1;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.clock-display .time-num {
  font-size: 28px;
  font-weight: 800;
  color: #4f46e5;
  font-family: 'Outfit', sans-serif;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.combined-clock-card .branch-paren {
  color: #b45309;
  font-size: 22px;
  font-weight: 800;
  margin-left: 8px;
}

.time-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
  font-weight: 600;
}

.simulation-control-card {
  gap: 10px;
  align-items: stretch !important;
}

.sim-header-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sim-title {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.sync-btn-compact {
  font-size: 11px;
  padding: 4px 8px;
  height: auto;
  border-radius: 6px;
}

.sim-body-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.simulation-input-field {
  width: 120px;
}

.sim-unit-text {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

/* 换算详细卡片 */
.branch-detail-panel {
  border-radius: 20px;
  padding: 20px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: auto;
  box-sizing: border-box;
}

@media (min-width: 992px) {
  .branch-detail-panel {
    min-height: 180px;
    display: flex;
    flex-direction: column;
  }
  .branch-detail-panel .detail-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.branch-detail-panel.water {
  background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%);
  border-color: #a5f3fc;
}
.branch-detail-panel.wood {
  background: linear-gradient(135deg, #f0fdf4 0%, #f0fdf4 100%);
  border-color: #bbf7d0;
}
.branch-detail-panel.earth {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-color: #fde68a;
}
.branch-detail-panel.flame {
  background: linear-gradient(135deg, #fff5f5 0%, #fff1f2 100%);
  border-color: #fecdd3;
}
.branch-detail-panel.gold {
  background: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);
  border-color: #e4e4e7;
}

.detail-badge-row {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.element-tag.water { background-color: #0284c7 !important; border-color: #0284c7 !important; }
.element-tag.wood { background-color: #10b981 !important; border-color: #10b981 !important; }
.element-tag.earth { background-color: #d97706 !important; border-color: #d97706 !important; }
.element-tag.flame { background-color: #ef4444 !important; border-color: #ef4444 !important; }
.element-tag.gold { background-color: #71717a !important; border-color: #71717a !important; }

.id-badge {
  font-weight: 700;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-info {
  display: flex;
  align-items: center;
  gap: 18px;
}

.zodiac-pic {
  font-size: 3.2rem;
  background: white;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.info-text h3 {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.modern-time {
  font-size: 13px;
  color: #64748b;
  margin-top: 5px;
  font-weight: 500;
}

.rhyme-box {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-left: 4px solid #f59e0b;
}

.quote-mark {
  font-size: 24px;
  font-weight: bold;
  color: #cbd5e1;
  font-family: Georgia, serif;
  line-height: 1;
}

.rhyme-text {
  font-size: 14px;
  color: #334155;
  font-weight: 600;
}

.midnight-warning {
  margin-top: 10px;
  padding: 10px 14px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 10px;
  color: #92400e;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.5;
}

/* 八卦方位图迷你版 SVG 样式 */
.bagua-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  transform-origin: 200px 200px;
}

.bagua-octagon-border {
  fill: rgba(255, 255, 255, 0.65);
  stroke: #fbbf24;
  stroke-width: 2;
  stroke-linejoin: round;
  filter: drop-shadow(0 4px 10px rgba(245, 158, 11, 0.15));
  transition: all 0.3s ease;
}

.bagua-octagon-inner {
  fill: none;
  stroke: rgba(251, 191, 36, 0.55);
  stroke-width: 1.2;
  stroke-linejoin: round;
  stroke-dasharray: 4 4;
}

.bagua-center-circle {
  fill: none;
  stroke: #fbbf24;
  stroke-width: 2;
  filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.1));
}

.bagua-sector-group {
  cursor: default;
  transition: all 0.3s ease;
}

.radial-line {
  stroke: rgba(251, 191, 36, 0.4);
  stroke-width: 1;
  stroke-dasharray: 2 3;
}

.trigram-symbol {
  font-size: 32px;
  font-weight: 800;
  text-anchor: middle;
  dominant-baseline: central;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.08));
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: 200px 70px;
}

.trigram-direction-eng {
  font-size: 9px;
  font-weight: 800;
  text-anchor: middle;
  letter-spacing: 0.8px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.taiji-center-group {
  transform-origin: 200px 200px;
  animation: spinTaijiCenter 15s linear infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

@keyframes spinTaijiCenter {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bagua-name-static {
  cursor: default;
  transition: all 0.3s ease;
}

.trigram-chinese-char {
  font-size: 17px;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@media (max-width: 768px) {
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
