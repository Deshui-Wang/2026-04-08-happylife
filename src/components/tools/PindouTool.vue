<template>
  <div class="pindou-tool animate-fade-in">
    <!-- 工具顶部导航栏（单行极简高雅设计） -->
    <div class="tool-header-row mb-20">
      <div class="header-left-group">
        <div class="btn-back-clean" @click="$emit('back')">
          <el-icon><ArrowLeft></ArrowLeft></el-icon>
          <span>返回</span>
        </div>
        <div class="header-divider"></div>
        <h2 class="section-title">拼豆不拼命</h2>
        <span class="section-subtitle">像素图案设计 · 拼豆色号对照 · 轻松创作不费眼</span>
      </div>

      <!-- 顶栏右侧核心入口：开始拼豆沉浸模式 -->
      <div class="header-right-actions">
        <el-button 
          type="success" 
          size="default" 
          class="start-pindou-top-btn"
          @click="openImmersiveMode"
        >
          <el-icon><VideoPlay></VideoPlay></el-icon>开始拼豆 (沉浸模式)
        </el-button>
      </div>
    </div>

    <!-- 工作台体验演练主区 -->
    <el-row :gutter="24" class="main-layout-row">
      <!-- 左侧：拼豆画布设置与图纸生成工具栏 -->
      <el-col :xs="24" :lg="9" class="layout-col">
        <!-- 工具 1: 画布基础参数 -->
        <el-card class="glass-card tool-panel-card mb-20" :body-style="{ padding: '20px 24px' }">
          <template #header>
            <div class="card-header-glow">
              <el-icon><Setting></Setting></el-icon>
              <span>画布与品牌调色盘</span>
            </div>
          </template>

          <el-form label-position="top" class="pindou-config-form">
            <el-form-item label="拼豆模板规格">
              <el-select v-model="boardSize" style="width: 100%;">
                <el-option label="14 × 14 迷你标准单板" value="14x14"></el-option>
                <el-option label="29 × 29 标准大板 (5mm)" value="29x29"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="拼豆品牌色板">
              <el-radio-group v-model="selectedBrand" size="default">
                <el-radio-button value="MARD" label="MARD">MARD</el-radio-button>
                <el-radio-button value="MIDO" label="MIDO">MIDO</el-radio-button>
                <el-radio-button value="ARTKAL" label="ARTKAL">ARTKAL</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="当前绘图画笔色号 (再次点击格点可取消上色)">
              <div class="color-picker-palette">
                <div 
                  v-for="color in paletteColors" 
                  :key="color.code"
                  class="palette-chip"
                  :class="{ active: activeColor.code === color.code }"
                  :style="{ backgroundColor: color.hex }"
                  @click="activeColor = color"
                  :title="`${color.code} - ${color.name}`"
                >
                  <span class="chip-code">{{ color.code }}</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 工具 2: 本地图片与 AI 提示词图纸生成 -->
        <el-card class="glass-card generate-panel-card mb-20" :body-style="{ padding: '20px 24px' }">
          <template #header>
            <div class="card-header-glow">
              <el-icon><MagicStick></MagicStick></el-icon>
              <span>智能图纸生成工具</span>
            </div>
          </template>

          <div class="gen-tools-wrapper">
            <!-- 2A. 上传本地图片生成图纸 -->
            <div class="gen-section-item mb-16">
              <div class="section-label-title">📷 上传本地图片转拼豆图纸</div>
              <div class="upload-area">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref="fileInputRef" 
                  style="display: none;" 
                  @change="handleImageUpload"
                />
                <el-button 
                  type="primary" 
                  plain 
                  class="upload-trigger-btn"
                  @click="$refs.fileInputRef.click()"
                >
                  <el-icon><Picture></Picture></el-icon>选择本地图片一键转换
                </el-button>
              </div>
            </div>

            <!-- 2B. 提示词生成图纸 -->
            <div class="gen-section-item">
              <div class="section-label-title">✨ 输入提示词自动生成图纸</div>
              <div class="prompt-input-row">
                <el-input 
                  v-model="aiPrompt" 
                  placeholder="如：皮卡丘、马里奥、小红心、猫咪..." 
                  clearable 
                  @keyup.enter="generatePatternFromPrompt"
                  class="prompt-input"
                ></el-input>
                <el-button 
                  type="warning" 
                  class="ai-gen-btn"
                  @click="generatePatternFromPrompt"
                >
                  生成
                </el-button>
              </div>

              <!-- 快捷预设提示词 -->
              <div class="prompt-quick-tags mt-8">
                <span class="quick-label">热门方案：</span>
                <div class="chips-flex">
                  <span 
                    v-for="tag in quickPrompts" 
                    :key="tag" 
                    class="quick-chip"
                    @click="aiPrompt = tag; generatePatternFromPrompt()"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：像素画布预览与主操作区 -->
      <el-col :xs="24" :lg="15" class="layout-col">
        <el-card class="glass-card canvas-card" :body-style="{ padding: '24px' }">
          <template #header>
            <div class="card-header-glow justify-between">
              <div style="display:flex;align-items:center;gap:8px">
                <el-icon><Grid></Grid></el-icon>
                <span>拼豆设计画布</span>
              </div>

              <div class="canvas-header-right">
                <el-button size="small" plain @click="clearBoard">
                  <el-icon><RefreshRight></RefreshRight></el-icon>清空
                </el-button>
                <el-tag size="small" type="primary" effect="plain" class="active-color-tag">
                  画笔: {{ activeColor.code }} ({{ activeColor.name }})
                </el-tag>
              </div>
            </div>
          </template>

          <div class="canvas-board-wrapper">
            <div class="pegboard-grid">
              <div 
                v-for="(colorHex, idx) in gridCells" 
                :key="idx" 
                class="peg-cell" 
                :style="{ backgroundColor: colorHex || '#ffffff' }"
                @click="paintCell(idx)"
                :title="colorHex ? '点击可取消上色' : '点击填色'"
              >
                <span class="peg-hole"></span>
              </div>
            </div>
          </div>

          <!-- 开始拼豆大按钮 -->
          <div class="canvas-bottom-actions">
            <div class="tip-text">💡 提示：点击画布中的点可涂色，再次点击相同颜色可取消上色。准备好后点击“开始拼豆”进入分色沉浸拼打！</div>
            <el-button 
              type="success" 
              size="large" 
              class="start-pindou-main-btn"
              @click="openImmersiveMode"
            >
              <el-icon><VideoPlay></VideoPlay></el-icon>开始拼豆 (进入分色沉浸模式)
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 4. 全屏沉浸式拼豆模式全屏抽屉/弹窗 -->
    <el-drawer
      v-model="isImmersiveMode"
      direction="btt"
      size="100%"
      class="immersive-pindou-drawer"
      :show-close="false"
      :destroy-on-close="true"
    >
      <div class="immersive-wrapper">
        <!-- 沉浸模式顶栏 -->
        <header class="immersive-top-header">
          <div class="left-action">
            <el-button plain class="btn-exit-immersive" @click="isImmersiveMode = false">
              <el-icon><Close></Close></el-icon>退出沉浸模式
            </el-button>
          </div>

          <div class="center-title-box">
            <h3 class="immersive-title">🧩 “不拼命” 沉浸式分色拼豆</h3>
            <span class="overall-progress-text">
              总体用豆进度：{{ totalPlacedCount }} / {{ totalUsedBeadsCount }} 颗 ({{ overallPercentage }}%)
            </span>
          </div>

          <div class="right-action">
            <el-progress 
              type="circle" 
              :percentage="overallPercentage" 
              :width="44" 
              :stroke-width="5"
              color="#10b981"
            />
          </div>
        </header>

        <!-- 色号切换导航栏 (用户点击任何颜色即可进入该颜色的沉浸拼豆，其他颜色变灰色) -->
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
              <span class="chip-color-name">{{ item.code }} {{ item.name }}</span>
              <span class="chip-color-count">({{ item.completedCount }}/{{ item.count }})</span>
              <el-icon v-if="item.isFinished" class="finished-check-icon"><CircleCheck></CircleCheck></el-icon>
            </div>
          </div>
        </div>

        <!-- 沉浸模式拼豆主画布 (聚焦当前颜色，其它颜色灰度化) -->
        <main class="immersive-canvas-viewport">
          <div class="immersive-pegboard-grid">
            <div 
              v-for="(colorHex, idx) in gridCells" 
              :key="idx" 
              class="immersive-peg-cell" 
              :class="{
                'is-focused-target': isFocusedCell(colorHex),
                'is-muted-other': isMutedCell(colorHex),
                'is-cell-placed': placedBeadsMap[idx]
              }"
              :style="getCellImmersiveStyle(colorHex)"
              @click="toggleCellBeadPlaced(idx, colorHex)"
            >
              <!-- 聚焦颜色上的状态 -->
              <template v-if="isFocusedCell(colorHex)">
                <el-icon v-if="placedBeadsMap[idx]" class="bead-check-icon"><Check></Check></el-icon>
                <span v-else class="bead-highlight-dot"></span>
              </template>
              <span v-else class="peg-hole-muted"></span>
            </div>
          </div>
        </main>

        <!-- 沉浸模式底栏操作与完成跳至下一个颜色按钮 -->
        <footer class="immersive-bottom-dock">
          <div class="current-focus-info" v-if="currentFocusColorItem">
            <div class="focus-badge" :style="{ backgroundColor: currentFocusColorItem.hex }">
              {{ currentFocusColorItem.code }}
            </div>
            <div class="focus-text-details">
              <strong class="focus-name">{{ currentFocusColorItem.name }} (色号 {{ currentFocusColorItem.code }})</strong>
              <span class="focus-sub-count">
                当前颜色拼打进度：{{ currentFocusColorItem.completedCount }} / {{ currentFocusColorItem.count }} 颗
              </span>
            </div>
          </div>

          <div class="dock-center-actions">
            <el-button 
              type="primary" 
              size="large" 
              class="finish-color-next-btn"
              @click="completeCurrentColorAndNext"
            >
              <el-icon><CircleCheck></CircleCheck></el-icon>完成当前颜色，进入下一个颜色 →
            </el-button>
          </div>
        </footer>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Setting, 
  RefreshRight, 
  MagicStick, 
  Grid,
  Picture,
  VideoPlay,
  Close,
  Check,
  CircleCheck
} from '@element-plus/icons-vue'

defineEmits(['back'])

const boardSize = ref('14x14')
const selectedBrand = ref('MARD')
const aiPrompt = ref('')
const fileInputRef = ref(null)

// 调色盘色号
const paletteColors = ref([
  { code: 'A01', name: '纯白', hex: '#FFFFFF' },
  { code: 'B04', name: '樱花粉', hex: '#FFB7C5' },
  { code: 'C12', name: '薄荷绿', hex: '#A8E6CF' },
  { code: 'D08', name: '天空蓝', hex: '#84D2F6' },
  { code: 'E03', name: '柠檬黄', hex: '#FFD97D' },
  { code: 'F15', name: '薰衣草紫', hex: '#C3B1E1' },
  { code: 'G09', name: '暖心红', hex: '#FF6B6B' },
  { code: 'H20', name: '碳墨黑', hex: '#2D3436' }
])

const activeColor = ref(paletteColors.value[1]) // 默认粉色

// 14x14 拼豆画布
const gridCells = ref(Array(196).fill(''))

// 快捷预设提示词
const quickPrompts = ['皮卡丘', '超级玛丽', '小红心', '猫咪', '哆啦A梦']

// 功能 1：点击点位涂色，再次点击相同颜色取消上色
const paintCell = (index) => {
  if (gridCells.value[index] === activeColor.value.hex) {
    gridCells.value[index] = '' // 取消上色
  } else {
    gridCells.value[index] = activeColor.value.hex // 正常上色
  }
}

// 重置画布
const clearBoard = () => {
  gridCells.value = Array(196).fill('')
  placedBeadsMap.value = {}
  ElMessage.success('画布已重置')
}

// 功能 2：上传本地图片转换为拼豆图纸
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const side = 14
      canvas.width = side
      canvas.height = side

      ctx.drawImage(img, 0, 0, side, side)
      const imgData = ctx.getImageData(0, 0, side, side).data

      const newGrid = []
      for (let i = 0; i < side * side; i++) {
        const r = imgData[i * 4]
        const g = imgData[i * 4 + 1]
        const b = imgData[i * 4 + 2]
        const a = imgData[i * 4 + 3]

        if (a < 50) {
          newGrid.push('')
        } else {
          const hex = findClosestPaletteHex(r, g, b)
          newGrid.push(hex)
        }
      }
      gridCells.value = newGrid
      placedBeadsMap.value = {}
      ElMessage.success('🎉 本地图片已智能转换为拼豆图纸！')
      event.target.value = ''
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

// 找到调色盘中最接近的颜色
const findClosestPaletteHex = (r, g, b) => {
  let minDist = Infinity
  let closestHex = paletteColors.value[0].hex

  paletteColors.value.forEach(item => {
    const hex = item.hex
    const cr = parseInt(hex.slice(1, 3), 16) || 0
    const cg = parseInt(hex.slice(3, 5), 16) || 0
    const cb = parseInt(hex.slice(5, 7), 16) || 0

    const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2)
    if (dist < minDist) {
      minDist = dist
      closestHex = hex
    }
  })
  return closestHex
}

// 功能 3：提示词生成拼豆图纸
const generatePatternFromPrompt = () => {
  const p = aiPrompt.value.trim() || '小红心'
  clearBoard()

  const newGrid = Array(196).fill('')
  
  if (p.includes('马里奥') || p.includes('超级玛丽')) {
    // 马里奥经典像素红蓝图案
    const marioRed = [18, 19, 20, 21, 22, 31, 32, 33, 34, 35, 36, 37, 38, 39, 45, 46, 47, 50, 51]
    const marioBlue = [87, 88, 89, 90, 91, 92, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120]
    const marioBlack = [48, 49, 62, 63, 76, 77]
    marioRed.forEach(i => newGrid[i] = '#FF6B6B')
    marioBlue.forEach(i => newGrid[i] = '#84D2F6')
    marioBlack.forEach(i => newGrid[i] = '#2D3436')
  } else if (p.includes('皮卡丘')) {
    // 皮卡丘明黄与红脸蛋
    const yellow = [33, 34, 37, 38, 46, 47, 48, 49, 50, 51, 52, 53, 60, 61, 62, 63, 64, 65, 66, 67, 75, 76, 77, 78, 79, 80, 89, 90, 91, 92, 93, 94]
    const redCheek = [61, 66]
    const blackEye = [63, 64]
    yellow.forEach(i => newGrid[i] = '#FFD97D')
    redCheek.forEach(i => newGrid[i] = '#FF6B6B')
    blackEye.forEach(i => newGrid[i] = '#2D3436')
  } else if (p.includes('猫咪') || p.includes('猫')) {
    const catWhite = [33, 38, 46, 47, 48, 51, 52, 53, 60, 61, 62, 63, 64, 65, 66, 67, 74, 75, 76, 77, 78, 79, 80, 81]
    const catPink = [62, 65]
    catWhite.forEach(i => newGrid[i] = '#FFFFFF')
    catPink.forEach(i => newGrid[i] = '#FFB7C5')
  } else {
    // 默认生成爱心图案
    const heart = [
      33, 34, 37, 38,
      46, 47, 48, 49, 50, 51, 52, 53,
      60, 61, 62, 63, 64, 65, 66, 67,
      75, 76, 77, 78, 79, 80,
      90, 91, 92, 93,
      105, 106
    ]
    heart.forEach(i => newGrid[i] = '#FF6B6B')
  }

  gridCells.value = newGrid
  ElMessage.success(`✨ 已根据提示词“${p}”成功生成拼豆图纸！`)
}

// 功能 4：全屏沉浸式拼豆模式与分色高亮机制
const isImmersiveMode = ref(false)
const focusedColorIndex = ref(0)
const placedBeadsMap = ref({}) // 记录各个点位是否已完成拼打

// 计算当前图纸中使用的全部色号列表与统计
const usedColorsList = computed(() => {
  const counts = {}
  gridCells.value.forEach(hex => {
    if (hex) {
      counts[hex] = (counts[hex] || 0) + 1
    }
  })

  return Object.keys(counts).map(hex => {
    const matched = paletteColors.value.find(p => p.hex === hex) || { code: 'C', name: '未知' }
    const totalCount = counts[hex]
    
    // 计算已放置颗数
    let completed = 0
    gridCells.value.forEach((cHex, idx) => {
      if (cHex === hex && placedBeadsMap.value[idx]) {
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
  })
})

// 当前选中的聚焦色号
const currentFocusColorItem = computed(() => {
  return usedColorsList.value[focusedColorIndex.value] || null
})

// 总拼豆颗数与总完成数
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

// 开启沉浸模式
const openImmersiveMode = () => {
  if (usedColorsList.value.length === 0) {
    // 如果没有颜色，生成演示爱心
    generatePatternFromPrompt()
  }
  focusedColorIndex.value = 0
  isImmersiveMode.value = true
}

// 判断点位是否属于当前聚焦的颜色
const isFocusedCell = (cellHex) => {
  if (!cellHex || !currentFocusColorItem.value) return false
  return cellHex === currentFocusColorItem.value.hex
}

// 判断点位是否属于非聚焦的其它颜色（将变成灰色底）
const isMutedCell = (cellHex) => {
  if (!cellHex) return false
  if (!currentFocusColorItem.value) return false
  return cellHex !== currentFocusColorItem.value.hex
}

// 沉浸模式下格点动态样式（聚焦色高亮发光，非聚焦色变全灰 opacity(0.2)）
const getCellImmersiveStyle = (cellHex) => {
  if (!cellHex) return { backgroundColor: '#ffffff' }
  if (isFocusedCell(cellHex)) {
    return { 
      backgroundColor: cellHex,
      boxShadow: `0 0 10px ${cellHex}`,
      transform: 'scale(1.08)',
      zIndex: 5
    }
  } else {
    // 其它颜色变全灰
    return { 
      backgroundColor: '#e2e8f0',
      opacity: 0.35
    }
  }
}

// 沉浸模式下点击点位切换拼打状态
const toggleCellBeadPlaced = (idx, cellHex) => {
  if (!isFocusedCell(cellHex)) return
  placedBeadsMap.value[idx] = !placedBeadsMap.value[idx]
}

// “完成当前颜色，进入下一个颜色” 按钮逻辑
const completeCurrentColorAndNext = () => {
  if (!currentFocusColorItem.value) return

  // 1. 将当前聚焦颜色下的所有点位标记为完成
  const currentHex = currentFocusColorItem.value.hex
  gridCells.value.forEach((hex, idx) => {
    if (hex === currentHex) {
      placedBeadsMap.value[idx] = true
    }
  })

  const prevName = currentFocusColorItem.value.name

  // 2. 寻找下一个未完成的颜色
  const nextUnfinishedIdx = usedColorsList.value.findIndex((item, i) => i > focusedColorIndex.value && !item.isFinished)
  if (nextUnfinishedIdx !== -1) {
    focusedColorIndex.value = nextUnfinishedIdx
    ElMessage.success(`🎉 【${prevName}】已完成拼打！自动切入下一个颜色：${usedColorsList.value[nextUnfinishedIdx].name}`)
  } else {
    // 若后面没有，找前面未完成的
    const firstUnfinishedIdx = usedColorsList.value.findIndex(item => !item.isFinished)
    if (firstUnfinishedIdx !== -1) {
      focusedColorIndex.value = firstUnfinishedIdx
      ElMessage.success(`🎉 【${prevName}】已完成拼打！自动切入下一个未完成颜色：${usedColorsList.value[firstUnfinishedIdx].name}`)
    } else {
      ElMessage.success('🏆 恭喜！全套拼豆图纸已 100% 完美拼打完成！')
    }
  }
}
</script>

<style scoped>
.pindou-tool { padding: 0; margin: 0 auto; }
.mb-20 { margin-bottom: 20px; }
.mb-16 { margin-bottom: 16px; }
.mt-8 { margin-top: 8px; }

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

.start-pindou-top-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.glass-card { 
  border-radius: 24px; 
  background: rgba(255, 255, 255, 0.75) !important; 
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

.color-picker-palette {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  margin-top: 6px;
}
.palette-chip {
  height: 38px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}
.palette-chip:hover {
  transform: scale(1.05);
}
.palette-chip.active {
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.25);
}
.chip-code {
  font-size: 11px;
  font-weight: 800;
  color: #1e293b;
  background: rgba(255, 255, 255, 0.85);
  padding: 1px 6px;
  border-radius: 6px;
}

/* 图纸生成工具栏 */
.gen-section-item { display: flex; flex-direction: column; gap: 8px; }
.section-label-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #334155;
}
.upload-area { width: 100%; }
.upload-trigger-btn {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  height: 40px;
}

.prompt-input-row {
  display: flex;
  gap: 8px;
}
.prompt-input { flex: 1; }
.ai-gen-btn {
  font-weight: 700;
  border-radius: 10px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
}

.prompt-quick-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.quick-label { font-size: 12px; color: #64748b; }
.chips-flex { display: flex; gap: 6px; flex-wrap: wrap; }
.quick-chip {
  font-size: 11.5px;
  color: #d97706;
  background: #fef3c7;
  border: 1px solid #fde68a;
  padding: 2px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.quick-chip:hover {
  background: #fde68a;
}

.canvas-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.active-color-tag { font-weight: 700; }

.canvas-board-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
  min-height: 420px;
}

.pegboard-grid {
  display: grid;
  grid-template-columns: repeat(14, 24px);
  grid-template-rows: repeat(14, 24px);
  gap: 4px;
  padding: 14px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #cbd5e1;
}

.peg-cell {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}
.peg-cell:hover {
  transform: scale(1.18);
  z-index: 2;
}
.peg-hole {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
}

.canvas-bottom-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.tip-text {
  font-size: 13px;
  color: #64748b;
  text-align: center;
}
.start-pindou-main-btn {
  width: 100%;
  max-width: 480px;
  height: 48px;
  font-size: 16px;
  font-weight: 800;
  border-radius: 14px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

/* 4. 全屏沉浸式拼豆抽屉/弹窗 */
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
.btn-exit-immersive:hover { color: #ffffff; border-color: #cbd5e1; }

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

/* 分色沉浸选择栏 */
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
.focus-color-chip:hover {
  background: #475569;
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

/* 画布主视图 */
.immersive-canvas-viewport {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: auto;
}

.immersive-pegboard-grid {
  display: grid;
  grid-template-columns: repeat(14, 28px);
  grid-template-rows: repeat(14, 28px);
  gap: 6px;
  padding: 20px;
  background: #1e293b;
  border-radius: 20px;
  border: 1px solid #334155;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.immersive-peg-cell {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.bead-highlight-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
}

.bead-check-icon {
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
}

.peg-hole-muted {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
}

/* 底部操作 Dock */
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
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
  color: #1e293b;
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
