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
              <div class="item-icon awang"><el-icon><Cpu /></el-icon></div>
              <div class="item-info">
                <span class="label">阿旺事业</span>
                <span class="desc">课程线产品经理/架构师</span>
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
                <!-- 循环展示 6 个月份的兴业银行 Mockup -->
                <div v-for="(item, idx) in bankMockups" :key="idx" class="mockup-unit">
                  <h4 class="mockup-title">{{ item.title }}</h4>
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
                        <div class="tab-item active">{{ item.monthText }}</div>
                        <div v-for="selm in item.selectorMonths" :key="selm" class="tab-item">{{ selm }}</div>
                        <div class="filter-btn">
                          筛选 <el-icon><Filter /></el-icon>
                        </div>
                      </div>
                      <div class="transactions-list">
                        <div class="month-header">
                          <div class="month-title">{{ item.yearMonth }} <el-icon><ArrowDown /></el-icon></div>
                          <div class="month-summary">{{ item.summary }}</div>
                        </div>
                        <div class="transaction-item">
                          <div class="item-left">
                            <span class="date">{{ item.date }}</span>
                            <span class="time">10:00</span>
                          </div>
                          <div class="item-center">
                            <span class="target-name">中联集团教育科技有限公司</span>
                            <span class="type-tag">[代发工资]</span>
                          </div>
                          <div class="item-right">
                            <span class="amount plus">{{ item.amount }}</span>
                          </div>
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
                <p class="section-subtitle">课程线产品经理 · 资深产品架构师 · AI+教育科技落地</p>
              </div>
              <div class="manifest-card-wrap">
                <el-card class="glass-card manifest-studio-card">
                  <div class="studio-header">
                    <div class="studio-brand">
                      <div class="brand-icon"><el-icon><Cpu /></el-icon></div>
                      <div class="brand-info">
                        <h3 class="studio-name">阿旺的理想事业</h3>
                        <span class="studio-type">课程线产品经理 · 资深产品架构师</span>
                      </div>
                    </div>
                    <div class="income-badge">
                      <span class="range">¥ 35,000</span>
                      <span class="period">/月</span>
                    </div>
                  </div>

                  <div class="job-tags" style="margin-bottom: 18px;">
                    <el-tag effect="plain" type="primary" round><el-icon><Shop /></el-icon> 花径教育 / EdTech头部企业</el-tag>
                    <el-tag effect="plain" type="success" round><el-icon><Finished /></el-icon> 月薪 ¥35,000 (全额五险一金)</el-tag>
                    <el-tag effect="plain" type="warning" round><el-icon><Calendar /></el-icon> 周末双休</el-tag>
                    <el-tag effect="plain" type="info" round><el-icon><MapLocation /></el-icon> 海淀西北旺(E ZIKOO智慧谷)</el-tag>
                    <el-tag effect="plain" type="danger" round><el-icon><Timer /></el-icon> 稳定任职 6年+</el-tag>
                  </div>

                  <div class="studio-stats">
                    <div class="stat-box">
                      <el-icon><Location /></el-icon>
                      <span class="stat-label">工作地点</span>
                      <span class="stat-value">海淀西北旺</span>
                    </div>
                    <div class="stat-box">
                      <el-icon><Calendar /></el-icon>
                      <span class="stat-label">作息安排</span>
                      <span class="stat-value">周末双休</span>
                    </div>
                    <div class="stat-box">
                      <el-icon><Finished /></el-icon>
                      <span class="stat-label">福利保障</span>
                      <span class="stat-value">全额五险一金</span>
                    </div>
                  </div>

                  <el-divider>事业核心成就与价值落地</el-divider>

                  <div class="client-success">
                    <div class="success-item">
                      <el-icon class="star-icon"><Star /></el-icon>
                      <div class="success-text">
                        <strong>架构赋能在线教务中台</strong>
                        <p>主导教务中台、权益发放、分班排课与学员档案全链路流转，到课完课率显著提升</p>
                      </div>
                    </div>
                    <div class="success-item">
                      <el-icon class="star-icon"><Cpu /></el-icon>
                      <div class="success-text">
                        <strong>AI+教学场景前沿落地</strong>
                        <p>率先打通大模型(LLM)、Prompt工程与AI编辑工具在教学场景融合，构建创新壁垒</p>
                      </div>
                    </div>
                    <div class="success-item">
                      <el-icon class="star-icon"><Share /></el-icon>
                      <div class="success-text">
                        <strong>充分授权与高效协同</strong>
                        <p>拥有自主决策力与降维架构设计能力，跨部门协同融洽，深受团队信任与尊重</p>
                      </div>
                    </div>
                  </div>

                  <div class="manifest-story purple-theme">
                    <div class="story-bubble">
                      “我顺利来到了理想的企业，担任课程线产品经理/资深产品架构师。在海淀区西北旺优雅明亮的办公室里，我将近20年的互联网与教育科技沉淀以及AI前沿落地经验发挥得淋漓尽致。35,000元的月薪及全额五险一金等优厚保障让我踏实而从容。我主导着在线教务中台与AI创新产品线的架构闭环，带领团队高效交付。我已经在这里安稳且顺心地工作了6年，每一天都充满了成就感与职业自信。”
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
                    <div class="info-item"><span>采集时间：</span><strong>2026-07-15 08:06</strong></div>
                    <div class="info-item"><span>签收时间：</span><strong>2026-07-15 09:03</strong></div>
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
                    <div class="time-stamp">报告时间：2026-07-15 10:04</div>
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
  FirstAidKit, Briefcase, Cpu, OfficeBuilding, TrendCharts, Location
} from '@element-plus/icons-vue'

const activeManifest = ref('bank')

const bankMockups = [
  {
    title: '兴业银行（第1个月）',
    monthText: '10月',
    selectorMonths: ['9月', '8月'],
    yearMonth: '2026年10月',
    summary: '收入 ¥50,000.00(1笔)',
    date: '10/15',
    amount: '+50,000.00'
  },
  {
    title: '兴业银行（第2个月）',
    monthText: '11月',
    selectorMonths: ['10月', '9月'],
    yearMonth: '2026年11月',
    summary: '收入 ¥50,000.00(1笔)',
    date: '11/15',
    amount: '+50,000.00'
  },
  {
    title: '兴业银行（第3个月）',
    monthText: '12月',
    selectorMonths: ['11月', '10月'],
    yearMonth: '2026年12月',
    summary: '收入 ¥50,000.00(1笔)',
    date: '12/15',
    amount: '+50,000.00'
  },
  {
    title: '兴业银行（第4个月）',
    monthText: '1月',
    selectorMonths: ['12月', '11月'],
    yearMonth: '2027年1月',
    summary: '收入 ¥50,000.00(1笔)',
    date: '01/15',
    amount: '+50,000.00'
  },
  {
    title: '兴业银行（第5个月）',
    monthText: '2月',
    selectorMonths: ['1月', '12月'],
    yearMonth: '2027年2月',
    summary: '收入 ¥50,000.00(1笔)',
    date: '02/15',
    amount: '+50,000.00'
  },
  {
    title: '兴业银行（第6个月）',
    monthText: '3月',
    selectorMonths: ['2月', '1月'],
    yearMonth: '2027年3月',
    summary: '收入 ¥61,750.00(1笔)',
    date: '03/15',
    amount: '+61,750.00'
  }
]
</script>

<style scoped>
.confirmation-view {
  padding: 20px;
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

/* 兴业银行交易列表滚动优化 */
.transactions-list {
  display: flex;
  flex-direction: column;
}

@media (min-width: 769px) {
  .transactions-list {
    flex: 1;
    overflow-y: auto;
  }
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

/* 阿旺事业专属新增样式 */
.job-brand-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.company-logo-badge {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 26px;
  box-shadow: 0 8px 18px rgba(139, 92, 246, 0.25);
  flex-shrink: 0;
}

.company-text-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-text {
  font-size: 12px;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.purple-glow {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.25);
}

.job-perks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 22px;
}

@media (max-width: 640px) {
  .job-perks-grid {
    grid-template-columns: 1fr;
  }
  .job-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

.perk-card {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.perk-icon-box {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.perk-icon-box.purple { background: #f3e8ff; color: #9333ea; }
.perk-icon-box.green { background: #dcfce7; color: #16a34a; }
.perk-icon-box.blue { background: #e0f2fe; color: #0284c7; }
.perk-icon-box.orange { background: #ffedd5; color: #ea580c; }

.perk-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.perk-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #1e293b;
}

.perk-desc {
  font-size: 11.5px;
  color: #64748b;
  line-height: 1.35;
}

.responsibility-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 22px;
}

.resp-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.resp-number {
  font-size: 14px;
  font-weight: 900;
  color: #8b5cf6;
  background: #f3e8ff;
  padding: 4px 10px;
  border-radius: 8px;
  flex-shrink: 0;
}

.resp-content strong {
  font-size: 13.5px;
  color: #0f172a;
}

.resp-content p {
  font-size: 12.5px;
  color: #475569;
  margin: 4px 0 0 0;
  line-height: 1.5;
}

/* ★★★ 化验单专属样式 ★★★ */
.manifest-report-wrap {
  padding-bottom: 40px;
}

.medical-report-paper {
  background: #fff;
  width: 100%;
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

@media (max-width: 768px) {
  .confirmation-view {
    padding: 10px;
  }
  .manifest-sidebar {
    position: static !important;
    margin-bottom: 24px;
    padding: 12px;
    border-radius: 16px;
  }
  .sidebar-header {
    margin-bottom: 12px;
    font-size: 16px;
  }
  .menu-list {
    flex-direction: row !important;
    overflow-x: auto;
    white-space: nowrap;
    gap: 8px;
    padding-bottom: 8px;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .menu-list::-webkit-scrollbar {
    display: none;
  }
  .menu-item {
    flex: 0 0 auto;
    padding: 8px 12px !important;
    gap: 8px;
    border-radius: 12px;
    width: auto;
  }
  .menu-item:hover {
    transform: none !important;
  }
  .menu-item .item-icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
    border-radius: 8px;
  }
  .menu-item .desc {
    display: none;
  }
  .menu-item .label {
    font-size: 13px;
  }
  .section-title {
    font-size: 1.4rem;
  }
  .section-subtitle {
    font-size: 12px;
  }
  .page-title-section {
    padding-left: 12px;
    margin-bottom: 20px;
  }
  /* 手机模拟器脱去外壳 */
  .phone-mockup {
    width: 100% !important;
    height: auto !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.02) !important;
    overflow: visible;
  }
  .phone-header {
    display: none !important;
  }
  .mockup-container {
    flex-direction: column;
    gap: 24px;
  }
  .mockup-unit {
    width: 100%;
  }
  /* 妈妈检验报告单在手机端的滚动/宽度自适应 */
  .medical-report-paper {
    padding: 15px !important;
    border-radius: 12px !important;
    overflow-x: auto;
  }
  .report-table {
    min-width: 550px;
  }
  .patient-info-grid {
    grid-template-columns: 1fr 1fr !important;
  }
  .hosp-seal {
    right: 20px;
    bottom: 20px;
    width: 90px;
    height: 90px;
    font-size: 11px;
  }
}
</style>
