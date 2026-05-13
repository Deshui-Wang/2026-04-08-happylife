<template>
  <div class="confirmation-view animate-fade-in">
    <div class="page-title-section">
      <h2 class="section-title">兴业银行显化实现内容</h2>
      <p class="section-subtitle">显化确认 · 兴业银行代发工资记录</p>
    </div>

    <div class="mockup-container">
      <!-- 手机外壳装饰 -->
      <div class="phone-mockup">
        <div class="phone-header">
          <span class="time">14:53</span>
          <div class="header-icons">
            <el-icon><Connection /></el-icon>
            <div class="battery">100</div>
          </div>
        </div>

        <!-- 银行App内容 -->
        <div class="bank-app-content">
          <header class="app-nav">
            <el-icon class="back-icon"><ArrowLeft /></el-icon>
            <span class="app-title">交易明细</span>
            <div class="right-icons">
              <el-icon><Search /></el-icon>
              <el-icon><MoreFilled /></el-icon>
            </div>
          </header>

          <div class="warning-banner">
            温馨提示：本页面最多展示1500条查询结果，如未能展示所有结果，建议您缩减查询时间范围重新查询。
          </div>

          <div class="card-info-section">
            <div class="bank-card-visual">
              <div class="card-chip"></div>
              <div class="card-logo">兴业银行</div>
              <div class="card-type">中联工资卡</div>
            </div>
            <div class="card-details">
              <span class="card-name">中联工资卡</span>
              <span class="card-number">622908 **** 5548</span>
            </div>
          </div>

          <div class="action-links">
            <span class="link">隐藏余额</span>
            <span class="link">导出明细</span>
          </div>

          <div class="month-selector">
            <div class="tab-item active">本月</div>
            <div class="tab-item">5月</div>
            <div class="tab-item">4月</div>
            <div class="tab-item">3月</div>
            <div class="filter-btn">
              筛选 <el-icon><Filter /></el-icon>
            </div>
          </div>

          <div class="transactions-list">
            <div class="month-header">
              <div class="month-title">
                6月 <el-icon><ArrowDown /></el-icon>
                <el-icon class="info-icon"><InfoFilled /></el-icon>
              </div>
              <div class="month-summary">
                支出 ¥0.00(0笔)  收入 ¥123,250.00(1笔)
              </div>
            </div>

            <div class="transaction-item">
              <div class="item-left">
                <span class="date">06/08</span>
                <span class="time">14:32</span>
              </div>
              <div class="item-center">
                <span class="target-name">中联集团教育科技有限公司</span>
                <span class="type-tag">[代发工资]</span>
              </div>
              <div class="item-right">
                <span class="amount plus">+123,250.00</span>
                <span class="balance">余额:123,255.44</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增：Angel 上班的显化 -->
    <div class="page-title-section mt-60">
      <h2 class="section-title">Angel 上班的显化</h2>
      <p class="section-subtitle">理想工作 · 文职岗位 · 稳定长久</p>
    </div>

    <div class="manifest-card-wrap">
      <el-card class="glass-card manifest-job-card">
        <div class="job-header">
          <div class="job-title-group">
            <span class="job-label">显化职位</span>
            <h3 class="job-name">高级文职 · 职能管理</h3>
          </div>
          <div class="salary-tag">
            <span class="currency">¥</span>
            <span class="value">15,800</span>
            <span class="unit">/月</span>
          </div>
        </div>

        <div class="job-tags">
          <el-tag effect="plain" type="primary" round><el-icon><Shop /></el-icon> 规模中等公司</el-tag>
          <el-tag effect="plain" type="success" round><el-icon><Finished /></el-icon> 五险一金</el-tag>
          <el-tag effect="plain" type="warning" round><el-icon><Calendar /></el-icon> 双休</el-tag>
          <el-tag effect="plain" type="info" round><el-icon><MapLocation /></el-icon> 通勤45分钟(地铁)</el-tag>
          <el-tag effect="plain" type="danger" round><el-icon><Timer /></el-icon> 极佳稳定性(6年+)</el-tag>
        </div>

        <el-divider />

        <div class="job-perks">
          <div class="perk-item">
            <div class="perk-icon lunch"><el-icon><Bowl /></el-icon></div>
            <div class="perk-info">
              <span class="perk-label">公司午餐</span>
              <span class="perk-desc">提供营养午餐，省心健康</span>
            </div>
          </div>
          <div class="perk-item">
            <div class="perk-icon social"><el-icon><UserFilled /></el-icon></div>
            <div class="perk-info">
              <span class="perk-label">理想同事</span>
              <span class="perk-desc">遇到一位非常谈得来且健谈的同事，氛围融洽</span>
            </div>
          </div>
        </div>

        <div class="manifest-story">
          <div class="story-bubble">
            “这是一份稳定且舒心的工作。在宽敞明亮的办公室里，我处理着得心应手的文职事务。15800元的月薪和齐全的保障让我感到踏实。最开心的是，我不仅每天能坐着地铁准时通勤，还遇到了一位性格极好的同事，我们总能聊到一块去。我已经在这里安稳地工作了6年，每一天都充满了幸福感。”
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { 
  Finished, ArrowLeft, Search, MoreFilled, 
  ArrowDown, InfoFilled, Filter, Connection,
  Shop, Calendar, MapLocation, Timer, Bowl, UserFilled
} from '@element-plus/icons-vue'
</script>

<style scoped>
.confirmation-view {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title-section {
  margin-bottom: 40px;
  text-align: left;
  border-left: 4px solid #6366f1;
  padding-left: 20px;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
}

.section-subtitle {
  color: #64748b;
  margin-top: 5px;
}

.mt-60 { margin-top: 60px; }

.manifest-card-wrap {
  display: flex;
  justify-content: center;
  padding-bottom: 60px;
}

.manifest-job-card {
  width: 100%;
  max-width: 600px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 10px;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.job-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  display: block;
  margin-bottom: 4px;
}

.job-name {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.salary-tag {
  background: linear-gradient(135deg, #10b981, #059669);
  padding: 12px 20px;
  border-radius: 16px;
  color: white;
  display: flex;
  align-items: baseline;
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
}

.salary-tag .currency { font-size: 14px; margin-right: 2px; font-weight: normal; }
.salary-tag .value { font-size: 24px; font-weight: 800; }
.salary-tag .unit { font-size: 12px; margin-left: 2px; opacity: 0.9; }

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.job-tags :deep(.el-tag) {
  border: none;
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  padding: 0 12px;
  height: 32px;
}

.job-perks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.perk-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.perk-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.perk-icon.lunch { background: #fff7ed; color: #f97316; }
.perk-icon.social { background: #f0fdf4; color: #22c55e; }

.perk-info {
  display: flex;
  flex-direction: column;
}

.perk-label { font-size: 14px; font-weight: bold; color: #1e293b; }
.perk-desc { font-size: 12px; color: #64748b; margin-top: 2px; }

.manifest-story {
  position: relative;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
  border-left: 4px solid #6366f1;
}

.story-bubble {
  font-size: 15px;
  line-height: 1.8;
  color: #475569;
  font-style: italic;
}

.mockup-container {
  display: flex;
  justify-content: center;
  perspective: 1000px;
}

.phone-mockup {
  width: 375px;
  height: 812px;
  background: #fff;
  border-radius: 40px;
  box-shadow: 0 50px 100px rgba(0,0,0,0.1), 0 15px 35px rgba(0,0,0,0.05);
  border: 12px solid #1e293b;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.phone-header {
  height: 44px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.header-icons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.battery {
  border: 1px solid #1e293b;
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 10px;
  position: relative;
}

.battery::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 4px;
  width: 2px;
  height: 4px;
  background: #1e293b;
}

.bank-app-content {
  flex: 1;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.app-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
}

.app-title {
  font-size: 18px;
  font-weight: bold;
}

.back-icon { font-size: 20px; color: #1e293b; cursor: pointer; }
.right-icons { display: flex; gap: 15px; color: #64748b; font-size: 18px; }

.warning-banner {
  background: #fffdf0;
  padding: 8px 15px;
  font-size: 12px;
  color: #b45309;
  line-height: 1.4;
  border-bottom: 1px solid #fef3c7;
}

.card-info-section {
  background: #fff;
  padding: 15px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.bank-card-visual {
  width: 60px;
  height: 38px;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  border-radius: 4px;
  position: relative;
  padding: 4px;
  color: white;
}

.card-chip {
  width: 10px;
  height: 8px;
  background: #fbbf24;
  border-radius: 2px;
  margin-bottom: 4px;
}

.card-logo { font-size: 6px; font-weight: bold; }
.card-type { font-size: 5px; position: absolute; bottom: 4px; right: 4px; opacity: 0.8; }

.card-details {
  display: flex;
  flex-direction: column;
}

.card-name { font-size: 16px; font-weight: bold; color: #1e293b; }
.card-number { font-size: 13px; color: #64748b; font-family: monospace; }

.action-links {
  background: #fff;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 8px solid #f1f5f9;
}

.action-links .link {
  font-size: 14px;
  color: #3b82f6;
  cursor: pointer;
}

.month-selector {
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 44px;
  gap: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.tab-item {
  font-size: 14px;
  color: #64748b;
  position: relative;
  padding: 5px 0;
}

.tab-item.active {
  color: #3b82f6;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #3b82f6;
}

.filter-btn {
  margin-left: auto;
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.month-header {
  padding: 15px;
}

.month-title {
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1e293b;
}

.info-icon { font-size: 14px; color: #3b82f6; }

.month-summary {
  font-size: 12px;
  color: #64748b;
  margin-top: 5px;
}

.transaction-item {
  background: #fff;
  padding: 15px;
  display: flex;
  align-items: center;
}

.item-left {
  display: flex;
  flex-direction: column;
  width: 60px;
}

.date { font-size: 14px; color: #64748b; }
.time { font-size: 12px; color: #94a3b8; margin-top: 2px; }

.item-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
}

.target-name { font-size: 15px; font-weight: 600; color: #1e293b; line-height: 1.2; }
.type-tag { font-size: 12px; color: #94a3b8; margin-top: 4px; }

.item-right {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.amount { font-size: 18px; font-weight: 800; }
.amount.plus { color: #d97706; } /* 兴业银行收入通常是金色/橙色 */

.balance { font-size: 12px; color: #94a3b8; margin-top: 4px; }
</style>
