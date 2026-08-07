<template>
  <div class="family-dashboard animate-fade-in">
    <!-- 两侧浪漫风趣 GIF 动态花卉点缀 -->
    <div class="hero-deco-wrap">
      <img :src="gifDeco1" class="deco-gif deco-left" alt="浪漫点缀1" />
      <img :src="gifDeco2" class="deco-gif deco-right" alt="浪漫点缀2" />
    </div>

    <!-- 1. 顶部全家福页眉 (甜蜜浪漫流字连贯诗意句) -->
    <div class="family-hero-banner-inline">
      <img :src="romanticImg" alt="宇宙中，恰好相遇的浪漫" class="hero-romantic-img" />
      <div class="days-inline-text">
        <span class="prefix">已经</span>
        <span class="num">{{ timeDiff.totalDays.toLocaleString() }}</span>
        <span class="unit">天</span>
        <img :src="gifTextSuffix" class="inline-gif-suffix" alt="浪漫动效点缀" />
      </div>
    </div>

    <!-- 浅色精致分割线 -->
    <div class="hero-timer-divider"></div>

    <!-- 2. 超大实时计时主屏 (大字号 Ticking Counter) -->
    <div class="main-timer-section">
      <!-- 实时计时器大数块 (年 / 天 / 时 / 分 / 秒) -->
      <div class="timer-cards-grid">
        <div class="timer-unit-card">
          <div class="number-glow">{{ timeDiff.years }}</div>
          <div class="unit-label">YEARS</div>
        </div>
        <div class="colon-separator">:</div>
        
        <div class="timer-unit-card">
          <div class="number-glow">{{ padZero(timeDiff.days) }}</div>
          <div class="unit-label">DAYS</div>
        </div>
        <div class="colon-separator">:</div>

        <div class="timer-unit-card">
          <div class="number-glow">{{ padZero(timeDiff.hours) }}</div>
          <div class="unit-label">HOURS</div>
        </div>
        <div class="colon-separator">:</div>

        <div class="timer-unit-card">
          <div class="number-glow">{{ padZero(timeDiff.minutes) }}</div>
          <div class="unit-label">MINUTES</div>
        </div>
        <div class="colon-separator">:</div>

        <div class="timer-unit-card highlight-card">
          <div class="number-glow sec-anim">{{ padZero(timeDiff.seconds) }}</div>
          <div class="unit-label">SECONDS</div>
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
import gifDeco1 from '@/pic/huaban-6444827080.gif'
import gifDeco2 from '@/pic/huaban-6444812456.gif'
import gifTextSuffix from '@/pic/huaban-6659614929.gif'

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
  position: relative;
  padding: 10px 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: visible;
}

/* GIF 浪漫花卉/动态点缀 */
.hero-deco-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  pointer-events: none;
  z-index: 5;
}

.deco-gif {
  position: absolute;
  width: 85px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(244, 114, 182, 0.3));
}

.deco-left {
  top: 0px;
  left: 5px;
  transform: rotate(-10deg);
}

.deco-right {
  top: 0px;
  right: 5px;
  transform: rotate(10deg);
}

@media (max-width: 900px) {
  .deco-gif {
    width: 55px;
  }
  .deco-left {
    top: -10px;
    left: -5px;
  }
  .deco-right {
    top: -10px;
    right: -5px;
  }
}

/* 1. 顶部全家福页眉 */
.family-hero-banner-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 36px;
  padding: 10px 0 5px 0;
  margin-top: 5px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}

/* 浅色精致渐变分割线 */
.hero-timer-divider {
  width: 85%;
  max-width: 900px;
  height: 1px;
  background: linear-gradient(90deg, rgba(244, 114, 182, 0) 0%, rgba(244, 114, 182, 0.3) 50%, rgba(244, 114, 182, 0) 100%);
  margin: 15px auto 25px auto;
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
  font-size: 2.6rem;
  font-weight: 400;
  color: #ec6b8b;
  letter-spacing: 2px;
  font-family: 'Zhi Mang Xing', 'Ma Shan Zheng', 'Long Cang', 'STKaiti', 'KaiTi', cursive;
  opacity: 0.95;
}

.days-inline-text .num {
  font-size: 5rem;
  font-weight: 900;
  font-family: 'Pacifico', 'Quicksand', 'Outfit', 'Comfortaa', cursive, sans-serif;
  background: linear-gradient(135deg, #ec6b8b 0%, #ff85a1 45%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  letter-spacing: 1px;
  padding: 0 4px;
}

.days-inline-text .unit {
  font-size: 2.6rem;
  font-weight: 400;
  color: #ec6b8b;
  letter-spacing: 2px;
  font-family: 'Zhi Mang Xing', 'Ma Shan Zheng', 'Long Cang', 'STKaiti', 'KaiTi', cursive;
  opacity: 0.95;
}

.inline-gif-suffix {
  height: 52px;
  width: auto;
  object-fit: contain;
  vertical-align: middle;
  margin-left: 6px;
  filter: drop-shadow(0 4px 10px rgba(244, 114, 182, 0.35));
  transition: transform 0.3s ease;
}

.inline-gif-suffix:hover {
  transform: scale(1.1);
}

/* 2. 实时计时主屏 (纯净展示，无最外层白底与任何方框边框) */
.main-timer-section {
  background: transparent;
  backdrop-filter: none;
  border: none;
  box-shadow: none;
  padding: 10px 0;
  margin-bottom: 0;
}

/* 计时大数展示 (无背景底块与无框线) */
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
  min-width: 110px;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 10px 8px;
  text-align: center;
  box-shadow: none;
  transition: transform 0.3s ease;
}

.timer-unit-card:hover {
  transform: translateY(-3px);
  border: none;
  box-shadow: none;
}

.highlight-card {
  background: transparent;
  border: none;
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
    padding: 10px 4px;
  }
  .family-hero-banner-inline {
    gap: 10px;
    padding: 5px 0;
  }
  .hero-romantic-img {
    max-width: 270px;
  }
  .days-inline-text {
    flex-wrap: nowrap;
    white-space: nowrap;
    align-items: center;
  }
  .days-inline-text .prefix,
  .days-inline-text .unit {
    font-size: 1.5rem;
    white-space: nowrap;
    display: inline-block;
  }
  .days-inline-text .num {
    font-size: 2.8rem;
  }
  .inline-gif-suffix {
    height: 32px;
  }
  .timer-cards-grid {
    gap: 4px;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
  }
  .timer-unit-card {
    min-width: unset;
    flex: 1;
    padding: 4px 2px;
  }
  .number-glow {
    font-size: 1.5rem;
  }
  .unit-label {
    font-size: 9px;
  }
  .colon-separator {
    display: inline-block;
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
}
</style>
