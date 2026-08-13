<template>
  <el-card class="glass-card bridge-card animate-fade-in">
    <template #header>
      <div class="card-header justify-between">
        <div style="display:flex;align-items:center;gap:8px">
          <el-icon><Warning /></el-icon>
          <span>资金分析 · 百岁推演</span>
        </div>
        <span class="formula-pill">期初现金 {{ (totalAssets/10000).toFixed(1) }}w = 存款 {{ (assets.savings/10000).toFixed(1) }}w + 额外 {{ (assets.compensation/10000).toFixed(1) }}w{{ assets.supplementary ? ' + 补充 ' + (assets.supplementary/10000).toFixed(1) + 'w' : '' }}</span>
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
                milestone36: row.year === (1982 + Number(assets.retirementAge || 54)),
                milestone60: row.age === 60,
                danger: row.balance <= 0,
                warning: row.balance > 0 && row.balance < 50000
              }">
            <td class="age-cell">
              <strong>{{ row.age }}</strong>
              <span v-if="row.year === (1982 + Number(assets.retirementAge || 54))" class="milestone-tag pension-tag">退休</span>
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
</template>

<script setup>
import { Warning } from '@element-plus/icons-vue'

defineProps({
  bridgeData: { type: Array, required: true },
  gapAnalysis: { type: Object, required: true },
  totalAssets: { type: Number, default: 0 },
  assets: { type: Object, required: true },
  retirementInfo: { type: Object, default: () => ({ estimatedPension: '0' }) }
})
</script>

<style scoped>
.glass-card { background: rgba(255, 255, 255, 0.9); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.3); }
.card-header { display: flex; align-items: center; gap: 8px; font-weight: bold; color: #1e293b; }
.justify-between { justify-content: space-between; }

.formula-pill { background: #eef2ff; color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: monospace; }

/* 资金断层分析模块样式 */
.bridge-card { border: 1px solid #e0e7ff; }
.bridge-table-wrap { border-radius: 8px; border: 1px solid #e2e8f0; overflow-x: auto; }
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
</style>
