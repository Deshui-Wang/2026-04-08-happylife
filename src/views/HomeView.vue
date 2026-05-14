<template>
  <div class="home-dashboard animate-fade-in">
    <!-- 1. 欢迎页眉 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="greeting">下午好，RICH 家族</h1>
        <p class="manifest-slogan">财富是认知的补偿，更是显化的能量。您的资产正在稳健流动中。</p>
      </div>
      <div class="date-badge">
        <div class="day">{{ today.format('DD') }}</div>
        <div class="month-year">{{ today.format('MMM YYYY') }}</div>
      </div>
    </div>

    <!-- 2. 核心指标卡片 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :xs="24" :sm="8">
        <div class="kpi-card">
          <div class="kpi-icon total"><el-icon><Money /></el-icon></div>
          <div class="kpi-data">
            <div class="label">当前总流动性</div>
            <div class="value">¥ {{ totalLiquidity.toLocaleString() }}</div>
            <div class="sub-label">存款 + 补偿 + 欠薪</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8">
        <div class="kpi-card">
          <div class="kpi-icon balance"><el-icon><TrendCharts /></el-icon></div>
          <div class="kpi-data">
            <div class="label">预计年度结余</div>
            <div class="value" :class="{ plus: annualNet > 0 }">
              {{ annualNet > 0 ? '+' : '' }}¥ {{ annualNet.toLocaleString() }}
            </div>
            <div class="sub-label">年收入 - 年开支 (铁岭标准)</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8">
        <div class="kpi-card">
          <div class="kpi-icon safety"><el-icon><CircleCheckFilled /></el-icon></div>
          <div class="kpi-data">
            <div class="label">财富安全边际</div>
            <div class="value">{{ safetyYears }} <span class="unit">年</span></div>
            <div class="sub-label">无收入状态下可维持时长</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 3. 功能导航卡片 -->
    <el-row :gutter="30" class="nav-row">
      <el-col :xs="24" :md="12">
        <div class="nav-entry-card calc" @click="goTo('also-home')">
          <div class="entry-content">
            <div class="entry-tag">核心工具</div>
            <h2 class="entry-title">财富测算与推演</h2>
            <p class="entry-desc">基于 2026 年基准，对资产、保险及未来流入进行百岁深度模拟，掌握资金断层风险。</p>
            <div class="entry-footer">
              <span class="status">当前状态：推演覆盖至 100 岁</span>
              <el-icon><Right /></el-icon>
            </div>
          </div>
          <div class="entry-decoration">
            <el-icon><Histogram /></el-icon>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :md="12">
        <div class="nav-entry-card confirm" @click="goTo('confirmation')">
          <div class="entry-content">
            <div class="entry-tag">显化成就</div>
            <h2 class="entry-title">显化确认中心</h2>
            <p class="entry-desc">确认已达成的财富里程碑与理想生活场景，增强财富显化能量。包含银行到账明细确认。</p>
            <div class="entry-footer">
              <span class="status">最新达成：中联集团代发工资 12.3w</span>
              <el-icon><Right /></el-icon>
            </div>
          </div>
          <div class="entry-decoration">
            <el-icon><Finished /></el-icon>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 4. 底部提醒 -->
    <div class="milestone-banner">
      <el-icon><Notification /></el-icon>
      <span class="text">关键里程碑：距离 55 岁领取退休金（¥5000/月）还有 9 年</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Money, TrendCharts, CircleCheckFilled, Right, Histogram, Finished, Notification } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const emit = defineEmits(['navigate'])

const today = dayjs()

// 模拟核心数据（与 AlsoHomeView 保持一致）
const assets = {
  savings: 160000,
  backPay: 123250,
  compensation: 261000,
  workingIncome: 10000,
  workingYears: 1
}

const expenses = {
  living: 2000 * 12, // 默认铁岭标准
  insurance: 12000 + 11029 + 4060 + 1800 + 38364 + 5000 + 4216.95
}

const totalLiquidity = computed(() => assets.savings + assets.backPay + assets.compensation)
const annualNet = computed(() => (assets.workingIncome * 12) - (expenses.living + expenses.insurance))
const safetyYears = computed(() => Math.floor(totalLiquidity.value / (expenses.living + expenses.insurance)))

const goTo = (tab) => {
  // 这里的 navigate 逻辑由 App.vue 处理
  // 我们通过 emit 通知父组件
  window.dispatchEvent(new CustomEvent('change-tab', { detail: tab }))
}
</script>

<style scoped>
.home-dashboard {
  padding: 10px 0;
  max-width: 1200px;
  margin: 0 auto;
}

/* 欢迎模块 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 10px;
}

.greeting {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.5px;
}

.manifest-slogan {
  color: #64748b;
  margin-top: 10px;
  font-size: 16px;
}

.date-badge {
  background: white;
  padding: 12px 20px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
}

.date-badge .day {
  font-size: 24px;
  font-weight: 800;
  color: #6366f1;
  line-height: 1;
}

.date-badge .month-year {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  margin-top: 4px;
  letter-spacing: 1px;
}

/* KPI 卡片 */
.kpi-row {
  margin-bottom: 40px;
}

.kpi-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-5px);
}

.kpi-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.kpi-icon.total { background: linear-gradient(135deg, #6366f1, #4f46e5); }
.kpi-icon.balance { background: linear-gradient(135deg, #10b981, #059669); }
.kpi-icon.safety { background: linear-gradient(135deg, #f59e0b, #d97706); }

.kpi-data .label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.kpi-data .value {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin: 4px 0;
}

.kpi-data .value.plus { color: #059669; }

.kpi-data .sub-label {
  font-size: 11px;
  color: #94a3b8;
}

.unit { font-size: 14px; font-weight: normal; margin-left: 2px; }

/* 导航入口卡片 */
.nav-row {
  margin-bottom: 40px;
}

.nav-entry-card {
  position: relative;
  background: white;
  border-radius: 30px;
  padding: 40px;
  cursor: pointer;
  overflow: hidden;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 40px rgba(0,0,0,0.04);
  border: 1px solid #f1f5f9;
}

.nav-entry-card:hover {
  transform: scale(1.02);
  box-shadow: 0 30px 60px rgba(0,0,0,0.08);
}

.entry-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  color: #64748b;
  margin-bottom: 15px;
}

.entry-title {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 15px 0;
}

.entry-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  max-width: 80%;
}

.entry-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.entry-footer .status {
  font-size: 13px;
  font-weight: bold;
  color: #6366f1;
}

.entry-footer .el-icon {
  font-size: 20px;
  color: #6366f1;
}

.entry-decoration {
  position: absolute;
  right: -20px;
  bottom: -20px;
  font-size: 180px;
  opacity: 0.03;
  transform: rotate(-15deg);
}

.nav-entry-card.calc:hover {
  background: linear-gradient(135deg, #ffffff, #f5f3ff);
  border-color: #c7d2fe;
}

.nav-entry-card.confirm:hover {
  background: linear-gradient(135deg, #ffffff, #f0fdf4);
  border-color: #bbf7d0;
}

/* 里程碑横幅 */
.milestone-banner {
  background: #1e293b;
  border-radius: 20px;
  padding: 18px 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  box-shadow: 0 15px 30px rgba(30, 41, 59, 0.2);
}

.milestone-banner .el-icon {
  font-size: 20px;
  color: #fbbf24;
}

.milestone-banner .text {
  font-size: 14px;
  font-weight: 500;
}
</style>
