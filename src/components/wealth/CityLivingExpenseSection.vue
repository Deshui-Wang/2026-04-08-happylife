<template>
  <el-card class="glass-card animate-fade-in mb-20">
    <template #header>
      <div class="card-header justify-between">
        <div style="display:flex; align-items:center; gap:8px;">
          <el-icon><Location /></el-icon><span>居住城市与生活开支 (时间段设置)</span>
        </div>
        <span class="city-stats-pill"> {{ cityCostsList.length }} 个城市</span>
      </div>
    </template>

    <el-form label-position="top">
      <div class="city-stages-wrapper">
        <div 
          v-for="city in cityCostsList" 
          :key="city.id" 
          class="city-stage-card"
        >
          <!-- 与卡片外框左上角完美融为一体的风光图案背景 -->
          <div 
            class="city-corner-blend-bg" 
            :style="{ backgroundImage: `url(${city.id === 'beijing' ? '/changcheng.webp' : city.id === 'tieling' ? '/longshan.webp' : '/mudanhua.webp'})` }"
          ></div>

          <div class="city-card-content">
            <!-- 卡片头部：城市标识与费用输入 -->
            <div class="city-stage-header">
              <div class="header-left">
                <span class="city-badge-name">{{ city.label }}</span>
                <el-tag size="small" type="primary" effect="light" class="city-cost-tag">
                  ¥{{ (city.monthly * 12 / 10000).toFixed(1) }}w/年
                </el-tag>
              </div>
              
              <div class="header-right-inputs">
                <div class="input-mini-box">
                  <span class="mini-label">生活费/月</span>
                  <el-input-number 
                    v-model="city.living" 
                    :min="0" 
                    :step="500"
                    size="small" 
                    controls-position="right" 
                    class="mini-num-input" 
                  />
                </div>
                <div class="input-mini-box">
                  <span class="mini-label">房租/月</span>
                  <el-input-number 
                    v-model="city.rent" 
                    :min="0" 
                    :step="500"
                    size="small" 
                    controls-position="right" 
                    class="mini-num-input" 
                  />
                </div>
              </div>
            </div>

            <!-- 卡片身体：居住年龄段拖拽滑块 -->
            <div class="city-stage-body">
              <div class="slider-row">
                <div class="slider-label-text">
                  居住年龄段：<strong>{{ city.ageRange[0] }} 岁</strong> 至 <strong>{{ city.ageRange[1] }} 岁</strong>
                  <span class="duration-badge">(共 {{ city.ageRange[1] - city.ageRange[0] + 1 }} 年)</span>
                </div>
                <el-slider 
                  v-model="city.ageRange" 
                  range 
                  :min="currentAge" 
                  :max="100" 
                  :marks="ageMarks"
                  class="city-age-slider"
                  @input="$emit('city-age-range-change', { city, val: $event })"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 合计支出横幅 (带 16px 明确上边距间隙) -->
      <div class="total-expense-banner" style="margin-top: 16px !important;">
        <div class="banner-title">合计首年年支出 ({{ currentAge }}岁阶段时刻)</div>
        <div class="banner-calc-row">
          <span>生活 ¥{{ ((totalAnnualExpense - activeAnnualPremium) || 0).toLocaleString() }} + 保费 ¥{{ activeAnnualPremium.toLocaleString() }} =</span>
          <span class="banner-total-num">¥ {{ totalAnnualExpense.toLocaleString() }}</span>
        </div>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { Location } from '@element-plus/icons-vue'

defineProps({
  cityCostsList: { type: Array, required: true },
  currentAge: { type: Number, default: 42 },
  ageMarks: { type: Object, default: () => ({}) },
  totalAnnualExpense: { type: Number, default: 0 },
  activeAnnualPremium: { type: Number, default: 0 }
})

defineEmits(['city-enabled-change', 'city-age-range-change'])
</script>

<style scoped>
.glass-card { 
  background: #ffffff; 
  border-radius: 14px; 
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04); 
  border: 1px solid #e2e8f0; 
}
:deep(.el-card__body) {
  padding: 14px 16px !important;
}
:deep(.el-card__header) {
  padding: 12px 16px !important;
  border-bottom: 1px solid #f1f5f9;
}
.card-header { display: flex; align-items: center; gap: 8px; font-weight: 800; color: #1e293b; font-size: 15px; }
.justify-between { justify-content: space-between; }
.mb-20 { margin-bottom: 16px !important; }

.city-stats-pill {
  font-size: 11px;
  font-weight: 600;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.15);
  padding: 2px 10px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  height: 22px;
  box-sizing: border-box;
}

.city-stages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.city-stage-card {
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

/* 与卡片外框左上角融合的特色图案印记（尺寸缩小一半，颜色清晰显现） */
.city-corner-blend-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 90px;
  height: 65px;
  background-size: cover;
  background-position: top left;
  opacity: 0.75;
  mask-image: linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%);
  pointer-events: none;
  z-index: 1;
}

.city-card-content {
  position: relative;
  z-index: 2;
}

.city-stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.city-badge-name {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
}

.city-cost-tag {
  font-weight: 600;
}
.header-right-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
}
.input-mini-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mini-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}
.mini-num-input {
  width: 95px;
}
.city-stage-body {
  margin-top: 12px;
  border-top: 1px dashed #f1f5f9;
  padding-top: 12px;
}

/* 增大“居住年龄段：”与进度条中间的间隙 */
.slider-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.slider-label-text {
  font-size: 12px;
  color: #475569;
}
.slider-label-text strong {
  color: #6366f1;
}
.duration-badge {
  font-size: 11px;
  color: #94a3b8;
  margin-left: 6px;
}
.city-age-slider {
  padding: 0 8px 12px 8px;
}
:deep(.city-age-slider .el-slider__runway) {
  background-color: #e2e8f0;
  margin-top: 4px !important;
  margin-bottom: 16px !important;
}
:deep(.city-age-slider .el-slider__bar) {
  background-color: #6366f1;
}
:deep(.city-age-slider .el-slider__button) {
  border-color: #6366f1;
}
:deep(.el-slider__marks-text) {
  font-size: 11px !important;
  color: #94a3b8 !important;
}

/* 合计支出横幅 */
.total-expense-banner { 
  background: #fff1f2; 
  border: 1px solid #fecdd3;
  padding: 10px 14px; 
  border-radius: 10px; 
  color: #be123c; 
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px !important;
}
.total-expense-banner .banner-title { 
  font-size: 13px; 
  color: #be123c; 
  font-weight: 500;
  line-height: 1.3;
}
.total-expense-banner .banner-calc-row { 
  font-size: 13px; 
  color: #be123c;
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  line-height: 1.3;
}
.total-expense-banner .banner-total-num {
  font-size: 20px;
  font-weight: 800;
  color: #be123c;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

:deep(.el-input-number .el-input__wrapper) {
  background-color: #f8fafc;
  box-shadow: 0 0 0 1px #e2e8f0 inset !important;
  border-radius: 6px;
  height: 32px !important;
}
:deep(.el-input-number .el-input-number__decrease),
:deep(.el-input-number .el-input-number__increase),
:deep(.el-input-number.is-controls-right .el-input-number__decrease),
:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  border-left: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
  color: #94a3b8 !important;
}
:deep(.el-input__inner) {
  font-weight: 700 !important;
  color: #0f172a !important;
  font-size: 13px !important;
}
</style>
