<template>
  <div class="footprint-view animate-fade-in">
    <div class="page-title-section">
      <h2 class="section-title">幸福足迹</h2>
      <p class="section-subtitle">家庭旅行 · 地区点亮 · 幸福见证</p>
    </div>

    <el-card class="glass-card map-control-card" :body-style="{ padding: '0' }">
      <div class="map-input-group">
        <div class="input-header">
          <el-input 
            v-model="newPlace" 
            placeholder="输入已到访的城市或省份点亮（如：北京、铁岭、四川、湖南）" 
            class="city-input"
            @keyup.enter="addFootprint"
            clearable
          >
            <template #append>
              <el-button type="primary" @click="addFootprint">点亮区域</el-button>
            </template>
          </el-input>
          <el-button @click="clearAll" type="danger" plain size="small" class="clear-btn">清空所有</el-button>
        </div>
        <div class="city-tags">
          <el-tag 
            v-for="place in visitedPlaces" 
            :key="place" 
            closable 
            @close="removeFootprint(place)"
            class="city-tag"
            effect="dark"
          >
            {{ place }}
          </el-tag>
        </div>
      </div>

      <div ref="chinaMapRef" class="china-map-container"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const chinaMapRef = ref(null)
let mapInstance = null
const newPlace = ref('')
const visitedPlaces = ref(['北京', '辽宁', '湖南']) // 默认示例

// 标准省份列表（用于匹配地图数据，与 ECharts 官方 GeoJSON 对应，采用简称）
const provinceNames = [
  '北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', 
  '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', 
  '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', 
  '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'
]

// 核心：城市与省份的对应关系（确保输入城市也能准确点亮省份）
const cityMap = {
  '北京': '北京', '上海': '上海', '天津': '天津', '重庆': '重庆',
  '铁岭': '辽宁', '沈阳': '辽宁', '大连': '辽宁',
  '长沙': '湖南', '岳阳': '湖南', '常德': '湖南',
  '济南': '山东', '青岛': '山东', '菏泽': '山东',
  '成都': '四川', '绵阳': '四川',
  '广州': '广东', '深圳': '广东', '东莞': '广东',
  '杭州': '浙江', '宁波': '浙江',
  '南京': '江苏', '苏州': '江苏', '无锡': '江苏',
  '西安': '陕西', '武汉': '湖北', '郑州': '河南',
  '福州': '福建', '厦门': '福建', '昆明': '云南'
}

// 持久化
watch(visitedPlaces, (newVal) => {
  localStorage.setItem('visited_places_final', JSON.stringify(newVal))
}, { deep: true })

const initMap = async () => {
  if (!chinaMapRef.value) return
  if (!mapInstance) {
    mapInstance = echarts.init(chinaMapRef.value)
    try {
      // 使用更稳定的 CDN 替换阿里云接口，避免线上环境因跨域或防盗链(Referer)导致请求失败
      const response = await axios.get('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json')
      echarts.registerMap('china', response.data)
    } catch (error) {
      console.error('地图数据加载失败', error)
      return
    }
  }
  renderMap()
}

// 核心渲染函数：根据 visitedPlaces 计算哪些省份需要变色
const renderMap = () => {
  // 1. 确定哪些省份需要被点亮
  const litProvinceSet = new Set()
  
  visitedPlaces.value.forEach(input => {
    const name = input.trim()
    // 检查是否在城市映射表中
    if (cityMap[name]) {
      litProvinceSet.add(cityMap[name])
    } else {
      // 模糊匹配省份名（如输入“辽宁”匹配“辽宁省”）
      const found = provinceNames.find(p => p.includes(name) || name.includes(p.replace(/(省|市|自治区|特别行政区|壮族|回族|维吾尔)$/, '')))
      if (found) litProvinceSet.add(found)
    }
  })

  // 2. 构建地图数据，为每个省份显式设置颜色
  const mapData = provinceNames.map(name => {
    const isLit = litProvinceSet.has(name)
    return {
      name: name,
      value: isLit ? 1 : 0,
      itemStyle: {
        areaColor: isLit ? '#6366f1' : '#f8fafc', // 点亮为蓝色，未点亮为极浅灰
        borderColor: '#cbd5e1',
        borderWidth: 0.5
      },
      label: {
        show: true,
        color: isLit ? '#ffffff' : '#64748b',
        fontSize: 10
      },
      emphasis: {
        itemStyle: { areaColor: isLit ? '#4f46e5' : '#e2e8f0' },
        label: { color: isLit ? '#ffffff' : '#1e293b' }
      }
    }
  })

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}' },
    series: [
      {
        name: '省份点亮',
        type: 'map',
        map: 'china',
        roam: true,
        zoom: 1.2,
        top: '10%',
        label: { show: true },
        data: mapData,
        // 关键：禁用默认的点击选中，全部由 data 驱动
        selectedMode: false 
      }
    ]
  }
  
  mapInstance.setOption(option, true)
}

const addFootprint = () => {
  const val = newPlace.value.trim()
  if (val && !visitedPlaces.value.includes(val)) {
    visitedPlaces.value.push(val)
    newPlace.value = ''
    renderMap()
    ElMessage.success(`已记录: ${val}`)
  }
}

const removeFootprint = (place) => {
  visitedPlaces.value = visitedPlaces.value.filter(p => p !== place)
  renderMap()
}

const clearAll = () => {
  ElMessageBox.confirm('确定要重置所有点亮的足迹吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    visitedPlaces.value = []
    renderMap()
    ElMessage.success('已清空')
  })
}

onMounted(() => {
  const saved = localStorage.getItem('visited_places_final')
  if (saved) {
    try {
      visitedPlaces.value = JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
  }
  nextTick(() => initMap())
})
</script>

<style scoped>
.footprint-view { padding: 20px; max-width: 1400px; margin: 0 auto; }
.page-title-section { margin-bottom: 30px; border-left: 4px solid #6366f1; padding-left: 20px; }
.section-title { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0; }
.section-subtitle { color: #64748b; margin-top: 5px; font-size: 14px; }
.map-control-card { border-radius: 30px; background: rgba(255, 255, 255, 0.8) !important; backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.4); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); }
.map-input-group { padding: 30px 40px; background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.5)); border-bottom: 1px solid #f1f5f9; }
.input-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.city-input { max-width: 500px; }
.city-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.city-tag { border-radius: 10px; font-weight: 600; padding: 10px 16px; height: auto; font-size: 14px; border: none; background: #6366f1; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
.china-map-container { width: 100%; height: 850px; }
</style>
