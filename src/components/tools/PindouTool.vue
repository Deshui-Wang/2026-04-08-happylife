<template>
  <div class="pindou-tool animate-fade-in">
    <!-- 工具顶部导航栏（单行极简高雅设计） -->
    <div class="tool-header-row mb-20">
      <div class="header-left-group">
        <div class="btn-back-clean" @click="$emit('back')">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回</span>
        </div>
        <div class="header-divider"></div>
        <h2 class="section-title">拼豆不拼命</h2>
        <span class="section-subtitle">像素图案设计 · 拼豆色号对照 · 轻松创作不费眼</span>
      </div>
    </div>

    <!-- 顶部功能预告与提示横幅 -->
    <el-card class="glass-card info-banner-card mb-20" :body-style="{ padding: '20px 24px' }">
      <div class="banner-inner">
        <div class="banner-icon-wrap">
          <span class="pindou-emoji">🧩</span>
        </div>
        <div class="banner-text-box">
          <div class="banner-title">
            <span>“拼豆不拼命” 独立创意设计空间已准备就绪</span>
            <el-tag size="small" type="success" effect="light" class="status-tag">组件框架已搭建</el-tag>
          </div>
          <p class="banner-desc">
            您可以随时告诉我您希望包含的具体功能（如：像素画布尺寸、照片转拼豆图纸、MARD/ARTKAL色号统计、打印预览等），我将为您即刻量身定制！
          </p>
        </div>
      </div>
    </el-card>

    <!-- 工作台体验演练主区 -->
    <el-row :gutter="24" class="main-layout-row">
      <!-- 左侧：拼豆画布设置与试玩工具栏 -->
      <el-col :xs="24" :lg="8" class="layout-col">
        <el-card class="glass-card tool-panel-card mb-20" :body-style="{ padding: '24px' }">
          <template #header>
            <div class="card-header-glow">
              <el-icon><Setting></Setting></el-icon>
              <span>画布配置与参数</span>
            </div>
          </template>

          <el-form label-position="top" class="pindou-config-form">
            <el-form-item label="拼豆模板规格">
              <el-select v-model="boardSize" style="width: 100%;">
                <el-option label="29 × 29 标准单板 (5mm)" value="29x29"></el-option>
                <el-option label="14 × 14 迷你测试小板" value="14x14"></el-option>
                <el-option label="58 × 58 大连版四合一" value="58x58"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="拼豆品牌与色板">
              <el-radio-group v-model="selectedBrand" size="default">
                <el-radio-button value="MARD" label="MARD">MARD</el-radio-button>
                <el-radio-button value="MIDO" label="MIDO">MIDO</el-radio-button>
                <el-radio-button value="ARTKAL" label="ARTKAL">ARTKAL</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="当前选定调色盘色号">
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

            <div class="action-buttons-wrap">
              <el-button type="primary" class="action-btn-glow" @click="clearBoard">
                <el-icon><RefreshRight></RefreshRight></el-icon>重置画布
              </el-button>
              <el-button @click="fillRandomDemo" plain>
                <el-icon><MagicStick></MagicStick></el-icon>演示图案
              </el-button>
            </div>
          </el-form>
        </el-card>

        <!-- 常用功能预告卡片 -->
        <el-card class="glass-card feature-preview-card" :body-style="{ padding: '20px' }">
          <div class="preview-title">✨ 后续可扩展特性</div>
          <ul class="preview-list">
            <li>📷 <strong>图片转拼豆图纸</strong>：自动将照片转为拼豆像素图</li>
            <li>📊 <strong>色号用量清单</strong>：自动统计各类色号所需的拼豆颗数</li>
            <li>🖨️ <strong>高清图纸导出</strong>：一键生成 1:1 打印或手机查看图纸</li>
            <li>🎨 <strong>智能勾线与修图</strong>：防混色优化与边缘自动勾线</li>
          </ul>
        </el-card>
      </el-col>

      <!-- 右侧：像素画布预览展示区 -->
      <el-col :xs="24" :lg="16" class="layout-col">
        <el-card class="glass-card canvas-card" :body-style="{ padding: '24px' }">
          <template #header>
            <div class="card-header-glow justify-between">
              <div style="display:flex;align-items:center;gap:8px">
                <el-icon><Grid></Grid></el-icon>
                <span>像素设计画布 (点击网格画豆)</span>
              </div>
              <el-tag size="small" type="info" effect="plain">
                选色中: {{ activeColor.code }} ({{ activeColor.name }})
              </el-tag>
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
              >
                <span class="peg-hole"></span>
              </div>
            </div>
          </div>

          <div class="canvas-footer-tips">
            <span>💡 提示：点击调色盘选择色号，直接点击网格中的拼豆孔即可上色。</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Back, 
  ArrowLeft,
  Setting, 
  RefreshRight, 
  MagicStick, 
  Grid 
} from '@element-plus/icons-vue'

defineEmits(['back'])

const boardSize = ref('29x29')
const selectedBrand = ref('MARD')

// 调色盘示例色号
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

const activeColor = ref(paletteColors.value[1]) // 默认选粉色

// 14x14 = 196 格子交互演示
const gridCells = ref(Array(196).fill(''))

// 点击网格填色
const paintCell = (index) => {
  gridCells.value[index] = activeColor.value.hex
}

// 重置画布
const clearBoard = () => {
  gridCells.value = Array(196).fill('')
  ElMessage.success('画布已重置')
}

// 填充随机像素小示例
const fillRandomDemo = () => {
  clearBoard()
  // 简易小心形演示
  const heartIndices = [
    33, 34, 37, 38,
    46, 47, 48, 49, 50, 51, 52, 53,
    60, 61, 62, 63, 64, 65, 66, 67,
    75, 76, 77, 78, 79, 80,
    90, 91, 92, 93,
    105, 106
  ]
  heartIndices.forEach(idx => {
    gridCells.value[idx] = '#FF6B6B'
  })
  ElMessage.success('已生成像素爱心演示图案')
}
</script>

<style scoped>
.pindou-tool { padding: 0; margin: 0 auto; }
.mb-20 { margin-bottom: 20px; }

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

.glass-card { 
  border-radius: 24px; 
  background: rgba(255, 255, 255, 0.75) !important; 
  backdrop-filter: blur(20px); 
  border: 1px solid rgba(255, 255, 255, 0.5); 
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.05); 
}

.info-banner-card {
  background: linear-gradient(135deg, rgba(253, 242, 248, 0.9) 0%, rgba(240, 253, 244, 0.9) 100%) !important;
  border: 1px solid rgba(244, 114, 182, 0.2);
}
.banner-inner {
  display: flex;
  align-items: center;
  gap: 18px;
}
.banner-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
}
.pindou-emoji { font-size: 28px; }

.banner-text-box { display: flex; flex-direction: column; gap: 4px; }
.banner-title {
  font-size: 16px;
  font-weight: 800;
  color: #831843;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.status-tag { font-weight: 600; }
.banner-desc {
  font-size: 13px;
  color: #9d174d;
  margin: 0;
  line-height: 1.5;
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

.action-buttons-wrap {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.action-btn-glow {
  background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
  border: none;
  font-weight: 600;
}

.feature-preview-card {
  background: #ffffff !important;
}
.preview-title {
  font-size: 14px;
  font-weight: 800;
  color: #475569;
  margin-bottom: 10px;
}
.preview-list {
  padding-left: 18px;
  margin: 0;
  font-size: 13px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.4;
}

.canvas-board-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 14px;
  min-height: 420px;
}

.pegboard-grid {
  display: grid;
  grid-template-columns: repeat(14, 24px);
  grid-template-rows: repeat(14, 24px);
  gap: 3px;
  padding: 12px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
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
  transform: scale(1.15);
  z-index: 2;
}
.peg-hole {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
}

.canvas-footer-tips {
  font-size: 13px;
  color: #64748b;
  text-align: center;
}
</style>
