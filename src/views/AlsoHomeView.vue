<template>
  <div class="flexicalc-container">
    <el-row :gutter="20">
      <!-- 左侧：资产与基础画像 + 消费与支出 (md=10) -->
      <el-col :xs="24" :md="10">
        <!-- 1. 资产模块 -->
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
            <div class="core-assets-header">
              <el-divider content-position="left" style="margin-top: 0; margin-bottom: 0; flex: 1;">核心资产</el-divider>
              <el-button type="primary" plain size="small" class="add-asset-btn" @click="addCustomAsset">
                <el-icon><Plus /></el-icon> <span>添加资产</span>
              </el-button>
            </div>
            
            <el-row :gutter="10" align="middle" class="core-assets-inputs mt-10">
              <el-col :xs="24" :sm="assets.customAssets && assets.customAssets.length ? 7 : 10">
                <el-form-item label="当前存款 (元)">
                  <el-input-number v-model="assets.savings" :precision="0" :step="1000" style="width: 100%" controls-position="right" />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="1" class="calc-symbol">+</el-col>

              <el-col :xs="24" :sm="assets.customAssets && assets.customAssets.length ? 7 : 10">
                <el-form-item label="欠薪+赔偿 (元)">
                  <el-input-number v-model="assets.compensation" :precision="0" :step="1000" style="width: 100%" controls-position="right" />
                </el-form-item>
              </el-col>

              <!-- 动态新增自定义资产项目 -->
              <template v-for="(item, index) in assets.customAssets" :key="item.id">
                <el-col :xs="24" :sm="1" class="calc-symbol">+</el-col>
                <el-col :xs="24" :sm="7" class="custom-asset-col">
                  <el-form-item>
                    <template #label>
                      <div class="custom-asset-label-wrap">
                        <el-input 
                          v-model="item.name" 
                          placeholder="资产名称" 
                          size="small"
                          class="custom-asset-name-input"
                        />
                        <span class="unit-text">(元)</span>
                        <el-button 
                          type="danger" 
                          link 
                          size="small" 
                          class="del-asset-btn"
                          @click="removeCustomAsset(index)"
                          title="删除资产"
                        >
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                    </template>
                    <el-input-number 
                      v-model="item.amount" 
                      :precision="0" 
                      :step="1000" 
                      style="width: 100%" 
                      controls-position="right" 
                    />
                  </el-form-item>
                </el-col>
              </template>

              <!-- 行内添加资产按钮 -->
              <el-col :xs="24" :sm="3" class="inline-add-col">
                <el-button type="primary" plain size="small" class="inline-add-btn" @click="addCustomAsset" title="点击添加新资产项">
                  <el-icon><Plus /></el-icon> <span>添加</span>
                </el-button>
              </el-col>
            </el-row>

            <div class="asset-summary-banner mt-10">
              <div class="summary-label">
                <el-icon><InfoFilled /></el-icon>
                <span>静态资产总额</span>
                <span class="formula-text">（存款 + 欠薪与赔偿{{ assets.customAssets && assets.customAssets.length ? ' + 自定义资产' : '' }}）</span>
              </div>
              <div class="summary-value">
                <span class="currency">¥</span>
                <span class="number">{{ totalAssets.toLocaleString() }}</span>
              </div>
            </div>

            <el-divider content-position="left">工作/未来流入</el-divider>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="8">
                <el-form-item label="月预计工作收入 (元)">
                  <el-input-number v-model="assets.workingIncome" :precision="0" :step="1000" style="width: 100%" controls-position="right" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8">
                <el-form-item label="预计工作年限 (年)">
                  <el-input-number v-model="assets.workingYears" :precision="0" :step="1" :min="0" style="width: 100%" controls-position="right" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8">
                <el-form-item>
                  <template #label>
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <span>未来退休金 (月)</span>
                      <el-tooltip placement="top">
                        <template #content>
                          {{ retirementInfo.age }}退休 | 距离退休 {{ retirementInfo.yearsLeft }} 年
                        </template>
                        <el-icon style="cursor: help; color: #94a3b8;"><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                  <el-input-number v-model="assets.estimatedPension" :precision="0" :step="500" :min="0" style="width: 100%" controls-position="right" />
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

        <!-- 2. 保险支出模块 -->
        <el-card class="glass-card expense-section animate-fade-in mb-20">
          <template #header>
            <div class="card-header justify-between">
              <div style="display:flex;align-items:center;gap:8px">
                <el-icon><MagicStick /></el-icon><span>保险支出管理</span>
              </div>
              <el-button class="header-action-btn" size="small" @click="drawerVisible = true">
                <el-icon><InfoFilled /></el-icon><span>保单说明</span>
              </el-button>
            </div>
          </template>

          <el-form label-position="top">
            <el-table :data="insuranceList" style="width: 100%" size="small" class="mini-table" :row-class-name="({row}) => !row.enabled ? 'disabled-row' : ''">
              <el-table-column width="45"><template #default="scope"><el-switch v-model="scope.row.enabled" size="small" /></template></el-table-column>
              <el-table-column prop="name" label="保单名称" min-width="120" />
              <el-table-column label="剩余年限" width="80" align="center">
                <template #default="scope">
                  <span style="color: #64748b;">{{ scope.row.yearsLeft }} 年</span>
                </template>
              </el-table-column>
              <el-table-column label="年交金额" min-width="90" align="right">
                <template #default="scope">
                  <span style="font-weight: 600; color: #475569;">¥{{ Math.round(scope.row.premium).toLocaleString() }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-card>

        <!-- 3. 居住城市模块 -->
        <el-card class="glass-card animate-fade-in">
          <template #header>
            <div class="card-header justify-between">
              <div style="display:flex; align-items:center; gap:8px;">
                <el-icon><Location /></el-icon>
                <span>居住城市与生活开支 (时间段设置)</span>
              </div>
              <span class="city-stats-pill">已启用 {{ cityCostsList.filter(c => c.enabled).length }} 个城市阶段</span>
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
                    <el-switch v-model="city.enabled" size="default" active-color="#6366f1" />
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
      </el-col>

      <!-- 右侧：资金断层分析 (md=14) -->
      <el-col :xs="24" :md="14">
        <el-card class="glass-card bridge-card animate-fade-in">
          <template #header>
            <div class="card-header justify-between">
              <div style="display:flex;align-items:center;gap:8px">
                <el-icon><Warning /></el-icon>
                <span>资金分析 · 百岁推演</span>
              </div>
              <span class="formula-pill">期初现金 {{ (totalAssets/10000).toFixed(1) }}w = 存款 {{ (assets.savings/10000).toFixed(1) }}w + 额外 {{ (assets.compensation/10000).toFixed(1) }}w{{ customAssetsTotal ? ' + 其他 (' + (customAssetsTotal/10000).toFixed(1) + 'w)' : '' }}</span>
            </div>
          </template>

          <!-- 汇总预警 (置顶) -->
          <div class="bridge-summary">
            <div class="summary-item" :class="gapAnalysis.hasGap ? 'is-danger' : 'is-safe'">
              <div class="summary-label">{{ gapAnalysis.hasGap ? '⚠ 资金断层预警' : '✅ 资金安全' }}</div>
              <div class="summary-value">{{ gapAnalysis.message }}</div>
            </div>
            <div class="summary-item is-info">
              <div class="summary-label">关键里程碑</div>
              <div class="summary-value">53岁10个月领退休金({{ retirementInfo.estimatedPension }}/月) · 60岁传世金生到账(90w)</div>
            </div>
          </div>

          <!-- 逐年推演表格 -->
          <div class="bridge-table-wrap">
            <table class="bridge-table">
              <thead>
                <tr>
                  <th>年龄</th>
                  <th>年份</th>
                  <th>期初余额</th>
                  <th>工作收入</th>
                  <th>退休金</th>
                  <th>保险收益</th>
                  <th class="col-out">保费支出</th>
                  <th class="col-out">生活开支</th>
                  <th>年结余</th>
                  <th>期末余额</th>
                  <th style="min-width:80px">资金水位</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in bridgeData" :key="idx"
                    :class="{
                      milestone36: row.year === 2036,
                      milestone60: row.age === 60,
                      danger: row.balance <= 0,
                      warning: row.balance > 0 && row.balance < 50000
                    }">
                  <td class="age-cell">
                    <strong>{{ row.age }}</strong>
                    <span v-if="row.year === 2036" class="milestone-tag pension-tag">退休</span>
                    <span v-if="row.age === 60" class="milestone-tag ins-tag">保险到期</span>
                  </td>
                  <td class="num-cell" style="color: #64748b; font-weight: 500;">
                    {{ row.year }}年
                  </td>
                  <td class="num-cell safe-bal"><strong>{{ (row.openBal/10000).toFixed(1) }}w</strong></td>
                  <td class="num-cell income">{{ row.jobIncome > 0 ? '+' + (row.jobIncome/10000).toFixed(1) + 'w' : '-' }}</td>
                  <td class="num-cell income">{{ row.pensionIncome > 0 ? '+' + (row.pensionIncome/10000).toFixed(1) + 'w' : '-' }}</td>
                  <td class="num-cell income">
                    {{ row.insIncome > 0 ? '+' + (row.insIncome/10000).toFixed(1) + 'w' : '-' }}
                    <span v-if="row.hasSurrender" style="display:block;font-size:10px;line-height:1;margin-top:2px;color:#f59e0b">(含13.6w退保)</span>
                  </td>
                  <td class="num-cell expense">
                    {{ row.insPremium > 0 ? '-' + (row.insPremium < 10000 ? (row.insPremium/10000).toFixed(2) : (row.insPremium/10000).toFixed(1)) + 'w' : '-' }}
                    <span v-if="row.isCurrentYearPartial" style="display:block;font-size:10px;line-height:1;margin-top:2px;color:#6366f1">(当年剩余保费)</span>
                  </td>
                  <td class="num-cell expense">-{{ (row.livingCost/10000).toFixed(1) }}w</td>
                  <td class="num-cell" :class="row.yearNet >= 0 ? 'income' : 'expense'">
                    {{ row.yearNet >= 0 ? '+' : '' }}{{ (row.yearNet/10000).toFixed(1) }}w
                  </td>
                  <td class="num-cell" :class="row.balance > 0 ? 'safe-bal' : 'danger-bal'">
                    <strong>{{ (row.balance/10000).toFixed(1) }}w</strong>
                  </td>
                  <td>
                    <div class="water-bar-bg">
                      <div class="water-bar-fill"
                           :style="{ width: row.barPct + '%' }"
                           :class="{ green: row.barPct > 50, yellow: row.barPct > 15 && row.barPct <= 50, red: row.barPct <= 15 }">
                      </div>
                      <span class="water-bar-label" v-if="row.balance <= 0">⚠ 断层</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 保单说明侧滑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="友邦保险13份合同全面梳理分析报告"
      size="60%"
      direction="rtl"
      destroy-on-close
      append-to-body
      class="policy-drawer"
    >
      <div class="markdown-body" v-html="renderedMarkdown"></div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { User, Postcard, MagicStick, Warning, InfoFilled, QuestionFilled, Operation, Delete, Finished, Location, Plus } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { marked } from 'marked'
import reportMd from '@/PRD/友邦保险13份合同全面梳理分析报告.md?raw'

const userProfile = reactive({ gender: 'female', birthday: dayjs('1982-07-01').toDate() })
const severanceType = ref('2N') // 2N 或 N
const drawerVisible = ref(false)
// 13份合同的基础元数据
const contractsData = [
  { id: 1, name: '优享年年年金保险', code: 'C333555552', type: '年金保险', startDate: '2024-01-01', premium: 12000.00, totalYears: 19, durationText: '39年（至2063年）', shortName: '优享年年年金' },
  { id: 2, name: '优享长伴终身护理保险', code: 'C305600781', type: '终身护理险', startDate: '2024-08-30', premium: 5000.00, totalYears: 13, durationText: '终身', shortName: '优享长伴护理' },
  { id: 3, name: '传世金生荣耀尊享版年金(分红型)', code: 'C871568001', type: '分红型年金', startDate: '2020-06-28', premium: 38365.20, totalYears: 15, durationText: '至105岁', shortName: '传世金生分红型' },
  { id: 4, name: '全佑惠享(2019)重大疾病保险', code: 'C116350330', type: '重大疾病险', startDate: '2019-01-01', premium: 11029.00, totalYears: 25, durationText: '终身', shortName: '全佑惠享(2019)重疾' },
  { id: 5, name: '全佑惠享荣耀珍藏版重大疾病保险', code: 'C991015298', type: '重大疾病险', startDate: '2019-12-07', premium: 4242.00, totalYears: 17, durationText: '终身', shortName: '全佑惠享荣耀珍藏版' },
  { id: 6, name: '卓越海外特药医疗保险', code: 'H122717572', type: '医疗保险', startDate: '2025-11-19', premium: 129.00, totalYears: 1, durationText: '1年（至2026/11）', shortName: '卓越海外特药' },
  { id: 7, name: '增利宝(2020)终身寿险(万能型)', code: 'C302105360', type: '万能型终身寿险', startDate: '2024-06-21', premium: 100.00, totalYears: 5, durationText: '终身', shortName: '增利宝万能型' },
  { id: 8, name: '安行无忧A款两全保险', code: 'C116350291', type: '两全保险', startDate: '2019-01-01', premium: 1800.00, totalYears: 10, durationText: '30年（至2049年）', shortName: '安行无忧两全' },
  { id: 9, name: '智选康逸荣耀(2022)医疗保险', code: 'H117784578', type: '医疗保险', startDate: '2026-01-01', premium: 4060.00, totalYears: 1, durationText: '1年（至2027/01）', shortName: '智选康逸医疗' },
  { id: 10, name: '欣安益(2023)意外伤害保险', code: 'A913344918', type: '意外伤害险', startDate: '2026-01-01', premium: 363.65, totalYears: 1, durationText: '1年（至2027/01）', shortName: '欣安益 A913' },
  { id: 11, name: '欣安益(2023)意外伤害保险', code: 'A921096368', type: '意外伤害险', startDate: '2026-03-12', premium: 1453.25, totalYears: 1, durationText: '1年（至2027/03）', shortName: '欣安益 A921' }
]

function getContractStatus(startDateStr, totalYears, refDate) {
  const now = refDate ? dayjs(refDate) : dayjs()
  const start = dayjs(startDateStr)
  
  if (totalYears === 1) {
    return {
      paidCount: 1,
      remainingCount: 0,
      nextPaymentDate: '已到期',
      lastPaymentDate: '—'
    }
  }

  let paidCount = 0
  for (let k = 1; k <= totalYears; k++) {
    const pDate = start.add(k - 1, 'year')
    if (now.isSame(pDate, 'day') || now.isAfter(pDate, 'day')) {
      paidCount = k
    } else {
      break
    }
  }

  const remainingCount = Math.max(0, totalYears - paidCount)
  let nextPaymentDate = '已结清'
  if (remainingCount > 0) {
    nextPaymentDate = start.add(paidCount, 'year').format('YYYY/MM/DD')
  }
  const lastPaymentDate = start.add(totalYears - 1, 'year').format('YYYY/MM/DD')

  return {
    paidCount,
    remainingCount,
    nextPaymentDate,
    lastPaymentDate
  }
}

const renderedMarkdown = computed(() => {
  // 订阅 drawerVisible 变更以确保每次打开侧滑抽屉时重新计算当前实时时间与年龄
  const _ = drawerVisible.value
  const now = dayjs()
  const currentDateStr = now.format('YYYY年M月D日')
  const currentAge = now.diff(dayjs(userProfile.birthday), 'year')

  let processedMd = reportMd || ''
  // 移除 markdown 顶部的 h1 标题，避免与 el-drawer 顶部标题栏重复
  processedMd = processedMd.replace(/^[\s\n]*#\s+友邦保险13份合同全面梳理分析报告[\s\n]*/, '')
  processedMd = processedMd
    .replace(
      /当前年龄：\d+岁（截至[^）]+）/,
      `当前年龄：${currentAge}岁（截至${currentDateStr}）`
    )
    .replace(
      /报告基准日\*\*：[^\n]+/,
      `报告基准日**：${currentDateStr}`
    )

  const summaryBlock = `\n\n<div class="summary-cards-section">
<div class="summary-cards-header">
<span class="title">保单分类资产与保障总览</span>
<span class="tag">共 11 份生效合同</span>
</div>
<div class="summary-cards-grid">
<div class="summary-card card-annuity">
<div class="card-title">年金保险 <span class="count-badge">2份</span></div>
<div class="card-subtitle">优享年年 · 传世金生</div>
<div class="card-metric">
<span class="label">累计总应缴保费</span>
<span class="value">¥80.35万</span>
</div>
<div class="card-metric">
<span class="label">预期总领取收益</span>
<span class="value purple">¥184.30万</span>
</div>
<div class="card-metric">
<span class="label">60岁总现金价值</span>
<span class="value main">¥101.50万</span>
</div>
</div>
<div class="summary-card card-illness">
<div class="card-title">重大疾病险 <span class="count-badge">2份</span></div>
<div class="card-subtitle">全佑惠享2019 · 珍藏版</div>
<div class="card-metric">
<span class="label">累计总应缴保费</span>
<span class="value">¥34.78万</span>
</div>
<div class="card-metric">
<span class="label">重疾保障保额</span>
<span class="value purple">40-45万元</span>
</div>
<div class="card-metric">
<span class="label">保障期限</span>
<span class="value main">终身保障</span>
</div>
</div>
<div class="summary-card card-care">
<div class="card-title">终身护理险 <span class="count-badge">1份</span></div>
<div class="card-subtitle">优享长伴终身护理</div>
<div class="card-metric">
<span class="label">累计总应缴保费</span>
<span class="value">¥6.50万</span>
</div>
<div class="card-metric">
<span class="label">护理金保底</span>
<span class="value purple">¥16.75万</span>
</div>
<div class="card-metric">
<span class="label">61岁+现价</span>
<span class="value main">¥16.75万+</span>
</div>
</div>
<div class="summary-card card-universal">
<div class="card-title">两全与万能 <span class="count-badge">2份</span></div>
<div class="card-subtitle">安行无忧 · 增利宝</div>
<div class="card-metric">
<span class="label">累计总应缴保费</span>
<span class="value">¥1.85万</span>
</div>
<div class="card-metric">
<span class="label">交通意外最高</span>
<span class="value purple">¥100万元</span>
</div>
<div class="card-metric">
<span class="label">账户增值机制</span>
<span class="value main">复利滚存</span>
</div>
</div>
<div class="summary-card card-medical">
<div class="card-title">医疗与意外 <span class="count-badge">4份</span></div>
<div class="card-subtitle">智选康逸 · 特药 · 欣安益</div>
<div class="card-metric">
<span class="label">年缴保费</span>
<span class="value">¥0.60万/年</span>
</div>
<div class="card-metric">
<span class="label">医疗特药保额</span>
<span class="value purple">800万/年</span>
</div>
<div class="card-metric">
<span class="label">意外身故/伤残</span>
<span class="value main">¥90万元</span>
</div>
</div>
</div>
</div>\n\n`

  processedMd = processedMd.replace(
    /(> \*\*报告基准日\*\*：[^\n]+)/,
    `$1${summaryBlock}`
  )

  // 动态构建 13份合同总览 双行展示表格 (0 缩进以防 marked 解析为 code block)
  const sec1RowsHtml = contractsData.map((c) => {
    const st = getContractStatus(c.startDate, c.totalYears, now)
    const remStr = c.totalYears === 1 ? '0（到期）' : `${st.remainingCount}年`
    const premStr = c.premium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return `<tr class="contract-header-row">
<td colspan="8">
<span class="contract-num">${c.id}</span>
<span class="contract-name">${c.name}</span>
</td>
</tr>
<tr class="contract-detail-row">
<td>${c.code}</td>
<td>${c.type}</td>
<td>${c.startDate.replace(/-/g, '/')}</td>
<td>¥${premStr}</td>
<td>${c.totalYears}年</td>
<td>${st.paidCount}</td>
<td><strong class="highlight-rem">${remStr}</strong></td>
<td>${c.durationText}</td>
</tr>`
  }).join('\n')

  const sec1Table = `<div class="overview-table-wrap">
<table class="overview-table">
<thead>
<tr>
<th>合同编号</th>
<th>险种类型</th>
<th>生效日</th>
<th>年缴保费</th>
<th>付费年限</th>
<th>已缴次数</th>
<th>剩余次数</th>
<th>保险期间</th>
</tr>
</thead>
<tbody>
${sec1RowsHtml}
</tbody>
</table>
</div>`

  // 动态构建 剩余缴费年限明细 表格
  const sec4Header = `| 合同 | 生效日 | 付费年限 | 下次缴费日 | 已缴 | 剩余 | 最后一期缴费 |\n|------|---------|:------:|---------|:---:|:---:|------------|`
  const sec4Body = contractsData.map((c) => {
    const st = getContractStatus(c.startDate, c.totalYears, now)
    const remStr = c.totalYears === 1 ? '0' : `${st.remainingCount}次`
    return `| ${c.shortName} | ${c.startDate.replace(/-/g, '/')} | ${c.totalYears}年 | ${st.nextPaymentDate} | ${st.paidCount}次 | ${remStr} | ${st.lastPaymentDate} |`
  }).join('\n')
  const sec4Table = `${sec4Header}\n${sec4Body}`

  processedMd = processedMd.replace(
    /\| 序号 \| 合同名称 \|[\s\S]*?\| 11 \| 欣安益\(2023\)意外伤害保险[^\n]+/,
    sec1Table
  )
  processedMd = processedMd.replace(
    /\| 合同 \| 生效日 \| 付费年限 \|[\s\S]*?\| 欣安益 A921[^\n]+/,
    sec4Table
  )

  const html = marked(processedMd)
  return html
})
const assets = reactive({ 
  savings: 100000, 
  backPay: 0, 
  compensation: 311750, // 欠薪+赔偿 默认值，对应6个月入账总额
  customAssets: [], // 自定义增加的核心资产列表
  workingIncome: 20000,
  workingYears: 10,
  estimatedPension: 5000,
  returns: [
    { name: '优享年年', amount: 19206, start: 60, end: 79, enabled: true },
    { name: '传世金生', amount: 900000, age: 60, enabled: true }
  ]
})

const addCustomAsset = () => {
  if (!assets.customAssets) {
    assets.customAssets = []
  }
  assets.customAssets.push({
    id: Date.now(),
    name: `补充资产 ${assets.customAssets.length + 1}`,
    amount: 0
  })
}

const removeCustomAsset = (index) => {
  assets.customAssets.splice(index, 1)
}

const customAssetsTotal = computed(() => {
  return (assets.customAssets || []).reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

const totalAssets = computed(() => {
  return Number(assets.savings || 0) + Number(assets.compensation || 0) + customAssetsTotal.value
})

const cityCostsList = ref([
  { id: 'beijing', label: '北京', monthly: 9300, living: 5000, rent: 4300, ageRange: [44, 54], enabled: true },
  { id: 'tieling', label: '铁岭', monthly: 2000, living: 2000, rent: 0, ageRange: [55, 100], enabled: true },
  { id: 'heze', label: '菏泽', monthly: 2500, living: 2500, rent: 0, ageRange: [55, 100], enabled: false }
])

const ageMarks = {
  44: '44岁',
  54: '53岁10个月退休',
  70: '70岁',
  100: '100岁'
}

// 自动监听生活费与房租输入，同步更新月总开支
watch(cityCostsList, (newVal) => {
  newVal.forEach(city => {
    city.monthly = Number(city.living || 0) + Number(city.rent || 0)
  })
}, { deep: true })


// 动态精准计算各保单在当前时间节点下的剩余缴费年限
const getInitialInsuranceList = () => {
  const now = dayjs()
  const c1 = getContractStatus('2024-01-01', 19, now)
  const c2 = getContractStatus('2024-08-30', 13, now)
  const c3 = getContractStatus('2020-06-28', 15, now)
  const c4 = getContractStatus('2019-01-01', 25, now)
  const c5 = getContractStatus('2019-12-07', 17, now)
  const c6 = getContractStatus('2025-11-19', 1, now)
  const c7 = getContractStatus('2024-06-21', 5, now)
  const c8 = getContractStatus('2019-01-01', 10, now)
  const c9 = getContractStatus('2026-01-01', 1, now)
  const c10 = getContractStatus('2026-01-01', 1, now)
  const c11 = getContractStatus('2026-03-12', 1, now)

  return [
    { enabled: true, name: '1月优享年年养老金', startDate: '2024-01-01', totalYears: 19, yearsLeft: c1.remainingCount, premium: 12000 },
    { enabled: true, name: '8月优享长伴护理', startDate: '2024-08-30', totalYears: 13, yearsLeft: c2.remainingCount, premium: 5000 },
    { enabled: true, name: '6月传世金生年金', startDate: '2020-06-28', totalYears: 15, yearsLeft: c3.remainingCount, premium: 38365.20 },
    { enabled: true, name: '1月全佑惠享(2019)重疾', startDate: '2019-01-01', totalYears: 25, yearsLeft: c4.remainingCount, premium: 11029 },
    { enabled: true, name: '12月全佑惠享荣耀重疾', startDate: '2019-12-07', totalYears: 17, yearsLeft: c5.remainingCount, premium: 4242 },
    { enabled: true, name: '11月卓越海外特药', startDate: '2025-11-19', totalYears: 1, yearsLeft: c6.remainingCount, premium: 129 },
    { enabled: true, name: '6月增利宝万能型', startDate: '2024-06-21', totalYears: 5, yearsLeft: c7.remainingCount, premium: 100 },
    { enabled: true, name: '1月安行无忧A款两全', startDate: '2019-01-01', totalYears: 10, yearsLeft: c8.remainingCount, premium: 1800 },
    { enabled: true, name: '1月智选康逸荣耀医疗', startDate: '2026-01-01', totalYears: 1, yearsLeft: 40, premium: 4060 },
    { enabled: true, name: '1月欣安益意外 A913', startDate: '2026-01-01', totalYears: 1, yearsLeft: c10.remainingCount, premium: 363.65 },
    { enabled: true, name: '3月欣安益意外 A921', startDate: '2026-03-12', totalYears: 1, yearsLeft: c11.remainingCount, premium: 1453.25 }
  ]
}

const insuranceList = ref(getInitialInsuranceList())

// ★★★ 核心资产自动计算逻辑 ★★★
const compensationInfo = computed(() => {
  const joinDate = dayjs('2022-03-01')
  const now = dayjs()
  const totalMonths = now.diff(joinDate, 'month')
  const years = Math.floor(totalMonths / 12)
  const remainingMonths = totalMonths % 12
  let n = years
  if (remainingMonths >= 6) {
    n += 1
  } else if (remainingMonths > 0) {
    n += 0.5
  }
  
  const severance = 29000 * n * (severanceType.value === '2N' ? 2 : 1)
  // 为了匹配 6次入账总额为 311,750：
  // 2N 方案下，裁员赔偿 = 261,000，所对应的实际欠薪追补 = 50,750 (即 7 个月)
  // N 方案下，裁员赔偿 = 130,500，所对应的实际欠薪追补 = 50,750
  const restorationMonths = 7
  const wageRestoration = 29000 * 0.25 * restorationMonths
  
  return {
    n,
    severance,
    wageRestoration,
    restorationMonths
  }
})

// 自动同步到 assets 以供表单修改或展示
watch(compensationInfo, (val) => {
  assets.compensation = val.severance + Math.round(val.wageRestoration)
  assets.backPay = 0
}, { immediate: true })

const syncCompResult = () => {
  // 此函数现已弃用，由 watch 自动处理
}

// 监听 传世金生 停保动作：如果关闭了保费，自动取消未来的满期收益预期
watch(() => insuranceList.value.find(i => i.name.includes('传世金生'))?.enabled, (newVal) => {
  if (newVal === false) {
    assets.returns[1].enabled = false
  }
}, { deep: true })

const currentAge = computed(() => dayjs('2026-07-01').diff(dayjs(userProfile.birthday), 'year'))
const retirementInfo = computed(() => {
  return { age: '53岁10个月', yearsLeft: Math.max(0, 53 - 43), estimatedPension: assets.estimatedPension }
})

const activeAnnualPremium = computed(() => insuranceList.value.filter(i => i.enabled && i.yearsLeft > 0).reduce((s, i) => s + i.premium, 0))
const totalAnnualExpense = computed(() => {
  let firstYearLivingCost = 0
  const activeCity = cityCostsList.value.find(c => c.enabled && currentAge.value >= c.ageRange[0] && currentAge.value <= c.ageRange[1])
  if (activeCity) {
    firstYearLivingCost = activeCity.monthly * 12
  }
  return firstYearLivingCost + activeAnnualPremium.value
})
const activeTotalRemaining = computed(() => insuranceList.value.filter(i => i.enabled).reduce((s, i) => s + (i.premium * i.yearsLeft), 0))

// ★★★ 新模块：资金断层逐年推演 ★★★
const bridgeData = computed(() => {
  const rows = []
  let bal = totalAssets.value // 期初现金池
  const maxBal = totalAssets.value // 用于水位条百分比基准
  const maxAge = 100

  for (let age = currentAge.value; age < maxAge; age++) {
    const t = age - currentAge.value
    const year = 2026 + t

    // 收入
    let jobIncome = 0
    let pensionIncome = 0
    if (year < 2036) {
      jobIncome = t < assets.workingYears ? assets.workingIncome * 12 : 0
      pensionIncome = 0
    } else if (year === 2036) {
      // 2036年5月退休，前4个月工作，后8个月领退休金
      jobIncome = assets.workingYears >= 10 ? assets.workingIncome * 4 : 0
      pensionIncome = assets.estimatedPension * 8
    } else {
      jobIncome = t < assets.workingYears ? assets.workingIncome * 12 : 0
      pensionIncome = assets.estimatedPension * 12
    }
    let insIncome = 0
    if (assets.returns[0].enabled && age >= assets.returns[0].start && age <= assets.returns[0].end) {
      insIncome += assets.returns[0].amount
    }
    if (assets.returns[1].enabled && age === assets.returns[1].age) {
      insIncome += assets.returns[1].amount
    }

    // 退保逻辑: 如果 传世金生 停缴，则在第一年产生 13.6 万退保现金价值
    const chuanshiIns = insuranceList.value.find(i => i.name.includes('传世金生'))
    const hasSurrender = (chuanshiIns && !chuanshiIns.enabled && t === 0)
    if (hasSurrender) {
      insIncome += 136000
    }

    // 支出：对于首年（2026年），仅统计当前月份之后尚未交的剩余保费；后续年份统计全额保费支出
    let insPremium = 0
    let isCurrentYearPartial = false

    if (t === 0) {
      const now = dayjs()
      insuranceList.value.forEach(i => {
        if (!i.enabled || i.yearsLeft <= 0) return
        if (i.startDate) {
          const paymentDateThisYear = dayjs(i.startDate).year(now.year())
          if (now.isBefore(paymentDateThisYear, 'day')) {
            insPremium += i.premium
          }
        } else {
          insPremium += i.premium
        }
      })
      isCurrentYearPartial = true
    } else {
      insPremium = insuranceList.value.filter(i => i.enabled && i.yearsLeft >= t).reduce((s, i) => s + i.premium, 0)
    }
    
    // 计算当前年龄居住的城市支出（支持多城市按年龄段配置）
    let livingCost = 0
    const activeCity = cityCostsList.value.find(c => c.enabled && age >= c.ageRange[0] && age <= c.ageRange[1])
    if (activeCity) {
      livingCost = activeCity.monthly * 12
    }

    const yearNet = jobIncome + pensionIncome + insIncome - insPremium - livingCost
    const openBal = bal // 期初余额
    bal = bal + yearNet

    rows.push({
      age,
      year: 2026 + t,
      openBal,
      jobIncome,
      pensionIncome,
      insIncome,
      insPremium,
      livingCost,
      yearNet,
      balance: bal,
      barPct: Math.max(0, Math.min(100, (bal / maxBal) * 100)),
      hasSurrender,
      isCurrentYearPartial
    })
  }
  return rows
})

const gapAnalysis = computed(() => {
  const firstGap = bridgeData.value.find(r => r.balance <= 0)
  if (!firstGap) {
    return { hasGap: false, message: '您的资金可以覆盖到100岁，无断层风险' }
  }
  const recoveryRow = bridgeData.value.find(r => r.age > firstGap.age && r.balance > 0)
  if (recoveryRow) {
    return {
      hasGap: true,
      message: `资金将在 ${firstGap.age} 岁耗尽，${recoveryRow.age} 岁因收益回款恢复正值。断层期 ${recoveryRow.age - firstGap.age} 年，需要额外储备 ¥${Math.abs(Math.min(...bridgeData.value.filter(r => r.balance < 0).map(r => r.balance))/10000).toFixed(1)}w 来填补缺口`
    }
  }
  return {
    hasGap: true,
    message: `资金将在 ${firstGap.age} 岁耗尽且无法恢复，请增加工作收入或减少开支`
  }
})

const simulation = computed(() => {
  let bal = totalAssets.value // 39.3w 初始存入池
  const hist = []
  let years = 0
  const maxSimYears = 100 - currentAge.value

  for (let t = 0; t < maxSimYears; t++) {
    const age = currentAge.value + t
    const year = 2026 + t
    
    // 年度流入 (Real Cash Flow)
    let inJob = 0
    let inPens = 0
    if (year < 2036) {
      inJob = t < assets.workingYears ? assets.workingIncome * 12 : 0
      inPens = 0
    } else if (year === 2036) {
      // 2036年5月退休，前4个月工作，后8个月领退休金
      inJob = assets.workingYears >= 10 ? assets.workingIncome * 4 : 0
      inPens = assets.estimatedPension * 8
    } else {
      inJob = t < assets.workingYears ? assets.workingIncome * 12 : 0
      inPens = assets.estimatedPension * 12
    }
    let inY = (assets.returns[0].enabled && age >= assets.returns[0].start && age <= assets.returns[0].end) ? assets.returns[0].amount : 0
    let inC = (assets.returns[1].enabled && age === assets.returns[1].age) ? assets.returns[1].amount : 0
    
    // 年度流入总额 (仅包含当年进款，不含初始存量)
    const totalIn = inJob + inPens + inY + inC

    // 年度支出 (Real Cash Flow)
    let outIns = 0
    if (t === 0) {
      const now = dayjs()
      insuranceList.value.forEach(i => {
        if (!i.enabled || i.yearsLeft <= 0) return
        if (i.startDate) {
          const paymentDateThisYear = dayjs(i.startDate).year(now.year())
          if (now.isBefore(paymentDateThisYear, 'day')) {
            outIns += i.premium
          }
        } else {
          outIns += i.premium
        }
      })
    } else {
      outIns = insuranceList.value.filter(i => i.enabled && i.yearsLeft >= t).reduce((s, i) => s + i.premium, 0)
    }
    
    // 计算当前年龄居住的城市支出（支持多城市按年龄段配置）
    let outCity = 0
    const activeCity = cityCostsList.value.find(c => c.enabled && age >= c.ageRange[0] && age <= c.ageRange[1])
    if (activeCity) {
      outCity = activeCity.monthly * 12
    }
    const totalOut = outIns + outCity


    // 存量实时变动：水位 = 上年余额 + 今年进账 - 今年出账
    bal = bal + totalIn - totalOut

    hist.push({ 
      age,
      inJob, inPens, inY, inC, inTotal: totalIn,
      outIns, outCity, outTotal: totalOut,
      accumBal: Math.max(-100, bal) // 允许负数(缺口)但不低于基准
    })
    
    if (bal > 0) years++
  }
  return { hist, survivalYears: years }
})

const flowChartData = computed(() => {
  const data = simulation.value.hist
  // 流量标尺：主要针对年度开支 (通常 < 20w)
  const medFlow = 150000 
  const maxBal = Math.max(...data.map(d => Math.max(d.accumBal, totalAssets.value)), 1)

  return data.map(d => {
    const inTotal = d.inTotal || 0.0001
    const outTotal = d.outTotal || 0.00001
    
    return {
      ...d,
      // 收入条：相对于流量标尺显示其高度 (最大占据 200px 的 30%，也就是作为“附加项”画在水位上)
      hTop: Math.min(50, (d.inTotal / medFlow) * 35), 
      hBottom: Math.min(50, (d.outTotal / medFlow) * 35),
      hJob: (d.inJob/inTotal)*100,
      hPens: (d.inPens/inTotal)*100,
      hInsY: (d.inY/inTotal)*100,
      hInsC: (d.inC/inTotal)*100,
      hOutIns: (d.outIns/outTotal)*100,
      hOutCity: (d.outCity/outTotal)*100,
      
      // 动态蓄水池高度：实时展示余额存量趋势
      hBase: (d.accumBal / maxBal) * 50, // 映射到 0-200px
      hTrendLine: (d.accumBal / maxBal) * 100 // 线上点位
    }
  })
})
// ★★★ 迷你计算器逻辑 ★★★
const calcExpr = ref('')
const calcResult = ref('')

const handleCalcInput = (val) => {
  if (val === '=') {
    try {
      // 简单的数学表达式计算
      const sanitized = calcExpr.value.replace(/[^-+*/.0-9]/g, '')
      calcResult.value = Function(`"use strict"; return (${sanitized})`)()
      calcExpr.value = calcResult.value.toString()
    } catch (e) {
      calcResult.value = 'Error'
    }
  } else if (val === 'C') {
    calcExpr.value = ''
    calcResult.value = ''
  } else {
    calcExpr.value += val
  }
}
</script>

<style scoped>
.flexicalc-container { padding: 20px 0px; min-height: 100vh; font-family: sans-serif; }
.glass-card { background: rgba(255, 255, 255, 0.9); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.3); }
.card-header { display: flex; align-items: center; gap: 8px; font-weight: bold; color: #1e293b; }
.justify-between { justify-content: space-between; }

.equal-height-row { display: flex; flex-wrap: wrap; align-items: stretch; }
.equal-height-row > .el-col { display: flex; flex-direction: column; }
.equal-height-row .glass-card { flex: 1; display: flex; flex-direction: column; }
:deep(.equal-height-row .glass-card .el-card__body) { flex: 1; display: flex; flex-direction: column; }
.total-expense-banner { margin-top: auto !important; }

.insurance-stats-bar { display: flex; gap: 10px; }
.stat-mini { background: #eef2ff; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
.stat-mini .value { color: #6366f1; font-weight: bold; }

.total-assets-banner, .total-expense-banner { 
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); 
  padding: 12px; 
  border-radius: 8px; 
  color: white; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}
.total-expense-banner { 
  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); 
  border: 1px solid #fecdd3;
  box-shadow: none; 
  color: #be123c; 
}
.total-assets-banner .label, .total-expense-banner .label { font-size: 13px; opacity: 0.9; }
.total-assets-banner .value, .total-expense-banner .value { font-size: 20px; font-weight: bold; }

.city-stats-pill {
  font-size: 11px;
  font-weight: 600;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.15);
  padding: 3px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  height: 24px;
  box-sizing: border-box;
}

/* 统一的高级胶囊型按钮样式 */
.header-action-btn {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #6366f1 !important;
  background: rgba(99, 102, 241, 0.08) !important;
  border: 1px solid rgba(99, 102, 241, 0.15) !important;
  padding: 4px 12px !important;
  height: 24px !important;
  border-radius: 20px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.header-action-btn:hover {
  background: rgba(99, 102, 241, 0.18) !important;
  border-color: rgba(99, 102, 241, 0.3) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}
.header-action-btn:active {
  transform: translateY(0);
}
.city-stages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.city-stage-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  background: #ffffff;
}
.city-stage-card.is-disabled {
  background: #f8fafc;
  border-color: #f1f5f9;
  opacity: 0.6;
}
.city-stage-card:not(.is-disabled) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.city-stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
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
  gap: 12px;
  align-items: center;
}
.input-mini-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mini-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}
.mini-num-input {
  width: 100px;
}
.city-stage-body {
  margin-top: 16px;
  border-top: 1px dashed #f1f5f9;
  padding-top: 16px;
}
.slider-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.slider-label-text {
  font-size: 13px;
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
  padding: 0 10px 10px 10px;
}
:deep(.city-age-slider .el-slider__bar) {
  background-color: #6366f1;
}
:deep(.city-age-slider .el-slider__button) {
  border-color: #6366f1;
}


.asset-total-inline {
  font-size: 16px;
  font-weight: 800;
  color: #4f46e5;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  padding: 0px 14px;
  border-radius: 8px;
  border: 1px solid #c7d2fe;
  text-align: center;
}

.incentive-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.incentive-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e2e8f0;
}
.incentive-item .item-label {
  display: flex;
  flex-direction: column;
}
.incentive-item .title {
  font-size: 13px;
  font-weight: bold;
  color: #1e293b;
}
.incentive-item .formula {
  font-size: 11px;
  color: #94a3b8;
}
.incentive-item .item-value {
  font-weight: bold;
  color: #475569;
  font-size: 14px;
}
.incentive-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 4px;
  font-size: 12px;
  font-weight: bold;
  color: #6366f1;
}
.incentive-total .val {
  font-size: 16px;
}

.calc-symbol {
  text-align: center;
  font-size: 20px;
  color: #6366f1;
  font-weight: bold;
  padding-top: 18px;
}

.tool-btn-square {
  width: 32px;
  height: 32px;
  padding: 0 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border-radius: 6px !important;
  font-size: 16px !important;
}

.asset-summary-banner {
  background: linear-gradient(135deg, #f8faff, #f0f4ff);
  border-radius: 12px;
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.05);
  border: 1px solid #e0e7ff;
}

.asset-summary-banner .summary-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.asset-summary-banner .formula-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: normal;
}

.asset-summary-banner .summary-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.asset-summary-banner .currency {
  font-size: 16px;
  color: #6366f1;
  font-weight: bold;
}

.asset-summary-banner .number {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: #4f46e5;
  text-shadow: 0 2px 4px rgba(79, 70, 229, 0.1);
}

.retirement-stat-card {
  background: #fdf2f8;
  border: 1px solid #fbcfe8;
  border-radius: 10px;
  padding: 15px;
}
.retirement-stat-card .stat-main { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
.retirement-stat-card .stat-main .label { color: #86198f; font-weight: bold; }
.retirement-stat-card .stat-main .value { color: #d946ef; font-size: 22px; font-weight: 800; }
.retirement-stat-card .stat-sub { color: #a21caf; font-size: 12px; }

.insurance-return-panel { display: flex; flex-direction: column; gap: 8px; }
.return-item { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px; }
.return-item .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.return-item .name { font-weight: bold; color: #166534; font-size: 13px; }
.return-item .amount { color: #15803d; font-weight: 800; font-size: 16px; margin-right: 10px; }
.return-item .period { color: #3f6212; font-size: 11px; }
.mt-10 { margin-top: 10px; }

.city-info-tag { margin-top: 10px; font-size: 13px; color: #64748b; background: #f1f5f9; padding: 6px 12px; border-radius: 6px; }
.city-info-tag .highlight { color: #1e293b; font-weight: bold; }

.insurance-summary-mini { margin-bottom: 12px; font-size: 14px; color: #475569; }
.insurance-summary-mini .value { color: #f43f5e; font-weight: bold; }

.mini-table :deep(.el-table__cell) { padding: 4px 0; }
.table-cell-multi { display: flex; flex-direction: column; line-height: 1.2; }
.table-cell-multi .p { font-weight: bold; color: #334155; }
.table-cell-multi .y { font-size: 11px; color: #94a3b8; }

.result-layout { display: flex; gap: 40px; align-items: flex-start; margin-top: 10px; }
.result-main-stats { flex: 1; min-width: 280px; }
.result-chart-area { flex: 2; }

.formula-pill { background: #eef2ff; color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: monospace; }

.formula-explanation { 
  background: #f8fafc; 
  border-radius: 8px; 
  padding: 12px; 
  margin: 15px 0; 
  border-left: 4px solid #6366f1; 
  font-size: 13px;
}
.formula-explanation .formula-title { 
  display: flex; 
  align-items: center; 
  gap: 4px; 
  font-weight: bold; 
  color: #1e293b; 
  margin-bottom: 8px; 
}
.formula-explanation .formula-content { 
  font-family: 'Courier New', Courier, monospace; 
  background: white; 
  padding: 6px 10px; 
  border-radius: 4px; 
  color: #475569; 
}
.formula-explanation .formula-note { font-size: 11px; color: #94a3b8; margin-top: 6px; }

.survival-status { text-align: left; margin: 0 0 20px 0; }
.survival-status h3 { font-size: 4rem; margin: 5px 0; font-weight: 800; line-height: 1; }
.safe { color: #10b981; } .risk { color: #f59e0b; }
.chart-mock { height: 240px; display: flex; align-items: flex-end; gap: 1px; margin-top: 10px; padding-bottom: 25px; position: relative; }
.chart-bar-wrapper { flex: 1; height: 100%; position: relative; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.chart-bar-stacked { width: 100%; display: flex; flex-direction: column-reverse; justify-content: flex-end; transition: all 0.3s ease; }
.layer { width: 100%; transition: height 0.3s ease; }

/* 测算结果全面重组样式 */
.result-full-card { margin-top: 30px; border: 1px solid #e0e7ff; }
.result-header { display: flex; align-items: center; gap: 8px; font-weight: bold; color: #4f46e5; }
.result-top-summary { padding: 10px 0; align-items: center; }

.survival-status { background: #f5f3ff; padding: 20px; border-radius: 12px; border: 1px solid #ddd6fe; text-align: center; }
.survival-status .label { color: #6d28d9; font-size: 14px; font-weight: 500; }
.survival-status h3 { font-size: 48px; margin: 10px 0; font-weight: 900; line-height: 1; color: #5b21b6; }
.survival-status .status-tip { display: flex; align-items: center; justify-content: center; gap: 5px; color: #7c3aed; font-size: 12px; opacity: 0.8; }
.result-top-summary { padding: 10px 0; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; }
.simple-formula { text-align: center; margin-bottom: 15px; font-size: 13px; color: #64748b; font-weight: bold; background: #fdf2f8; padding: 6px; border-radius: 4px; }

.formula-explanations { background: #f8fafc; border: 1px dashed #cbd5e1; padding: 20px; border-radius: 12px; }
.formula-item .formula-label { display: block; font-size: 13px; font-weight: bold; color: #475569; margin-bottom: 5px; }
.formula-item .formula-content { font-size: 13px; color: #64748b; line-height: 1.6; }

.waterfall-chart-main { height: 400px; display: flex; align-items: stretch; position: relative; margin-top: 80px; gap: 4px; border-bottom: 2px solid #f1f5f9; padding-bottom: 40px; }
.zero-line { position: absolute; top: 200px; left: 0; right: 0; height: 2px; background: #cbd5e1; z-index: 5; }

.wf-bar-col { flex: 1; min-width: 12px; position: relative; display: flex; flex-direction: column; z-index: 10; border-radius: 2px; }
.wf-stack { width: 100%; display: flex; flex-direction: column; transition: transform 0.3s ease; }
.wf-reservoir-layer { position: absolute; bottom: 200px; width: 100%; background: rgba(59, 130, 246, 0.2); border-radius: 2px 2px 0 0; transition: height 0.3s ease; }
.wf-top-float { position: absolute; width: 100%; z-index: 15; justify-content: flex-end; }
.wf-top { display: none; } /* 弃用旧版 */
.wf-bottom { position: absolute; top: 200px; justify-content: flex-start; }

.wf-layer { width: 100%; border-radius: 1px; flex-shrink: 0; }
.wf-layer.layer-savings { background: #3b82f6; }
.wf-layer.layer-job { background: #818cf8; }
.wf-layer.layer-chuanshi { background: #059669; } /* 深绿 */
.wf-layer.layer-pension { background: #fbbf24; } /* 橙色 */
.wf-layer.layer-out-ins { background: #fecaca; } /* 浅红 */
.wf-layer.layer-out-city { background: #ef4444; } /* 深红 */

.wf-age-label { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); font-size: 10px; color: #94a3b8; white-space: nowrap; }
.wf-box { position: absolute; inset: -5px; z-index: 20; cursor: pointer; }

/* 资产趋势水位线 */
.wf-trend-point {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #6366f1;
  border-radius: 50%;
  z-index: 30;
  border: 1.5px solid white;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.wf-trend-point.gap {
  background: white;
  border-color: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
}
.line-point { 
  display: inline-block; 
  width: 12px; 
  height: 6px; 
  background: #6366f1; 
  border-radius: 3px; 
  border: 1px solid white;
  box-shadow: 0 0 4px rgba(99, 102, 241, 0.3);
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

.standalone-legend { display: flex; gap: 30px; background: #f8fafc; padding: 12px 24px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; justify-content: center; }
.dot { width: 12px; height: 12px; border-radius: 2px; display: inline-block; margin-right: 4px; }
.dot.pot-savings { background: #3b82f6; }
.dot.pot-job { background: #818cf8; }
.dot.pot-youxiang { background: #34d399; }
.dot.pot-chuanshi { background: #059669; }
.dot.pot-pension { background: #fbbf24; }
.dot.pot-out-ins { background: #fecaca; }
.dot.pot-out-city { background: #ef4444; }

.wf-tooltip { min-width: 200px; padding: 8px; }
.tt-head { font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 8px; font-size: 14px; }
.tt-bal-main { font-size: 16px; font-weight: 800; color: #4f46e5; }
.tt-row.plus { color: #059669; font-size: 13px; }
.tt-row.minus { color: #e11d48; font-size: 13px; }
.tt-net { margin-top: 8px; padding: 4px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; }
.tt-net.gain { background: #f0fdf4; color: #15803d; }
.tt-net.loss { background: #fef2f2; color: #b91c1c; }

/* ★★★ 资金断层分析模块样式 ★★★ */
.bridge-card { border: 1px solid #e0e7ff; }
.bridge-table-wrap { border-radius: 8px; border: 1px solid #e2e8f0; }
.bridge-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.bridge-table thead { position: sticky; top: 0; z-index: 10; }
.bridge-table th {
  background: #1e293b;
  color: white;
  padding: 8px 4px;
  text-align: center;
  font-weight: 600;
  font-size: 11px;
  white-space: nowrap;
}
.bridge-table th.col-out { background: #991b1b; }
.bridge-table td { padding: 6px 4px; text-align: center; border-bottom: 1px solid #f1f5f9; }
.bridge-table tbody tr:nth-child(even) { background: #f8fafc; }
.bridge-table tbody tr:hover { background: #eef2ff; }

.bridge-table tr.milestone36 { background: #fdf2f8 !important; border-left: 3px solid #d946ef; }
.bridge-table tr.milestone60 { background: #f0fdf4 !important; border-left: 3px solid #22c55e; }
.bridge-table tr.danger { background: #fef2f2 !important; }
.bridge-table tr.danger td { color: #991b1b; }
.bridge-table tr.warning { background: #fffbeb !important; }

.age-cell { font-size: 12px; white-space: nowrap; }
.milestone-tag { display: inline-block; font-size: 10px; padding: 1px 6px; border-radius: 10px; margin-left: 4px; font-weight: bold; }
.pension-tag { background: #f3e8ff; color: #7c3aed; }
.ins-tag { background: #dcfce7; color: #16a34a; }

.num-cell { font-family: 'SF Mono', 'Courier New', monospace; font-size: 11px; }
.num-cell.income { color: #059669; font-weight: 600; }
.num-cell.expense { color: #dc2626; font-weight: 600; }
.safe-bal { color: #1d4ed8; }
.danger-bal { color: #dc2626; }

.water-bar-bg {
  width: 100%;
  height: 16px;
  background: #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.water-bar-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s ease, background 0.3s ease;
  min-width: 2px;
}
.water-bar-fill.green { background: linear-gradient(90deg, #34d399, #10b981); }
.water-bar-fill.yellow { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.water-bar-fill.red { background: linear-gradient(90deg, #f87171, #ef4444); }
.water-bar-label {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: bold;
  color: #dc2626;
}

.bridge-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.summary-item {
  flex: 1;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid;
}
.summary-item.is-safe { background: #f0fdf4; border-color: #bbf7d0; }
.summary-item.is-danger { background: #fef2f2; border-color: #fecaca; }
.summary-item.is-info { background: #eff6ff; border-color: #bfdbfe; }
.summary-label { font-size: 14px; font-weight: bold; margin-bottom: 6px; }
.is-safe .summary-label { color: #15803d; }
.is-danger .summary-label { color: #dc2626; }
.is-info .summary-label { color: #1d4ed8; }
.summary-value { font-size: 13px; color: #475569; line-height: 1.5; }

.mt-20 { margin-top: 20px; }

/* ★★★ 优化表单控件样式 (el-input-number, el-select) ★★★ */
:deep(.el-input-number .el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  background-color: #f8fafc;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02) inset, 0 0 0 1px #e2e8f0 inset !important;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-input-number .el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover) {
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.1), 0 0 0 1px #818cf8 inset !important;
}

:deep(.el-input-number .el-input__wrapper.is-focus),
:deep(.el-select .el-input__wrapper.is-focus) {
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15), 0 0 0 2px #6366f1 inset !important;
}

:deep(.el-input__inner) {
  font-weight: 600 !important;
  color: #1e293b !important;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background: transparent !important;
  border-color: transparent !important;
  color: #94a3b8;
  transition: color 0.2s;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  color: #6366f1;
}

/* ★★★ 优化开关样式 (el-switch) ★★★ */
:deep(.el-switch) {
  --el-switch-on-color: #6366f1;
  --el-switch-off-color: #cbd5e1;
}
.expense-section :deep(.el-switch) { --el-switch-on-color: #4f46e5; }
.insurance-return-panel :deep(.el-switch) { --el-switch-on-color: #10b981; }

:deep(.el-switch__action) {
  box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
}
:deep(.el-switch__core) {
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.08);
}

/* 停用/关闭状态时的视觉置灰效果 */
.return-item {
  transition: all 0.3s ease;
}
.return-item.is-disabled {
  opacity: 0.45;
  filter: grayscale(1);
  background: #f8fafc;
  border-color: #e2e8f0;
}
:deep(.disabled-row) {
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

/* 赔偿计算器样式 */
.comp-result-list {
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
  border: 1px dashed #e2e8f0;
}
.res-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}
.res-item b {
  color: #334155;
}
.res-formula {
  font-size: 10px;
  color: #94a3b8;
  margin-top: -4px;
  margin-bottom: 4px;
}
.total-res {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-weight: bold;
  color: #1e293b;
}
.total-res .val {
  color: #6366f1;
  font-size: 18px;
}
.premium-radio :deep(.el-radio-button__inner) {
  padding: 6px 12px;
}
.mb-20 { margin-bottom: 20px; }

</style>

<style>
/* 全局样式块（非 scoped），专门用于渲染 v-html 中的 Markdown 报告及抽屉包装 */
.policy-drawer {
  height: 100vh !important; /* 强制锁定抽屉总体高度为视口高度 */
}
@media (max-width: 768px) {
  .policy-drawer {
    width: 100% !important;
  }
}
.policy-drawer .el-drawer__header {
  margin-bottom: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}
.policy-drawer .el-drawer__title {
  font-weight: 800 !important;
  color: #1e1b4b !important;
  font-size: 16px !important;
}
.policy-drawer .el-drawer__body {
  padding: 0 !important;
  background-color: #fafbfc;
  height: calc(100vh - 65px) !important; /* 锁定Body高度为窗口减去Header，严防溢出屏幕 */
  overflow-y: auto !important; /* 强制启用独立的Y轴垂直滚动条 */
}

/* ★★★ 13份合同总览 双行展示表格样式 ★★★ */
.overview-table-wrap {
  margin: 20px 0 28px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.overview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
  background: #ffffff;
}

.overview-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  padding: 10px 14px;
  border-bottom: 2px solid #e2e8f0;
  text-align: left;
  white-space: nowrap;
}

.overview-table .contract-header-row td {
  background: linear-gradient(90deg, #f1f5f9 0%, #f8fafc 100%);
  padding: 10px 16px;
  border-top: 1px solid #cbd5e1;
  border-bottom: 1px solid #e2e8f0;
}

.overview-table .contract-num {
  display: inline-block;
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  border-radius: 50%;
  background: #6366f1;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  margin-right: 8px;
}

.overview-table .contract-name {
  font-size: 14px;
  font-weight: 800;
  color: #1e1b4b;
}

.overview-table .contract-detail-row td {
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  white-space: nowrap;
}

.overview-table .highlight-rem {
  color: #6366f1;
  font-weight: 800;
}

/* ★★★ 横向 5 组分类卡片样式 ★★★ */
.summary-cards-section {
  margin: 20px 0 24px 0;
  padding: 16px 18px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.summary-cards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.summary-cards-header .title {
  font-size: 15px;
  font-weight: 800;
  color: #1e1b4b;
}

.summary-cards-header .tag {
  font-size: 11.5px;
  font-weight: 600;
  color: #6366f1;
  background: #e0e7ff;
  padding: 3px 10px;
  border-radius: 20px;
}

.summary-cards-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.summary-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px rgba(99, 102, 241, 0.08);
}

.summary-card .card-title {
  font-size: 13px;
  font-weight: 800;
  color: #1e1b4b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.summary-card .count-badge {
  font-size: 10px;
  font-weight: 700;
  color: #4f46e5;
  background: #f0f4ff;
  padding: 1px 6px;
  border-radius: 10px;
}

.summary-card .card-subtitle {
  font-size: 10.5px;
  color: #94a3b8;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-card .card-metric {
  display: flex;
  flex-direction: column;
  padding: 5px 7px;
  background: #f8fafc;
  border-radius: 6px;
  margin-bottom: 5px;
}
.summary-card .card-metric:last-child {
  margin-bottom: 0;
}

.summary-card .card-metric .label {
  font-size: 10px;
  color: #64748b;
  margin-bottom: 1px;
}

.summary-card .card-metric .value {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

.summary-card .card-metric .value.purple {
  color: #6366f1;
}

.summary-card .card-metric .value.main {
  color: #059669;
}

@media (max-width: 1200px) {
  .summary-cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .summary-cards-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  line-height: 1.75;
  color: #334155;
  padding: 24px 28px 80px 28px; /* 增加底部内边距，确保6.3保障总额速览表格及底部注释能流畅滚出展示，不被屏幕下边缘遮挡 */
  background-color: #fafbfc;
}

/* 标题样式 - 精巧的色彩与层级 */
.markdown-body h1 {
  font-size: 24px;
  font-weight: 800;
  color: #1e1b4b;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e7ff;
  letter-spacing: -0.5px;
}
.markdown-body h2 {
  font-size: 18px;
  font-weight: 700;
  color: #4f46e5;
  margin-top: 32px;
  margin-bottom: 16px;
  padding-left: 10px;
  border-left: 4px solid #4f46e5;
  letter-spacing: -0.3px;
}
.markdown-body h3 {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 24px;
  margin-bottom: 12px;
}
.markdown-body h4 {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-top: 16px;
  margin-bottom: 8px;
}

/* 段落与强调 */
.markdown-body p {
  margin-bottom: 18px;
  font-size: 13.5px;
  color: #475569;
}
.markdown-body strong {
  color: #4f46e5;
  font-weight: 700;
  background: linear-gradient(120deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%);
  padding: 1px 4px;
  border-radius: 4px;
}

/* 带有现代渐变质感的引用块 */
.markdown-body blockquote {
  padding: 16px 20px;
  margin: 24px 0;
  background: linear-gradient(135deg, #f5f7ff 0%, #eff2fe 100%);
  border-left: 5px solid #6366f1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.03);
  font-size: 13px;
}
.markdown-body blockquote p {
  margin-bottom: 0;
  color: #4338ca;
  font-weight: 500;
}

/* 精美表格设计 */
.markdown-body table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 24px 0;
  font-size: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.markdown-body th {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  color: #1e293b;
  font-weight: 700;
  padding: 12px 14px;
  border-bottom: 2px solid #e2e8f0;
  text-align: left;
  white-space: nowrap;
}
.markdown-body td {
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
  line-height: 1.5;
  background-color: #ffffff;
}
.markdown-body tr:last-child td {
  border-bottom: none;
}
.markdown-body tr:nth-child(even) td {
  background-color: #f8fafc;
}
.markdown-body tr:hover td {
  background-color: #f0f4ff !important;
  color: #1e1b4b;
}

/* 列表美化 */
.markdown-body ul, .markdown-body ol {
  padding-left: 24px;
  margin-bottom: 20px;
  font-size: 13.5px;
}
.markdown-body li {
  margin-bottom: 8px;
  color: #475569;
}
.markdown-body li::marker {
  color: #6366f1;
}

/* 分割线 */
.markdown-body hr {
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0 50%, transparent);
  margin: 32px 0;
}

/* 内联代码块 */
.markdown-body code {
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  background-color: #f1f5f9;
  border-radius: 4px;
  font-size: 11.5px;
  color: #e11d48;
}

/* 核心资产标题与新增按钮 */
.core-assets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.add-asset-btn {
  border-radius: 6px;
  font-weight: 500;
}
.custom-asset-label-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
}
.custom-asset-name-input {
  max-width: 110px;
}
.custom-asset-name-input :deep(.el-input__wrapper) {
  padding: 0 4px;
  box-shadow: none;
  border-bottom: 1px dashed #818cf8;
  border-radius: 0;
  background: transparent;
}
.custom-asset-name-input :deep(.el-input__inner) {
  font-size: 12px;
  font-weight: 600;
  color: #4f46e5;
}
.custom-asset-label-wrap .unit-text {
  font-size: 12px;
  color: #64748b;
}
.custom-asset-label-wrap .del-asset-btn {
  padding: 0;
  margin-left: auto;
  color: #ef4444;
}
.inline-add-col {
  display: flex;
  align-items: center;
  padding-bottom: 18px;
}
.inline-add-btn {
  border-style: dashed !important;
  border-color: #818cf8 !important;
  color: #4f46e5 !important;
  background-color: #eef2ff !important;
  border-radius: 8px;
}
.inline-add-btn:hover {
  background-color: #e0e7ff !important;
}

@media (max-width: 768px) {
  .flexicalc-container {
    padding: 10px 0px;
  }
  .core-assets-inputs {
    align-items: stretch !important;
  }
  .calc-symbol {
    text-align: center;
    padding: 5px 0 !important;
    font-size: 18px;
    font-weight: bold;
    color: #6366f1;
  }
  /* 逐年推演表格横向滚动与样式优化 */
  .bridge-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  .bridge-table {
    min-width: 800px; /* 保证列在横向滚动时有足够空间 */
  }
  .bridge-table th, .bridge-table td {
    padding: 6px 8px !important;
    font-size: 11.5px !important;
  }
  .bridge-summary {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
