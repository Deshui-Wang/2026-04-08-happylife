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
      // 简单安全表达式计算
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
