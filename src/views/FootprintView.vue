<template>
  <div class="omni-tools-view animate-fade-in">
    <!-- 1. 当未选择特定工具时，展示“万能”工具卡片画廊 -->
    <template v-if="!activeTool">
      <div class="page-title-section mb-30">
        <div class="title-badge">OMNI TOOLS</div>
        <h2 class="section-title">万能百宝箱</h2>
        <p class="section-subtitle">丰富实用的小工具集 · 发现更多生活与创作乐趣</p>
      </div>

      <!-- 工具卡片网格布局 -->
      <div class="tools-grid">
        <!-- 卡片 1: 幸福足迹 -->
        <el-card 
          class="glass-card tool-entry-card" 
          shadow="hover"
          @click="activeTool = 'footprint'"
        >
          <div class="card-cover-bg footprint-bg"></div>
          <div class="card-body-content">
            <div class="card-top-header">
              <div class="tool-icon-circle footprint-icon">
                <span>🗺️</span>
              </div>
              <el-tag size="small" type="primary" effect="light" class="tool-tag">旅行见证</el-tag>
            </div>
            <h3 class="tool-card-title">幸福足迹</h3>
            <p class="tool-card-desc">家庭旅行 · 地区点亮 · 幸福与足迹双重见证</p>
            <div class="tool-card-footer">
              <span class="enter-link">开启地图 <el-icon><ArrowRight /></el-icon></span>
            </div>
          </div>
        </el-card>

        <!-- 卡片 2: 拼豆不拼命 -->
        <el-card 
          class="glass-card tool-entry-card" 
          shadow="hover"
          @click="activeTool = 'pindou'"
        >
          <div class="card-cover-bg pindou-bg"></div>
          <div class="card-body-content">
            <div class="card-top-header">
              <div class="tool-icon-circle pindou-icon">
                <span>🧩</span>
              </div>
              <el-tag size="small" type="danger" effect="light" class="tool-tag">像素手作</el-tag>
            </div>
            <h3 class="tool-card-title">拼豆不拼命</h3>
            <p class="tool-card-desc">像素图案设计 · 拼豆色号对照 · 轻松创作不费眼</p>
            <div class="tool-card-footer">
              <span class="enter-link pindou-link">开启拼豆设计 <el-icon><ArrowRight /></el-icon></span>
            </div>
          </div>
        </el-card>

        <!-- 卡片 3: 更多工具 (敬请期待) -->
        <el-card class="glass-card tool-entry-card is-disabled" shadow="none">
          <div class="card-body-content">
            <div class="card-top-header">
              <div class="tool-icon-circle more-icon">
                <span>🚀</span>
              </div>
              <el-tag size="small" type="info" effect="plain" class="tool-tag">筹备中</el-tag>
            </div>
            <h3 class="tool-card-title">更多神奇工具</h3>
            <p class="tool-card-desc">持续添加更多便利生活与效率小工具，敬请期待...</p>
            <div class="tool-card-footer">
              <span class="disabled-text">敬请期待</span>
            </div>
          </div>
        </el-card>
      </div>
    </template>

    <!-- 2. 独立工具组件视图 -->
    <template v-else-if="activeTool === 'footprint'">
      <FootprintTool @back="activeTool = null" />
    </template>
    <template v-else-if="activeTool === 'pindou'">
      <PindouTool @back="activeTool = null" />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import FootprintTool from '../components/tools/FootprintTool.vue'
import PindouTool from '../components/tools/PindouTool.vue'

const activeTool = ref(null)
</script>

<style scoped>
.omni-tools-view {
  padding: 10px 0;
  max-width: 1400px;
  margin: 0 auto;
}
.mb-30 { margin-bottom: 30px; }

.page-title-section {
  text-align: center;
  margin-bottom: 36px;
}
.title-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
  padding: 4px 14px;
  border-radius: 20px;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
}
.section-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #0f172a;
  margin: 0 0 8px 0;
}
.section-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* 工具卡片网格 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
}

.tool-entry-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px !important;
  border: 1px solid #e2e8f0 !important;
  background: #ffffff !important;
  cursor: pointer;
  transition: all 0.3s ease !important;
}
.tool-entry-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.15) !important;
  border-color: #cbd5e1 !important;
}

.tool-entry-card.is-disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
.tool-entry-card.is-disabled:hover {
  transform: none;
  box-shadow: none !important;
}

.card-cover-bg {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  opacity: 0.12;
  filter: blur(20px);
  pointer-events: none;
}
.footprint-bg { background: #6366f1; }
.pindou-bg { background: #ec4899; }

.card-body-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.card-top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.tool-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
.footprint-icon { background: #eef2ff; }
.pindou-icon { background: #fdf2f8; }
.more-icon { background: #f1f5f9; }

.tool-tag { font-weight: 600; }

.tool-card-title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.tool-card-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 24px 0;
  flex: 1;
}

.tool-card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px dashed #f1f5f9;
}

.enter-link {
  font-size: 14px;
  font-weight: 700;
  color: #6366f1;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: gap 0.2s ease;
}
.tool-entry-card:hover .enter-link {
  gap: 8px;
}

.pindou-link {
  color: #ec4899;
}

.disabled-text {
  font-size: 13px;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
