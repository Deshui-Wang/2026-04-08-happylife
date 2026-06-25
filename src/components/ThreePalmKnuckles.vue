<template>
  <el-row :gutter="24" class="palms-row" style="margin-bottom: 24px; margin-top: 24px; display: flex; flex-wrap: wrap; align-items: stretch;">
    <!-- 天干掌诀 -->
    <el-col :xs="24" :md="8" style="margin-bottom: 24px; display: flex; flex-direction: column;">
      <div class="glass-card hand-card">
        <div class="card-glow-title text-center" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <el-icon class="glow-icon"><Pointer /></el-icon>
          <span>掐指神算 · 天干掌诀</span>
        </div>
        <div class="hand-description">
          点击天干可切换并查看五行阴阳与性情释义；十天干绕掌心顺时针分布。
        </div>
        <div class="hand-container">
          <div class="hand-outline">
            <div class="finger-labels">
              <span class="label-item">食指</span>
              <span class="label-item">中指</span>
              <span class="label-item">无名指</span>
              <span class="label-item">小指</span>
            </div>
            <div class="finger-joints-grid">
              <!-- Row 1 -->
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '丁' }" @click="$emit('update:activeStem', '丁')">
                <span class="joint-name">丁</span>
                <span class="joint-pinyin">dīng</span>
                <span class="joint-badge flame">火</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '戊' }" @click="$emit('update:activeStem', '戊')">
                <span class="joint-name">戊</span>
                <span class="joint-pinyin">wù</span>
                <span class="joint-badge earth">土</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '己' }" @click="$emit('update:activeStem', '己')">
                <span class="joint-name">己</span>
                <span class="joint-pinyin">jǐ</span>
                <span class="joint-badge earth">土</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '庚' }" @click="$emit('update:activeStem', '庚')">
                <span class="joint-name">庚</span>
                <span class="joint-pinyin">gēng</span>
                <span class="joint-badge gold">金</span>
              </div>

              <!-- Row 2 -->
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '丙' }" @click="$emit('update:activeStem', '丙')">
                <span class="joint-name">丙</span>
                <span class="joint-pinyin">bǐng</span>
                <span class="joint-badge flame">火</span>
              </div>
              <!-- 掌心 (2x2) -->
              <div class="hand-center-taiji" style="grid-column: span 2; grid-row: span 2;">
                <div class="taiji-mini-spin">☯</div>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '辛' }" @click="$emit('update:activeStem', '辛')">
                <span class="joint-name">辛</span>
                <span class="joint-pinyin">xīn</span>
                <span class="joint-badge gold">金</span>
              </div>

              <!-- Row 3 -->
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '乙' }" @click="$emit('update:activeStem', '乙')">
                <span class="joint-name">乙</span>
                <span class="joint-pinyin">yǐ</span>
                <span class="joint-badge wood">木</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '壬' }" @click="$emit('update:activeStem', '壬')">
                <span class="joint-name">壬</span>
                <span class="joint-pinyin">rén</span>
                <span class="joint-badge water">水</span>
              </div>

              <!-- Row 4 -->
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '甲' }" @click="$emit('update:activeStem', '甲')">
                <span class="joint-name">甲</span>
                <span class="joint-pinyin">jiǎ</span>
                <span class="joint-badge wood">木</span>
              </div>
              <div class="joint-cell cell-empty-place"></div>
              <div class="joint-cell cell-empty-place"></div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeStem === '癸' }" @click="$emit('update:activeStem', '癸')">
                <span class="joint-name">癸</span>
                <span class="joint-pinyin">guǐ</span>
                <span class="joint-badge water">水</span>
              </div>
            </div>
          </div>
          
          <!-- 天干详细解读卡片 -->
          <div class="branch-detail-panel stem-detail-panel" :class="activeStemInfo.element" style="margin-top: 15px; width: 100%;">
            <div class="detail-badge-row">
              <el-tag effect="dark" :class="'element-tag ' + activeStemInfo.element">
                五行：{{ activeStemInfo.elementName }}
              </el-tag>
              <el-tag type="info" effect="plain" style="color: #475569; border-color: #cbd5e1;">
                阴阳：{{ activeStemInfo.polar }}性
              </el-tag>
            </div>
            <div class="detail-content">
              <div class="main-info">
                <span class="zodiac-pic">☯</span>
                <div class="info-text">
                  <h3>{{ activeStemInfo.name }} ({{ activeStemInfo.pinyin }}) · {{ activeStemInfo.polar }}{{ activeStemInfo.elementName }}</h3>
                  <p class="modern-time" style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.5;">{{ activeStemInfo.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>

    <!-- 地支掌诀 -->
    <el-col :xs="24" :md="8" style="margin-bottom: 24px; display: flex; flex-direction: column;">
      <div class="glass-card hand-card">
        <div class="card-glow-title text-center" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <el-icon class="glow-icon"><Pointer /></el-icon>
            <span>掐指神算 · 地支掌诀</span>
          </div>
          <el-tooltip content="点击查看传统掌法指诀口诀图" placement="top" effect="dark">
            <el-button 
              type="warning" 
              circle 
              size="small" 
              class="hand-diagram-btn"
              @click="showTraditionalHandDialog = true"
            >
              <el-icon><Picture /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        <div class="hand-description">
          点击指节可切换手动模拟时间并锁定地支；金色高亮为实时时辰轨迹。
        </div>
        <div class="hand-container">
          <div class="hand-outline">
            <div class="finger-labels">
              <span class="label-item">食指</span>
              <span class="label-item">中指</span>
              <span class="label-item">无名指</span>
              <span class="label-item">小指</span>
            </div>
            <div class="finger-joints-grid">
              <!-- Row 1 -->
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '巳' }" @click="$emit('select-branch', '巳')">
                <span class="joint-name">巳</span>
                <span class="joint-pinyin">sì</span>
                <span class="joint-badge flame">火</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '午' }" @click="$emit('select-branch', '午')">
                <span class="joint-name">午</span>
                <span class="joint-pinyin">wù</span>
                <span class="joint-badge flame">火</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '未' }" @click="$emit('select-branch', '未')">
                <span class="joint-name">未</span>
                <span class="joint-pinyin">wèi</span>
                <span class="joint-badge earth">土</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '申' }" @click="$emit('select-branch', '申')">
                <span class="joint-name">申</span>
                <span class="joint-pinyin">shēn</span>
                <span class="joint-badge gold">金</span>
              </div>

              <!-- Row 2 -->
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '辰' }" @click="$emit('select-branch', '辰')">
                <span class="joint-name">辰</span>
                <span class="joint-pinyin">chén</span>
                <span class="joint-badge earth">土</span>
              </div>
              <!-- 掌心 (2x2) -->
              <div class="hand-center-taiji" style="grid-column: span 2; grid-row: span 2;">
                <div class="taiji-mini-spin">☯</div>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '酉' }" @click="$emit('select-branch', '酉')">
                <span class="joint-name">酉</span>
                <span class="joint-pinyin">yǒu</span>
                <span class="joint-badge gold">金</span>
              </div>

              <!-- Row 3 -->
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '卯' }" @click="$emit('select-branch', '卯')">
                <span class="joint-name">卯</span>
                <span class="joint-pinyin">mǎo</span>
                <span class="joint-badge wood">木</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '戌' }" @click="$emit('select-branch', '戌')">
                <span class="joint-name">戌</span>
                <span class="joint-pinyin">xū</span>
                <span class="joint-badge earth">土</span>
              </div>

              <!-- Row 4 -->
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '寅' }" @click="$emit('select-branch', '寅')">
                <span class="joint-name">寅</span>
                <span class="joint-pinyin">yín</span>
                <span class="joint-badge wood">木</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '丑' }" @click="$emit('select-branch', '丑')">
                <span class="joint-name">丑</span>
                <span class="joint-pinyin">chǒu</span>
                <span class="joint-badge earth">土</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '子' }" @click="$emit('select-branch', '子')">
                <span class="joint-name">子</span>
                <span class="joint-pinyin">zǐ</span>
                <span class="joint-badge water">水</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: simulatedBranchInfo.name === '亥' }" @click="$emit('select-branch', '亥')">
                <span class="joint-name">亥</span>
                <span class="joint-pinyin">hài</span>
                <span class="joint-badge water">水</span>
              </div>
            </div>
          </div>
          
          <!-- 地支详细解读卡片 -->
          <div class="branch-detail-panel" :class="simulatedBranchInfo.element" style="margin-top: 15px; width: 100%;">
            <div class="detail-badge-row">
              <el-tag effect="dark" :class="'element-tag ' + simulatedBranchInfo.element">
                五行：{{ simulatedBranchInfo.elementName }}
              </el-tag>
              <el-tag type="info" effect="plain" style="color: #475569; border-color: #cbd5e1;">
                生肖：{{ simulatedBranchInfo.zodiacEmoji }} {{ simulatedBranchInfo.zodiac }}
              </el-tag>
            </div>
            <div class="detail-content">
              <div class="main-info">
                <span class="zodiac-pic">{{ simulatedBranchInfo.zodiacEmoji }}</span>
                <div class="info-text">
                  <h3>{{ simulatedBranchInfo.name }} ({{ simulatedBranchInfo.pinyin }}) · {{ simulatedBranchInfo.zodiac }}时</h3>
                  <p class="modern-time" style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.5;">
                    时间段：{{ simulatedBranchInfo.timeSpan }}<br/>
                    月份：{{ simulatedBranchInfo.month }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>

    <!-- 八卦掌诀 -->
    <el-col :xs="24" :md="8" style="margin-bottom: 24px; display: flex; flex-direction: column;">
      <div class="glass-card hand-card">
        <div class="card-glow-title text-center" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <el-icon class="glow-icon"><Pointer /></el-icon>
          <span>掐指神算 · 八卦掌诀</span>
        </div>
        <div class="hand-description">
          点击卦名查看后天八卦方位与象征意象；九宫格对应手掌外圈及掌心。
        </div>
        <div class="hand-container">
          <div class="hand-outline">
            <div class="finger-labels">
              <span class="label-item">食指</span>
              <span class="label-item">中指</span>
              <span class="label-item">无名指</span>
              <span class="label-item">小指</span>
            </div>
            <div class="finger-joints-grid">
              <!-- Row 1 -->
              <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '巽' }" @click="$emit('update:activeBagua', '巽')">
                <span class="joint-name">巽</span>
                <span class="joint-pinyin">xùn ☴</span>
                <span class="joint-badge wood">木</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '离' }" @click="$emit('update:activeBagua', '离')">
                <span class="joint-name">离</span>
                <span class="joint-pinyin">lí ☲</span>
                <span class="joint-badge flame">火</span>
              </div>
              <div class="joint-cell cell-empty-place"></div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '坤' }" @click="$emit('update:activeBagua', '坤')">
                <span class="joint-name">坤</span>
                <span class="joint-pinyin">kūn ☷</span>
                <span class="joint-badge earth">土</span>
              </div>

              <!-- Row 2 -->
              <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '震' }" @click="$emit('update:activeBagua', '震')">
                <span class="joint-name">震</span>
                <span class="joint-pinyin">zhèn ☳</span>
                <span class="joint-badge wood">木</span>
              </div>
              <!-- 掌心 (2x2) -->
              <div class="hand-center-taiji" style="grid-column: span 2; grid-row: span 2;">
                <div class="taiji-mini-spin">☯</div>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '兑' }" @click="$emit('update:activeBagua', '兑')">
                <span class="joint-name">兑</span>
                <span class="joint-pinyin">duì ☱</span>
                <span class="joint-badge gold">金</span>
              </div>

              <!-- Row 3 -->
              <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '艮' }" @click="$emit('update:activeBagua', '艮')">
                <span class="joint-name">艮</span>
                <span class="joint-pinyin">gèn ☶</span>
                <span class="joint-badge earth">土</span>
              </div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '乾' }" @click="$emit('update:activeBagua', '乾')">
                <span class="joint-name">乾</span>
                <span class="joint-pinyin">qián ☰</span>
                <span class="joint-badge gold">金</span>
              </div>

              <!-- Row 4 -->
              <div class="joint-cell cell-empty-place"></div>
              <div class="joint-cell cell-empty-place"></div>
              <div class="joint-cell cell-active-glow" :class="{ active: activeBagua === '坎' }" @click="$emit('update:activeBagua', '坎')">
                <span class="joint-name">坎</span>
                <span class="joint-pinyin">kǎn ☵</span>
                <span class="joint-badge water">水</span>
              </div>
              <div class="joint-cell cell-empty-place"></div>
            </div>
          </div>
          
          <!-- 八卦详细解读卡片 -->
          <div class="branch-detail-panel bagua-detail-panel" :class="activeBaguaInfo.element" style="margin-top: 15px; width: 100%;">
            <div class="detail-badge-row">
              <el-tag effect="dark" :class="'element-tag ' + activeBaguaInfo.element">
                五行：{{ activeBaguaInfo.elementName }}
              </el-tag>
              <el-tag type="info" effect="plain" style="color: #475569; border-color: #cbd5e1;">
                阴阳：{{ activeBaguaInfo.yinYang }}性
              </el-tag>
              <el-tag type="warning" effect="dark" style="border: none;">
                卦符：{{ activeBaguaInfo.trigram }}
              </el-tag>
            </div>
            <div class="detail-content">
              <div class="main-info" style="width: 100%;">
                <div class="info-text" style="width: 100%;">
                  <h3>{{ activeBaguaInfo.name }}卦 ({{ activeBaguaInfo.pinyin }}) · {{ activeBaguaInfo.nature }}</h3>
                  <p class="modern-time" style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.5;">
                    <strong>象征：</strong>{{ activeBaguaInfo.code }}<br/>
                    <strong>释义：</strong>{{ activeBaguaInfo.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  
  <el-dialog
    v-model="showTraditionalHandDialog"
    title="传统地支掌诀排法口诀"
    width="460px"
    top="8vh"
    append-to-body
    destroy-on-close
    class="traditional-hand-dialog"
  >
    <div class="dialog-img-container">
      <img :src="traditionalHandMapImg" alt="传统地支掌诀排法" class="traditional-hand-img" />
      <div class="traditional-hand-tip">
        <strong>💡 古人“掐指一算”传统掌诀定位：</strong><br/>
        以左手为盘，按顺时针次序环绕食指、中指、无名指和小指的指节排定十二地支：
        <ul style="margin: 5px 0; padding-left: 20px;">
          <li><strong>子（北）</strong>：位于无名指根部</li>
          <li><strong>午（南）</strong>：位于中指尖端</li>
          <li><strong>卯（东）</strong>：位于食指中节</li>
          <li><strong>酉（西）</strong>：位于小指中节</li>
        </ul>
        古人在测算时，常以大拇指点按对应关节进行推演排盘，称为“掐指神算”。
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Pointer, Picture } from '@element-plus/icons-vue'
import traditionalHandMapImg from '../pic/traditional_hand_map.png'

const props = defineProps({
  activeStem: { type: String, required: true },
  activeBagua: { type: String, required: true },
  simulatedBranchInfo: { type: Object, required: true },
  heavenlyStemsList: { type: Array, required: true },
  baguaList: { type: Array, required: true }
})

defineEmits([
  'update:activeStem',
  'update:activeBagua',
  'select-branch'
])

const showTraditionalHandDialog = ref(false)

const activeStemInfo = computed(() => {
  return props.heavenlyStemsList.find(s => s.name === props.activeStem) || props.heavenlyStemsList[0]
})

const activeBaguaInfo = computed(() => {
  const base = props.baguaList.find(b => b.name === props.activeBagua) || props.baguaList[0]
  const natureToElement = {
    '天': { element: 'gold', name: '金', yinYang: '阳', desc: '至健至刚，天行健，自强不息' },
    '泽': { element: 'gold', name: '金', yinYang: '阴', desc: '喜悦沟通，丽泽兑，朋友相学' },
    '火': { element: 'flame', name: '火', yinYang: '阴', desc: '光明美丽，明两作照，守中正' },
    '雷': { element: 'wood', name: '木', yinYang: '阳', desc: '变动爆发，雷震千里，警醒自修' },
    '风': { element: 'wood', name: '木', yinYang: '阴', desc: '无孔不入，柔顺渗透，申命行事' },
    '水': { element: 'water', name: '水', yinYang: '阳', desc: '坎坷险陷，沉淀心智，常德行进' },
    '山': { element: 'earth', name: '土', yinYang: '阳', desc: '静止阻碍，安如磐石，适可而止' },
    '地': { element: 'earth', name: '土', yinYang: '阴', desc: '包容厚德，坤厚载物，德合无疆' }
  }
  const match = natureToElement[base.nature]
  return {
    ...base,
    element: match ? match.element : 'gold',
    elementName: match ? match.name : '金',
    yinYang: match ? match.yinYang : '阳',
    desc: match ? match.desc : ''
  }
})
</script>

<style scoped>
/* 玻璃卡片 */
.glass-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
}

/* 卡片标题发光效果 */
.card-glow-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 15px;
}

.glow-icon {
  color: #6366f1;
  font-size: 18px;
}

.text-center {
  justify-content: center;
}

/* 掐指掌法图右栏 */
.hand-card {
  flex: 1 !important;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.hand-description {
  font-size: 13px;
  color: #64748b;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 25px;
}

.hand-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.hand-outline {
  width: 100%;
  max-width: 380px;
  background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08), transparent 70%);
  border: 2px solid rgba(99, 102, 241, 0.1);
  border-radius: 40px;
  padding: 30px 20px 20px 20px;
  position: relative;
}

.finger-labels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  margin-bottom: 12px;
}

.label-item {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
}

.finger-joints-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 12px;
}

.joint-cell {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.joint-cell:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.joint-cell.active {
  background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%) !important;
  border-color: #f59e0b !important;
  color: white !important;
  box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3) !important;
  transform: scale(1.08);
  z-index: 2;
}

.joint-name {
  font-size: 18px;
  font-weight: 800;
}

.joint-cell.active .joint-name {
  color: #fbbf24;
}

.joint-pinyin {
  font-size: 10px;
  color: #64748b;
  margin-top: 2px;
}

.joint-cell.active .joint-pinyin {
  color: rgba(255,255,255,0.6);
}

.joint-badge {
  font-size: 8px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 4px;
  margin-top: 4px;
}

.joint-badge.water { background-color: #e0f2fe; color: #0284c7; }
.joint-badge.earth { background-color: #fef3c7; color: #b45309; }
.joint-badge.wood { background-color: #dcfce7; color: #15803d; }
.joint-badge.flame { background-color: #fee2e2; color: #b91c1c; }
.joint-badge.gold { background-color: #f4f4f5; color: #4b5563; }

.joint-cell.active .joint-badge {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
}

.cell-empty-place {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  cursor: default !important;
  pointer-events: none !important;
}

.hand-center-taiji {
  background: rgba(99, 102, 241, 0.03);
  border: 1px dashed rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.taiji-mini-spin {
  font-size: 32px;
  color: #cbd5e1;
  animation: spinTaiji 20s linear infinite;
}

@keyframes spinTaiji {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 换算详细卡片 */
.branch-detail-panel {
  border-radius: 20px;
  padding: 20px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  text-align: left;
}

.branch-detail-panel.water {
  background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%);
  border-color: #a5f3fc;
}
.branch-detail-panel.wood {
  background: linear-gradient(135deg, #f0fdf4 0%, #f0fdf4 100%);
  border-color: #bbf7d0;
}
.branch-detail-panel.earth {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-color: #fde68a;
}
.branch-detail-panel.flame {
  background: linear-gradient(135deg, #fff5f5 0%, #fff1f2 100%);
  border-color: #fecdd3;
}
.branch-detail-panel.gold {
  background: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);
  border-color: #e4e4e7;
}

.detail-badge-row {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.element-tag.water { background-color: #0284c7 !important; border-color: #0284c7 !important; }
.element-tag.wood { background-color: #10b981 !important; border-color: #10b981 !important; }
.element-tag.earth { background-color: #d97706 !important; border-color: #d97706 !important; }
.element-tag.flame { background-color: #ef4444 !important; border-color: #ef4444 !important; }
.element-tag.gold { background-color: #71717a !important; border-color: #71717a !important; }

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-info {
  display: flex;
  align-items: center;
  gap: 18px;
}

.zodiac-pic {
  font-size: 3.2rem;
  background: white;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.info-text h3 {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.modern-time {
  font-size: 13px;
  color: #64748b;
  margin-top: 5px;
  font-weight: 500;
}

/* 传统掌法弹窗样式 */
.traditional-hand-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
}

.dialog-img-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.traditional-hand-img {
  max-width: 100%;
  max-height: 280px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.traditional-hand-tip {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.hand-diagram-btn {
  margin-left: auto;
  transition: all 0.3s;
}

.hand-diagram-btn:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .branch-detail-panel {
    padding: 15px !important;
    border-radius: 16px !important;
  }
  .zodiac-pic {
    width: 54px !important;
    height: 54px !important;
    font-size: 2rem !important;
  }
  .info-text h3 {
    font-size: 16px !important;
  }
}
</style>
