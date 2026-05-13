<template>
  <div class="confirmation-view animate-fade-in">
    <el-row :gutter="40">
      <!-- 左侧导航栏 -->
      <el-col :xs="24" :sm="8" :md="6">
        <div class="manifest-sidebar">
          <div class="sidebar-header">
            <el-icon><Finished /></el-icon>
            <span>显化清单</span>
          </div>
          <div class="menu-list">
            <div 
              class="menu-item" 
              :class="{ active: activeManifest === 'bank' }"
              @click="activeManifest = 'bank'"
            >
              <div class="item-icon bank"><el-icon><Postcard /></el-icon></div>
              <div class="item-info">
                <span class="label">兴业银行</span>
                <span class="desc">代发工资记录</span>
              </div>
            </div>

            <div 
              class="menu-item" 
              :class="{ active: activeManifest === 'angel' }"
              @click="activeManifest = 'angel'"
            >
              <div class="item-icon angel"><el-icon><Suitcase /></el-icon></div>
              <div class="item-info">
                <span class="label">Angel 上班</span>
                <span class="desc">理想文职岗位</span>
              </div>
            </div>

            <div 
              class="menu-item" 
              :class="{ active: activeManifest === 'awang' }"
              @click="activeManifest = 'awang'"
            >
              <div class="item-icon awang"><el-icon><Brush /></el-icon></div>
              <div class="item-info">
                <span class="label">阿旺事业</span>
                <span class="desc">自由职业/工作室</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧内容区 -->
      <el-col :xs="24" :sm="16" :md="18">
        <transition name="fade-transform" mode="out-in">
          <div class="manifest-content-area" :key="activeManifest">
            
            <!-- 1. 兴业银行内容 -->
            <div v-if="activeManifest === 'bank'" class="content-wrapper">
              <div class="page-title-section">
                <h2 class="section-title">兴业银行显化实现内容</h2>
                <p class="section-subtitle">显化确认 · 兴业银行代发工资记录</p>
              </div>
              <div class="mockup-container">
                <div class="phone-mockup">
                  <div class="phone-header">
                    <span class="time">14:53</span>
                    <div class="header-icons">
                      <el-icon><Connection /></el-icon>
                      <div class="battery">100</div>
                    </div>
                  </div>
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
            </div>

            <!-- 2. Angel 上班内容 -->
            <div v-if="activeManifest === 'angel'" class="content-wrapper">
              <div class="page-title-section">
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

            <!-- 3. 阿旺事业内容 -->
            <div v-if="activeManifest === 'awang'" class="content-wrapper">
              <div class="page-title-section">
                <h2 class="section-title">阿旺事业显化</h2>
                <p class="section-subtitle">自由职业 · 创意研究 · 财富自由</p>
              </div>
              <div class="manifest-card-wrap">
                <el-card class="glass-card manifest-studio-card">
                  <div class="studio-header">
                    <div class="studio-brand">
                      <div class="brand-icon"><el-icon><Brush /></el-icon></div>
                      <div class="brand-info">
                        <h3 class="studio-name">阿旺个人工作室</h3>
                        <span class="studio-type">设计 · 创意 · 谈话 · 研究</span>
                      </div>
                    </div>
                    <div class="income-badge">
                      <span class="range">¥ 15k - 50k</span>
                      <span class="period">/月</span>
                    </div>
                  </div>
                  <div class="studio-stats">
                    <div class="stat-box">
                      <el-icon><HomeFilled /></el-icon>
                      <span class="stat-label">通勤时间</span>
                      <span class="stat-value">0 分钟</span>
                    </div>
                    <div class="stat-box">
                      <el-icon><Calendar /></el-icon>
                      <span class="stat-label">休息安排</span>
                      <span class="stat-value">完全自由</span>
                    </div>
                    <div class="stat-box">
                      <el-icon><Finished /></el-icon>
                      <span class="stat-label">五险一金</span>
                      <span class="stat-value">工作室缴纳</span>
                    </div>
                  </div>
                  <el-divider>客户与口碑</el-divider>
                  <div class="client-success">
                    <div class="success-item">
                      <el-icon class="star-icon"><Star /></el-icon>
                      <div class="success-text">
                        <strong>深度信任</strong>
                        <p>吸引志同道合的高质量客户</p>
                      </div>
                    </div>
                    <div class="success-item">
                      <el-icon class="star-icon"><Refresh /></el-icon>
                      <div class="success-text">
                        <strong>高复购率</strong>
                        <p>作品价值得到长期认可</p>
                      </div>
                    </div>
                    <div class="success-item">
                      <el-icon class="star-icon"><Share /></el-icon>
                      <div class="success-text">
                        <strong>好评转介绍</strong>
                        <p>口碑相传，源源不断的被动获客</p>
                      </div>
                    </div>
                  </div>
                  <div class="manifest-story purple-theme">
                    <div class="story-bubble">
                      “我终于实现了彻底的职业自由。在自己的工作室里，我随心所欲地挥洒创意，进行深度研究与对谈。每个月1.5万到5万的不等收入让我拥有了十足的安全感，五险一金也由工作室按时足额缴纳。告别了通勤的劳顿，我拥有了对时间的绝对掌控权。最令我欣慰的是，我的客户都像老朋友一样志同道合，他们信任我、追随我，并不断把这份价值介绍给更多人。这种被需要、被尊重且自由的状态，就是我理想中的事业。”
                    </div>
                  </div>
                </el-card>
              </div>
            </div>

          </div>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Finished, ArrowLeft, Search, MoreFilled, 
  ArrowDown, InfoFilled, Filter, Connection,
  Shop, Calendar, MapLocation, Timer, Bowl, UserFilled,
  Brush, HomeFilled, Star, Refresh, Share, Postcard, Suitcase
} from '@element-plus/icons-vue'

const activeManifest = ref('bank')
</script>

<style scoped>
.confirmation-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ★★★ 侧边栏样式 ★★★ */
.manifest-sidebar {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  position: sticky;
  top: 20px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 25px;
  padding-left: 10px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid transparent;
}

.menu-item:hover {
  background: white;
  transform: translateX(5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.menu-item.active {
  background: white;
  border-color: #6366f1;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.item-icon.bank { background: linear-gradient(135deg, #3b82f6, #1e3a8a); }
.item-icon.angel { background: linear-gradient(135deg, #10b981, #059669); }
.item-icon.awang { background: linear-gradient(135deg, #6366f1, #a855f7); }

.item-info {
  display: flex;
  flex-direction: column;
}

.menu-item .label {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.menu-item .desc {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

/* ★★★ 内容区样式 ★★★ */
.manifest-content-area {
  min-height: 600px;
}

.page-title-section {
  margin-bottom: 30px;
  text-align: left;
  border-left: 4px solid #6366f1;
  padding-left: 20px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
}

.section-subtitle {
  color: #64748b;
  margin-top: 5px;
  font-size: 14px;
}

/* 复用卡片样式并微调 */
.manifest-card-wrap {
  display: flex;
  justify-content: flex-start;
  padding-bottom: 40px;
}

.manifest-job-card, .manifest-studio-card {
  width: 100%;
  max-width: 650px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* 手机模拟器在窄屏内容区缩放 */
.mockup-container {
  display: flex;
  justify-content: flex-start;
  padding-bottom: 40px;
}

.phone-mockup {
  width: 340px;
  height: 740px;
  background: #fff;
  border-radius: 40px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.1);
  border: 10px solid #1e293b;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.phone-header { height: 44px; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: bold; }
.header-icons { display: flex; gap: 8px; align-items: center; }
.battery { border: 1px solid #1e293b; padding: 1px 4px; border-radius: 4px; font-size: 10px; position: relative; }
.battery::after { content: ''; position: absolute; right: -3px; top: 4px; width: 2px; height: 4px; background: #1e293b; }
.bank-app-content { flex: 1; background: #f8f9fa; display: flex; flex-direction: column; }
.app-nav { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #fff; }
.app-title { font-size: 17px; font-weight: bold; }
.back-icon { font-size: 20px; color: #1e293b; }
.right-icons { display: flex; gap: 15px; color: #64748b; font-size: 18px; }
.warning-banner { background: #fffdf0; padding: 8px 15px; font-size: 11px; color: #b45309; line-height: 1.4; border-bottom: 1px solid #fef3c7; }
.card-info-section { background: #fff; padding: 15px; display: flex; gap: 15px; align-items: center; }
.bank-card-visual { width: 55px; height: 35px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius: 4px; position: relative; padding: 4px; color: white; }
.card-chip { width: 10px; height: 8px; background: #fbbf24; border-radius: 2px; margin-bottom: 4px; }
.card-logo { font-size: 6px; font-weight: bold; }
.card-type { font-size: 5px; position: absolute; bottom: 4px; right: 4px; opacity: 0.8; }
.card-details { display: flex; flex-direction: column; }
.card-name { font-size: 15px; font-weight: bold; color: #1e293b; }
.card-number { font-size: 12px; color: #64748b; font-family: monospace; }
.action-links { background: #fff; display: flex; justify-content: space-around; padding: 10px 0; border-top: 1px solid #f1f5f9; border-bottom: 8px solid #f1f5f9; }
.action-links .link { font-size: 13px; color: #3b82f6; }
.month-selector { background: #fff; display: flex; align-items: center; padding: 0 15px; height: 44px; gap: 20px; border-bottom: 1px solid #f1f5f9; }
.tab-item { font-size: 13px; color: #64748b; position: relative; padding: 5px 0; }
.tab-item.active { color: #3b82f6; font-weight: bold; }
.tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #3b82f6; }
.filter-btn { margin-left: auto; font-size: 13px; color: #64748b; display: flex; align-items: center; gap: 4px; }
.month-header { padding: 15px; }
.month-title { font-size: 18px; font-weight: 800; display: flex; align-items: center; gap: 6px; color: #1e293b; }
.info-icon { font-size: 13px; color: #3b82f6; }
.month-summary { font-size: 11px; color: #64748b; margin-top: 5px; }
.transaction-item { background: #fff; padding: 15px; display: flex; align-items: center; }
.item-left { display: flex; flex-direction: column; width: 55px; }
.date { font-size: 13px; color: #64748b; }
.time { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.item-center { flex: 1; display: flex; flex-direction: column; padding-left: 10px; }
.target-name { font-size: 14px; font-weight: 600; color: #1e293b; line-height: 1.2; }
.type-tag { font-size: 11px; color: #94a3b8; margin-top: 4px; }
.item-right { text-align: right; display: flex; flex-direction: column; }
.amount { font-size: 16px; font-weight: 800; }
.amount.plus { color: #d97706; }
.balance { font-size: 11px; color: #94a3b8; margin-top: 4px; }

/* 任务卡片内部样式 */
.job-header, .studio-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.job-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; display: block; }
.job-name { font-size: 22px; font-weight: 800; color: #1e293b; margin: 0; }
.salary-tag { background: linear-gradient(135deg, #10b981, #059669); padding: 10px 18px; border-radius: 14px; color: white; display: flex; align-items: baseline; }
.salary-tag .value { font-size: 20px; font-weight: 800; }
.job-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.job-tags :deep(.el-tag) { height: 28px; font-size: 11px; }
.job-perks { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
.perk-item { display: flex; gap: 12px; align-items: center; }
.perk-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.perk-icon.lunch { background: #fff7ed; color: #f97316; }
.perk-icon.social { background: #f0fdf4; color: #22c55e; }
.perk-label { font-size: 13px; font-weight: bold; }
.perk-desc { font-size: 11px; color: #64748b; }
.manifest-story { padding: 18px; background: #f8fafc; border-radius: 14px; border-left: 4px solid #6366f1; }
.story-bubble { font-size: 14px; line-height: 1.7; color: #475569; font-style: italic; }

/* 工作室内部样式 */
.studio-brand { display: flex; gap: 12px; align-items: center; }
.brand-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #a855f7); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; }
.studio-name { font-size: 18px; font-weight: 800; }
.income-badge { text-align: right; background: #fdf4ff; padding: 6px 12px; border-radius: 10px; }
.income-badge .range { font-size: 16px; font-weight: 800; color: #a21caf; }
.studio-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
.stat-box { background: #f8fafc; padding: 12px 8px; border-radius: 14px; text-align: center; }
.stat-box .el-icon { font-size: 18px; color: #6366f1; }
.stat-label { font-size: 10px; color: #94a3b8; display: block; }
.stat-value { font-size: 12px; font-weight: bold; }
.client-success { display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px; }
.success-item { display: flex; gap: 12px; }
.star-icon { font-size: 18px; color: #fbbf24; }
.success-text strong { font-size: 14px; }
.success-text p { font-size: 12px; color: #64748b; margin: 2px 0 0 0; }
.purple-theme { border-left-color: #a855f7 !important; background: #faf5ff !important; }

/* 切换动画 */
.fade-transform-enter-active, .fade-transform-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
