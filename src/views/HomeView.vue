<template>
  <div class="family-dashboard animate-fade-in">
    <!-- 1. 顶部全家福艺术字页眉 -->
    <div class="family-hero-banner">
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

      <!-- 全景总数明细横幅 (总天数 / 总小时 / 总秒数) -->
      <div class="totals-banner">
        <div class="total-item">
          <div class="label">累计陪伴总天数</div>
          <div class="value">{{ timeDiff.totalDays.toLocaleString() }} <span class="unit">天</span></div>
        </div>
        <div class="divider-line"></div>
        <div class="total-item">
          <div class="label">累计陪伴总小时</div>
          <div class="value">{{ timeDiff.totalHours.toLocaleString() }} <span class="unit">小时</span></div>
        </div>
        <div class="divider-line"></div>
        <div class="total-item">
          <div class="label">累计陪伴总秒数</div>
          <div class="value">{{ timeDiff.totalSeconds.toLocaleString() }} <span class="unit">秒</span></div>
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
  padding: 10px 0;
  margin: 0 auto;
}

/* 1. 顶部全家福艺术字页眉 */
.family-hero-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 20px 0;
  margin-bottom: 10px;
}

.hero-romantic-img {
  max-width: 480px;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 12px 24px rgba(244, 114, 182, 0.2));
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
  border-radius: 28px;
  padding: 36px;
  box-shadow: 0 20px 50px rgba(99, 102, 241, 0.08);
  margin-bottom: 30px;
}

.timer-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 16px;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.heart-icon {
  font-size: 24px;
  color: #6366f1;
}

.pulse-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
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
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.timer-unit-card {
  flex: 1;
  min-width: 130px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e0e7ff;
  border-radius: 20px;
  padding: 24px 16px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.05);
  transition: all 0.3s ease;
}

.timer-unit-card:hover {
  transform: translateY(-4px);
  border-color: #6366f1;
  box-shadow: 0 15px 35px rgba(99, 102, 241, 0.12);
}

.highlight-card {
  background: linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%);
  border-color: #a855f7;
}

.number-glow {
  font-size: 3.6rem;
  font-weight: 900;
  line-height: 1;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  background: linear-gradient(135deg, #312e81 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
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

/* 全景总数明细 */
.totals-banner {
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  border-radius: 20px;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 1px solid #e0e7ff;
}

.total-item {
  text-align: center;
}

.total-item .label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 6px;
}

.total-item .value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #312e81;
}

.total-item .value .unit {
  font-size: 14px;
  color: #6366f1;
  font-weight: 600;
}

.divider-line {
  width: 1px;
  height: 40px;
  background-color: #cbd5e1;
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
