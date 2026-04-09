<template>
  <div class="app-container">
    <!-- 顶部玻璃导航栏 -->
    <header class="navbar glass-card animate-fade-in">
      <div class="logo">
        <el-icon :size="24" color="#6366f1"><MagicStick /></el-icon>
        <span class="gradient-text">HappyLife AI</span>
      </div>
      <div class="nav-links">
        <el-button link>Dashboard</el-button>
        <el-button link>Settings</el-button>
        <el-avatar
          :size="40"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
      </div>
    </header>

    <!-- 主体区域：灵犀财算 FlexiCalc -->
    <main class="main-content">
      
      <FlexiCalc />
    </main>

    <!-- 页脚 -->
    <footer class="footer animate-fade-in" style="animation-delay: 0.8s">
      <p>© 2026 Crafted with ❤️ for Deshui-happylife</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'
import FlexiCalc from './components/FlexiCalc.vue'
</script>

<style scoped>
.app-container {
  width: 98%;
  max-width: 2560px; /* 适配至 2K/4K 屏幕 */
  margin: 0 auto;
  padding: 20px 40px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
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
</style>
