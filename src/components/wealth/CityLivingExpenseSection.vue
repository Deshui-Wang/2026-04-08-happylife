<template>
  <el-card class="glass-card animate-fade-in">
    <template #header>
      <div class="card-header justify-between">
        <div style="display:flex; align-items:center; gap:8px;">
          <el-icon><Location /></el-icon>
          <span>居住城市与生活开支 (时间段设置)</span>
        </div>
        <span class="city-stats-pill"> {{ cityCostsList.filter(c => c.enabled).length }} 个城市</span>
      </div>
    </template>

    <el-form label-position="top">
      <div class="city-stages-wrapper">
        <div 
          v-for="city in cityCostsList" 
          :key="city.id" 
          class="city-stage-card" 
          :class="{ 'is-disabled': !city.enabled }"
        >
          <!-- 卡片头部：开关与城市信息 -->
          <div class="city-stage-header">
            <div class="header-left">
              <el-switch v-model="city.enabled" size="default" active-color="#6366f1" @change="$emit('city-enabled-change', city)" />
              <span class="city-badge-name">{{ city.label }}</span>
              <el-tag v-if="city.enabled" size="small" type="primary" effect="light" class="city-cost-tag">
                ¥{{ (city.monthly * 12 / 10000).toFixed(1) }}w/年
              </el-tag>
            </div>
            
            <div class="header-right-inputs" v-if="city.enabled">
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
          <div class="city-stage-body" v-if="city.enabled">
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

      <!-- 合计支出横幅 -->
      <div class="total-expense-banner" style="margin-top: 24px;">
        <div class="label">合计首年年支出 ({{ currentAge }}岁阶段时刻)</div>
        <div class="value" style="display:flex; align-items:center; gap:8px; flex-wrap: wrap;">
          <span style="font-size:13px; opacity:0.9; font-weight:normal;">
            生活 ¥{{ ((totalAnnualExpense - activeAnnualPremium) || 0).toLocaleString() }} + 保费 ¥{{ activeAnnualPremium.toLocaleString() }} =
          </span>
          <span>¥ {{ totalAnnualExpense.toLocaleString() }}</span>
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
