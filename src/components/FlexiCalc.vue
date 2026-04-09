<template>
  <div class="flexicalc-container">
    <el-row :gutter="20" class="equal-height-row">
      <!-- 1. 资产模块 (左侧) -->
      <el-col :xs="24" :md="12">
        <el-card class="glass-card config-section animate-fade-in">
          <template #header>
            <div class="card-header"><el-icon><Postcard /></el-icon><span>资产与基础画像</span></div>
          </template>
          
          <el-form label-position="top">
            <el-divider content-position="left" style="margin-top: 0;">核心资产</el-divider>
            <el-row :gutter="10" align="middle">
              <el-col :span="5">
                <el-form-item label="当前存款 (元)">
                  <el-input-number v-model="assets.savings" :precision="0" :step="1000" style="width: 100%" controls-position="right" />
                </el-form-item>
              </el-col>
              <el-col :span="1" style="text-align:center;font-size:18px;color:#6366f1;font-weight:bold;padding-top:28px">+</el-col>
              <el-col :span="5">
                <el-form-item label="额外流入 (一次性/元)">
                  <div style="display: flex; gap: 4px; align-items: center;">
                    <el-input-number v-model="assets.oneTimeIncome" :precision="0" :step="1000" style="flex: 1" controls-position="right" />
                    <el-popover placement="bottom" :width="320" trigger="click" popper-style="padding: 16px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                      <template #reference>
                        <el-button link type="primary" :icon="MagicStick" style="font-size: 18px; padding: 0 4px;" />
                      </template>
                      <div class="comp-tool">
                        <div style="font-weight: bold; margin-bottom: 12px; font-size: 15px; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                          <el-icon color="#6366f1"><MagicStick /></el-icon> 赔偿金速算小工具
                        </div>
                        <el-form size="small" label-position="left" label-width="90px">
                          <el-form-item label="计算基数">
                            <el-radio-group v-model="compCalc.base" class="premium-radio">
                              <el-radio-button :label="29000">2.9w</el-radio-button>
                              <el-radio-button :label="19725">1.97w</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                          <el-form-item label="赔偿时限">
                            <el-radio-group v-model="compCalc.type" class="premium-radio">
                              <el-radio-button label="N+1">N+1</el-radio-button>
                              <el-radio-button label="2N">2N</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                        </el-form>
                        
                        <el-divider style="margin: 12px 0;" />
                        
                        <div class="comp-result-list">
                          <div class="res-item">
                            <span>工龄系数 (N):</span> 
                            <span><b>{{ compCalcResult.n }}</b></span>
                          </div>
                          <div class="res-formula">入职: {{ compCalc.joinDate }} (共{{ compCalcResult.totalMonths }}个月)</div>
                          
                          <div class="res-item" style="margin-top: 8px;">
                            <span>裁员补偿 ({{ compCalc.type }}):</span> 
                            <span><b>¥{{ compCalcResult.severance.toLocaleString() }}</b></span>
                          </div>
                          <div class="res-formula">计算: {{ compCalc.base }} × {{ compCalc.type === '2N' ? '(' + compCalcResult.n + ' × 2)' : '(' + compCalcResult.n + ' + 1)' }}</div>

                          <div class="res-item" style="margin-top: 8px;">
                            <span>工资追补 (25%):</span> 
                            <span><b>¥{{ compCalcResult.wageRestoration.toLocaleString() }}</b></span>
                          </div>
                          <div class="res-formula">计算: {{ compCalc.base }} × 0.25 × {{ compCalcResult.restorationMonths }}个月</div>

                          <div class="total-res">
                            <span>计算总和:</span> 
                            <span class="val">¥{{ compCalcResult.total.toLocaleString() }}</span>
                          </div>
                        </div>
                        
                        <el-button type="primary" size="default" style="width: 100%; border-radius: 8px; margin-top: 12px;" @click="syncCompResult">
                          同步到额外流入
                        </el-button>
                      </div>
                    </el-popover>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="text-align:center;font-size:18px;color:#6366f1;font-weight:bold;padding-top:28px">+</el-col>
              <el-col :span="4">
                <el-form-item :class="{'is-disabled': !assets.baoyouEnabled}">
                  <template #label>
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                      <span>宝有</span>
                      <el-switch v-model="assets.baoyouEnabled" size="small" />
                    </div>
                  </template>
                  <el-input-number v-model="assets.baoyou" :precision="0" style="width: 100%" controls-position="right" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="1" style="text-align:center;font-size:18px;color:#6366f1;font-weight:bold;padding-top:28px">=</el-col>
              <el-col :span="5">
                <el-form-item label="静态资产总额">
                  <div class="asset-total-inline">¥ {{ totalAssets.toLocaleString() }}</div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">工作/未来流入</el-divider>
            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item label="月预计工作收入 (元)">
                  <el-input-number v-model="assets.workingIncome" :precision="0" :step="1000" style="width: 100%" controls-position="right" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="预计工作年限 (年)">
                  <el-input-number v-model="assets.workingYears" :precision="0" :step="1" :min="0" style="width: 100%" controls-position="right" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">预估退休收入</el-divider>

            <div class="retirement-stat-card">
              <div class="stat-main" style="align-items: center;">
                <span class="label">预估退休金 (月)</span>
                <el-input-number v-model="assets.estimatedPension" :precision="0" :step="500" :min="0" style="width: 140px" controls-position="right" />
              </div>
              <div class="stat-sub" style="margin-top: 8px;">
                <span>55岁退休 | 距离退休 {{ retirementInfo.yearsLeft }} 年</span>
              </div>
            </div>

            <el-divider content-position="left">保险收益/返还</el-divider>
            <div class="insurance-return-panel">
              <el-row :gutter="12">
                <el-col :span="12">
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
                <el-col :span="12">
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
      </el-col>

      <!-- 2. 消费模块 (右侧) -->
      <el-col :xs="24" :md="12">
        <el-card class="glass-card expense-section animate-fade-in">
          <template #header>
            <div class="card-header"><el-icon><MagicStick /></el-icon><span>消费与支出管理</span></div>
          </template>

          <el-form label-position="top">
            <el-divider content-position="left" style="margin-top: 0;">保险年缴支出</el-divider>
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

            <el-divider content-position="left" style="margin-top: 30px;">居住城市</el-divider>
            <el-form-item>
              <div style="display: flex; gap: 15px; width: 100%; align-items: stretch;">
                <el-select v-model="selectedCity" size="large" style="flex: 1;">
                  <el-option :label="`菏泽 (${cityCosts.heze.monthly}/月)`" value="heze" />
                  <el-option :label="`铁岭 (${cityCosts.tieling.monthly}/月)`" value="tieling" />
                </el-select>
                <div class="city-info-tag" style="flex: 1; margin: 0; padding: 0; height: 40px; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
                  月生活费：<span class="highlight" style="margin-left: 6px; font-size: 15px;">¥ {{ cityCosts[selectedCity].monthly.toLocaleString() }}</span>
                </div>
              </div>
            </el-form-item>

            <div class="total-expense-banner" style="margin-top: 25px;">
              <div class="label">合计年支出</div>
              <div class="value" style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:14px; opacity:0.9; font-weight:normal;">生活 ¥{{ (cityCosts[selectedCity].monthly * 12).toLocaleString() }} + 保费 ¥{{ activeAnnualPremium.toLocaleString() }} =</span>
                <span>¥ {{ totalAnnualExpense.toLocaleString() }}</span>
              </div>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- ★★★ 新模块：资金断层分析 ★★★ -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card class="glass-card bridge-card animate-fade-in">
          <template #header>
            <div class="card-header justify-between">
              <div style="display:flex;align-items:center;gap:8px">
                <el-icon><Warning /></el-icon>
                <span>资金断层分析 · 从今年到百岁逐年推演</span>
              </div>
              <span class="formula-pill">期初现金 {{ (totalAssets/10000).toFixed(1) }}w = 存款 {{ (assets.savings/10000).toFixed(1) }}w + 额外 {{ (assets.oneTimeIncome/10000).toFixed(1) }}w</span>
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
              <div class="summary-value">55岁领退休金({{ retirementInfo.estimatedPension }}/月) · 60岁传世金生到账(90w)</div>
            </div>
          </div>

          <!-- 逐年推演表格 -->
          <div class="bridge-table-wrap">
            <table class="bridge-table">
              <thead>
                <tr>
                  <th>年龄</th>
                  <th>期初余额</th>
                  <th>工作收入</th>
                  <th>退休金</th>
                  <th>保险收益</th>
                  <th class="col-out">保费支出</th>
                  <th class="col-out">生活开支</th>
                  <th>年结余</th>
                  <th>期末余额</th>
                  <th style="min-width:160px">资金水位</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in bridgeData" :key="idx"
                    :class="{
                      milestone55: row.age === 55,
                      milestone60: row.age === 60,
                      danger: row.balance <= 0,
                      warning: row.balance > 0 && row.balance < 50000
                    }">
                  <td class="age-cell">
                    <strong>{{ row.age }}</strong>
                    <span v-if="row.age === 55" class="milestone-tag pension-tag">领退休金</span>
                    <span v-if="row.age === 60" class="milestone-tag ins-tag">保险到期</span>
                  </td>
                  <td class="num-cell safe-bal"><strong>{{ (row.openBal/10000).toFixed(1) }}w</strong></td>
                  <td class="num-cell income">{{ row.jobIncome > 0 ? '+' + (row.jobIncome/10000).toFixed(1) + 'w' : '-' }}</td>
                  <td class="num-cell income">{{ row.pensionIncome > 0 ? '+' + (row.pensionIncome/10000).toFixed(1) + 'w' : '-' }}</td>
                  <td class="num-cell income">
                    {{ row.insIncome > 0 ? '+' + (row.insIncome/10000).toFixed(1) + 'w' : '-' }}
                    <span v-if="row.hasSurrender" style="display:block;font-size:10px;line-height:1;margin-top:2px;color:#f59e0b">(含13.6w退保)</span>
                  </td>
                  <td class="num-cell expense">{{ row.insPremium > 0 ? '-' + (row.insPremium/10000).toFixed(1) + 'w' : '-' }}</td>
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


  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { User, Postcard, MagicStick, Warning, InfoFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const userProfile = reactive({ gender: 'female', birthday: dayjs('1982-01-01').toDate() })
const assets = reactive({ 
  savings: 147755, 
  oneTimeIncome: 0,
  baoyou: 300000,
  baoyouEnabled: true,
  workingIncome: 0,
  workingYears: 0,
  estimatedPension: 5000,
  returns: [
    { name: '优享年年', amount: 19206, start: 60, end: 79, enabled: true },
    { name: '传世金生', amount: 900000, age: 60, enabled: true }
  ]
})
const totalAssets = computed(() => {
  const by = assets.baoyouEnabled ? assets.baoyou : 0
  return assets.savings + assets.oneTimeIncome + by
})

const selectedCity = ref('tieling')
const cityCosts = {
  heze: { monthly: 2500 },
  tieling: { monthly: 2000 }
}

// 严格按照您的截图(2026/44岁时刻)
const insuranceList = ref([
  { enabled: true, name: '1月优享年年养老金', yearsLeft: 17, premium: 12000 },
  { enabled: true, name: '全佑惠享(2019)重疾', yearsLeft: 17, premium: 11029 },
  { enabled: true, name: '智选康逸荣耀医疗(年交)', yearsLeft: 40, premium: 4060 },
  { enabled: true, name: '安行无忧A款两全', yearsLeft: 4, premium: 1800 },
  { enabled: true, name: '6月传世金生年金', yearsLeft: 10, premium: 38364 },
  { enabled: true, name: '8月优享长伴护理', yearsLeft: 11, premium: 5000 },
  { enabled: true, name: '全佑惠享荣耀重疾', yearsLeft: 10, premium: 4216.95 },
])

// ★★★ 赔偿金计算工具逻辑 ★★★
const compCalc = reactive({
  base: 29000,
  type: 'N+1',
  joinDate: '2022-03-01',
  targetDate: dayjs().format('YYYY-MM-DD')
})

const compCalcResult = computed(() => {
  const joinDate = dayjs(compCalc.joinDate)
  const now = dayjs()
  
  // 计算 N: 满半年不满一年算 1, 满一年算 1, 不满半年算 0.5 (中国劳动法标准)
  const totalMonths = now.diff(joinDate, 'month')
  const years = Math.floor(totalMonths / 12)
  const remainingMonths = totalMonths % 12
  let n = years
  if (remainingMonths >= 6) {
    n += 1
  } else if (remainingMonths > 0) {
    n += 0.5
  }
  
  // 裁员补偿
  const multiplier = compCalc.type === '2N' ? n * 2 : n + 1
  const severance = compCalc.base * multiplier
  
  // 工资扣减补偿: 2024年12月至今 (月薪 * 25%)
  const restorationMonths = Math.max(0, now.diff(dayjs('2024-12-01'), 'month') + 1)
  const wageRestoration = compCalc.base * 0.25 * restorationMonths
  
  return {
    n,
    severance,
    wageRestoration,
    restorationMonths,
    totalMonths,
    total: Math.round(severance + wageRestoration)
  }
})

const syncCompResult = () => {
  assets.oneTimeIncome = compCalcResult.value.total
}

// 监听 传世金生 停保动作：如果关闭了保费，自动取消未来的满期收益预期
watch(() => insuranceList.value.find(i => i.name.includes('传世金生'))?.enabled, (newVal) => {
  if (newVal === false) {
    assets.returns[1].enabled = false
  }
}, { deep: true })

const currentAge = computed(() => dayjs('2026-01-01').diff(dayjs(userProfile.birthday), 'year'))
const retirementInfo = computed(() => {
  return { age: 55, yearsLeft: Math.max(0, 55 - currentAge.value), estimatedPension: assets.estimatedPension }
})

const activeAnnualPremium = computed(() => insuranceList.value.filter(i => i.enabled && i.yearsLeft > 0).reduce((s, i) => s + i.premium, 0))
const totalAnnualExpense = computed(() => {
  const cityMonthly = cityCosts[selectedCity.value].monthly
  return (cityMonthly * 12) + activeAnnualPremium.value
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

    // 收入
    const jobIncome = t < assets.workingYears ? assets.workingIncome * 12 : 0
    const pensionIncome = age >= 55 ? retirementInfo.value.estimatedPension * 12 : 0
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

    // 支出
    const insPremium = insuranceList.value.filter(i => i.enabled && i.yearsLeft > t).reduce((s, i) => s + i.premium, 0)
    const livingCost = cityCosts[selectedCity.value].monthly * 12

    const yearNet = jobIncome + pensionIncome + insIncome - insPremium - livingCost
    const openBal = bal // 期初余额
    bal = bal + yearNet

    rows.push({
      age,
      openBal,
      jobIncome,
      pensionIncome,
      insIncome,
      insPremium,
      livingCost,
      yearNet,
      balance: bal,
      barPct: Math.max(0, Math.min(100, (bal / maxBal) * 100)),
      hasSurrender
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
    
    // 年度流入 (Real Cash Flow)
    const inJob = t < assets.workingYears ? assets.workingIncome * 12 : 0
    const inPens = age >= 55 ? retirementInfo.value.estimatedPension * 12 : 0
    let inY = (assets.returns[0].enabled && age >= assets.returns[0].start && age <= assets.returns[0].end) ? assets.returns[0].amount : 0
    let inC = (assets.returns[1].enabled && age === assets.returns[1].age) ? assets.returns[1].amount : 0
    
    // 年度流入总额 (仅包含当年进款，不含初始存量)
    const totalIn = inJob + inPens + inY + inC

    // 年度支出 (Real Cash Flow)
    const outIns = insuranceList.value.filter(i => i.enabled && i.yearsLeft > t).reduce((s, i) => s + i.premium, 0)
    const outCity = cityCosts[selectedCity.value].monthly * 12
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
</script>

<style scoped>
.flexicalc-container { padding: 20px; background: #f0f2f5; min-height: 100vh; font-family: sans-serif; }
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
.bridge-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.bridge-table thead { position: sticky; top: 0; z-index: 10; }
.bridge-table th {
  background: #1e293b;
  color: white;
  padding: 10px 12px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}
.bridge-table th.col-out { background: #991b1b; }
.bridge-table td { padding: 8px 10px; text-align: center; border-bottom: 1px solid #f1f5f9; }
.bridge-table tbody tr:nth-child(even) { background: #f8fafc; }
.bridge-table tbody tr:hover { background: #eef2ff; }

.bridge-table tr.milestone55 { background: #fdf2f8 !important; border-left: 3px solid #d946ef; }
.bridge-table tr.milestone60 { background: #f0fdf4 !important; border-left: 3px solid #22c55e; }
.bridge-table tr.danger { background: #fef2f2 !important; }
.bridge-table tr.danger td { color: #991b1b; }
.bridge-table tr.warning { background: #fffbeb !important; }

.age-cell { font-size: 14px; white-space: nowrap; }
.milestone-tag { display: inline-block; font-size: 10px; padding: 1px 6px; border-radius: 10px; margin-left: 4px; font-weight: bold; }
.pension-tag { background: #f3e8ff; color: #7c3aed; }
.ins-tag { background: #dcfce7; color: #16a34a; }

.num-cell { font-family: 'SF Mono', 'Courier New', monospace; font-size: 12px; }
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
</style>
