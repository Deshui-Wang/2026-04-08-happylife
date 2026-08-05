<template>
  <div class="family-dashboard animate-fade-in">
    <!-- 1. 顶部全家福艺术字页眉 (图片在上层 z-2，天数在底层 z-1 重叠) -->
    <div class="family-hero-banner">
      <!-- 底层大字号浅色相伴天数 -->
      <div class="background-days-text">
        <span class="prefix">相伴</span>
        <span class="num">{{ timeDiff.totalDays.toLocaleString() }}</span>
        <span class="unit">天</span>
      </div>

      <!-- 上层透明底粉色书法字图 -->
      <img :src="romanticImg" alt="宇宙中，恰好相遇的浪漫" class="hero-romantic-img" />
    </div>

    <!-- 2. 超大实时计时主屏 (大字号 Ticking Counter) -->
    <div class="main-timer-section">
      <div class="timer-section-header">
        <div class="title-wrap">
          <el-icon class="heart-icon"><Clock /></el-icon>
          <span>相伴时光实时计时器</span>
        </div>
        <div class="pulse-indicator">
          <span class="dot"></span>
          <span>实时同步中</span>
        </div>
      </div>

      <!-- 实时计时器大数块 (年 / 天 / 时 / 分 / 秒) -->
      <div class="timer-cards-grid">
        <div class="timer-unit-card">
          <div class="number-glow">{{ timeDiff.years }}</div>
          <div class="unit-label">年 (YEARS)</div>
        </div>
        <div class="colon-separator">:</div>
        
        <div class="timer-unit-card">
          <div class="number-glow">{{ padZero(timeDiff.days) }}</div>
          <div class="unit-label">天 (DAYS)</div>
        </div>
        <div class="colon-separator">:</div>

        <div class="timer-unit-card">
          <div class="number-glow">{{ padZero(timeDiff.hours) }}</div>
          <div class="unit-label">小时 (HOURS)</div>
        </div>
        <div class="colon-separator">:</div>

        <div class="timer-unit-card">
          <div class="number-glow">{{ padZero(timeDiff.minutes) }}</div>
          <div class="unit-label">分钟 (MINUTES)</div>
        </div>
        <div class="colon-separator">:</div>

        <div class="timer-unit-card highlight-card">
          <div class="number-glow sec-anim">{{ padZero(timeDiff.seconds) }}</div>
          <div class="unit-label">秒 (SECONDS)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Calendar, Clock } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import romanticImg from '@/pic/yuzhou_romantic_text_transparent.png'

const startTime = dayjs('2020-01-14T00:00:00')

const timeDiff = reactive({
  years: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalDays: 0,
  totalHours: 0,
  totalSeconds: 0
})

let timer = null

const padZero = (num) => {
  return String(num).padStart(2, '0')
}

const updateTimer = () => {
  const now = dayjs()
  const diffMs = Math.max(0, now.diff(startTime))
  
  const totalSec = Math.floor(diffMs / 1000)
  const totalDays = Math.floor(totalSec / 86400)
  
  const years = Math.floor(totalDays / 365.25)
  const days = Math.floor(totalDays % 365.25)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60

  timeDiff.years = years
  timeDiff.days = days
  timeDiff.hours = hours
  timeDiff.minutes = minutes
  timeDiff.seconds = seconds
  timeDiff.totalDays = totalDays
  timeDiff.totalHours = Math.floor(totalSec / 3600)
  timeDiff.totalSeconds = totalSec
}

onMounted(() => {
  updateTimer()
  timer = setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.family-dashboard {
  padding: 0;
  margin: 0 auto;
  min-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 1. 顶部全家福艺术字页眉 */
.family-hero-banner {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0 10px 0;
  margin-bottom: 10px;
  overflow: visible;
}

/* 底层：大字号浅色文字 (z-index: 1) */
.background-days-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
  white-space: nowrap;
  user-select: none;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.background-days-text .prefix {
  font-size: clamp(1.8rem, 3.5vw, 3rem);
  font-weight: 900;
  color: rgba(244, 114, 182, 0.22);
  letter-spacing: 4px;
}

.background-days-text .num {
  font-size: clamp(6rem, 14vw, 11.5rem);
  font-weight: 900;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  color: rgba(244, 114, 182, 0.22);
  letter-spacing: -4px;
  text-shadow: 0 10px 40px rgba(244, 114, 182, 0.12);
  line-height: 0.9;
}

.background-days-text .unit {
  font-size: clamp(1.8rem, 3.5vw, 3rem);
  font-weight: 900;
  color: rgba(244, 114, 182, 0.22);
  letter-spacing: 4px;
}

/* 上层：透明底图片 (z-index: 2) */
.hero-romantic-img {
  position: relative;
  z-index: 2;
  max-width: 380px;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 22px rgba(244, 114, 182, 0.22));
  transition: transform 0.3s ease;
}

.hero-romantic-img:hover {
  transform: scale(1.03);
}

/* 2. 实时计时主屏 */
.main-timer-section {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 15px 40px rgba(99, 102, 241, 0.07);
  margin-bottom: 0;
}

.timer-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 12px;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
}

.heart-icon {
  font-size: 22px;
  color: #6366f1;
}

.pulse-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid #a7f3d0;
}

.pulse-indicator .dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* 计时大卡片网格 */
.timer-cards-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 0;
  flex-wrap: wrap;
}

.timer-unit-card {
  flex: 1;
  min-width: 120px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e0e7ff;
  border-radius: 18px;
  padding: 16px 12px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.04);
  transition: all 0.3s ease;
}

.timer-unit-card:hover {
  transform: translateY(-3px);
  border-color: #6366f1;
  box-shadow: 0 12px 28px rgba(99, 102, 241, 0.1);
}

.highlight-card {
  background: linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%);
  border-color: #a855f7;
}

.number-glow {
  font-size: 2.8rem;
  font-weight: 900;
  line-height: 1;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  background: linear-gradient(135deg, #312e81 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

.sec-anim {
  background: linear-gradient(135deg, #7e22ce 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.unit-label {
  font-size: 13px;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.5px;
}

.colon-separator {
  font-size: 2.5rem;
  font-weight: 900;
  color: #a5b4fc;
  margin-bottom: 20px;
}

/* 3. 快捷入口 */
.quick-nav-section {
  margin-top: 10px;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-size: 16px;
}

.section-title-wrap h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
}

.nav-card {
  position: relative;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.1);
  border-color: #818cf8;
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 12px;
}

.nav-card h4 {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
}

.nav-card p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

.card-arrow {
  position: absolute;
  right: 16px;
  bottom: 16px;
  color: #a5b4fc;
  font-size: 18px;
  transition: transform 0.2s ease;
}

.nav-card:hover .card-arrow {
  transform: translateX(4px);
  color: #4f46e5;
}

@media (max-width: 768px) {
  .family-hero-card {
    padding: 24px;
    border-radius: 20px;
  }
  .hero-title {
    font-size: 2rem;
  }
  .sub-title {
    font-size: 1.1rem;
  }
  .hero-slogan {
    font-size: 0.95rem;
  }
  .main-timer-section {
    padding: 20px;
    border-radius: 20px;
  }
  .number-glow {
    font-size: 2.2rem;
  }
  .colon-separator {
    display: none;
  }
  .timer-cards-grid {
    gap: 8px;
  }
  .timer-unit-card {
    min-width: 45%;
    padding: 16px 10px;
  }
  .totals-banner {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  .divider-line {
    width: 80%;
    height: 1px;
  }
}
</style>
