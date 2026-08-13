<template>
  <el-card class="glass-card config-section animate-fade-in mb-20">
    <template #header>
      <div class="card-header justify-between">
        <div style="display:flex;align-items:center;gap:8px">
          <el-icon><Postcard /></el-icon><span>资产与基础画像</span>
        </div>
        <el-popover placement="bottom" :width="240" trigger="click" effect="light" popper-style="padding: 12px; border-radius: 12px;">
          <template #reference>
            <el-button class="header-action-btn" size="small">
              <el-icon><Operation /></el-icon><span>辅助计算</span>
            </el-button>
          </template>
          <div class="mini-calculator">
            <div class="calc-screen">
              <div class="expr">{{ calcExpr || '0' }}</div>
              <div class="res" v-if="calcResult !== ''">= {{ calcResult }}</div>
            </div>
            <div class="calc-btns">
              <el-button v-for="b in ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','C','+']" 
                :key="b" size="small" @click="handleCalcInput(b)"
                :type="['/','*','-','+'].includes(b) ? 'warning' : b === 'C' ? 'danger' : ''" plain>
                {{ b }}
              </el-button>
              <el-button type="success" size="small" style="grid-column: span 4; margin-top: 5px;" @click="handleCalcInput('=')">计算 (ENTER)</el-button>
            </div>
          </div>
        </el-popover>
      </div>
    </template>
    
    <el-form label-position="top">
      <el-divider content-position="left" style="margin-top: 0;">核心资产</el-divider>
      
      <div class="core-assets-inputs">
        <div class="asset-input-col">
          <el-form-item label="当前存款 (元)">
            <el-input-number v-model="assets.savings" :precision="0" :step="1000" style="width: 100%" controls-position="right" />
          </el-form-item>
        </div>

        <div class="calc-symbol">+</div>

        <div class="asset-input-col">
          <el-form-item label="欠薪+赔偿 (元)">
            <el-input-number v-model="assets.compensation" :precision="0" :step="1000" style="width: 100%" controls-position="right" />
          </el-form-item>
        </div>

        <div class="calc-symbol">+</div>

        <div class="asset-input-col">
          <el-form-item label="补充资产 (元)">
            <el-input-number 
              v-model="assets.supplementary" 
              :precision="0" 
              :step="1000" 
              style="width: 100%" 
              controls-position="right" 
            />
          </el-form-item>
        </div>
      </div>

      <div class="asset-summary-banner mt-10">
        <div class="summary-label">
          <el-icon><InfoFilled /></el-icon>
          <span>静态资产总额</span>
        </div>
        <div class="summary-value">
          <span class="currency">¥</span>
          <span class="number">{{ totalAssets.toLocaleString() }}</span>
        </div>
      </div>

      <el-divider content-position="left">工作收入</el-divider>
      <el-row :gutter="10">
        <el-col :xs="12" :sm="12">
          <el-form-item label="月预计工作收入 (元)">
            <el-input-number v-model="assets.workingIncome" :precision="0" :step="1000" style="width: 100%" controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-form-item label="预计工作年限 (年)">
            <el-input-number v-model="assets.workingYears" :precision="0" :step="1" :min="0" style="width: 100%" controls-position="right" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">退休收入</el-divider>
      <el-row :gutter="10">
        <el-col :xs="12" :sm="12">
          <el-form-item label="退休金预计金额 (元/月)">
            <el-input-number v-model="assets.estimatedPension" :precision="0" :step="500" :min="0" style="width: 100%" controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-form-item>
            <template #label>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span>预计退休年龄 (岁)</span>
                <el-tooltip placement="top">
                  <template #content>
                    {{ retirementInfo.age }}退休 | 距离退休 {{ retirementInfo.yearsLeft }} 年
                  </template>
                  <el-icon style="cursor: help; color: #94a3b8;"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-input-number v-model="assets.retirementAge" :precision="0" :step="1" :min="30" :max="100" style="width: 100%" controls-position="right" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">保险收益/返还</el-divider>
      <div class="insurance-return-panel">
        <el-row :gutter="12">
          <el-col :xs="24" :sm="12">
            <div class="return-item" :class="{'is-disabled': !assets.returns[0].enabled}">
              <div class="item-header">
                <span class="name">优享年年 (年领)</span>
                <el-switch v-model="assets.returns[0].enabled" size="small" />
              </div>
              <div class="item-body">
                <span class="amount">¥ 19,206/年</span>
                <span class="period">60岁 - 79岁</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="return-item" :class="{'is-disabled': !assets.returns[1].enabled}">
              <div class="item-header">
                <span class="name">传世金生 (满期)</span>
                <el-switch v-model="assets.returns[1].enabled" size="small" />
              </div>
              <div class="item-body">
                <span class="amount">¥ 900,000</span>
                <span class="period">60岁 一次性领取</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { Postcard, Operation, InfoFilled, QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  assets: { type: Object, required: true },
  totalAssets: { type: Number, default: 0 },
  retirementInfo: { type: Object, default: () => ({ age: 54, yearsLeft: 10 }) }
})

// 辅助计算器状态逻辑
const calcExpr = ref('')
const calcResult = ref('')

const handleCalcInput = (btn) => {
  if (btn === 'C') {
    calcExpr.value = ''
    calcResult.value = ''
    return
  }
  if (btn === '=') {
    if (!calcExpr.value) return
    try {
      const sanitized = calcExpr.value.replace(/[^0-9+\-*/.]/g, '')
      const res = Function(`'use strict'; return (${sanitized})`)()
      calcResult.value = Number.isFinite(res) ? String(Math.round(res * 100) / 100) : '错误'
    } catch (e) {
      calcResult.value = '错误'
    }
    return
  }
  
  if (calcResult.value !== '') {
    if (['+', '-', '*', '/'].includes(btn)) {
      calcExpr.value = calcResult.value + btn
    } else {
      calcExpr.value = btn
    }
    calcResult.value = ''
  } else {
    calcExpr.value += btn
  }
}
</script>

<style scoped>
.glass-card { 
  background: #ffffff; 
  border-radius: 16px; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); 
  border: 1px solid #e2e8f0; 
}
.card-header { display: flex; align-items: center; gap: 8px; font-weight: 800; color: #1e293b; font-size: 16px; }
.justify-between { justify-content: space-between; }
.mb-20 { margin-bottom: 20px; }
.mt-10 { margin-top: 14px; }

/* 统一的高级胶囊型按钮样式 */
.header-action-btn {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #6366f1 !important;
  background: #f0f3ff !important;
  border: 1px solid #e0e7ff !important;
  padding: 4px 14px !important;
  height: 28px !important;
  border-radius: 20px !important;
  transition: all 0.2s ease !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.header-action-btn:hover {
  background: #e0e7ff !important;
  border-color: #c7d2fe !important;
}

.core-assets-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.core-assets-inputs .asset-input-col {
  flex: 1;
  min-width: 0;
}
.calc-symbol {
  flex: 0 0 auto;
  text-align: center;
  font-size: 20px;
  color: #6366f1;
  font-weight: bold;
  padding-top: 8px;
}

/* 静态资产总额卡片（对应截图浅紫色卡片样式） */
.asset-summary-banner {
  background: #f0f4ff;
  border: 1px solid #e0e7ff;
  padding: 16px 20px;
  border-radius: 12px;
  color: #1e293b;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.asset-summary-banner .summary-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}
.asset-summary-banner .summary-label .el-icon {
  color: #475569;
  font-size: 16px;
}
.asset-summary-banner .summary-value {
  font-size: 28px;
  font-weight: 800;
  color: #4f46e5;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.asset-summary-banner .currency {
  font-size: 18px;
  font-weight: 700;
  color: #4f46e5;
}

/* 保险收益/返还卡片（对应截图淡绿色亮彩卡片样式） */
.insurance-return-panel {
  margin-top: 8px;
}
.return-item {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}
.return-item.is-disabled {
  opacity: 0.45;
  filter: grayscale(1);
  background: #f8fafc;
  border-color: #e2e8f0;
}
.return-item .item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.return-item .name {
  font-size: 14px;
  font-weight: 700;
  color: #047857;
}
.return-item .item-body {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.return-item .amount {
  font-size: 18px;
  font-weight: 800;
  color: #059669;
}
.return-item .period {
  font-size: 12px;
  color: #4b5563;
}

:deep(.insurance-return-panel .el-switch) {
  --el-switch-on-color: #10b981;
}

/* 计算器样式 */
.mini-calculator {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.calc-screen {
  background: #f8fafc;
  padding: 10px;
  border-radius: 8px;
  text-align: right;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #e2e8f0;
}
.calc-screen .expr {
  font-family: monospace;
  font-size: 16px;
  color: #1e293b;
  word-break: break-all;
}
.calc-screen .res {
  font-size: 14px;
  color: #6366f1;
  font-weight: bold;
}
.calc-btns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}
.calc-btns .el-button {
  margin: 0 !important;
  width: 100%;
}

:deep(.el-form-item__label) {
  font-weight: 600 !important;
  color: #475569 !important;
  font-size: 13px !important;
}

:deep(.el-input-number .el-input__wrapper) {
  background-color: #f8fafc;
  box-shadow: 0 0 0 1px #e2e8f0 inset !important;
  border-radius: 8px;
  height: 38px;
}
:deep(.el-input-number .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c7d2fe inset !important;
  background-color: #ffffff;
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
:deep(.el-input-number .el-input-number__decrease:hover),
:deep(.el-input-number .el-input-number__increase:hover),
:deep(.el-input-number.is-controls-right .el-input-number__decrease:hover),
:deep(.el-input-number.is-controls-right .el-input-number__increase:hover) {
  color: #6366f1 !important;
  background: transparent !important;
  background-color: transparent !important;
}
:deep(.el-input__inner) {
  font-weight: 700 !important;
  color: #0f172a !important;
  font-size: 14px !important;
}
</style>
