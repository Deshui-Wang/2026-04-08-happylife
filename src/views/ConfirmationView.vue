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
                <span class="label">现金入账</span>
                <span class="desc">各银行代发与转账记录</span>
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

            <div 
              class="menu-item" 
              :class="{ active: activeManifest === 'mom' }"
              @click="activeManifest = 'mom'"
            >
              <div class="item-icon mom"><el-icon><FirstAidKit /></el-icon></div>
              <div class="item-info">
                <span class="label">妈妈安康</span>
                <span class="desc">甲亢指标完全正常</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧内容区 -->
      <el-col :xs="24" :sm="16" :md="18">
        <transition name="fade-transform" mode="out-in">
          <div class="manifest-content-area" :key="activeManifest">
            
            <!-- 1. 现金入账内容 -->
            <div v-if="activeManifest === 'bank'" class="content-wrapper">
              <div class="page-title-section">
                <h2 class="section-title">现金入账显化实现内容</h2>
                <p class="section-subtitle">显化确认 · 各银行代发与转账记录</p>
              </div>
              <div class="mockup-container multi-mockup">
                <!-- 1. 兴业银行 Mockup -->
                <div class="mockup-unit">
                  <h4 class="mockup-title">兴业银行</h4>
                  <div class="phone-mockup cibi-theme">
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
                      温馨提示：本页面最多展示1500条查询结果...
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
                      <div class="filter-btn">
                        筛选 <el-icon><Filter /></el-icon>
                      </div>
                    </div>
                    <div class="transactions-list">
                      <div class="month-header">
                        <div class="month-title">6月 <el-icon><ArrowDown /></el-icon></div>
                        <div class="month-summary">收入 ¥128,654.99(2笔)</div>
                      </div>
                      <div class="transaction-item">
                        <div class="item-left"><span class="date">06/08</span></div>
                        <div class="item-center">
                          <span class="target-name">中联集团教育科技有限公司</span>
                          <span class="type-tag">[代发工资]</span>
                        </div>
                        <div class="item-right">
                          <span class="amount plus">+5,404.99</span>
                        </div>
                      </div>
                      <div class="transaction-item">
                        <div class="item-left"><span class="date">06/08</span></div>
                        <div class="item-center">
                          <span class="target-name">中联集团教育科技有限公司</span>
                          <span class="type-tag">[代发工资]</span>
                        </div>
                        <div class="item-right">
                          <span class="amount plus">+123,250.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 2. 招商银行 Mockup (CMB) -->
              <div class="mockup-unit">
                <h4 class="mockup-title">招商银行</h4>
                <div class="phone-mockup cmb-theme">
                  <div class="phone-header">
                    <span class="time">15:13</span>
                    <div class="header-icons">
                      <el-icon><Connection /></el-icon>
                      <div class="battery">96</div>
                    </div>
                  </div>
                  <div class="bank-app-content">
                    <header class="app-nav cmb-nav">
                      <el-icon class="back-icon"><ArrowLeft /></el-icon>
                      <span class="app-title">收支</span>
                      <div class="right-icons">
                        <el-icon><Search /></el-icon>
                        <el-icon><MoreFilled /></el-icon>
                      </div>
                    </header>
                    
                    <div class="cmb-filters">
                      <span class="filter-item">2026.06 <el-icon><ArrowDown /></el-icon></span>
                      <span class="filter-item">银行卡 <el-icon><ArrowDown /></el-icon></span>
                      <span class="filter-item">按金额</span>
                      <span class="filter-btn-text">筛选</span>
                    </div>

                    <div class="cmb-scroll-content">
                      <div class="cmb-month-card">
                        <div class="month-label">6<span>月</span></div>
                        <div class="month-income">
                          <span class="label">收入</span>
                          <span class="value">¥ 22,000.00</span>
                        </div>
                        <div class="analysis-btn">分析</div>
                        
                        <div class="cmb-transactions">
                          <div class="day-group">
                            <div class="day-badge">6.8</div>
                            <div class="cmb-item">
                              <div class="item-icon-wrap"><div class="cmb-icon-box transfer">转</div></div>
                              <div class="cmb-item-main">
                                <div class="cmb-item-top">
                                  <span class="desc">转账-中联集团教育科技有限公司</span>
                                  <span class="amount">+¥22,000.00</span>
                                </div>
                                <div class="cmb-item-bottom">
                                  <span class="card-info">储蓄卡7546 10:24</span>
                                  <span class="balance">余额:¥182,000.00</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="cmb-tab-bar">
                      <div class="tab-item active">
                        <el-icon><Postcard /></el-icon>
                        <span>明细</span>
                      </div>
                      <div class="tab-item">
                        <el-icon><Notebook /></el-icon>
                        <span>账本</span>
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
            <!-- 4. 妈妈安康内容 -->
            <div v-if="activeManifest === 'mom'" class="content-wrapper">
              <div class="page-title-section">
                <h2 class="section-title">妈妈健康显化</h2>
                <p class="section-subtitle">健康身体 · 指标正常 · 平安长寿</p>
              </div>
              <div class="manifest-report-wrap">
                <div class="medical-report-paper animate-slide-up">
                  <header class="report-header">
                    <div class="hospital-info">
                      <el-icon class="hosp-logo"><FirstAidKit /></el-icon>
                      <span class="hosp-name">铁岭县中心医院检验报告单</span>
                    </div>
                    <div class="report-type">门诊</div>
                    <div class="qr-placeholder">
                      <div class="qr-box"></div>
                      <div class="qr-box"></div>
                    </div>
                  </header>

                  <section class="patient-info-grid">
                    <div class="info-item"><span>姓名：</span><strong>崔建明</strong></div>
                    <div class="info-item"><span>性别：</span><strong>女</strong></div>
                    <div class="info-item"><span>年龄：</span><strong>71岁</strong></div>
                    <div class="info-item"><span>病人编号：</span><strong>01976939/51</strong></div>
                    <div class="info-item"><span>科别：</span><strong>内分泌门诊</strong></div>
                    <div class="info-item"><span>标本种类：</span><strong>血清</strong></div>
                    <div class="info-item"><span>条码编号：</span><strong>0201530789</strong></div>
                    <div class="info-item"><span>样本编号：</span><strong>MZ0034</strong></div>
                    <div class="info-item"><span>床号：</span><strong>-</strong></div>
                    <div class="info-item"><span>检查科室：</span><strong>检验科</strong></div>
                    <div class="info-item"><span>采集时间：</span><strong>2026-06-15 08:06</strong></div>
                    <div class="info-item"><span>签收时间：</span><strong>2026-06-15 09:03</strong></div>
                    <div class="info-item"><span>申请医生：</span><strong>王春波</strong></div>
                    <div class="info-item"><span>临床诊断：</span><strong>甲状腺功能亢进症</strong></div>
                    <div class="info-item full-row"><span>检验项目：</span><strong>血清促甲状腺激素测定(发光法)、血清游离甲状腺素(FT4)测定(发光法)、血清游离三碘甲状腺原氨酸(FT3)测定(发光法)</strong></div>
                  </section>

                  <table class="report-table">
                    <thead>
                      <tr>
                        <th>序号</th>
                        <th>项目名称</th>
                        <th>英文缩写</th>
                        <th>检验结果</th>
                        <th>单位</th>
                        <th>参考值范围</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>01</td>
                        <td>促甲状腺激素</td>
                        <td>TSH</td>
                        <td class="result-value normal">2.15</td>
                        <td>uIU/mL</td>
                        <td>0.35 - 5.10</td>
                        <td><el-tag size="small" type="success" effect="dark">正常</el-tag></td>
                      </tr>
                      <tr>
                        <td>02</td>
                        <td>游离三碘甲状腺原氨酸</td>
                        <td>FT3</td>
                        <td class="result-value normal">3.25</td>
                        <td>pg/ml</td>
                        <td>1.8 - 4.2</td>
                        <td><el-tag size="small" type="success" effect="dark">正常</el-tag></td>
                      </tr>
                      <tr>
                        <td>03</td>
                        <td>游离甲状腺素</td>
                        <td>FT4</td>
                        <td class="result-value normal">1.22</td>
                        <td>ng/dL</td>
                        <td>0.89 - 1.85</td>
                        <td><el-tag size="small" type="success" effect="dark">正常</el-tag></td>
                      </tr>
                    </tbody>
                  </table>

                  <footer class="report-footer">
                    <div class="time-stamp">报告时间：2026-06-15 10:04</div>
                    <div class="doctors">
                      <div class="doc-item">报告医生：<span class="signature">郝乐</span></div>
                      <div class="doc-item">审核医生：<span class="signature">孙宁</span></div>
                    </div>
                    <p class="disclaimer">此结果仅对该标本负责！仅供临床参考如有异议请于3日内到检验科咨询。79892163 79892089</p>
                    <div class="hosp-seal">铁岭县中心医院<br/>检验科专用章</div>
                  </footer>
                </div>
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
  Brush, HomeFilled, Star, Refresh, Share, Postcard, Suitcase, Notebook,
  FirstAidKit
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
.item-icon.mom { background: linear-gradient(135deg, #f43f5e, #be123c); }

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
  gap: 20px;
}

.multi-mockup {
  flex-wrap: wrap;
}

.mockup-unit {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.mockup-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
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

/* ★★★ 招商银行 (CMB) 专属样式 ★★★ */
.cmb-theme {
  background: #f4f6f8;
}

.cmb-nav {
  border-bottom: none;
}

.cmb-filters {
  display: flex;
  padding: 10px 15px;
  gap: 15px;
  align-items: center;
  background: white;
  font-size: 13px;
  color: #333;
}

.cmb-filters .filter-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cmb-filters .filter-btn-text {
  margin-left: auto;
  color: #436eee;
}

.cmb-scroll-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.cmb-month-card {
  background: white;
  border-radius: 16px;
  padding: 20px 15px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,255,1) 100%);
}

.month-label {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.month-label span {
  font-size: 14px;
  margin-left: 2px;
}

.month-income {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 20px;
}

.month-income .label {
  font-size: 14px;
  color: #666;
}

.month-income .value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.analysis-btn {
  position: absolute;
  top: 20px;
  right: 15px;
  background: #000;
  color: #fff;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
}

.day-badge {
  background: #f1f5f9;
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 12px;
}

.cmb-item {
  display: flex;
  gap: 7px;
}

.item-icon-wrap {
  display: flex;
  align-items: flex-start;
}

.cmb-icon-box {
  width: 20px;
  height: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  border-radius: 4px;
  color: #64748b;
}

.cmb-item-main {
  flex: 1;
}

.cmb-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.cmb-item-top .desc {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  max-width: 135px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.cmb-item-top .amount {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: 8px;
}

.cmb-item-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
}

.cmb-tab-bar {
  height: 60px;
  border-top: 1px solid #f1f5f9;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 5px;
}

.cmb-tab-bar .tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #94a3b8;
}

.cmb-tab-bar .tab-item.active {
  color: #000;
}

.cmb-tab-bar .tab-item .el-icon {
  font-size: 20px;
}

.cmb-tab-bar .tab-item span {
  font-size: 11px;
}

/* ★★★ 任务卡片内部样式 ★★★ */
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

/* ★★★ 化验单专属样式 ★★★ */
.manifest-report-wrap {
  padding-bottom: 40px;
}

.medical-report-paper {
  background: #fff;
  width: 100%;
  max-width: 850px;
  min-height: 500px;
  padding: 40px 50px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05);
  border-radius: 4px;
  position: relative;
  font-family: "SimSun", "STSong", serif;
  color: #000;
}

.medical-report-paper::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 8px;
  background: #f1f5f9;
}

.report-header {
  border-bottom: 2px solid #000;
  padding-bottom: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.hospital-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hosp-logo { font-size: 24px; color: #be123c; }
.hosp-name { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
.report-type { font-size: 18px; border: 1px solid #000; padding: 2px 10px; margin-right: 80px; }

.qr-placeholder { display: flex; gap: 10px; }
.qr-box { width: 45px; height: 45px; border: 1px solid #eee; background: #fafafa; }

.patient-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  font-size: 14px;
  margin-bottom: 25px;
}

.patient-info-grid .info-item span { color: #666; }
.patient-info-grid .full-row { grid-column: span 4; border-top: 1px dashed #ccc; padding-top: 8px; margin-top: 5px; }

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.report-table th {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 10px;
  text-align: left;
  font-size: 14px;
}

.report-table td {
  padding: 12px 10px;
  font-size: 14px;
}

.result-value.normal {
  font-weight: bold;
  font-size: 16px;
}

.report-footer {
  border-top: 1px solid #000;
  padding-top: 15px;
  position: relative;
}

.time-stamp { font-size: 13px; margin-bottom: 10px; }

.doctors {
  display: flex;
  gap: 40px;
  margin-bottom: 15px;
}

.doc-item { font-size: 15px; }
.signature {
  font-family: "STKaiti", "Kaiti", cursive;
  font-size: 20px;
  margin-left: 10px;
  font-weight: bold;
}

.disclaimer {
  font-size: 12px;
  color: #333;
  border-top: 1px dashed #ccc;
  padding-top: 10px;
}

.hosp-seal {
  position: absolute;
  right: 60px;
  bottom: 30px;
  width: 120px;
  height: 120px;
  border: 3px solid rgba(190, 18, 60, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(190, 18, 60, 0.4);
  font-weight: bold;
  font-size: 14px;
  transform: rotate(-15deg);
  pointer-events: none;
}

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
