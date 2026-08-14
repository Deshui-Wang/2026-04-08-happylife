<template>
  <div class="ledger-container animate-fade-in">
    <!-- 1. 顶栏总览卡片 (#0D2B2E 深墨绿 & #E8C268 鎏金) -->
    <div class="overview-header-card">
      <!-- 第一行：两个标签一行 -->
      <div class="summary-title-wrap">
        <span class="badge-tag">好好记账 · 稳稳发财</span>
        <span 
          class="cloud-sync-chip" 
          :class="{ 'syncing': isSyncing }" 
          title="点击手动与云端同步全端账单数据"
          @click="manualCloudSync"
        >
          <el-icon :class="{ 'spin-icon': isSyncing }"><Refresh /></el-icon>
          <span>{{ syncStatusText }}</span>
        </span>
      </div>

      <!-- 第二行：总金额与小猪一行 (左右对齐) -->
      <div class="overview-top-row">
        <div class="summary-amount-box">
          <div class="currency-symbol">¥</div>
          <div class="amount-num">{{ formattedTotalAmount }}</div>
        </div>

        <div class="overview-right-hero">
          <img
            :src="huabanAddPic"
            alt="快捷记账"
            class="header-hero-pic"
            title="点击快捷记账"
            @click="openAddModal"
          />
        </div>
      </div>

      <!-- 虚线下方：三项统计数据横向均分占位 -->
      <div class="summary-meta-row">
        <div class="meta-item">
          <span class="meta-label">筛选笔数</span>
          <span class="meta-val">{{ filteredRecords.length }} 笔</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">最高消费类型</span>
          <span class="meta-val">{{ topCategoryName }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">主要消费者</span>
          <span class="meta-val">{{ topMemberName }}</span>
        </div>
      </div>
    </div>

    <!-- 3. 上滑条件查询抽屉 Modal (Slide-up Filter Drawer) -->
    <el-drawer
      v-model="isFilterDrawerOpen"
      title="筛选条件查询"
      direction="btt"
      size="80%"
      class="custom-filter-drawer"
      destroy-on-close
      :append-to-body="true"
    >
      <div class="drawer-filter-body">
        <!-- 时间范围 -->
        <div class="drawer-group">
          <label class="drawer-group-label">时间范围</label>
          <div class="drawer-pills-grid">
            <button 
              v-for="item in timeOptions" 
              :key="item.value"
              class="drawer-pill-btn"
              :class="{ active: timeRange === item.value }"
              @click="timeRange = item.value"
            >
              {{ item.label }}
            </button>
          </div>
          <div v-if="timeRange === 'custom'" class="drawer-custom-date">
            <el-date-picker
              v-model="customDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%;"
            />
          </div>
        </div>

        <!-- 消费者 -->
        <div class="drawer-group">
          <label class="drawer-group-label">消费者</label>
          <div class="drawer-pills-grid">
            <button
              class="drawer-pill-btn"
              :class="{ active: selectedMember === 'all' }"
              @click="selectedMember = 'all'"
            >
              全部成员
            </button>
            <button
              v-for="m in MEMBERS"
              :key="m.name"
              class="drawer-pill-btn"
              :class="{ active: selectedMember === m.name }"
              :style="selectedMember === m.name ? { backgroundColor: m.color, borderColor: m.color, color: '#fff' } : {}"
              @click="selectedMember = m.name"
            >
              {{ m.name }}
            </button>
          </div>
        </div>

        <!-- 消费类型 -->
        <div class="drawer-group">
          <label class="drawer-group-label">消费类型</label>
          <div class="drawer-cat-grid">
            <button
              class="drawer-cat-btn"
              :class="{ active: selectedCategory === 'all' }"
              @click="selectedCategory = 'all'"
            >
              全部分类
            </button>
            <button
              v-for="c in CATEGORIES"
              :key="c.name"
              class="drawer-cat-btn"
              :class="{ active: selectedCategory === c.name }"
              @click="selectedCategory = c.name"
            >
              <span>{{ c.icon }}</span>
              <span>{{ c.name }}</span>
            </button>
          </div>
        </div>

        <!-- 关键字搜索 -->
        <div class="drawer-group">
          <label class="drawer-group-label">关键字搜索</label>
          <el-input
            v-model="searchKeyword"
            placeholder="输入描述/备注关键字..."
            clearable
            size="large"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <template #footer>
        <div class="drawer-footer-actions">
          <button class="btn-drawer-reset" @click="resetFilters">重置条件</button>
          <button class="btn-drawer-close-inline" @click="isFilterDrawerOpen = false">关闭</button>
          <button class="btn-drawer-apply" @click="isFilterDrawerOpen = false">完成筛选</button>
        </div>
      </template>
    </el-drawer>

    <!-- 4. 统计分析与页签切换 (温馨甜蜜家庭风) -->
    <div v-if="filteredRecords.length > 0" class="sweet-stats-card">
      <div class="stats-header-bar">
        <div class="title-left-wrap">
          <h3 class="stats-section-title">消费排行</h3>
          <div class="stats-tabs-header">
            <button 
              class="stats-tab-btn" 
              :class="{ active: activeStatsTab === 'consumer' }" 
              @click="activeStatsTab = 'consumer'"
            >
              消费者
            </button>
            <button 
              class="stats-tab-btn" 
              :class="{ active: activeStatsTab === 'category' }" 
              @click="activeStatsTab = 'category'"
            >
              消费类型
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 1: 消费者支出占比 (清爽单行横线分割) -->
      <div v-if="activeStatsTab === 'consumer'" class="sweet-stats-list animate-fade-in">
        <div v-for="st in memberStats" :key="st.name" class="sweet-item-line">
          <div class="sweet-info-row">
            <div class="sweet-name-col">
              <span class="sweet-color-dot" :style="{ backgroundColor: st.color }"></span>
              <span class="sweet-item-name">{{ st.name }}</span>
            </div>
            <div class="sweet-metrics-col">
              <span class="sweet-amount">¥{{ st.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
              <span class="sweet-percent-chip" :style="{ borderColor: st.color, color: st.color }">{{ st.percentage }}%</span>
            </div>
          </div>

          <!-- 温润果冻胶囊条 Track -->
          <div class="sweet-pill-track">
            <div 
              class="sweet-pill-fill" 
              :style="{ 
                width: st.percentage + '%', 
                background: getGradientColor(st.color),
                boxShadow: `0 3px 10px ${st.color}50`
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tab 2: 消费类型构成 (清爽单行横线分割) -->
      <div v-else-if="activeStatsTab === 'category'" class="sweet-stats-list animate-fade-in">
        <div v-for="cs in categoryStats" :key="cs.name" class="sweet-item-line">
          <div class="sweet-info-row">
            <div class="sweet-name-col">
              <span class="sweet-cat-emoji">{{ cs.icon }}</span>
              <span class="sweet-item-name">{{ cs.name }}</span>
            </div>
            <div class="sweet-metrics-col">
              <span class="sweet-amount">¥{{ cs.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
              <span class="sweet-percent-chip" :style="{ borderColor: cs.color, color: cs.color }">{{ cs.percentage }}%</span>
            </div>
          </div>

          <!-- 温润果冻胶囊条 Track -->
          <div class="sweet-pill-track">
            <div 
              class="sweet-pill-fill" 
              :style="{ 
                width: cs.percentage + '%', 
                background: getGradientColor(cs.color),
                boxShadow: `0 3px 10px ${cs.color}50`
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. 账单明细列表 / 周日历网格视图 -->
    <div class="records-list-section">
      <div class="section-title-bar">
        <div class="title-left-wrap">
          <h3>账单明细</h3>
          <!-- 视图模式切换：按周日历网格 vs 列表模式 -->
          <div class="view-mode-toggle">
            <button 
              class="mode-toggle-btn" 
              :class="{ active: viewMode === 'calendar' }"
              @click="viewMode = 'calendar'"
            >
              📅 周日历
            </button>
            <button 
              class="mode-toggle-btn" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              📜 列表
            </button>
          </div>
        </div>

        <button class="btn-title-filter" @click="isFilterDrawerOpen = true">
          <el-icon><Search /></el-icon>
          <span>筛选</span>
        </button>
      </div>

      <!-- A. 按周日历网格视图 (一行一周，每行 7 个格子，带有日期与星期) -->
      <div v-if="viewMode === 'calendar'" class="calendar-view-card animate-fade-in">
        <!-- 月份切换导航栏 -->
        <div class="calendar-month-nav">
          <div class="nav-month-title">
            <span class="month-text">{{ currentCalendarMonth.format('YYYY 年 MM 月') }}</span>
          </div>
          <div class="nav-btn-group">
            <button class="nav-btn" title="上一个月" @click="prevMonth">‹ 上月</button>
            <button class="nav-btn today" title="跳转本月" @click="goTodayMonth">今天</button>
            <button class="nav-btn" title="下一个月" @click="nextMonth">下月 ›</button>
          </div>
        </div>

        <!-- 星期标题头 (一行7列: 周一 ~ 周日) -->
        <div class="calendar-weekdays-header">
          <div class="weekday-col">一</div>
          <div class="weekday-col">二</div>
          <div class="weekday-col">三</div>
          <div class="weekday-col">四</div>
          <div class="weekday-col">五</div>
          <div class="weekday-col">六</div>
          <div class="weekday-col">日</div>
        </div>

        <!-- 周日历网格主体：一行一周，一行 7 个格子 -->
        <div class="calendar-grid-body">
          <div 
            v-for="(week, wIdx) in calendarWeeks" 
            :key="wIdx" 
            class="calendar-week-row"
          >
            <div 
              v-for="day in week" 
              :key="day.dateStr" 
              class="day-cell"
              :class="{ 
                'has-spending': day.hasRecords, 
                'no-spending': !day.hasRecords, 
                'is-today': day.isToday, 
                'other-month': !day.isCurrentMonth 
              }"
              @click="openDayDetail(day)"
            >
              <!-- 格子头部：仅保留日期数字 -->
              <div class="cell-top-bar">
                <span class="day-date-num">{{ day.dayNum }}</span>
              </div>

              <!-- 格子主体：有记录显示金额 / 无记录显示“记账” -->
              <div class="cell-body-content">
                <template v-if="day.hasRecords">
                  <div class="cell-spend-amount" :class="{ 'is-income': day.isIncome }">
                    {{ Number(day.totalAmount).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) }}
                  </div>
                  <div class="cell-spend-count">{{ day.records.length }}笔</div>
                </template>
                <template v-else>
                  <div class="cell-no-spend-tag">记账</div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- B. 列表模式视图 -->
      <template v-else>
        <!-- 空状态 -->
        <div v-if="filteredRecords.length === 0" class="empty-state-card">
          <el-empty :description="records.length === 0 ? '欢迎开启家庭正式记账！目前暂无账单记录' : '暂无符合条件的账单记录'">
            <button class="btn-primary-add inline-empty-btn" @click="openAddModal">
              <el-icon style="margin-right: 4px;"><Plus /></el-icon> 记第一笔账
            </button>
          </el-empty>
        </div>

        <!-- 按日期分组列表 -->
        <div v-else class="grouped-records-list">
          <div v-for="group in groupedRecords" :key="group.date" class="date-group-card">
            <div class="date-group-header">
              <span class="date-str">{{ group.formattedDate }}</span>
              <span class="date-total">当日小计: ¥{{ group.total.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
            </div>

            <div class="record-items-wrapper">
              <div v-for="item in group.items" :key="item.id" class="record-item">
                <!-- 行 1: Icon 与 分类 (右侧编辑与删除按钮) -->
                <div class="record-row row-1">
                  <div class="cat-title-inline">
                    <div class="cat-icon-badge" :style="{ backgroundColor: getCatInfo(item.category).bg }">
                      <span>{{ getCatInfo(item.category).icon }}</span>
                    </div>
                    <span class="category-name">{{ item.category }}</span>
                  </div>
                  <div class="item-actions-group">
                    <button class="btn-action-icon btn-edit" title="编辑记录" @click="openEditModal(item)">
                      <el-icon><Edit /></el-icon>
                    </button>
                    <button class="btn-action-icon btn-delete" title="删除记录" @click="deleteRecord(item.id)">
                      <el-icon><Delete /></el-icon>
                    </button>
                  </div>
                </div>

                <!-- 行 2: 消费者 与 消费金额 -->
                <div class="record-row row-2">
                  <div class="members-chips-wrap">
                    <span
                      v-for="uName in getRecordUsers(item)"
                      :key="uName"
                      class="member-chip"
                      :style="{ backgroundColor: '#ffffff', borderColor: getMemberInfo(uName).color, color: getMemberInfo(uName).color }"
                    >
                      {{ uName }}
                    </span>
                  </div>
                  <div class="item-amount">-¥{{ Number(item.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
                </div>

                <!-- 行 3: 描述 与 时间 -->
                <div class="record-row row-3">
                  <span class="desc-text">{{ item.description || '无详细描述' }}</span>
                  <span class="time-text">{{ formatTime(item.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 6. 移动端快捷记账弹窗 Modal (支持消费者多选与编辑) -->
    <el-dialog
      v-model="isAddModalOpen"
      :title="isEditMode ? '编辑账单记录' : '记账'"
      width="92%"
      max-width="500px"
      class="custom-add-ledger-dialog"
      :align-center="true"
      :append-to-body="true"
      destroy-on-close
    >
      <form class="add-form" @submit.prevent="saveRecord">
        <!-- 消费者多选 -->
        <div class="form-group">
          <div class="label-with-tip">
            <label class="form-label">消费者</label>
            <span class="sub-tip">(可多选)</span>
          </div>
          <div class="member-selector-grid">
            <button
              v-for="m in MEMBERS"
              :key="m.name"
              type="button"
              class="member-select-btn"
              :class="{ selected: form.users.includes(m.name) }"
              :style="form.users.includes(m.name) ? { backgroundColor: m.color, borderColor: m.color, color: '#fff', fontWeight: '900', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } : {}"
              @click="toggleConsumer(m.name)"
            >
              {{ m.name }}
            </button>
          </div>
        </div>

        <!-- 消费类型选择 -->
        <div class="form-group">
          <label class="form-label">消费类型</label>
          <div class="category-selector-grid">
            <button
              v-for="c in CATEGORIES"
              :key="c.name"
              type="button"
              class="cat-select-btn"
              :class="{ selected: form.category === c.name }"
              @click="form.category = c.name"
            >
              <span class="cat-btn-icon">{{ c.icon }}</span>
              <span class="cat-btn-name">{{ c.name }}</span>
            </button>
          </div>
        </div>

        <!-- 金额录入与快捷面额按钮 -->
        <div class="form-group">
          <label class="form-label">支出金额 (元)</label>
          <div class="amount-input-box">
            <span class="symbol">¥</span>
            <input
              v-model.number="form.amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              class="amount-field"
              required
            />
          </div>
          <div class="quick-amounts-row">
            <button v-for="q in [10, 50, 100, 200, 500]" :key="q" type="button" class="quick-amt-btn" @click="addQuickAmount(q)">
              +{{ q }}
            </button>
            <button type="button" class="quick-amt-btn reset" @click="form.amount = ''">清空</button>
          </div>
        </div>

        <!-- 备注描述 -->
        <div class="form-group">
          <label class="form-label">描述 / 备注说明</label>
          <el-input
            v-model="form.description"
            placeholder="例如: 盒马鲜生、缴水电费、周末餐馆聚餐..."
            maxlength="60"
            show-word-limit
          />
        </div>

        <!-- 时间戳 -->
        <div class="form-group">
          <label class="form-label">记账时间</label>
          <el-date-picker
            v-model="form.timestamp"
            type="datetime"
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
        </div>

        <!-- 底部提交操作区 -->
        <div class="dialog-footer-actions">
          <button type="button" class="btn-cancel" @click="isAddModalOpen = false">取消</button>
          <button type="submit" class="btn-submit-gold">保存账单</button>
        </div>
      </form>
    </el-dialog>

    <!-- 7. 单日账单明细与快速记账 Drawer 抽屉 (点击日历格子触发) -->
    <el-drawer
      v-model="isDayDetailDrawerOpen"
      :title="selectedDayItem ? `${selectedDayItem.formattedFullDate} (周${selectedDayItem.weekDayName})` : '单日账单明细'"
      direction="btt"
      size="80%"
      class="custom-day-detail-drawer"
      destroy-on-close
      :append-to-body="true"
    >
      <div v-if="selectedDayItem" class="day-detail-drawer-body">
        <!-- 日额小计 Banner -->
        <div class="day-summary-banner" :class="{ 'no-spend': !selectedDayItem.hasRecords }">
          <div class="summary-left">
            <span class="day-status-label">{{ selectedDayItem.hasRecords ? '当日支出小计' : '本日记录' }}</span>
            <span class="day-status-val">
              {{ selectedDayItem.hasRecords ? '¥ ' + Number(selectedDayItem.totalAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) : '暂无记账' }}
            </span>
          </div>
          <button class="btn-add-on-day" @click="openAddModalForDate(selectedDayItem.dateStr)">
            <el-icon><Plus /></el-icon>
            <span>记一笔</span>
          </button>
        </div>

        <!-- 当天账单记录列表 -->
        <div v-if="selectedDayItem.hasRecords" class="day-records-sublist">
          <div v-for="item in selectedDayItem.records" :key="item.id" class="record-item">
            <div class="record-row row-1">
              <div class="cat-title-inline">
                <div class="cat-icon-badge" :style="{ backgroundColor: getCatInfo(item.category).bg }">
                  <span>{{ getCatInfo(item.category).icon }}</span>
                </div>
                <span class="category-name">{{ item.category }}</span>
              </div>
              <div class="item-actions-group">
                <button class="btn-action-icon btn-edit" title="编辑记录" @click="openEditModal(item)">
                  <el-icon><Edit /></el-icon>
                </button>
                <button class="btn-action-icon btn-delete" title="删除记录" @click="deleteRecord(item.id)">
                  <el-icon><Delete /></el-icon>
                </button>
              </div>
            </div>

            <div class="record-row row-2">
              <div class="members-chips-wrap">
                <span
                  v-for="uName in getRecordUsers(item)"
                  :key="uName"
                  class="member-chip"
                  :style="{ backgroundColor: '#ffffff', borderColor: getMemberInfo(uName).color, color: getMemberInfo(uName).color }"
                >
                  {{ uName }}
                </span>
              </div>
              <div class="item-amount">-¥{{ Number(item.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>

            <div class="record-row row-3">
              <span class="desc-text">{{ item.description || '无详细描述' }}</span>
              <span class="time-text">{{ formatTime(item.timestamp) }}</span>
            </div>
          </div>
        </div>

        <!-- 当天无记录提示 -->
        <div v-else class="day-empty-box">
          <div class="empty-icon-text">📝 这一天尚未记账</div>
          <p class="empty-sub-tip">点击右上角的【记一笔】按钮即可在当前选定日期补充记账</p>
        </div>

        <!-- 底部显式关闭按钮 -->
        <div class="day-drawer-footer">
          <button class="btn-drawer-close-full" @click="isDayDetailDrawerOpen = false">
            关闭明细
          </button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { Plus, Search, Delete, Calendar, User, Discount, Edit, Download, Upload, Refresh, Close } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import huabanAddPic from '../pic/huaban-6928070080.webp'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

// 1. 常量定义：四位成员
const MEMBERS = [
  { name: '👩‍🎤胖脆', color: '#f43f5e' },
  { name: '🧑🏻‍💻阿旺', color: '#8b5cf6' },
  { name: '😽宝仔', color: '#3b82f6' },
  { name: '🍓草莓', color: '#10b981' }
]

// 2. 常量定义：八大账单分类 (默认只显示第一个emoji图标)
const CATEGORIES = [
  { name: '饭菜', icon: '🍚', color: '#ef4444', bg: '#fee2e2' },
  { name: '水果零食', icon: '🍎', color: '#f59e0b', bg: '#fef3c7' },
  { name: '日常购物', icon: '🛒', color: '#10b981', bg: '#d1fae5' },
  { name: '水电煤气', icon: '💡', color: '#06b6d4', bg: '#cffaff' },
  { name: '交通/停车/保养', icon: '🚗', color: '#3b82f6', bg: '#dbeafe' },
  { name: '旅行和演出', icon: '✈️', color: '#8b5cf6', bg: '#ede9fe' },
  { name: '人情往来', icon: '🧧', color: '#ec4899', bg: '#fce7f3' },
  { name: '礼物基金', icon: '🎁', color: '#6366f1', bg: '#e0e7ff' }
]

const STORAGE_KEY = 'happylife_family_ledger_records'

// 视图切换模式：'calendar'（按周日历网格，默认） / 'list'（传统列表明细）
const viewMode = ref('calendar')
const currentCalendarMonth = ref(dayjs())
const isDayDetailDrawerOpen = ref(false)
const selectedDayItem = ref(null)

const prevMonth = () => {
  currentCalendarMonth.value = currentCalendarMonth.value.subtract(1, 'month')
}
const nextMonth = () => {
  currentCalendarMonth.value = currentCalendarMonth.value.add(1, 'month')
}
const goTodayMonth = () => {
  currentCalendarMonth.value = dayjs()
}

// 筛选响应式状态
const timeRange = ref('month')
const customDateRange = ref([])
const selectedMember = ref('all')
const selectedCategory = ref('all')
const searchKeyword = ref('')
const isFilterDrawerOpen = ref(false)
const activeStatsTab = ref('consumer')

const timeOptions = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本年', value: 'year' },
  { label: '全部记录', value: 'all' },
  { label: '自定义时间', value: 'custom' }
]

const getGradientColor = (baseColor) => {
  if (baseColor === '#f43f5e') return 'linear-gradient(90deg, #fb7185 0%, #fda4af 100%)' // 蜜桃玫瑰粉
  if (baseColor === '#8b5cf6') return 'linear-gradient(90deg, #a78bfa 0%, #c4b5fd 100%)' // 梦幻薰衣草紫
  if (baseColor === '#3b82f6') return 'linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%)' // 晴空暖水蓝
  if (baseColor === '#10b981') return 'linear-gradient(90deg, #34d399 0%, #6ee7b7 100%)' // 鲜采薄荷草莓绿
  if (baseColor === '#ef4444') return 'linear-gradient(90deg, #f87171 0%, #fca5a5 100%)'
  if (baseColor === '#f59e0b') return 'linear-gradient(90deg, #fbbf24 0%, #fde68a 100%)'
  if (baseColor === '#06b6d4') return 'linear-gradient(90deg, #22d3ee 0%, #a5f3fc 100%)'
  if (baseColor === '#ec4899') return 'linear-gradient(90deg, #f472b6 0%, #fbcfe8 100%)'
  if (baseColor === '#6366f1') return 'linear-gradient(90deg, #818cf8 0%, #c7d2fe 100%)'
  return `linear-gradient(90deg, ${baseColor} 0%, #E8C268 100%)`
}

// 筛选概要计算属性
const getTimeRangeLabel = computed(() => {
  const opt = timeOptions.find(o => o.value === timeRange.value)
  return opt ? opt.label : '时间范围'
})

const getMemberLabel = computed(() => {
  if (selectedMember.value === 'all') return '全部成员'
  return selectedMember.value
})

const getCategoryLabel = computed(() => {
  if (selectedCategory.value === 'all') return '全部分类'
  return selectedCategory.value
})

const resetFilters = () => {
  timeRange.value = 'month'
  customDateRange.value = []
  selectedMember.value = 'all'
  selectedCategory.value = 'all'
  searchKeyword.value = ''
  ElMessage.success('已重置筛选条件')
}

// 账单记录列表数据 (初始化为空，由用户真实录入)
const records = ref([])
const isEditMode = ref(false)
const editingRecordId = ref(null)
const fileInputRef = ref(null)

// 弹窗状态与表单 (支持消费者多选)
const isAddModalOpen = ref(false)
const form = reactive({
  users: [MEMBERS[0].name],
  category: '饭菜',
  amount: '',
  description: '',
  timestamp: ''
})

// 辅助方法：获取记录的消费者列表
const getRecordUsers = (r) => {
  if (Array.isArray(r.users) && r.users.length > 0) {
    return r.users
  }
  if (r.user) {
    return [r.user]
  }
  return [MEMBERS[0].name]
}

// 消费者多选切换
const toggleConsumer = (name) => {
  const index = form.users.indexOf(name)
  if (index > -1) {
    if (form.users.length > 1) {
      form.users.splice(index, 1)
    } else {
      ElMessage.warning('至少需要选择一位消费者')
    }
  } else {
    form.users.push(name)
  }
}

// 全端共享云端存储 Endpoint (优先使用项目原生的 Cloudflare 专属数据库 API，备用高可用通道)
const LOCAL_API_URL = '/api/ledger'
const PRIMARY_CLOUD_URL = 'https://api.npoint.io/34eb8bbbd493f18e95df'
const PENDING_SYNC_KEY = 'happylife_pending_sync'

const isSyncing = ref(false)
const lastSyncTime = ref(null)

const syncStatusText = computed(() => {
  if (isSyncing.value) return '云端同步中...'
  if (lastSyncTime.value) return `多端已同步 (${dayjs(lastSyncTime.value).format('HH:mm')})`
  return '刷新'
})

// 过滤掉所有历史测试数据 (如 rec-1 88元饭菜、seed- 等)
const isTestData = (r) => {
  if (!r) return true
  if (r.id === 'rec-1') return true
  if (r.id && String(r.id).startsWith('seed-')) return true
  if (r.amount === 88 && (r.description === '买菜' || (r.user && r.user.includes('阿旺')))) return true
  return false
}

const POSSIBLE_STORAGE_KEYS = [
  'happylife_family_ledger_records',
  'family_ledger_records',
  'ledger_records',
  'happylife_ledger_records',
  'records'
]

// 本地数据存储与加载 (扫描全部历史 Key 自动全量合并，彻底过滤 mock 测试数据)
const loadRecords = () => {
  try {
    let allMerged = []
    POSSIBLE_STORAGE_KEYS.forEach(key => {
      try {
        const raw = localStorage.getItem(key)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            allMerged = mergeRecords(allMerged, parsed)
          }
        }
      } catch (e) {}
    })

    const cleanRecords = allMerged
      .filter(r => !isTestData(r))
      .map(r => {
        if (r.category === '水电日常') return { ...r, category: '水电煤气' }
        if (r.category === '交通') return { ...r, category: '交通/停车/保养' }
        return r
      })

    records.value = cleanRecords
    saveToStorage()
  } catch (e) {
    records.value = []
  }
}

const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
  } catch (e) {
    ElMessage.error('数据本地存储失败，可能超出浏览器存储限制')
  }
}

// 合并本地与云端账单 (按 id 去重，自动过滤测试数据，确保多端增删改均精准实时)
const mergeRecords = (localList, cloudList) => {
  const map = new Map()

  if (Array.isArray(cloudList)) {
    cloudList.forEach(item => {
      if (item && item.id && !isTestData(item)) {
        map.set(item.id, item)
      }
    })
  }

  if (Array.isArray(localList)) {
    localList.forEach(item => {
      if (item && item.id && !isTestData(item)) {
        if (!map.has(item.id)) {
          map.set(item.id, item)
        } else {
          const existing = map.get(item.id)
          map.set(item.id, { ...existing, ...item })
        }
      }
    })
  }

  return Array.from(map.values()).sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf())
}

// 向云端推送最新全量账单
const syncToCloud = async (recordsToPush) => {
  try {
    isSyncing.value = true
    const payload = recordsToPush || records.value
    let success = false

    // 1. 尝试原生 Cloudflare API
    try {
      const res = await axios.post(LOCAL_API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 6000
      })
      if (res.data && res.data.success) {
        success = true
      }
    } catch (e) {}

    // 2. 尝试高可用备用 API
    if (!success) {
      try {
        await axios.post(PRIMARY_CLOUD_URL, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 8000
        })
        success = true
      } catch (e) {}
    }

    if (success) {
      lastSyncTime.value = new Date()
      localStorage.removeItem(PENDING_SYNC_KEY)
    } else {
      localStorage.setItem(PENDING_SYNC_KEY, 'true')
    }
  } catch (err) {
    localStorage.setItem(PENDING_SYNC_KEY, 'true')
  } finally {
    isSyncing.value = false
  }
}

// 从云端拉取最新账单并合并本地
const syncFromCloud = async (showNotification = false) => {
  if (isSyncing.value) return
  try {
    isSyncing.value = true
    let cloudData = null

    // 1. 优先尝试从原生 Cloudflare 数据库拉取
    try {
      const res = await axios.get(LOCAL_API_URL, { timeout: 6000 })
      if (res.data && Array.isArray(res.data)) {
        cloudData = res.data
      }
    } catch (e) {}

    // 2. 尝试从备用云服务端拉取
    if (cloudData === null) {
      try {
        const response = await axios.get(PRIMARY_CLOUD_URL, { timeout: 8000 })
        let data = response.data
        if (typeof data === 'string') {
          try { data = JSON.parse(data) } catch (e) {}
        }
        if (Array.isArray(data)) {
          cloudData = data
        }
      } catch (e) {}
    }
    
    if (Array.isArray(cloudData)) {
      const merged = mergeRecords(records.value, cloudData)
      const hasNew = JSON.stringify(merged) !== JSON.stringify(records.value) || JSON.stringify(merged) !== JSON.stringify(cloudData)
      
      records.value = merged
      saveToStorage()

      const isPending = localStorage.getItem(PENDING_SYNC_KEY) === 'true'
      // 只要合并后的账单与云端不一致（即本地有云端没有的数据），或有未完成的同步标记，就强制推送到云端
      if (JSON.stringify(merged) !== JSON.stringify(cloudData) || isPending) {
        await syncToCloud(merged)
      }

      lastSyncTime.value = new Date()
      if (showNotification) {
        ElMessage.success(hasNew ? '已成功同步最新多端账单数据！' : '当前已是最新云端共享账本数据')
      }
    } else {
      if (showNotification) {
        ElMessage.warning('网络同步暂未就绪，已读取本地暂存数据')
      }
    }
  } catch (err) {
    if (showNotification) {
      ElMessage.warning('网络同步暂未就绪，已读取本地暂存数据')
    }
  } finally {
    isSyncing.value = false
  }
}

const manualCloudSync = () => {
  syncFromCloud(true)
}

// 获取安全的单图标 emoji
const getFirstEmoji = (iconStr) => {
  if (!iconStr) return '💰'
  const parts = iconStr.trim().split(/\s+/)
  return parts[0] || '💰'
}

const getCatInfo = (catName) => {
  let targetName = catName
  if (targetName === '水电日常') targetName = '水电煤气'
  if (targetName === '交通') targetName = '交通/停车/保养'
  
  const found = CATEGORIES.find(c => c.name === targetName)
  if (found) {
    return {
      ...found,
      icon: getFirstEmoji(found.icon)
    }
  }
  return { name: catName, icon: '💰', color: '#E8C268', bg: 'rgba(232,194,104,0.15)' }
}

const getMemberInfo = (memberName) => {
  return MEMBERS.find(m => m.name === memberName) || { name: memberName, color: '#64748b' }
}

const formatTime = (ts) => {
  return dayjs(ts).format('HH:mm')
}

// 过滤后的账单列表
const filteredRecords = computed(() => {
  return records.value.filter(r => {
    const rDate = dayjs(r.timestamp)
    const now = dayjs()

    if (timeRange.value === 'week') {
      if (!rDate.isSame(now, 'week')) return false
    } else if (timeRange.value === 'month') {
      if (!rDate.isSame(now, 'month')) return false
    } else if (timeRange.value === 'year') {
      if (!rDate.isSame(now, 'year')) return false
    } else if (timeRange.value === 'custom') {
      if (customDateRange.value && customDateRange.value.length === 2) {
        const start = dayjs(customDateRange.value[0]).startOf('day')
        const end = dayjs(customDateRange.value[1]).endOf('day')
        if (rDate.isBefore(start) || rDate.isAfter(end)) return false
      }
    }

    if (selectedMember.value !== 'all') {
      const uList = getRecordUsers(r)
      if (!uList.includes(selectedMember.value)) {
        return false
      }
    }

    if (selectedCategory.value !== 'all' && r.category !== selectedCategory.value) {
      return false
    }

    if (searchKeyword.value.trim()) {
      const kw = searchKeyword.value.trim().toLowerCase()
      const desc = (r.description || '').toLowerCase()
      const uList = getRecordUsers(r).join(' ').toLowerCase()
      const cat = (r.category || '').toLowerCase()
      if (!desc.includes(kw) && !uList.includes(kw) && !cat.includes(kw)) {
        return false
      }
    }

    return true
  }).sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf())
})

const totalAmount = computed(() => {
  return filteredRecords.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

const formattedTotalAmount = computed(() => {
  return totalAmount.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const topCategoryName = computed(() => {
  if (categoryStats.value.length === 0) return '无记录'
  return categoryStats.value[0].name
})

const topMemberName = computed(() => {
  if (memberStats.value.length === 0) return '无记录'
  return memberStats.value[0].name
})

const memberStats = computed(() => {
  const total = totalAmount.value || 1
  const map = {}
  MEMBERS.forEach(m => { map[m.name] = 0 })

  filteredRecords.value.forEach(r => {
    const uList = getRecordUsers(r)
    const share = Number(r.amount || 0) / (uList.length || 1)
    uList.forEach(u => {
      map[u] = (map[u] || 0) + share
    })
  })

  return MEMBERS.map(m => {
    const amt = map[m.name] || 0
    return {
      name: m.name,
      color: m.color,
      amount: amt,
      percentage: ((amt / total) * 100).toFixed(1)
    }
  }).sort((a, b) => b.amount - a.amount)
})

const categoryStats = computed(() => {
  const total = totalAmount.value || 1
  const map = {}
  CATEGORIES.forEach(c => { map[c.name] = 0 })

  filteredRecords.value.forEach(r => {
    map[r.category] = (map[r.category] || 0) + Number(r.amount || 0)
  })

  return CATEGORIES.map(c => {
    const amt = map[c.name] || 0
    return {
      name: c.name,
      icon: c.icon,
      color: c.color,
      amount: amt,
      percentage: ((amt / total) * 100).toFixed(1)
    }
  }).sort((a, b) => b.amount - a.amount)
})

const groupedRecords = computed(() => {
  const groups = {}

  filteredRecords.value.forEach(r => {
    const dStr = dayjs(r.timestamp).format('YYYY-MM-DD')
    if (!groups[dStr]) {
      groups[dStr] = {
        date: dStr,
        formattedDate: dayjs(dStr).format('YYYY年MM月DD日 dddd'),
        total: 0,
        items: []
      }
    }
    groups[dStr].items.push(r)
    groups[dStr].total += Number(r.amount || 0)
  })

  return Object.values(groups).sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
})

// 核心计算属性：按周划分日历阵列 (一行一周，每行 7 个格子)
const calendarWeeks = computed(() => {
  const targetMonth = currentCalendarMonth.value
  const startOfMonth = targetMonth.startOf('month')
  const endOfMonth = targetMonth.endOf('month')
  
  // 星期计算 (1=周一 ... 7/0=周日)
  const firstDayOfWeek = startOfMonth.day()
  const diffToMon = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  let currentPointer = startOfMonth.subtract(diffToMon, 'day')
  
  const lastDayOfWeek = endOfMonth.day()
  const diffToSun = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek
  const endPointer = endOfMonth.add(diffToSun, 'day')
  
  const weeks = []
  let currentWeek = []
  
  while (currentPointer.isBefore(endPointer) || currentPointer.isSame(endPointer, 'day')) {
    const dStr = currentPointer.format('YYYY-MM-DD')
    const isCurrentMonth = currentPointer.isSame(targetMonth, 'month')
    
    // 该日期的全部符合条件账单
    const dayRecords = filteredRecords.value.filter(r => dayjs(r.timestamp).format('YYYY-MM-DD') === dStr)
    
    let dayExpense = 0
    let dayIncome = 0
    dayRecords.forEach(item => {
      const amt = Number(item.amount || 0)
      if (item.type === 'income' || item.isIncome || item.category === '收入' || amt < 0) {
        dayIncome += Math.abs(amt)
      } else {
        dayExpense += amt
      }
    })
    
    const isIncomeDay = dayIncome > dayExpense
    const displayAmount = isIncomeDay ? dayIncome : dayExpense

    currentWeek.push({
      dateStr: dStr,
      dayNum: currentPointer.date(),
      formattedFullDate: currentPointer.format('YYYY年MM月DD日'),
      weekDayName: ['日', '一', '二', '三', '四', '五', '六'][currentPointer.day()],
      isToday: currentPointer.isSame(dayjs(), 'day'),
      isCurrentMonth,
      records: dayRecords,
      hasRecords: dayRecords.length > 0,
      totalAmount: displayAmount,
      isIncome: isIncomeDay
    })
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    
    currentPointer = currentPointer.add(1, 'day')
  }
  
  return weeks
})

// 刷新当前打开的单日明细抽屉数据
const refreshSelectedDayItem = (dateStr) => {
  if (!selectedDayItem.value) return
  const targetDate = dateStr || selectedDayItem.value.dateStr
  const updatedDayRecords = filteredRecords.value.filter(r => dayjs(r.timestamp).format('YYYY-MM-DD') === targetDate)
  const updatedTotal = updatedDayRecords.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  
  selectedDayItem.value = {
    ...selectedDayItem.value,
    dateStr: targetDate,
    formattedFullDate: dayjs(targetDate).format('YYYY年MM月DD日'),
    weekDayName: ['日', '一', '二', '三', '四', '五', '六'][dayjs(targetDate).day()],
    records: updatedDayRecords,
    hasRecords: updatedDayRecords.length > 0,
    totalAmount: updatedTotal
  }
}

const openDayDetail = (dayItem) => {
  selectedDayItem.value = dayItem
  isDayDetailDrawerOpen.value = true
}

const openAddModalForDate = (dateStr) => {
  isEditMode.value = false
  editingRecordId.value = null
  form.users = selectedMember.value !== 'all' ? [selectedMember.value] : [MEMBERS[0].name]
  form.category = selectedCategory.value !== 'all' ? selectedCategory.value : '饭菜'
  form.amount = ''
  form.description = ''
  
  const targetDate = dateStr || dayjs().format('YYYY-MM-DD')
  const currentTimeStr = dayjs().format('HH:mm:ss')
  form.timestamp = `${targetDate} ${currentTimeStr}`
  
  isAddModalOpen.value = true
}

const openAddModal = () => {
  openAddModalForDate(dayjs().format('YYYY-MM-DD'))
}

const openEditModal = (item) => {
  isEditMode.value = true
  editingRecordId.value = item.id
  form.users = [...getRecordUsers(item)]
  form.category = item.category
  form.amount = item.amount
  form.description = item.description || ''
  form.timestamp = item.timestamp
  isAddModalOpen.value = true
}

const addQuickAmount = (val) => {
  const current = Number(form.amount || 0)
  form.amount = Number((current + val).toFixed(2))
}

const saveRecord = async () => {
  if (!form.amount || Number(form.amount) <= 0) {
    ElMessage.warning('请输入有效的支出金额')
    return
  }
  if (!form.users || form.users.length === 0) {
    ElMessage.warning('请选择至少一位消费者')
    return
  }

  const userLabel = form.users.join(' & ')
  const formattedAmt = Number(Number(form.amount).toFixed(2))
  const formattedDesc = form.description.trim() || `${userLabel}记录的${form.category}支出`
  const formattedTime = form.timestamp || dayjs().format('YYYY-MM-DD HH:mm:ss')

  if (isEditMode.value && editingRecordId.value) {
    const idx = records.value.findIndex(r => r.id === editingRecordId.value)
    if (idx !== -1) {
      records.value[idx] = {
        ...records.value[idx],
        user: userLabel,
        users: [...form.users],
        category: form.category,
        amount: formattedAmt,
        description: formattedDesc,
        timestamp: formattedTime
      }
      saveToStorage()
      await syncToCloud()
      refreshSelectedDayItem(dayjs(formattedTime).format('YYYY-MM-DD'))
      ElMessage.success('账单记录已成功更新')
    }
  } else {
    const newRecord = {
      id: 'rec-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      user: userLabel,
      users: [...form.users],
      category: form.category,
      amount: formattedAmt,
      description: formattedDesc,
      timestamp: formattedTime
    }
    records.value.unshift(newRecord)
    saveToStorage()
    await syncToCloud()
    refreshSelectedDayItem(dayjs(formattedTime).format('YYYY-MM-DD'))
    ElMessage.success('成功记入一笔账单')
  }

  isAddModalOpen.value = false
}

const deleteRecord = (id) => {
  ElMessageBox.confirm('确定要删除这条账单记录吗？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const targetItem = records.value.find(r => r.id === id)
    const targetDateStr = targetItem ? dayjs(targetItem.timestamp).format('YYYY-MM-DD') : null
    records.value = records.value.filter(r => r.id !== id)
    saveToStorage()
    await syncToCloud()
    if (targetDateStr) refreshSelectedDayItem(targetDateStr)
    ElMessage.success('账单已删除')
  }).catch(() => {})
}

const clearAllRecords = () => {
  if (records.value.length === 0) {
    ElMessage.info('当前账本已是空状态')
    return
  }
  ElMessageBox.confirm('确定要清空所有账单数据吗？此操作无法撤销，建议操作前先点击【导出备份】保存数据。', '提示', {
    confirmButtonText: '确定清空',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    records.value = []
    saveToStorage()
    await syncToCloud()
    ElMessage.success('已清空所有账单，随时开始记录正式数据')
  }).catch(() => {})
}

const exportJSON = () => {
  if (records.value.length === 0) {
    ElMessage.info('当前暂无账单数据可导出')
    return
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records.value, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", `family_ledger_${dayjs().format('YYYYMMDD_HHmmss')}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
  ElMessage.success('账单备份已成功导出')
}

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
    fileInputRef.value.click()
  }
}

const handleImportFile = (event) => {
  const file = event.target.files && event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result)
      if (!Array.isArray(imported)) {
        ElMessage.error('导入失败：数据格式不正确，需为 JSON 账单数组')
        return
      }
      const validRecords = imported.filter(r => r && r.amount && r.category)
      if (validRecords.length === 0) {
        ElMessage.warning('文件内未找到有效的账单记录')
        return
      }

      ElMessageBox.confirm(`读取到 ${validRecords.length} 笔有效账单，请选择导入模式：`, '导入账本备份', {
        distinguishCancelAndClose: true,
        confirmButtonText: '覆盖现有账本',
        cancelButtonText: '合并至现有账本',
        type: 'info'
      }).then(() => {
        records.value = validRecords
        saveToStorage()
        ElMessage.success(`已成功覆盖导入 ${validRecords.length} 笔账单`)
      }).catch((action) => {
        if (action === 'cancel') {
          const existingIds = new Set(records.value.map(r => r.id))
          let addedCount = 0
          validRecords.forEach(r => {
            if (!r.id) r.id = 'rec-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
            if (!existingIds.has(r.id)) {
              records.value.unshift(r)
              existingIds.add(r.id)
              addedCount++
            }
          })
          saveToStorage()
          syncToCloud()
          ElMessage.success(`成功合并 ${addedCount} 笔新账单`)
        }
      })
    } catch (err) {
      ElMessage.error('解析 JSON 文件失败，请检查文件格式')
    }
  }
  reader.readAsText(file)
}

let syncTimer = null

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    syncFromCloud(false)
  }
}

onMounted(() => {
  loadRecords()
  syncFromCloud(false)
  
  // 每 20 秒自动轮询云端同步，实现多端无感同步
  syncTimer = setInterval(() => {
    syncFromCloud(false)
  }, 20000)

  // 页面切回前台时自动触发现发同步
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  if (syncTimer) clearInterval(syncTimer)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.ledger-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 10px 60px 10px;
  overflow-x: hidden;
}

/* 1. 顶栏总览卡片 (#0D2B2E 深墨绿 & #E8C268 鎏金) */
.overview-header-card {
  background: linear-gradient(135deg, #0D2B2E 0%, #153e42 60%, #1c5257 100%);
  color: #fff;
  border-radius: 24px;
  padding: 22px 24px;
  border: 1.5px solid rgba(232, 194, 104, 0.4);
  box-shadow: 0 16px 36px rgba(13, 43, 46, 0.35);
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.overview-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.overview-left-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.summary-title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}

.badge-tag {
  background: rgba(255, 255, 255, 0.12);
  border: none !important;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 13.5px;
  font-weight: 700;
  color: #E8C268;
}

.cloud-sync-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.12);
  border: none !important;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  color: #E8C268;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.cloud-sync-chip:hover {
  background: rgba(255, 255, 255, 0.2);
}

.cloud-sync-chip.syncing {
  opacity: 0.85;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.summary-title-wrap h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.overview-right-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-hero-pic {
  height: 95px;
  width: auto;
  max-width: 140px;
  object-fit: contain;
  cursor: pointer;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45));
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.35s ease;
  user-select: none;
}

.header-hero-pic:hover {
  transform: scale(1.1) rotate(3deg);
  filter: drop-shadow(0 12px 24px rgba(232, 194, 104, 0.6));
}

.header-hero-pic:active {
  transform: scale(0.95);
}

.btn-primary-add {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E8C268 0%, #d4a73b 100%);
  color: #0D2B2E;
  border: none;
  border-radius: 20px;
  padding: 9px 24px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(232, 194, 104, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(232, 194, 104, 0.5);
}

.inline-empty-btn {
  margin-top: 10px;
}

/* 2. 操作快捷工具栏 */
.action-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 14px;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.action-btn.btn-add {
  background: linear-gradient(135deg, #E8C268 0%, #d4a73b 100%);
  color: #0D2B2E;
  box-shadow: 0 4px 12px rgba(232, 194, 104, 0.3);
}

.action-btn.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(232, 194, 104, 0.45);
}

.action-btn.btn-filter {
  background: #ffffff;
  color: #0D2B2E;
  border-color: #cbd5e1;
}

.action-btn.btn-filter:hover {
  background: #f8fafc;
  border-color: #0D2B2E;
}

.action-btn.btn-export {
  background: #f0fdf4;
  color: #166534;
  border-color: #bbf7d0;
}

.action-btn.btn-export:hover {
  background: #dcfce7;
}

.action-btn.btn-import {
  background: #eff6ff;
  color: #1e40af;
  border-color: #bfdbfe;
}

.action-btn.btn-import:hover {
  background: #dbeafe;
}

.action-btn.btn-clear {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
  margin-left: auto;
}

.action-btn.btn-clear:hover {
  background: #fee2e2;
}

/* 记录操作按钮组 */
.item-actions-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-action-icon {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-action-icon.btn-edit {
  color: #64748b;
}

.btn-action-icon.btn-edit:hover {
  background-color: #f1f5f9;
  color: #3b82f6;
}

.btn-action-icon.btn-delete {
  color: #94a3b8;
}

.btn-action-icon.btn-delete:hover {
  background-color: #fef2f2;
  color: #ef4444;
}

.summary-amount-box {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 14px;
  margin-top: 8px;
  margin-left: 8px;
}

.currency-symbol {
  font-size: 2rem;
  font-weight: 900;
  color: #E8C268;
}

.amount-num {
  font-size: 3rem;
  font-weight: 900;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  color: #E8C268;
  letter-spacing: -1px;
  line-height: 1;
}

.summary-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed rgba(232, 194, 104, 0.25);
  padding-top: 14px;
  margin-top: 12px;
  width: 100%;
}

.meta-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 11px;
  color: rgba(232, 194, 104, 0.75);
}

.meta-val {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}



.btn-query-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0D2B2E;
  color: #E8C268;
  border: 1.5px solid #E8C268;
  border-radius: 16px;
  padding: 8px 18px;
  font-size: 13.5px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(13, 43, 46, 0.25);
  flex-shrink: 0;
  transition: transform 0.2s;
}

.btn-query-trigger:hover {
  transform: translateY(-1px);
}

/* 3. 筛选抽屉 Modal (custom-filter-drawer) */
:deep(.custom-filter-drawer) {
  border-top-left-radius: 24px !important;
  border-top-right-radius: 24px !important;
  background: #ffffff !important;
  max-height: 85vh !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.custom-filter-drawer .el-drawer__header) {
  margin-bottom: 0 !important;
  padding: 16px 20px !important;
  border-bottom: 1.5px solid #e2e8f0 !important;
  color: #0D2B2E !important;
  font-weight: 900 !important;
  flex-shrink: 0 !important;
}

:deep(.custom-filter-drawer .el-drawer__title) {
  color: #0D2B2E !important;
  font-weight: 900 !important;
  font-size: 1.15rem !important;
}

:deep(.custom-filter-drawer .el-drawer__close-btn) {
  font-size: 22px !important;
  color: #64748b !important;
  padding: 8px !important;
  background: #f1f5f9 !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
}
:deep(.custom-filter-drawer .el-drawer__close-btn:hover) {
  background: #e2e8f0 !important;
  color: #0f172a !important;
}

:deep(.custom-filter-drawer .el-drawer__body) {
  padding: 18px 20px !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
  touch-action: pan-y !important;
  flex: 1 !important;
}

:deep(.custom-filter-drawer .el-drawer__footer) {
  padding: 0 !important;
  flex-shrink: 0 !important;
}

.drawer-filter-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.drawer-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drawer-group-label {
  font-size: 13.5px;
  font-weight: 900;
  color: #0D2B2E;
}

.drawer-pills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.drawer-pill-btn {
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  color: #1e293b;
  border-radius: 14px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}

.drawer-pill-btn.active {
  background: #0D2B2E;
  border-color: #E8C268;
  color: #E8C268;
  box-shadow: 0 4px 12px rgba(13, 43, 46, 0.25);
}

.drawer-cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.drawer-cat-btn {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 800;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s;
}

.drawer-cat-btn.active {
  background: #0D2B2E;
  border-color: #E8C268;
  color: #E8C268;
}

.drawer-footer-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
  padding: 14px 20px;
  border-top: 1px dashed #e2e8f0;
  background: #ffffff;
}

.btn-drawer-reset {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-drawer-close-inline {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  color: #64748b;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-drawer-close-inline:hover {
  background: #f8fafc;
  color: #0f172a;
}

.btn-drawer-apply {
  background: linear-gradient(135deg, #0D2B2E 0%, #174e54 100%);
  color: #E8C268;
  border: 1.5px solid #E8C268;
  border-radius: 12px;
  padding: 10px 30px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(13, 43, 46, 0.3);
}

/* 4. 统计分析与页签切换 (温馨甜蜜家庭风) */
.sweet-stats-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(232, 194, 104, 0.35);
  border-radius: 24px;
  padding: 20px 22px;
  box-shadow: 0 10px 30px rgba(13, 43, 46, 0.05);
  margin-bottom: 22px;
}

.stats-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stats-section-title {
  font-size: 15px;
  font-weight: 800;
  color: #0D2B2E;
  margin: 0;
}

.stats-tabs-header {
  display: inline-flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 3px;
  border: 1px solid #e2e8f0;
}

.stats-tab-btn {
  border: none;
  background: transparent;
  padding: 5px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stats-tab-btn:hover {
  color: #0D2B2E;
}

.stats-tab-btn.active {
  background: #ffffff;
  color: #0D2B2E;
  font-weight: 800;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.sweet-stats-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sweet-item-line {
  padding: 12px 0;
  transition: background 0.2s;
}

.sweet-item-line:last-child {
  border-bottom: none;
}

.sweet-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sweet-name-col {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sweet-rank-tag {
  font-size: 14px;
}

.sweet-color-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.sweet-cat-emoji {
  font-size: 17px;
  line-height: 1;
}

.sweet-item-name {
  font-size: 13.5px;
  font-weight: 800;
  color: #0D2B2E;
}

.sweet-metrics-col {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sweet-amount {
  font-size: 14px;
  font-weight: 900;
  font-family: SFMono-Regular, Consolas, monospace;
  color: #0D2B2E;
}

.sweet-percent-chip {
  font-size: 11.5px;
  font-weight: 900;
  font-family: SFMono-Regular, Consolas, monospace;
  padding: 2px 9px;
  border-radius: 12px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

/* 温润果冻胶囊条 Track */
.sweet-pill-track {
  width: 100%;
  height: 12px;
  background: #f8fafc;
  border-radius: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.sweet-pill-fill {
  height: 100%;
  border-radius: 20px;
  position: relative;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 蜜桃糖果感软揉顶斑 */
.sweet-pill-fill::after {
  content: '';
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.9);
}

/* 5. 账单明细列表 */
.records-list-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 20px;
  border: 1.5px solid rgba(13, 43, 46, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
}

.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;
}

.section-title-bar h3 {
  font-size: 15px;
  font-weight: 800;
  color: #0D2B2E;
  margin: 0;
}

.btn-title-filter {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0D2B2E;
  color: #E8C268;
  border: 1.5px solid #E8C268;
  border-radius: 16px;
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(13, 43, 46, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-title-filter:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(13, 43, 46, 0.35);
}

.grouped-records-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.date-group-card {
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
  background: #fff;
}

.date-group-header {
  background: #f8fafc;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
  border-bottom: 1px solid #f1f5f9;
}

.date-total {
  font-family: SFMono-Regular, Consolas, monospace;
  color: #0D2B2E;
  font-weight: 800;
}

.record-items-wrapper {
  display: flex;
  flex-direction: column;
}

.record-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.2s;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item:hover {
  background: #f0fdf4;
}

.record-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.cat-title-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cat-icon-badge {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.category-name {
  font-size: 14.5px;
  font-weight: 800;
  color: #0D2B2E;
}

.row-2 {
  min-height: 26px;
}

.members-chips-wrap {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.member-chip {
  background: #ffffff;
  border: 1.5px solid #64748b;
  font-size: 11.5px;
  font-weight: 800;
  padding: 2px 9px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
}

.item-amount {
  font-size: 1.15rem;
  font-weight: 900;
  font-family: SFMono-Regular, Consolas, monospace;
  color: #0D2B2E;
}

.row-3 {
  margin-top: 2px;
}

.desc-text {
  font-size: 12px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.time-text {
  font-size: 12px;
  color: #94a3b8;
  flex-shrink: 0;
  font-family: SFMono-Regular, Consolas, monospace;
}

.btn-delete {
  background: transparent;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.2s;
}

.btn-delete:hover {
  color: #ef4444;
}

/* 6. 弹窗与表单 (消费者多选支持) */
:deep(.custom-add-ledger-dialog) {
  top: 4vh !important;
  margin: 0 auto !important;
  max-height: 88vh !important;
  display: flex !important;
  flex-direction: column !important;
  border-radius: 24px !important;
  border: 2px solid #0D2B2E !important;
  background: #ffffff !important;
  color: #1e293b !important;
  box-shadow: 0 20px 50px rgba(13, 43, 46, 0.25) !important;
  overflow: hidden !important;
}

:deep(.custom-add-ledger-dialog .el-dialog__header) {
  margin-right: 0 !important;
  padding: 16px 20px !important;
  background: #f8fafc !important;
  border-bottom: 1.5px solid #e2e8f0 !important;
}

:deep(.custom-add-ledger-dialog .el-dialog__title) {
  color: #0D2B2E !important;
  font-weight: 900 !important;
  font-size: 1.2rem !important;
}

:deep(.custom-add-ledger-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: #0D2B2E !important;
  font-size: 18px !important;
}

:deep(.custom-add-ledger-dialog .el-dialog__body) {
  flex: 1 !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
  touch-action: pan-y !important;
  padding: 18px 20px !important;
  background: #ffffff !important;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-with-tip {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.sub-tip {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.form-label {
  font-size: 13.5px;
  font-weight: 800;
  color: #0D2B2E;
  letter-spacing: 0.3px;
}

.member-selector-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.member-select-btn {
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  color: #1e293b;
  border-radius: 12px;
  padding: 9px 0;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}

.member-select-btn:hover {
  border-color: #0D2B2E;
}

.category-selector-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.cat-select-btn {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-select-btn:hover {
  border-color: #0D2B2E;
}

.cat-select-btn.selected {
  background: #0D2B2E;
  border-color: #E8C268;
  box-shadow: 0 6px 16px rgba(13, 43, 46, 0.3);
  transform: scale(1.02);
}

.cat-select-btn.selected .cat-btn-name {
  color: #E8C268;
  font-weight: 900;
}

.cat-btn-icon {
  font-size: 20px;
}

.cat-btn-name {
  font-size: 11px;
  font-weight: 800;
  color: #1e293b;
  text-align: center;
  word-break: break-all;
  line-height: 1.25;
}

.amount-input-box {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1.5px solid #475569;
  border-radius: 14px;
  padding: 4px 14px;
  transition: border-color 0.2s;
}

.amount-input-box:focus-within {
  border-color: #0D2B2E;
  box-shadow: 0 0 0 3px rgba(13, 43, 46, 0.15);
  background: #ffffff;
}

.amount-input-box .symbol {
  font-size: 1.6rem;
  font-weight: 900;
  color: #0D2B2E;
  margin-right: 6px;
}

.amount-field {
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.8rem;
  font-weight: 900;
  font-family: SFMono-Regular, Consolas, monospace;
  width: 100%;
  color: #0D2B2E;
}

.quick-amounts-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.quick-amt-btn {
  flex: 1;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 0;
  font-size: 12.5px;
  font-weight: 800;
  color: #0D2B2E;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-amt-btn:hover {
  background: #0D2B2E;
  color: #E8C268;
}

.quick-amt-btn.reset {
  color: #ef4444;
  background: #fee2e2;
  border-color: #fca5a5;
}

.quick-amt-btn.reset:hover {
  background: #ef4444;
  color: #ffffff;
}

.dialog-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed #e2e8f0;
}

.btn-cancel {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  border-radius: 12px;
  padding: 9px 20px;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-submit-gold {
  background: linear-gradient(135deg, #0D2B2E 0%, #174e54 100%);
  color: #E8C268;
  border: 1.5px solid #E8C268;
  border-radius: 12px;
  padding: 9px 28px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(13, 43, 46, 0.3);
  transition: transform 0.2s;
}

.btn-submit-gold:hover {
  transform: translateY(-1px);
}


/* 移动端与PC双端响应式兼容 */
@media (max-width: 768px) {
  .ledger-container {
    padding: 6px 6px 80px 6px;
  }
  .overview-header-card {
    padding: 16px;
  }
  .overview-top-row {
    gap: 12px;
  }
  .amount-num {
    font-size: 2.2rem;
  }
  .header-hero-pic {
    height: 85px;
    max-width: 120px;
  }
  .summary-meta-row {
    gap: 12px;
  }
  .meta-label {
    font-size: 10px;
  }
  .meta-val {
    font-size: 11.5px;
  }
  .stats-breakdown-grid {
    grid-template-columns: 1fr;
  }
  .drawer-cat-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .category-selector-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .desc-text {
    max-width: 150px;
  }
}

/* ==================== 8. 周日历网格模式专属样式 (一行一周，每行7格子) ==================== */
.title-left-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.view-mode-toggle {
  display: inline-flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}
.mode-toggle-btn {
  border: none;
  background: transparent;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}
.mode-toggle-btn.active {
  background: #ffffff;
  color: #0D2B2E;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.calendar-view-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  margin-bottom: 20px;
}

.calendar-month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #f1f5f9;
}
.month-text {
  font-size: 17px;
  font-weight: 900;
  color: #0D2B2E;
}
.nav-btn-group {
  display: flex;
  gap: 6px;
}
.nav-btn {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}
.nav-btn:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #0f172a;
}
.nav-btn.today {
  background: rgba(13, 43, 46, 0.08);
  border-color: rgba(13, 43, 46, 0.2);
  color: #0D2B2E;
}

.calendar-weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  text-align: center;
  margin-bottom: 8px;
}
.weekday-col {
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  padding: 6px 0;
  background: #f1f5f9;
  border-radius: 8px;
}

.calendar-grid-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.calendar-week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.day-cell {
  min-height: 76px;
  border-radius: 10px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
}
.day-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* 没有花钱状态 */
.day-cell.no-spending {
  background: #f8fafc;
  border-color: #e2e8f0;
}
/* 有消费发生状态 */
.day-cell.has-spending {
  background: #fff1f2;
  border-color: #fecdd3;
}
/* 今天高亮 */
.day-cell.is-today {
  border: 2px solid #8b5cf6 !important;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
}
/* 非本月暗化 */
.day-cell.other-month {
  opacity: 0.4;
}

.cell-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.day-date-num {
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
}
.day-weekday-lbl {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
}

.cell-body-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  flex: 1;
}

/* “没花钱”胶囊文案 */
.cell-no-spend-tag {
  font-size: 11px;
  font-weight: 800;
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 3px 6px;
  border-radius: 6px;
  white-space: nowrap;
}

.cell-spend-amount {
  font-size: 12px;
  font-weight: 900;
  color: #be123c;
  white-space: nowrap;
}
.cell-spend-amount.is-income {
  color: #059669;
}
.cell-spend-count {
  font-size: 10px;
  font-weight: 600;
  color: #9f1239;
  opacity: 0.8;
}

/* 单日账单明细 Drawer 抽屉深度覆盖与流动滚动强化 */
:deep(.custom-day-detail-drawer) {
  border-top-left-radius: 24px !important;
  border-top-right-radius: 24px !important;
  max-height: 85vh !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.custom-day-detail-drawer .el-drawer__header) {
  margin-bottom: 0 !important;
  padding: 16px 20px !important;
  border-bottom: 1px solid #f1f5f9 !important;
  flex-shrink: 0 !important;
}

:deep(.custom-day-detail-drawer .el-drawer__title) {
  font-weight: 800 !important;
  color: #0f172a !important;
  font-size: 16px !important;
}

:deep(.custom-day-detail-drawer .el-drawer__close-btn) {
  font-size: 22px !important;
  color: #64748b !important;
  padding: 8px !important;
  background: #f1f5f9 !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
}
:deep(.custom-day-detail-drawer .el-drawer__close-btn:hover) {
  background: #e2e8f0 !important;
  color: #0f172a !important;
}

:deep(.custom-day-detail-drawer .el-drawer__body) {
  padding: 16px 20px 24px 20px !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
  touch-action: pan-y !important;
  flex: 1 !important;
}

.day-detail-drawer-body {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
}

.day-summary-banner {
  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
  border: 1px solid #fecdd3;
  padding: 14px 18px;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.day-summary-banner.no-spend {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #bbf7d0;
}

.summary-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.day-status-label {
  font-size: 11.5px;
  color: #64748b;
  font-weight: 600;
}
.day-status-val {
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
}

.summary-right-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-add-on-day {
  background: #0D2B2E;
  color: #E8C268;
  border: 1px solid #E8C268;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(13, 43, 46, 0.2);
}
.btn-add-on-day:hover {
  background: #174e54;
}

.btn-close-day-drawer {
  background: #ffffff;
  color: #64748b;
  border: 1px solid #cbd5e1;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}
.btn-close-day-drawer:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.day-records-sublist {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 10px;
}

.day-drawer-footer {
  margin-top: auto;
  padding-top: 16px;
  padding-bottom: 10px;
}

.btn-drawer-close-full {
  width: 100%;
  padding: 12px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-drawer-close-full:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.day-empty-box {
  text-align: center;
  padding: 30px 10px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}
.empty-icon-text {
  font-size: 16px;
  font-weight: 800;
  color: #059669;
  margin-bottom: 6px;
}
.empty-sub-tip {
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 600px) {
  .day-cell {
    min-height: 64px;
    padding: 4px 2px;
  }
  .day-date-num {
    font-size: 11px;
  }
  .day-weekday-lbl {
    font-size: 9px;
  }
  .cell-no-spend-tag {
    font-size: 9.5px;
    padding: 2px 3px;
  }
  .cell-spend-amount {
    font-size: 10.5px;
  }
  .cell-spend-count {
    font-size: 9px;
  }
}
</style>
