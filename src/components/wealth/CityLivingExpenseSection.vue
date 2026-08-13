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
          <!-- 卡片头部：城市标识、浅色特色图案与费用输入 -->
          <div class="city-stage-header">
            <div class="header-left">
              <span class="city-badge-name">{{ city.label }}</span>
              
              <!-- 浅色城市专属图案徽章 (长城 / 龙首山 / 牡丹花) -->
              <span class="city-pattern-tag" :class="city.id" :title="city.label + '特色'">
                <!-- 北京: 长城 -->
                <svg v-if="city.id === 'beijing'" viewBox="0 0 24 24" class="city-svg-icon">
                  <path fill="currentColor" d="M19 4h-2V2h-2v2h-2V2h-2v2H9V2H7v2H5V2H3v6h18V4h-2zM4 10v9h16v-9H4zm2 2h3v5H6v-5zm5 0h3v5h-3v-5zm5 0h3v5h-3v-5z"/>
                </svg>
                <!-- 铁岭: 龙首山 -->
                <svg v-else-if="city.id === 'tieling'" viewBox="0 0 24 24" class="city-svg-icon">
                  <path fill="currentColor" d="M14 6l-3.8 5.7-1.7-2.5L3 17h18L14 6zm-3.8 7.3L14 8.2l4.8 7.8H5.2l5-6.7z"/>
                </svg>
                <!-- 菏泽: 牡丹花 -->
                <svg v-else-if="city.id === 'heze'" viewBox="0 0 24 24" class="city-svg-icon">
                  <path fill="currentColor" d="M12 2C9.5 4.5 7 7.5 7 11c0 2.8 2.2 5 5 5s5-2.2 5-5c0-3.5-2.5-6.5-5-9zm0 12c-1.7 0-3-1.3-3-3 0-2.1 2-4.2 3-5.5 1 1.3 3 3.4 3 5.5 0 1.7-1.3 3-3 3z"/>
                  <path fill="currentColor" d="M6 8c-2 1-3.5 3-3.5 5.5A5.5 5.5 0 0 0 8 19c2.5 0 4.5-1.5 5.5-3.5M18 8c2 1 3.5 3 3.5 5.5A5.5 5.5 0 0 1 16 19c-2.5 0-4.5-1.5-5.5-3.5"/>
                </svg>
                <span class="pattern-text">{{ city.id === 'beijing' ? '长城' : city.id === 'tieling' ? '龙首山' : '牡丹花' }}</span>
              </span>

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
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
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
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
}

/* 浅色城市专属特色图案徽章 */
.city-pattern-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}
.city-pattern-tag.beijing {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.18);
}
.city-pattern-tag.tieling {
  background: rgba(16, 185, 129, 0.08);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.18);
}
.city-pattern-tag.heze {
  background: rgba(244, 63, 94, 0.08);
  color: #e11d48;
  border: 1px solid rgba(244, 63, 94, 0.18);
}
.city-svg-icon {
  width: 13px;
  height: 13px;
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
