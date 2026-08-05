<template>
  <div class="family-dashboard animate-fade-in">
    <!-- 1. 顶部全家福页眉 (甜蜜浪漫流字连贯诗意句) -->
    <div class="family-hero-banner-inline">
      <img :src="romanticImg" alt="宇宙中，恰好相遇的浪漫" class="hero-romantic-img" />
      <div class="days-inline-text">
        <span class="prefix">—— 已经</span>
        <span class="num">{{ timeDiff.totalDays.toLocaleString() }}</span>
        <span class="unit">天</span>
        <span class="heart-sparkle">💕</span>
      </div>
    </div>

    <!-- 2. 超大实时计时主屏 (大字号 Ticking Counter) -->
    <div class="main-timer-section">
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

/* 1. 顶部全家福页眉 (图片与相伴天数有机连成完整句子，纯字无底框) */
.family-hero-banner-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 10px 0;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.hero-romantic-img {
  max-width: 440px;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 22px rgba(244, 114, 182, 0.25));
  transition: transform 0.3s ease;
}

.hero-romantic-img:hover {
  transform: scale(1.02);
}

.days-inline-text {
  display: flex;
  align-items: baseline;
  gap: 6px;
  user-select: none;
  filter: drop-shadow(0 4px 14px rgba(244, 63, 94, 0.25));
}

.days-inline-text .prefix {
  font-size: 1.7rem;
  font-weight: 700;
  color: #ec6b8b;
  letter-spacing: 1px;
  font-family: 'Comfortaa', 'PingFang SC', sans-serif;
  opacity: 0.92;
}

.days-inline-text .num {
  font-size: 3.8rem;
  font-weight: 900;
  font-family: 'Dancing Script', 'Caveat', 'Comfortaa', cursive, sans-serif;
  background: linear-gradient(135deg, #ec6b8b 0%, #ff85a1 45%, #b87cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  letter-spacing: 1px;
  padding: 0 4px;
}

.days-inline-text .unit {
  font-size: 1.7rem;
  font-weight: 700;
  color: #ec6b8b;
  font-family: 'Comfortaa', 'PingFang SC', sans-serif;
  opacity: 0.92;
}

.days-inline-text .heart-sparkle {
  font-size: 1.5rem;
  margin-left: 2px;
  display: inline-block;
  animation: gentle-heartbeat 2.4s infinite ease-in-out;
}

@keyframes gentle-heartbeat {
  0%, 100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.22);
    opacity: 1;
  }
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
