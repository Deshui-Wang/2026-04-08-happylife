<template>
  <div class="app-container">
    <header class="navbar animate-fade-in">
      <div class="header-content">
        <div class="logo">
          <img :src="logoIcon" alt="logo" style="width: 44px; height: 44px; object-fit: contain;" />
          <span class="gradient-text">RICH</span>
        </div>
        <el-tabs v-model="activeTab" class="custom-tabs header-tabs">
          <el-tab-pane label="全家福" name="home"></el-tab-pane>
          <el-tab-pane label="账本" name="ledger"></el-tab-pane>
          <el-tab-pane label="财富" name="also-home"></el-tab-pane>
          <el-tab-pane label="显化" name="confirmation"></el-tab-pane>
          <el-tab-pane label="足迹" name="footprint"></el-tab-pane>
          <el-tab-pane label="修行" name="dictionary"></el-tab-pane>
        </el-tabs>
      </div>
    </header>

    <!-- 主体区域 -->
    <main class="main-content">
      <div v-if="activeTab === 'home'" class="animate-fade-in">
        <HomeView />
      </div>
      <div v-else-if="activeTab === 'ledger'" class="animate-fade-in">
        <LedgerView />
      </div>
      <div v-else-if="activeTab === 'also-home'" class="animate-fade-in">
        <AlsoHomeView />
      </div>
      <div v-else-if="activeTab === 'confirmation'" class="animate-fade-in">
        <ConfirmationView />
      </div>
      <div v-else-if="activeTab === 'footprint'" class="animate-fade-in">
        <FootprintView />
      </div>
      <div v-else-if="activeTab === 'dictionary'" class="animate-fade-in">
        <PracticeDictionaryView />
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer animate-fade-in" style="animation-delay: 0.8s">
      <p>© 2026 Crafted with ❤️ for Deshui-happylife</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'
import logoIcon from './pic/logo-icon-340x340.svg'
import HomeView from './views/HomeView.vue'
import LedgerView from './views/LedgerView.vue'
import AlsoHomeView from './views/AlsoHomeView.vue'
import ConfirmationView from './views/ConfirmationView.vue'
import FootprintView from './views/FootprintView.vue'
import PracticeDictionaryView from './views/PracticeDictionaryView.vue'

const activeTab = ref('home')

const handleTabChange = (e) => {
  activeTab.value = e.detail
}

onMounted(() => {
  window.addEventListener('change-tab', handleTabChange)
})

onUnmounted(() => {
  window.removeEventListener('change-tab', handleTabChange)
})
</script>

<style scoped>
.app-container {
  width: 100%;
  max-width: 2560px; /* 适配至 2K/4K 屏幕 */
  margin: 0 auto;
  padding: 20px;
  flex: 1;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h2 {
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.subtitle {
  color: #64748b;
  font-size: 1.1rem;
}

/* Navbar */
.navbar {
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 60px;
  padding: 0.5rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -1px;
}

/* Banner */
.banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem;
  margin-bottom: 2rem;
  overflow: hidden;
  position: relative;
}

.banner-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.banner-content p {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.circle-gradient {
  width: 200px;
  height: 200px;
  background: var(--accent-gradient);
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info .label {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
}

.stat-info .value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-trend {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-trend.up { color: #10b981; }
.stat-trend.down { color: #ef4444; }

/* Content Row */
.content-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 2rem;
}

.section-inner {
  padding: 2rem;
}

.section-title {
  margin-bottom: 1.5rem;
  font-family: var(--font-accent);
  color: #334155;
}

/* List Items */
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid rgba(241, 245, 249, 1);
  transition: background 0.2s;
}

.task-item:hover {
  background: rgba(99, 102, 241, 0.05);
}

.done-text {
  text-decoration: line-through;
  color: #94a3b8;
}

/* Tabs Styling */
.custom-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  border-bottom: none;
}

.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.custom-tabs :deep(.el-tabs__item) {
  font-size: 0.95rem;
  font-weight: 400;
  color: #64748b;
  padding: 0 25px;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  color: #6366f1;
}

.custom-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
}

.footer {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Animations for List */
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.4s ease;
}
.task-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 768px) {
  .app-container {
    padding: 8px 4px;
  }
  .header-content {
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 0;
  }
  .logo {
    font-size: 1.4rem;
  }
  .custom-tabs {
    width: 100%;
  }
  .custom-tabs :deep(.el-tabs__header) {
    margin-bottom: 0;
    width: 100%;
  }
  .custom-tabs :deep(.el-tabs__nav-wrap) {
    padding: 0 2px;
  }
  .custom-tabs :deep(.el-tabs__nav-scroll) {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .custom-tabs :deep(.el-tabs__nav) {
    display: flex !important;
    justify-content: space-around !important;
    width: 100% !important;
    float: none !important;
  }
  .custom-tabs :deep(.el-tabs__item) {
    padding: 0 4px !important;
    font-size: 0.85rem !important;
    min-width: auto !important;
  }
}
</style>
