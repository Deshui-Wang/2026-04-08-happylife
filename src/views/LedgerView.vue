<template>
  <div class="ledger-container animate-fade-in">
    <!-- 1. 顶栏总览卡片 (#0D2B2E 深墨绿 & #E8C268 鎏金) -->
    <div class="overview-header-card">
      <div class="overview-top-row">
        <div class="summary-title-wrap">
          <span class="badge-tag">家庭账本</span>
          <h2>总支出概览</h2>
        </div>
        <button class="btn-primary-add" @click="openAddModal">
          <el-icon><Plus /></el-icon>
          <span>记账</span>
        </button>
      </div>

      <div class="summary-amount-box">
        <div class="currency-symbol">¥</div>
        <div class="amount-num">{{ formattedTotalAmount }}</div>
      </div>

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

    <!-- 2. 多维度查询与筛选工具栏 (Query Toolbar) -->
    <div class="query-toolbar-card">
      <!-- 时间范围 Filter Pills -->
      <div class="toolbar-section">
        <div class="section-label">时间范围</div>
        <div class="pills-scroll-group">
          <button 
            v-for="item in timeOptions" 
            :key="item.value"
            class="pill-btn"
            :class="{ active: timeRange === item.value }"
            @click="timeRange = item.value"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <!-- 自定义时间选择器 (When timeRange === 'custom') -->
      <div v-if="timeRange === 'custom'" class="custom-date-picker-wrap">
        <el-date-picker
          v-model="customDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          size="default"
          style="width: 100%;"
        />
      </div>

      <!-- 按消费者查询 Consumer Pills -->
      <div class="toolbar-section">
        <div class="section-label">消费者</div>
        <div class="pills-scroll-group">
          <button
            class="pill-btn member-pill"
            :class="{ active: selectedMember === 'all' }"
            @click="selectedMember = 'all'"
          >
            全部成员
          </button>
          <button
            v-for="m in MEMBERS"
            :key="m.name"
            class="pill-btn member-pill"
            :class="{ active: selectedMember === m.name }"
            :style="selectedMember === m.name ? { backgroundColor: m.color, borderColor: m.color, color: '#fff' } : {}"
            @click="selectedMember = m.name"
          >
            <span class="member-dot" :style="{ backgroundColor: m.color }"></span>
            {{ m.name }}
          </button>
        </div>
      </div>

      <!-- 消费类型 Filter & 搜索框 -->
      <div class="toolbar-bottom-row">
        <div class="category-select-wrap">
          <el-select v-model="selectedCategory" placeholder="选择消费类型" size="default" style="width: 100%;">
            <el-option label="全部类型" value="all" />
            <el-option
              v-for="c in CATEGORIES"
              :key="c.name"
              :label="`${c.icon} ${c.name}`"
              :value="c.name"
            />
          </el-select>
        </div>

        <div class="search-input-wrap">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索描述备注..."
            clearable
            size="default"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 3. 统计分析与进度条 (Member & Category Breakdown) -->
    <div v-if="filteredRecords.length > 0" class="stats-breakdown-grid">
      <!-- 消费者支出占比 -->
      <div class="breakdown-card">
        <div class="card-header">
          <h3>消费者支出占比</h3>
        </div>
        <div class="progress-list">
          <div v-for="st in memberStats" :key="st.name" class="progress-item">
            <div class="progress-info">
              <span class="name">
                <span class="color-indicator" :style="{ backgroundColor: st.color }"></span>
                {{ st.name }}
              </span>
              <span class="amount-percent">¥{{ st.amount.toLocaleString() }} ({{ st.percentage }}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: st.percentage + '%', backgroundColor: st.color }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 消费类型构成 -->
      <div class="breakdown-card">
        <div class="card-header">
          <h3>消费类型构成</h3>
        </div>
        <div class="progress-list">
          <div v-for="cs in categoryStats.slice(0, 5)" :key="cs.name" class="progress-item">
            <div class="progress-info">
              <span class="name">
                <span class="cat-icon">{{ cs.icon }}</span>
                {{ cs.name }}
              </span>
              <span class="amount-percent">¥{{ cs.amount.toLocaleString() }} ({{ cs.percentage }}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: cs.percentage + '%', backgroundColor: cs.color }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. 账单明细列表 (Grouped History List) -->
    <div class="records-list-section">
      <div class="section-title-bar">
        <h3>账单明细 ({{ filteredRecords.length }})</h3>
        <div class="action-tools">
          <el-button size="small" text class="gold-text-btn" @click="exportJSON">导出数据</el-button>
          <el-button size="small" text type="danger" @click="confirmResetData">重置数据</el-button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredRecords.length === 0" class="empty-state-card">
        <el-empty description="暂无符合条件的账单记录">
          <button class="btn-primary-add inline-empty-btn" @click="openAddModal">记账</button>
        </el-empty>
      </div>

      <!-- 按日期分组列表 -->
      <div v-else class="grouped-records-list">
        <div v-for="group in groupedRecords" :key="group.date" class="date-group-card">
          <div class="date-group-header">
            <span class="date-str">{{ group.formattedDate }}</span>
            <span class="date-total">当日小计: ¥{{ group.total.toLocaleString() }}</span>
          </div>

          <div class="record-items-wrapper">
            <div v-for="item in group.items" :key="item.id" class="record-item">
              <!-- 分类图标 -->
              <div class="cat-icon-badge" :style="{ backgroundColor: getCatInfo(item.category).bg }">
                <span>{{ getCatInfo(item.category).icon }}</span>
              </div>

              <!-- 描述与成员信息 -->
              <div class="record-main-info">
                <div class="title-row">
                  <span class="category-name">{{ item.category }}</span>
                  <div class="members-chips-wrap">
                    <span
                      v-for="uName in getRecordUsers(item)"
                      :key="uName"
                      class="member-chip"
                      :style="{ backgroundColor: getMemberInfo(uName).color }"
                    >
                      {{ uName }}
                    </span>
                  </div>
                </div>
                <div class="desc-row">
                  <span class="desc-text">{{ item.description || '无详细描述' }}</span>
                  <span class="time-text">{{ formatTime(item.timestamp) }}</span>
                </div>
              </div>

              <!-- 金额与操作 -->
              <div class="record-action-box">
                <div class="item-amount">-¥{{ Number(item.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
                <button class="btn-delete" title="删除记录" @click="deleteRecord(item.id)">
                  <el-icon><Delete /></el-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. 移动端快捷记账弹窗 Modal (支持消费者多选) -->
    <el-dialog
      v-model="isAddModalOpen"
      title="记账"
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

    <!-- 6. 移动端悬浮记账按钮 (Mobile FAB) -->
    <div class="mobile-fab-wrap" @click="openAddModal">
      <button class="fab-btn">
        <el-icon><Plus /></el-icon>
        <span class="fab-text">记账</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Search, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

// 1. 常量定义：四位成员
const MEMBERS = [
  { name: '👩‍🎤胖脆', color: '#f43f5e' },
  { name: '🧑🏻‍💻阿旺', color: '#8b5cf6' },
  { name: '😽宝仔', color: '#3b82f6' },
  { name: '🍓草莓', color: '#10b981' }
]

// 2. 常量定义：七大账单分类
const CATEGORIES = [
  { name: '饭菜', icon: '🍚 🥩', color: '#ef4444', bg: '#fee2e2' },
  { name: '水果零食', icon: '🍎 🍟 🍦', color: '#f59e0b', bg: '#fef3c7' },
  { name: '水电日常', icon: '💡 🔌 🧹', color: '#06b6d4', bg: '#cffaff' },
  { name: '交通', icon: '🚗 ⛽️ 🅿️', color: '#3b82f6', bg: '#dbeafe' },
  { name: '旅行和演出', icon: '✈️ 🎤 🎬', color: '#8b5cf6', bg: '#ede9fe' },
  { name: '人情往来', icon: '🧧', color: '#ec4899', bg: '#fce7f3' },
  { name: '礼物基金', icon: '🎁', color: '#10b981', bg: '#d1fae5' }
]

const STORAGE_KEY = 'happylife_family_ledger_records'

// 筛选响应式状态
const timeRange = ref('month')
const customDateRange = ref([])
const selectedMember = ref('all')
const selectedCategory = ref('all')
const searchKeyword = ref('')

const timeOptions = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本年', value: 'year' },
  { label: '全部记录', value: 'all' },
  { label: '自定义时间', value: 'custom' }
]

// 账单记录列表数据
const records = ref([])

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

// 初始化样本 seed 数据
const initSeedData = () => {
  const now = dayjs()
  return [
    {
      id: 'seed-1',
      users: ['👩‍🎤胖脆', '🧑🏻‍💻阿旺'],
      user: '👩‍🎤胖脆 & 🧑🏻‍💻阿旺',
      category: '饭菜',
      amount: 188.5,
      description: '周末家庭便当与超市食材',
      timestamp: now.subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'seed-2',
      users: ['🧑🏻‍💻阿旺'],
      user: '🧑🏻‍💻阿旺',
      category: '水果零食',
      amount: 68.0,
      description: '盒马买阳光玫瑰葡萄与切片西瓜',
      timestamp: now.subtract(5, 'hour').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'seed-3',
      users: ['😽宝仔'],
      user: '😽宝仔',
      category: '交通',
      amount: 45.0,
      description: '打车去公园散步',
      timestamp: now.subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'seed-4',
      users: ['🍓草莓'],
      user: '🍓草莓',
      category: '礼物基金',
      amount: 320.0,
      description: '储备家庭生日纪念日礼物通存金',
      timestamp: now.subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'seed-5',
      users: ['👩‍🎤胖脆', '🍓草莓'],
      user: '👩‍🎤胖脆 & 🍓草莓',
      category: '水电日常',
      amount: 210.0,
      description: '缴纳夏季空调电费',
      timestamp: now.subtract(4, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'seed-6',
      users: ['🧑🏻‍💻阿旺', '😽宝仔'],
      user: '🧑🏻‍💻阿旺 & 😽宝仔',
      category: '旅行和演出',
      amount: 680.0,
      description: '预订周末音乐会门票',
      timestamp: now.subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: 'seed-7',
      users: ['😽宝仔'],
      user: '😽宝仔',
      category: '人情往来',
      amount: 500.0,
      description: '好友婚礼红聚红包',
      timestamp: now.subtract(10, 'day').format('YYYY-MM-DD HH:mm:ss')
    }
  ]
}

const loadRecords = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      records.value = JSON.parse(raw)
    } else {
      records.value = initSeedData()
      saveToStorage()
    }
  } catch (e) {
    records.value = initSeedData()
  }
}

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
}

const getCatInfo = (catName) => {
  return CATEGORIES.find(c => c.name === catName) || { name: catName, icon: '💰', color: '#E8C268', bg: 'rgba(232,194,104,0.15)' }
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

const openAddModal = () => {
  form.users = selectedMember.value !== 'all' ? [selectedMember.value] : [MEMBERS[0].name]
  form.category = selectedCategory.value !== 'all' ? selectedCategory.value : '饭菜'
  form.amount = ''
  form.description = ''
  form.timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
  isAddModalOpen.value = true
}

const addQuickAmount = (val) => {
  const current = Number(form.amount || 0)
  form.amount = Number((current + val).toFixed(2))
}

const saveRecord = () => {
  if (!form.amount || Number(form.amount) <= 0) {
    ElMessage.warning('请输入有效的支出金额')
    return
  }
  if (!form.users || form.users.length === 0) {
    ElMessage.warning('请选择至少一位消费者')
    return
  }

  const userLabel = form.users.join(' & ')
  const newRecord = {
    id: 'rec-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    user: userLabel,
    users: [...form.users],
    category: form.category,
    amount: Number(Number(form.amount).toFixed(2)),
    description: form.description.trim() || `${userLabel}记录的${form.category}支出`,
    timestamp: form.timestamp || dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  records.value.unshift(newRecord)
  saveToStorage()
  isAddModalOpen.value = false
  ElMessage.success('成功记入一笔账单')
}

const deleteRecord = (id) => {
  ElMessageBox.confirm('确定要删除这条账单记录吗？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    records.value = records.value.filter(r => r.id !== id)
    saveToStorage()
    ElMessage.success('账单已删除')
  }).catch(() => {})
}

const confirmResetData = () => {
  ElMessageBox.confirm('确定要重置为默认样本数据吗？本地新增数据将被覆盖', '警告', {
    confirmButtonText: '重置',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    records.value = initSeedData()
    saveToStorage()
    ElMessage.success('重置数据成功')
  }).catch(() => {})
}

const exportJSON = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records.value, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", `family_ledger_${dayjs().format('YYYYMMDD_HHmmss')}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
  ElMessage.success('账单数据已导出文件')
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
.ledger-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 10px 60px 10px;
}

/* 1. 顶栏总览卡片 (#0D2B2E 深墨绿 & #E8C268 鎏金) */
.overview-header-card {
  background: linear-gradient(135deg, #0D2B2E 0%, #153e42 60%, #1c5257 100%);
  color: #fff;
  border-radius: 24px;
  padding: 24px 28px;
  border: 1.5px solid rgba(232, 194, 104, 0.4);
  box-shadow: 0 16px 36px rgba(13, 43, 46, 0.35);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.overview-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-tag {
  background: rgba(232, 194, 104, 0.2);
  border: 1px solid rgba(232, 194, 104, 0.5);
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 800;
  color: #E8C268;
}

.summary-title-wrap h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.btn-primary-add {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #E8C268 0%, #d4a73b 100%);
  color: #0D2B2E;
  border: none;
  border-radius: 20px;
  padding: 10px 22px;
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

.summary-amount-box {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 18px;
}

.currency-symbol {
  font-size: 2.2rem;
  font-weight: 900;
  color: #E8C268;
}

.amount-num {
  font-size: 3.4rem;
  font-weight: 900;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  color: #E8C268;
  letter-spacing: -1px;
  line-height: 1;
}

.summary-meta-row {
  display: flex;
  gap: 28px;
  border-top: 1px dashed rgba(232, 194, 104, 0.25);
  padding-top: 14px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
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

/* 2. 多维度查询与筛选工具栏 */
.query-toolbar-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(13, 43, 46, 0.15);
  border-radius: 20px;
  padding: 18px 20px;
  box-shadow: 0 10px 30px rgba(13, 43, 46, 0.05);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-label {
  font-size: 13px;
  font-weight: 800;
  color: #0D2B2E;
  white-space: nowrap;
  min-width: 60px;
}

.pills-scroll-group {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.pills-scroll-group::-webkit-scrollbar {
  display: none;
}

.pill-btn {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pill-btn:hover {
  background: #e2e8f0;
  color: #0D2B2E;
}

.pill-btn.active {
  background: #0D2B2E;
  border-color: #E8C268;
  color: #E8C268;
  box-shadow: 0 4px 12px rgba(13, 43, 46, 0.3);
}

.member-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.custom-date-picker-wrap {
  padding-left: 72px;
}

.toolbar-bottom-row {
  display: flex;
  gap: 12px;
}

.category-select-wrap {
  flex: 1;
}

.search-input-wrap {
  flex: 1;
}

/* 3. 统计分析与进度条 */
.stats-breakdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.breakdown-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(13, 43, 46, 0.1);
  border-radius: 20px;
  padding: 16px 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
}

.breakdown-card h3 {
  font-size: 14px;
  font-weight: 800;
  color: #0D2B2E;
  margin-top: 0;
  margin-bottom: 12px;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}

.progress-info .name {
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.amount-percent {
  color: #64748b;
  font-family: SFMono-Regular, Consolas, monospace;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s ease;
}

/* 4. 账单明细列表 */
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

.gold-text-btn {
  color: #0D2B2E !important;
  font-weight: 700;
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
  align-items: center;
  gap: 14px;
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

.cat-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.record-main-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.category-name {
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
}

.members-chips-wrap {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.member-chip {
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 1px 8px;
  border-radius: 10px;
}

.desc-row {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #64748b;
}

.desc-text {
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time-text {
  color: #94a3b8;
}

.record-action-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-amount {
  font-size: 1.1rem;
  font-weight: 900;
  font-family: SFMono-Regular, Consolas, monospace;
  color: #0D2B2E;
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

/* 5. 弹窗与表单 (消费者多选支持) */
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
  font-size: 11.5px;
  font-weight: 800;
  color: #1e293b;
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

/* 6. 移动端悬浮 FAB 按键 */
.mobile-fab-wrap {
  display: none;
  position: fixed;
  right: 20px;
  bottom: 30px;
  z-index: 99;
}

.fab-btn {
  height: 52px;
  padding: 0 20px;
  border-radius: 26px;
  background: linear-gradient(135deg, #E8C268 0%, #d4a73b 100%);
  color: #0D2B2E;
  border: 1.5px solid #fff;
  font-size: 15px;
  font-weight: 900;
  box-shadow: 0 10px 25px rgba(13, 43, 46, 0.5);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .ledger-container {
    padding: 6px 6px 80px 6px;
  }
  .overview-header-card {
    padding: 18px 20px;
  }
  .amount-num {
    font-size: 2.5rem;
  }
  .toolbar-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .custom-date-picker-wrap {
    padding-left: 0;
  }
  .toolbar-bottom-row {
    flex-direction: column;
    gap: 8px;
  }
  .stats-breakdown-grid {
    grid-template-columns: 1fr;
  }
  .category-selector-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .mobile-fab-wrap {
    display: block;
  }
}
</style>
