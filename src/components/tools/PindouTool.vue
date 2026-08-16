<template>
  <div class="pindou-tool animate-fade-in">
    <!-- 工具顶部导航栏 -->
    <div class="tool-header-row mb-20">
      <div class="header-left-group">
        <div class="btn-back-clean" @click="$emit('back')">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回</span>
        </div>
        <div class="header-divider"></div>
        <h2 class="section-title">拼豆不拼命</h2>
        <span class="section-subtitle">拼豆图纸识别 · 29×29拼板划分 · 逐一分色沉浸拼豆</span>
      </div>

      <!-- 顶栏右侧核心入口：导出图纸与开启拼豆沉浸模式 -->
      <div class="header-right-actions">
        <el-button 
          type="primary" 
          plain 
          class="export-hd-btn"
          @click="exportHDBlueprint"
        >
          <el-icon><Download /></el-icon>导出 HD 打印级图纸 (PNG)
        </el-button>
        <el-button 
          type="success" 
          size="default" 
          class="start-pindou-top-btn"
          @click="openImmersiveMode"
        >
          <el-icon><VideoPlay /></el-icon>开始拼豆 (分色沉浸模式)
        </el-button>
      </div>
    </div>

    <!-- 工作台主区 -->
    <el-row :gutter="24" class="main-layout-row">
      <!-- 左侧：拼豆图纸上传与原稿对比区域 -->
      <el-col :xs="24" :lg="9" class="layout-col">
        <el-card class="glass-card tool-panel-card mb-20" :body-style="{ padding: '20px 24px' }">
          <template #header>
            <div class="card-header-glow">
              <el-icon><Picture /></el-icon>
              <span>拼豆图纸上传与原稿对比</span>
            </div>
          </template>

          <div class="upload-sidebar-container">
            <!-- 1. 核心上传按钮区域 -->
            <div class="upload-action-box mb-16">
              <input 
                type="file" 
                accept="image/*" 
                ref="fileInputRef" 
                style="display: none;" 
                @change="handleImageUpload"
              />
              <el-button 
                type="primary" 
                size="large"
                class="upload-primary-btn"
                @click="$refs.fileInputRef.click()"
              >
                <el-icon><Picture /></el-icon>上传拼豆图纸/像素原图
              </el-button>
            </div>

            <!-- 3. 上传的图片原稿预览区 (上面方形画板区 + 下面对应图像色号区) -->
            <div class="original-blueprint-card" v-if="uploadedImageSrc">
              <!-- 上面方形画板区 (截图一：图的部分) -->
              <div class="preview-section-item mb-12">
                <div class="section-sub-title mb-6">
                  <el-icon><Picture /></el-icon>
                  <span>上面：图的画板区域 (截图 1)</span>
                </div>
                <div class="top-square-image-wrapper">
                  <img :src="uploadedImageSrc" class="top-square-image" alt="图的画板区域" />
                </div>
              </div>

              <!-- 下面对应图像色号区 (截图二：色号的部分) -->
              <div class="preview-section-item">
                <div class="section-sub-title mb-6">
                  <el-icon><Grid /></el-icon>
                  <span>下面：色号对照区域 (截图 2)</span>
                </div>
                <div class="bottom-legend-preview-box">
                  <div class="original-bottom-strip-wrapper mb-8">
                    <img :src="uploadedImageSrc" class="bottom-strip-image" alt="色号对照区域" />
                  </div>
                  <div class="extracted-color-chips-grid">
                    <span 
                      v-for="item in usedColorsList" 
                      :key="item.hex" 
                      class="mini-color-chip-pill"
                      :style="{ backgroundColor: item.hex, color: getContrastTextColor(item.hex) }"
                      :title="`${item.code} - ${item.name} (${item.count}颗)`"
                    >
                      <strong>{{ item.code }}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：对应矩阵画布、用量清单与沉浸打豆入口 -->
      <el-col :xs="24" :lg="15" class="layout-col">
        <el-card class="glass-card canvas-card" :body-style="{ padding: '24px' }">
          <template #header>
            <div class="card-header-glow justify-between">
              <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
                <el-icon><Grid /></el-icon>
                <span>高清拼豆矩阵画布 ({{ gridSideLength }} × {{ gridSideLength }})</span>
                <el-checkbox v-model="showColorCodeOnGrid" size="small">字标</el-checkbox>
                <el-checkbox v-model="showPegboardGuides" size="small">29×29拼板网格线</el-checkbox>
              </div>

              <div class="canvas-header-right">
                <el-tag size="small" type="primary" effect="plain" class="active-color-tag">
                  当前: {{ activeColor.code }} ({{ activeColor.name }})
                </el-tag>
              </div>
            </div>
          </template>

          <!-- 🧰 专业画板工具栏 (撤销/重做、缩放、重置) -->
          <div class="workbench-toolbar-bar mb-16">
            <div class="tools-left-info">
              <span class="toolbar-hint-text">💡 鼠标按住拖拽即可在画布上自由修正/补色</span>
            </div>
            <div class="tools-right-group">
              <!-- 撤销 / 重做按钮 -->
              <el-tooltip content="撤销 (Ctrl+Z)" placement="top">
                <el-button 
                  size="small" 
                  circle 
                  :disabled="historyIndex <= 0"
                  @click="undo"
                >
                  ↩️
                </el-button>
              </el-tooltip>
              <el-tooltip content="重做 (Ctrl+Y)" placement="top">
                <el-button 
                  size="small" 
                  circle 
                  :disabled="historyIndex >= historyStack.length - 1"
                  @click="redo"
                >
                  ↪️
                </el-button>
              </el-tooltip>

              <div class="toolbar-divider"></div>

              <!-- 画布缩放控制器 -->
              <span class="zoom-label">缩放: {{ zoomLevel }}%</span>
              <el-button size="small" circle @click="zoomOut" :disabled="zoomLevel <= 80">-</el-button>
              <el-button size="small" circle @click="resetZoom">100%</el-button>
              <el-button size="small" circle @click="zoomIn" :disabled="zoomLevel >= 300">+</el-button>

              <div class="toolbar-divider"></div>

              <el-button size="small" plain type="danger" @click="clearBoard">
                <el-icon><RefreshRight /></el-icon>重置
              </el-button>

              <el-button size="small" type="success" plain @click="saveCurrentBlueprint">
                <el-icon><DocumentChecked /></el-icon>保存
              </el-button>
            </div>
          </div>

          <!-- 画布滚动画板容器 (右侧拼豆画布显示对应横竖方格与颜色) -->
          <div 
            class="canvas-viewport-container"
            @mouseleave="handleCanvasMouseUp"
          >
            <div 
              class="canvas-board-wrapper" 
              :style="{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }"
            >
              <div 
                class="pegboard-grid"
                :style="gridContainerStyle"
                @mousedown="handleCanvasMouseDown"
                @mouseup="handleCanvasMouseUp"
              >
                <div 
                  v-for="(cell, idx) in gridCells" 
                  :key="idx" 
                  class="peg-cell" 
                  :class="{
                    'pegboard-divider-right': showPegboardGuides && isBoardRightEdge(idx),
                    'pegboard-divider-bottom': showPegboardGuides && isBoardBottomEdge(idx)
                  }"
                  :style="{ backgroundColor: cell.hex || '#ffffff' }"
                  @mousedown.prevent="handleCellMouseDown(idx, $event)"
                  @mouseenter="handleCellMouseEnter(idx)"
                  :title="cell.code ? `[第 ${Math.floor(idx/gridSideLength)+1} 行 ${idx%gridSideLength+1} 列] ${cell.code} (${cell.name})` : '点击填色'"
                >
                  <span 
                    v-if="showColorCodeOnGrid && cell.code" 
                    class="grid-code-label"
                    :style="{ color: getContrastTextColor(cell.hex) }"
                  >
                    {{ cell.code }}
                  </span>
                  <span v-else class="peg-hole"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- 用量统计与开启分色拼豆按钮 -->
          <div class="canvas-bottom-section mt-16">
            <!-- 现存色号清单 -->
            <div class="bead-summary-box mb-16" v-if="usedColorsList.length > 0">
              <div class="summary-box-title">📊 识别提取的色号清单 (共计 {{ usedColorsList.length }} 种色号):</div>
              <div class="summary-tags-flex">
                <span 
                  v-for="item in usedColorsList" 
                  :key="item.hex"
                  class="bead-stat-pill"
                  :style="{ backgroundColor: item.hex, color: getContrastTextColor(item.hex) }"
                  @click="activeColor = paletteColors.find(p => p.hex === item.hex) || activeColor"
                  :title="`色号 ${item.code} (${item.name}) - 共 ${item.count} 颗`"
                >
                  <strong>{{ item.code }}</strong>
                </span>
              </div>
            </div>

            <div class="canvas-bottom-actions">
              <el-button 
                type="success" 
                size="large" 
                class="start-pindou-main-btn"
                @click="openImmersiveMode"
              >
                <el-icon><VideoPlay /></el-icon>开始拼豆 (进入 {{ gridSideLength }}×{{ gridSideLength }} 分色沉浸模式)
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 全屏沉浸式分色拼豆模式 (Teleport 到 document.body，实现 100% 真全屏覆盖) -->
    <teleport to="body">
      <div v-if="isImmersiveMode" class="true-fullscreen-pindou-overlay">
        <div class="immersive-wrapper">
          <!-- 沉浸模式顶栏 -->
          <header class="immersive-top-header">
            <div class="left-action">
              <el-button plain class="btn-exit-immersive" @click="isImmersiveMode = false">
                <el-icon><Close /></el-icon>退出沉浸模式
              </el-button>
            </div>

            <div class="center-title-box">
              <h3 class="immersive-title">🧩 “不拼命” 沉浸式分色拼豆 ({{ gridSideLength }} × {{ gridSideLength }})</h3>
              <span class="overall-progress-text">
                总体用豆进度：{{ totalPlacedCount }} / {{ totalUsedBeadsCount }} 颗 ({{ overallPercentage }}%)
              </span>
            </div>

            <div class="right-action">
              <div class="immersive-zoom-toolbar">
                <span class="zoom-level-tag">{{ immersiveZoomLevel }}%</span>
                <el-button size="small" circle @click="zoomOutImmersive">-</el-button>
                <el-button size="small" plain @click="fitImmersiveToScreen">适合屏幕</el-button>
                <el-button size="small" circle @click="zoomInImmersive">+</el-button>
              </div>
              <el-progress 
                type="circle" 
                :percentage="overallPercentage" 
                :width="40" 
                :stroke-width="4"
                color="#10b981"
              />
            </div>
          </header>

          <!-- 色号切换导航栏 -->
          <div class="color-focus-nav-bar">
            <span class="focus-bar-label">分色沉浸选色：</span>
            <div class="color-chips-scroll">
              <div 
                v-for="(item, index) in usedColorsList" 
                :key="item.hex"
                class="focus-color-chip"
                :class="{ 
                  active: focusedColorIndex === index, 
                  finished: item.isFinished 
                }"
                @click="focusedColorIndex = index"
              >
                <span class="chip-color-dot" :style="{ backgroundColor: item.hex }"></span>
                <span class="chip-color-name">{{ item.code }}</span>
                <el-icon v-if="item.isFinished" class="finished-check-icon"><CircleCheck /></el-icon>
              </div>
            </div>
          </div>

          <!-- 沉浸模式拼豆主画布 (高亮当前色，非当前部位显示浅底黑字线框轮廓) -->
          <main class="immersive-canvas-viewport">
            <div 
              class="immersive-canvas-scroll-container"
              :style="{ transform: `scale(${immersiveZoomLevel / 100})`, transformOrigin: 'center center' }"
            >
              <div 
                class="immersive-pegboard-grid"
                :style="gridContainerStyleImmersive"
              >
                <div 
                  v-for="(cell, idx) in gridCells" 
                  :key="idx" 
                  class="immersive-peg-cell" 
                  :class="{
                    'is-focused-target': isFocusedCell(cell.hex),
                    'is-wireframe-other': cell.hex && !isFocusedCell(cell.hex),
                    'is-cell-placed': placedBeadsMap[idx]
                  }"
                  :style="getCellImmersiveStyle(cell)"
                  @click="toggleCellBeadPlaced(idx, cell.hex)"
                >
                  <!-- 聚焦当前色号：已打豆显示绿勾，未打豆显示满色彩色号 -->
                  <template v-if="isFocusedCell(cell.hex)">
                    <el-icon v-if="placedBeadsMap[idx]" class="bead-check-icon"><Check /></el-icon>
                    <span v-else class="bead-code-label" :style="{ color: getContrastTextColor(cell.hex) }">{{ cell.code }}</span>
                  </template>
                  <!-- 其他非聚焦部位：线框轮廓显示色号，图像整体跟进一目了然 -->
                  <template v-else-if="cell.code">
                    <span class="wireframe-code-label">{{ cell.code }}</span>
                  </template>
                  <span v-else class="peg-hole-muted"></span>
                </div>
              </div>
            </div>
          </main>

          <!-- 沉浸模式底栏 -->
          <footer class="immersive-bottom-dock">
            <div class="current-focus-info" v-if="currentFocusColorItem">
              <div class="focus-badge" :style="{ backgroundColor: currentFocusColorItem.hex, color: getContrastTextColor(currentFocusColorItem.hex) }">
                {{ currentFocusColorItem.code }}
              </div>
              <div class="focus-text-details">
                <strong class="focus-name">当前色号：{{ currentFocusColorItem.code }}</strong>
              </div>
            </div>

            <div class="dock-center-actions">
              <el-button 
                type="primary" 
                size="large" 
                class="finish-color-next-btn"
                @click="completeCurrentColorAndNext"
              >
                <el-icon><CircleCheck /></el-icon>完成当前颜色，进入下一个颜色 →
              </el-button>
            </div>
          </footer>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  RefreshRight, 
  Grid,
  Picture,
  VideoPlay,
  Close,
  Check,
  CircleCheck,
  Download,
  DocumentChecked
} from '@element-plus/icons-vue'
import img7704Url from '../../pic/IMG_7704.jpg'

defineEmits(['back'])

const boardSize = ref('64x64')
const fileInputRef = ref(null)
const showColorCodeOnGrid = ref(true)
const showPegboardGuides = ref(true)

// 上传的原始图片预览 (User request 2: 上传后显示上传的图片原稿)
const uploadedImageSrc = ref(img7704Url)

// 画板工具与历史记录 (Undo/Redo & Drag-to-paint)
const currentTool = ref('brush')
const zoomLevel = ref(100)
const historyStack = ref([])
const historyIndex = ref(-1)

// 连续拖拽作画状态
const isMouseDown = ref(false)
const hasMutatedDuringDrag = ref(false)

// 计算当前边长
const gridSideLength = computed(() => {
  if (boardSize.value === '80x80') return 80
  if (boardSize.value === '64x64') return 64
  if (boardSize.value === '52x52') return 52
  if (boardSize.value === '29x29') return 29
  return 14
})

// 计算 29x29 标准拼板需要数量
const boardsRequired = computed(() => {
  const side = gridSideLength.value
  const cols = Math.ceil(side / 29)
  const rows = Math.ceil(side / 29)
  return { count: cols * rows, cols, rows }
})

// 物理拼板边框判断
const isBoardRightEdge = (idx) => {
  const side = gridSideLength.value
  const col = (idx % side) + 1
  return col % 29 === 0 && col !== side
}

const isBoardBottomEdge = (idx) => {
  const side = gridSideLength.value
  const row = Math.floor(idx / side) + 1
  return row % 29 === 0 && row !== side
}

// 扩展全色系 MARD / ARTKAL 拼豆调色盘库 (已针对图纸采样进行精准色彩校准)
const paletteColors = ref([
  // 黑白灰
  { code: 'H7',  name: '纯黑墨碳', hex: '#141414', cat: 'bw' },
  { code: 'H2',  name: '纯白雪玉', hex: '#ffffff', cat: 'bw' },
  { code: 'H15', name: '亮银月灰', hex: '#91999e', cat: 'bw' },
  { code: 'H16', name: '深石炭灰', hex: '#33373b', cat: 'bw' },
  { code: 'H5',  name: '深石墨灰', hex: '#4b5157', cat: 'bw' },
  { code: 'M12', name: '烟薰中灰', hex: '#676f78', cat: 'bw' },
  { code: 'H6',  name: '极夜深灰', hex: '#22262a', cat: 'bw' },
  { code: 'H1',  name: '象牙乳白', hex: '#fef3c7', cat: 'bw' },
  { code: 'H3',  name: '浅云麻灰', hex: '#e5e7eb', cat: 'bw' },
  { code: 'H4',  name: '水泥冷灰', hex: '#d1d5db', cat: 'bw' },

  // 红与粉
  { code: 'G09', name: '鲜亮大红', hex: '#dc2626', cat: 'red' },
  { code: 'F11', name: '红棕深啡', hex: '#3b1a16', cat: 'red' },
  { code: 'P1',  name: '甜美粉红', hex: '#f43f5e', cat: 'red' },
  { code: 'P2',  name: '柔粉樱花', hex: '#fda4af', cat: 'red' },
  { code: 'P3',  name: '水粉草莓', hex: '#fb7185', cat: 'red' },
  { code: 'G13', name: '红棕栗色', hex: '#9a4a2d', cat: 'red' },
  { code: 'G10', name: '玫瑰酒红', hex: '#881337', cat: 'red' },
  { code: 'P4',  name: '浅桃粉红', hex: '#fecdd3', cat: 'red' },
  { code: 'P5',  name: '珊瑚水红', hex: '#ff6b6b', cat: 'red' },
  { code: 'G12', name: '豆沙红棕', hex: '#7f1d1d', cat: 'red' },

  // 橙与黄
  { code: 'G6',  name: '暖阳鲜橙', hex: '#de8a3b', cat: 'yellow' },
  { code: 'G7',  name: '赭石棕橙', hex: '#b56939', cat: 'yellow' },
  { code: 'G1',  name: '米暖肤黄', hex: '#fbe0bf', cat: 'yellow' },
  { code: 'A6',  name: '金明耀黄', hex: '#eab308', cat: 'yellow' },
  { code: 'A12', name: '浅桃肉肤', hex: '#fcba9d', cat: 'yellow' },
  { code: 'A2',  name: '柠檬鲜黄', hex: '#fde047', cat: 'yellow' },
  { code: 'A1',  name: '奶黄淡彩', hex: '#fef9c3', cat: 'yellow' },
  { code: 'A3',  name: '芥末明黄', hex: '#ca8a04', cat: 'yellow' },
  { code: 'A5',  name: '暖杏肤色', hex: '#ffedd5', cat: 'yellow' },
  { code: 'A8',  name: '小麦肤色', hex: '#fdba74', cat: 'yellow' },

  // 绿
  { code: 'B24', name: '嫩绿鲜翠', hex: '#d2ea9b', cat: 'green' },
  { code: 'G17', name: '暗绿苍翠', hex: '#3f4a27', cat: 'green' },
  { code: 'B18', name: '森林深绿', hex: '#166534', cat: 'green' },
  { code: 'B5',  name: '薄荷浅绿', hex: '#4ade80', cat: 'green' },
  { code: 'B1',  name: '荧光黄绿', hex: '#84cc16', cat: 'green' },
  { code: 'B2',  name: '橄榄苍绿', hex: '#65a30d', cat: 'green' },
  { code: 'B7',  name: '浅青水绿', hex: '#86efac', cat: 'green' },
  { code: 'B10', name: '墨绿青苔', hex: '#14532d', cat: 'green' },
  { code: 'B12', name: '抹茶雅绿', hex: '#4d7c0f', cat: 'green' },
  { code: 'B15', name: '碧青翠绿', hex: '#10b981', cat: 'green' },

  // 蓝
  { code: 'D4',  name: '宝蓝蔚蓝', hex: '#173e9e', cat: 'blue' },
  { code: 'D2',  name: '紫蓝雾青', hex: '#7e8ce0', cat: 'blue' },
  { code: 'C8',  name: '湖水亮蓝', hex: '#1d64c8', cat: 'blue' },
  { code: 'D1',  name: '天青浅蓝', hex: '#60a5fa', cat: 'blue' },
  { code: 'D10', name: '藏青深蓝', hex: '#1e3a8a', cat: 'blue' },
  { code: 'C1',  name: '冰蓝水清', hex: '#cff4fc', cat: 'blue' },
  { code: 'D3',  name: '钴蓝深海', hex: '#1d4ed8', cat: 'blue' },
  { code: 'C5',  name: '蒂芙尼蓝', hex: '#2dd4bf', cat: 'blue' },
  { code: 'D6',  name: '灰调雾蓝', hex: '#93c5fd', cat: 'blue' },
  { code: 'D8',  name: '暗夜墨蓝', hex: '#172554', cat: 'blue' },

  // 紫与棕
  { code: 'E2',  name: '优雅罗兰紫', hex: '#a855f7', cat: 'purple' },
  { code: 'E1',  name: '浅熏衣紫', hex: '#c084fc', cat: 'purple' },
  { code: 'E5',  name: '深葡萄紫', hex: '#581c87', cat: 'purple' },
  { code: 'E8',  name: '丁香粉紫', hex: '#e9d5ff', cat: 'purple' },
  { code: 'F2',  name: '焦糖琥珀棕', hex: '#d97706', cat: 'purple' },
  { code: 'F8',  name: '深木摩卡棕', hex: '#78350f', cat: 'purple' },
  { code: 'F4',  name: '咖啡黑棕', hex: '#451a03', cat: 'purple' },
  { code: 'F1',  name: '浅咖奶茶', hex: '#b45309', cat: 'purple' },
  { code: 'F6',  name: '木质红棕', hex: '#92400e', cat: 'purple' },
  { code: 'E4',  name: '皇家深紫', hex: '#6b21a8', cat: 'purple' }
])

const activeColor = ref(paletteColors.value[0])

// CIELAB 算法计算
const hexToLab = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100 / 95.047
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100 / 100.000
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100 / 108.883

  x = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16 / 116
  y = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16 / 116
  z = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16 / 116

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

const paletteLabCache = paletteColors.value.map(item => ({
  ...item,
  lab: hexToLab(item.hex)
}))

const rgbToLab = (r8, g8, b8) => {
  let r = r8 / 255, g = g8 / 255, b = b8 / 255
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100 / 95.047
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100 / 100.000
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100 / 108.883

  x = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16 / 116
  y = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16 / 116
  z = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16 / 116

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

const findClosestPaletteItemLab = (r, g, b, allowedCodes = null) => {
  const targetLab = rgbToLab(r, g, b)
  let minDist = Infinity
  let closest = paletteLabCache[0]

  for (let i = 0; i < paletteLabCache.length; i++) {
    const item = paletteLabCache[i]
    if (allowedCodes && Array.isArray(allowedCodes) && allowedCodes.length > 0) {
      if (!allowedCodes.includes(item.code)) continue
    }

    const dL = targetLab[0] - item.lab[0]
    const da = targetLab[1] - item.lab[1]
    const db = targetLab[2] - item.lab[2]
    const dist = dL * dL + da * da + db * db
    if (dist < minDist) {
      minDist = dist
      closest = item
    }
  }
  return closest
}

// 画布数据 (存对象 { hex, code, name })
const gridCells = ref(Array(64 * 64).fill({ hex: '', code: '', name: '' }))

// 高对比度文本颜色
const getContrastTextColor = (hex) => {
  if (!hex || hex === '#ffffff') return '#000000'
  const cr = parseInt(hex.slice(1, 3), 16) || 0
  const cg = parseInt(hex.slice(3, 5), 16) || 0
  const cb = parseInt(hex.slice(5, 7), 16) || 0
  const yiq = (cr * 299 + cg * 587 + cb * 114) / 1000
  return yiq >= 128 ? '#000000' : '#ffffff'
}

// 画布动态布局参数
const gridContainerStyle = computed(() => {
  const side = gridSideLength.value
  let cellSize = 11
  if (side === 80) cellSize = 9
  else if (side === 64) cellSize = 11
  else if (side === 52) cellSize = 13
  else if (side === 29) cellSize = 18
  else if (side === 14) cellSize = 26

  return {
    gridTemplateColumns: `repeat(${side}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${side}, ${cellSize}px)`,
    gap: side >= 52 ? '1px' : '3px'
  }
})

// 沉浸模式布局参数
const gridContainerStyleImmersive = computed(() => {
  const side = gridSideLength.value
  let cellSize = 16
  if (side === 80) cellSize = 12
  else if (side === 64) cellSize = 15
  else if (side === 52) cellSize = 18
  else if (side === 29) cellSize = 24
  else if (side === 14) cellSize = 32

  return {
    gridTemplateColumns: `repeat(${side}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${side}, ${cellSize}px)`,
    gap: side >= 52 ? '1.5px' : '4px'
  }
})

// 缩放控制
const zoomIn = () => { if (zoomLevel.value < 300) zoomLevel.value += 25 }
const zoomOut = () => { if (zoomLevel.value > 80) zoomLevel.value -= 25 }
const resetZoom = () => { zoomLevel.value = 100 }

// ↩️ 历史记录 stack
const saveHistoryState = () => {
  const copy = gridCells.value.map(c => ({ ...c }))
  if (historyIndex.value < historyStack.value.length - 1) {
    historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
  }
  historyStack.value.push(copy)
  if (historyStack.value.length > 35) {
    historyStack.value.shift()
  } else {
    historyIndex.value++
  }
}

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    gridCells.value = historyStack.value[historyIndex.value].map(c => ({ ...c }))
  }
}

const redo = () => {
  if (historyIndex.value < historyStack.value.length - 1) {
    historyIndex.value++
    gridCells.value = historyStack.value[historyIndex.value].map(c => ({ ...c }))
  }
}

// 规格切换重置与重新采样
const onBoardSizeChange = () => {
  if (uploadedImageSrc.value) {
    processImageToGrid(uploadedImageSrc.value)
  } else {
    const total = gridSideLength.value * gridSideLength.value
    gridCells.value = Array(total).fill({ hex: '', code: '', name: '' })
    saveHistoryState()
  }
}

// 连续拖拽涂色逻辑 (Drag-to-paint)
const applyToolToCell = (index) => {
  const targetColor = activeColor.value
  const cell = gridCells.value[index]
  if (cell.hex !== targetColor.hex || cell.code !== targetColor.code) {
    gridCells.value[index] = { 
      hex: targetColor.hex, 
      code: targetColor.code, 
      name: targetColor.name 
    }
    hasMutatedDuringDrag.value = true
  }
}

const handleCellMouseDown = (index, e) => {
  if (e.button !== 0) return
  isMouseDown.value = true
  hasMutatedDuringDrag.value = false
  applyToolToCell(index)
}

const handleCellMouseEnter = (index) => {
  if (isMouseDown.value) {
    applyToolToCell(index)
  }
}

const handleCanvasMouseDown = () => {
  isMouseDown.value = true
}

const handleCanvasMouseUp = () => {
  if (isMouseDown.value) {
    isMouseDown.value = false
    if (hasMutatedDuringDrag.value) {
      saveHistoryState()
      hasMutatedDuringDrag.value = false
    }
  }
}

// 清空画布
const clearBoard = () => {
  const total = gridSideLength.value * gridSideLength.value
  gridCells.value = Array(total).fill({ hex: '', code: '', name: '' })
  placedBeadsMap.value = {}
  saveHistoryState()
  ElMessage.success('画布已重置')
}

// 示例图纸 IMG_7704 绑定的精准 19 种拼豆色号集合
const img7704PaletteCodes = [
  'F11', 'H7', 'H15', 'G6', 'G7', 'H2', 'G1', 'H16', 'H5', 
  'D4', 'A6', 'G17', 'G13', 'M12', 'H6', 'D2', 'A12', 'B24', 'C8'
]

// 辅助判断单元格是否主要为无色留白背景
const isWhiteBackgroundPixel = (pixels) => {
  let whiteCount = 0
  pixels.forEach(({ r, g, b }) => {
    if (r > 235 && g > 235 && b > 235) whiteCount++
  })
  return (whiteCount / pixels.length) > 0.6
}

// 核心图片像素矩阵提取与转换引擎 (主导色频次聚类采样算法)
const processImageToGrid = (imageSrc) => {
  const side = gridSideLength.value
  const img = new Image()
  img.onload = () => {
    const sampleScale = 10
    const hrWidth = side * sampleScale
    const hrHeight = side * sampleScale

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = hrWidth
    canvas.height = hrHeight

    // 截取上方 1:1 正方形画板区域 (0..img.width)
    const sourceWidth = img.width
    const sourceHeight = Math.min(img.width, img.height)

    ctx.drawImage(img, 0, 0, sourceWidth, sourceHeight, 0, 0, hrWidth, hrHeight)
    const imgData = ctx.getImageData(0, 0, hrWidth, hrHeight)
    const data = imgData.data

    const allowedCodes = (imageSrc === img7704Url) ? img7704PaletteCodes : null
    const newGrid = []

    for (let row = 0; row < side; row++) {
      for (let col = 0; col < side; col++) {
        // 64x64 图纸的两侧 1..9 列与 53..64 列全为画布留白区
        const isSideBlankColumn = (side === 64) && (col < 9 || col >= 52)
        if (isSideBlankColumn) {
          newGrid.push({ hex: '', code: '', name: '' })
          continue
        }

        // 采样单元格内圈 60% 核心像素 (避开黑字与橙线)
        const startX = Math.floor(col * sampleScale + sampleScale * 0.2)
        const endX = Math.floor(col * sampleScale + sampleScale * 0.8)
        const startY = Math.floor(row * sampleScale + sampleScale * 0.2)
        const endY = Math.floor(row * sampleScale + sampleScale * 0.8)

        const pixels = []
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * hrWidth + x) * 4
            const r = data[idx]
            const g = data[idx + 1]
            const b = data[idx + 2]
            const a = data[idx + 3]

            if (a >= 40) {
              pixels.push({ r, g, b })
            }
          }
        }

        if (pixels.length === 0) {
          newGrid.push({ hex: '', code: '', name: '' })
          continue
        }

        // 统计该单元格内主导色出现频次 (Dominant Palette Color)
        const codeCounts = {}
        pixels.forEach(({ r, g, b }) => {
          const matched = findClosestPaletteItemLab(r, g, b, allowedCodes)
          const key = matched.code
          if (!codeCounts[key]) {
            codeCounts[key] = { count: 0, matched }
          }
          codeCounts[key].count++
        })

        let maxCount = -1
        let bestMatch = null
        Object.keys(codeCounts).forEach(code => {
          if (codeCounts[code].count > maxCount) {
            maxCount = codeCounts[code].count
            bestMatch = codeCounts[code].matched
          }
        })

        const isWhiteBg = isWhiteBackgroundPixel(pixels)

        if (!bestMatch || (bestMatch.code === 'H2' && isWhiteBg)) {
          newGrid.push({ hex: '', code: '', name: '' })
        } else {
          newGrid.push({ hex: bestMatch.hex, code: bestMatch.code, name: bestMatch.name })
        }
      }
    }

    gridCells.value = newGrid
    placedBeadsMap.value = {}
    saveHistoryState()
  }
  img.src = imageSrc
}

// 载入 IMG_7704 示例图纸
const loadIMG7704Case = () => {
  boardSize.value = '64x64'
  uploadedImageSrc.value = img7704Url
  processImageToGrid(img7704Url)
  ElMessage.success('🎉 成功载入示例图纸 (IMG_7704 64×64) 并智能映射右侧拼豆矩阵！')
}

// 上传本地拼豆图纸/像素图片 (User request 1, 2, 3, 4)
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const src = e.target.result
    uploadedImageSrc.value = src
    processImageToGrid(src)
    ElMessage.success(`🎉 图纸解析成功！已在右侧显示 ${gridSideLength.value}×${gridSideLength.value} 对应的矩阵与色块！`)
    event.target.value = ''
  }
  reader.readAsDataURL(file)
}

// 🖨️ 导出 HD 打印级拼豆图纸
const exportHDBlueprint = () => {
  const side = gridSideLength.value
  const cellSize = 22
  const padding = 60
  const headerHeight = 120
  const legendItemHeight = 28
  const list = usedColorsList.value
  const legendRows = Math.ceil(list.length / 4) || 1
  const legendHeight = legendRows * legendItemHeight + 70
  const canvasWidth = Math.max(860, side * cellSize + padding * 2)
  const canvasHeight = headerHeight + side * cellSize + legendHeight + padding

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')

  // 白色底图
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 标头
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 26px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`“不拼命” 拼豆 HD 打印图纸 (${side} × ${side})`, canvasWidth / 2, 45)

  ctx.fillStyle = '#64748b'
  ctx.font = '13.5px sans-serif'
  ctx.fillText(
    `色号: ${list.length} 种  |  拼板需求: ${boardsRequired.value.count} 块 29×29 标准单板`, 
    canvasWidth / 2, 
    78
  )

  // 绘制拼豆网格
  const startX = (canvasWidth - side * cellSize) / 2
  const startY = headerHeight

  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(startX - 12, startY - 12, side * cellSize + 24, side * cellSize + 24)
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1.5
  ctx.strokeRect(startX - 12, startY - 12, side * cellSize + 24, side * cellSize + 24)

  // 绘制坐标刻度线
  ctx.fillStyle = '#94a3b8'
  ctx.font = '10px sans-serif'
  for (let i = 0; i < side; i += 10) {
    const x = startX + i * cellSize + cellSize / 2
    const y = startY + i * cellSize + cellSize / 2
    ctx.fillText(`${i + 1}`, x, startY - 18)
    ctx.fillText(`${i + 1}`, startX - 22, y)
  }

  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      const idx = r * side + c
      const cell = gridCells.value[idx]
      const cx = startX + c * cellSize + cellSize / 2
      const cy = startY + r * cellSize + cellSize / 2

      ctx.beginPath()
      ctx.arc(cx, cy, (cellSize / 2) - 1, 0, Math.PI * 2)
      ctx.fillStyle = cell.hex || '#ffffff'
      ctx.fill()
      ctx.strokeStyle = '#e2e8f0'
      ctx.stroke()

      if (cell.code) {
        ctx.fillStyle = getContrastTextColor(cell.hex)
        ctx.font = 'bold 8.5px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(cell.code, cx, cy)
      }
    }
  }

  // 绘制 29x29 物理拼板分割线
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 2.5
  ctx.setLineDash([6, 4])
  for (let col = 29; col < side; col += 29) {
    const x = startX + col * cellSize
    ctx.beginPath()
    ctx.moveTo(x, startY)
    ctx.lineTo(x, startY + side * cellSize)
    ctx.stroke()
  }
  for (let row = 29; row < side; row += 29) {
    const y = startY + row * cellSize
    ctx.beginPath()
    ctx.moveTo(startX, y)
    ctx.lineTo(startX + side * cellSize, y)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // 绘制用量清单
  const legendStartY = startY + side * cellSize + 35
  ctx.fillStyle = '#1e293b'
  ctx.font = 'bold 15px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('📊 用豆色号清单与极简对照表：', startX, legendStartY)

  const colWidth = (side * cellSize) / 4
  list.forEach((item, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    const x = startX + col * colWidth
    const y = legendStartY + 30 + row * legendItemHeight

    ctx.beginPath()
    ctx.arc(x + 10, y, 7, 0, Math.PI * 2)
    ctx.fillStyle = item.hex
    ctx.fill()
    ctx.strokeStyle = '#cbd5e1'
    ctx.stroke()

    ctx.fillStyle = '#334155'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${item.code} ${item.name}`, x + 22, y)
  })

  // 触发下载
  const link = document.createElement('a')
  link.download = `happylife_pindou_blueprint_${side}x${side}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
  ElMessage.success('🎉 已成功导出带 29×29 分格线的 HD 高清打印图纸！')
}

// 快捷键监听
const handleKeyDown = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
    if (e.shiftKey) redo()
    else undo()
    e.preventDefault()
  } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
    redo()
    e.preventDefault()
  }
}

const isImmersiveMode = ref(false)
const focusedColorIndex = ref(0)
const placedBeadsMap = ref({})
const immersiveZoomLevel = ref(100)

const usedColorsList = computed(() => {
  const counts = {}
  gridCells.value.forEach(cell => {
    if (cell && cell.hex) {
      counts[cell.hex] = (counts[cell.hex] || 0) + 1
    }
  })

  return Object.keys(counts).map(hex => {
    const matched = paletteColors.value.find(p => p.hex === hex) || { code: 'C', name: '自定义' }
    const totalCount = counts[hex]

    let completed = 0
    gridCells.value.forEach((cell, idx) => {
      if (cell && cell.hex === hex && placedBeadsMap.value[idx]) {
        completed++
      }
    })

    return {
      hex,
      code: matched.code,
      name: matched.name,
      count: totalCount,
      completedCount: completed,
      isFinished: completed >= totalCount && totalCount > 0
    }
  }).sort((a, b) => {
    const idxA = img7704PaletteCodes.indexOf(a.code)
    const idxB = img7704PaletteCodes.indexOf(b.code)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return b.count - a.count
  })
})

const currentFocusColorItem = computed(() => {
  return usedColorsList.value[focusedColorIndex.value] || null
})

const totalUsedBeadsCount = computed(() => {
  return usedColorsList.value.reduce((sum, item) => sum + item.count, 0)
})

const totalPlacedCount = computed(() => {
  return usedColorsList.value.reduce((sum, item) => sum + item.completedCount, 0)
})

const overallPercentage = computed(() => {
  if (totalUsedBeadsCount.value === 0) return 0
  return Math.round((totalPlacedCount.value / totalUsedBeadsCount.value) * 100)
})

const fitImmersiveToScreen = () => {
  const side = gridSideLength.value
  let baseCellSize = 15
  if (side === 80) baseCellSize = 12
  else if (side === 64) baseCellSize = 15
  else if (side === 52) baseCellSize = 18
  else if (side === 29) baseCellSize = 24
  else if (side === 14) baseCellSize = 32

  const boardPx = side * baseCellSize + 40
  const availHeight = Math.max(300, window.innerHeight - 230)
  const availWidth = Math.max(300, window.innerWidth - 60)

  const scale = Math.min(availWidth / boardPx, availHeight / boardPx) * 100
  immersiveZoomLevel.value = Math.max(30, Math.min(150, Math.floor(scale)))
}

const zoomInImmersive = () => {
  if (immersiveZoomLevel.value < 250) immersiveZoomLevel.value += 15
}
const zoomOutImmersive = () => {
  if (immersiveZoomLevel.value > 30) immersiveZoomLevel.value -= 15
}

const openImmersiveMode = () => {
  if (usedColorsList.value.length === 0) {
    loadIMG7704Case()
  }
  focusedColorIndex.value = 0
  isImmersiveMode.value = true
  setTimeout(() => {
    fitImmersiveToScreen()
  }, 50)
}

const isFocusedCell = (cellHex) => {
  if (!cellHex || !currentFocusColorItem.value) return false
  return cellHex === currentFocusColorItem.value.hex
}

const isMutedCell = (cellHex) => {
  if (!cellHex) return false
  if (!currentFocusColorItem.value) return false
  return cellHex !== currentFocusColorItem.value.hex
}

const isShowMutedCode = (cellHex) => {
  return Boolean(cellHex && isMutedCell(cellHex) && gridSideLength.value <= 29)
}

const getCellImmersiveStyle = (cell) => {
  if (!cell || !cell.hex) {
    return {
      backgroundColor: '#0f172a',
      border: '1px solid #1e293b'
    }
  }

  if (isFocusedCell(cell.hex)) {
    // 当前正在进行的色号：100% 满色彩高亮 + 强化边框与发光效果
    return { 
      backgroundColor: cell.hex,
      border: `2px solid ${getContrastTextColor(cell.hex)}`,
      boxShadow: `0 0 14px ${cell.hex}, 0 0 4px rgba(255, 255, 255, 0.8)`,
      transform: 'scale(1.12)',
      zIndex: 20,
      opacity: 1
    }
  } else {
    // 非当前进行中的部位：隐约保留图纸色彩与轮廓（28% 柔和透明底色 + 浅线条轮廓）
    return { 
      backgroundColor: cell.hex,
      border: '1px solid rgba(255, 255, 255, 0.15)',
      opacity: 0.28,
      filter: 'saturate(0.7)'
    }
  }
}

const toggleCellBeadPlaced = (idx, cellHex) => {
  if (!isFocusedCell(cellHex)) return
  placedBeadsMap.value[idx] = !placedBeadsMap.value[idx]
}

const completeCurrentColorAndNext = () => {
  if (!currentFocusColorItem.value) return

  const currentHex = currentFocusColorItem.value.hex
  gridCells.value.forEach((cell, idx) => {
    if (cell && cell.hex === currentHex) {
      placedBeadsMap.value[idx] = true
    }
  })

  const prevName = currentFocusColorItem.value.name
  const nextUnfinishedIdx = usedColorsList.value.findIndex((item, i) => i > focusedColorIndex.value && !item.isFinished)
  if (nextUnfinishedIdx !== -1) {
    focusedColorIndex.value = nextUnfinishedIdx
    ElMessage.success(`🎉 【${prevName}】已完成拼打！切入下一个颜色：${usedColorsList.value[nextUnfinishedIdx].code}`)
  } else {
    const firstUnfinishedIdx = usedColorsList.value.findIndex(item => !item.isFinished)
    if (firstUnfinishedIdx !== -1) {
      focusedColorIndex.value = firstUnfinishedIdx
      ElMessage.success(`🎉 切入下一个未完成颜色：${usedColorsList.value[firstUnfinishedIdx].code}`)
    } else {
      ElMessage.success('🏆 恭喜！整套图纸已 100% 完美拼打完成！')
    }
  }
}

// 💾 保存与自动重载手动纠正后的拼豆图纸 (LocalStorage)
const LOCAL_STORAGE_KEY = 'happylife_pindou_saved_blueprint_v1'

const saveCurrentBlueprint = () => {
  try {
    const saveData = {
      boardSize: boardSize.value,
      uploadedImageSrc: uploadedImageSrc.value,
      gridCells: gridCells.value.map(c => ({ ...c })),
      placedBeadsMap: { ...placedBeadsMap.value },
      savedAt: new Date().toLocaleString()
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData))
    ElMessage.success('💾 手动纠正后的图纸已成功保存！下一次打开时将自动载入。')
  } catch (err) {
    ElMessage.error('保存失败：存储空间不足')
  }
}

const loadSavedBlueprint = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.gridCells) && parsed.gridCells.length > 0) {
        boardSize.value = parsed.boardSize || '64x64'
        uploadedImageSrc.value = parsed.uploadedImageSrc || img7704Url
        gridCells.value = parsed.gridCells
        placedBeadsMap.value = parsed.placedBeadsMap || {}
        saveHistoryState()
        return true
      }
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

// 挂载与销毁
onMounted(() => {
  const hasSaved = loadSavedBlueprint()
  if (!hasSaved) {
    loadIMG7704Case()
  } else {
    ElMessage.info('ℹ️ 已自动从本地载入上次手动纠正保存的拼豆图纸！')
  }
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('mouseup', handleCanvasMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('mouseup', handleCanvasMouseUp)
})
</script>

<style scoped>
.pindou-tool { padding: 0; margin: 0 auto; }
.mb-20 { margin-bottom: 20px; }
.mb-16 { margin-bottom: 16px; }
.mb-10 { margin-bottom: 10px; }
.mb-8 { margin-bottom: 8px; }
.mt-4 { margin-top: 4px; }

.tool-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}
.header-left-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.btn-back-clean {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.btn-back-clean:hover {
  color: #ec4899;
  background: rgba(236, 72, 153, 0.08);
}
.header-divider {
  width: 1px;
  height: 16px;
  background: #cbd5e1;
}

.section-title { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin: 0; }
.section-subtitle { color: #64748b; font-size: 13.5px; margin: 0; font-weight: 400; }

.header-right-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.export-hd-btn {
  border-radius: 12px;
  font-weight: 700;
}

.start-pindou-top-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.glass-card { 
  border-radius: 24px; 
  background: rgba(255, 255, 255, 0.85) !important; 
  backdrop-filter: blur(20px); 
  border: 1px solid rgba(255, 255, 255, 0.5); 
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.05); 
}

.card-header-glow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}
.justify-between { justify-content: space-between; }

/* 左侧上传与原稿对比区域 */
.upload-sidebar-container {
  display: flex;
  flex-direction: column;
}
.upload-action-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.upload-primary-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 800;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border: none;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
}
.sample-case-btn {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
}

.pegboard-info-tip {
  font-size: 12px;
  color: #6366f1;
  font-weight: 600;
  background: #eef2ff;
  padding: 6px 12px;
  border-radius: 8px;
}

/* 上传原图预览卡片 (上面方形画板区 + 下面对应图像色号) */
.original-blueprint-card {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.preview-section-item {
  display: flex;
  flex-direction: column;
}
.section-sub-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}
.mb-6 { margin-bottom: 6px; }

/* 上面：图的画板区域 (截图 1：包含 1-64 行主图案 + 底部 1..64 坐标轴) */
.top-square-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1.05;
  overflow: hidden;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.top-square-image {
  width: 100%;
  height: 118%;
  object-fit: fill;
  object-position: top center;
}

/* 下面：色号对照区域 (截图 2：仅包含 F11/H7/H15 色号药丸，排除 1..64 坐标轴) */
.bottom-legend-preview-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.original-bottom-strip-wrapper {
  width: 100%;
  height: 52px;
  overflow: hidden;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.bottom-strip-image {
  width: 100%;
  height: 660%;
  object-fit: cover;
  object-position: bottom center;
}
.extracted-color-chips-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  margin-top: 4px;
}
.mini-color-chip-pill {
  font-size: 11px;
  padding: 4px 0;
  border-radius: 6px;
  font-weight: 800;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 画板工具栏 */
.workbench-toolbar-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f1f5f9;
  padding: 8px 16px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 10px;
}
.tools-left-info {
  display: flex;
  align-items: center;
}
.toolbar-hint-text {
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
}
.tools-right-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.toolbar-divider {
  width: 1px;
  height: 16px;
  background: #cbd5e1;
}
.zoom-label {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.canvas-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.active-color-tag { font-weight: 700; }

.canvas-viewport-container {
  width: 100%;
  overflow: auto;
  max-height: 680px;
  padding: 16px 0;
  display: flex;
  justify-content: center;
  user-select: none;
}
.canvas-viewport-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.canvas-viewport-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.canvas-board-wrapper {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.pegboard-grid {
  position: relative;
  z-index: 2;
  display: grid;
  padding: 10px;
  background: transparent;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #cbd5e1;
}

/* 方块填色 (User request 1: 带有颜色的方块变成方块填色，而不是圆圈填色) */
.peg-cell {
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.08s ease;
  user-select: none;
  box-sizing: border-box;
}
.peg-cell:hover {
  transform: scale(1.25);
  z-index: 10;
}

.pegboard-divider-right {
  border-right: 2px dashed #ec4899 !important;
}
.pegboard-divider-bottom {
  border-bottom: 2px dashed #ec4899 !important;
}

.grid-code-label {
  font-size: 7.5px;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
}
.peg-hole {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.15);
}

.bead-summary-box {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
}
.summary-box-title {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 8px;
}
.summary-tags-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.bead-stat-pill {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.canvas-bottom-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.start-pindou-main-btn {
  width: 100%;
  max-width: 520px;
  height: 48px;
  font-size: 16px;
  font-weight: 800;
  border-radius: 14px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

/* 真全屏覆盖全域浮层 (Teleport to body, 100% 遮盖包括应用顶部菜单在内的全屏幕) */
.true-fullscreen-pindou-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 999999 !important;
  background: #0f172a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 沉浸模式样式 */
:deep(.immersive-pindou-drawer) {
  background: #0f172a !important;
  color: #ffffff;
}
:deep(.immersive-pindou-drawer .el-drawer__body) {
  padding: 0 !important;
  background: #0f172a;
  overflow: hidden;
}

.immersive-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #0f172a;
}

.immersive-top-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}
.btn-exit-immersive {
  border-radius: 20px;
  background: transparent;
  color: #94a3b8;
  border-color: #475569;
}

.center-title-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.immersive-title {
  font-size: 18px;
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
}
.overall-progress-text {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

.color-focus-nav-bar {
  padding: 12px 24px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  display: flex;
  align-items: center;
  gap: 12px;
}
.focus-bar-label {
  font-size: 13px;
  color: #94a3b8;
  white-space: nowrap;
  font-weight: 600;
}
.color-chips-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.color-chips-scroll::-webkit-scrollbar { height: 4px; }
.color-chips-scroll::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }

.focus-color-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 12px;
  background: #334155;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.focus-color-chip.active {
  border-color: #10b981;
  background: #064e3b;
}
.focus-color-chip.finished {
  opacity: 0.6;
}
.chip-color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
.chip-color-name {
  font-size: 13px;
  font-weight: 700;
  color: #f8fafc;
}
.chip-color-count {
  font-size: 12px;
  color: #94a3b8;
}
.finished-check-icon {
  color: #10b981;
  font-size: 16px;
}

.right-action {
  display: flex;
  align-items: center;
  gap: 16px;
}
.immersive-zoom-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0f172a;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #334155;
}
.zoom-level-tag {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  min-width: 42px;
  text-align: center;
}

.immersive-canvas-viewport {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  overflow: auto;
  position: relative;
}
.immersive-canvas-scroll-container {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  box-sizing: border-box;
}

.immersive-pegboard-grid {
  display: grid;
  padding: 16px;
  background: #1e293b;
  border-radius: 20px;
  border: 1px solid #334155;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.immersive-peg-cell {
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.bead-code-label {
  font-size: 8px;
  font-weight: 800;
  line-height: 1;
}

.wireframe-code-label {
  font-size: 7.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.bead-check-icon {
  color: #ffffff;
  font-size: 16px;
  font-weight: 900;
}

.peg-muted-code {
  font-size: 6.5px;
  color: #64748b;
}

.peg-hole-muted {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
}

.immersive-bottom-dock {
  height: 80px;
  padding: 0 32px;
  background: #1e293b;
  border-top: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-focus-info {
  display: flex;
  align-items: center;
  gap: 14px;
}
.focus-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.focus-text-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.focus-name {
  font-size: 16px;
  color: #f8fafc;
}
.focus-sub-count {
  font-size: 13px;
  color: #94a3b8;
}

.finish-color-next-btn {
  height: 46px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 800;
  border-radius: 14px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
}
</style>
