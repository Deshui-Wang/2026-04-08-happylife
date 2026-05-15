<template>
  <div class="footprint-view animate-fade-in">
    <div class="page-title-section">
      <h2 class="section-title">幸福足迹</h2>
      <p class="section-subtitle">家庭旅行 · 城市点亮 · 幸福见证</p>
    </div>

    <el-card class="glass-card map-control-card" :body-style="{ padding: '0' }">
      <div class="map-input-group">
        <div class="input-header">
          <el-input 
            v-model="newCity" 
            placeholder="输入已到访的城市名称（如：大连、成都、三亚）" 
            class="city-input"
            @keyup.enter="addFootprint"
            clearable
          >
            <template #append>
              <el-button type="primary" @click="addFootprint">点亮城市</el-button>
            </template>
          </el-input>
          <el-button @click="clearAll" type="danger" plain size="small" class="clear-btn">清空所有</el-button>
        </div>
        <div class="city-tags">
          <el-tag 
            v-for="city in litCities" 
            :key="city" 
            closable 
            @close="removeFootprint(city)"
            class="city-tag"
            effect="dark"
          >
            {{ city }}
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
const newCity = ref('')
const litCities = ref(['北京', '铁岭', '菏泽'])

// 持久化存储
watch(litCities, (newVal) => {
  localStorage.setItem('rich_lit_cities', JSON.stringify(newVal))
}, { deep: true })

// 深度扩展示例坐标字典 (覆盖全国主要地级市)
const cityCoords = {
  // 直辖市
  '北京': [116.407526, 39.90403], '上海': [121.473701, 31.230416], '天津': [117.190182, 39.125596], '重庆': [106.504962, 29.533155],
  // 辽宁
  '铁岭': [123.844279, 42.290585], '沈阳': [123.429096, 41.796767], '大连': [121.618622, 38.91459], '鞍山': [122.995632, 41.110626], '抚顺': [123.921109, 41.875951], '本溪': [123.770519, 41.297909], '丹东': [124.383044, 40.124296], '锦州': [121.135742, 41.119269], '营口': [122.228687, 40.664717], '阜新': [121.648962, 42.011796], '辽阳': [123.18152, 41.269404], '盘锦': [122.06957, 41.124484], '朝阳': [120.451376, 41.573391], '葫芦岛': [120.856394, 40.755572],
  // 山东
  '菏泽': [115.463304, 35.240493], '济南': [117.000923, 36.675807], '青岛': [120.355173, 36.082982], '淄博': [118.047648, 36.814939], '枣庄': [117.557964, 34.857954], '东营': [118.491624, 37.463286], '烟台': [121.391382, 37.539297], '潍坊': [119.107078, 36.70925], '济宁': [116.587245, 35.41539], '泰安': [117.129063, 36.194968], '威海': [122.116394, 37.509691], '日照': [119.461424, 35.428588], '莱芜': [117.677736, 36.214397], '临沂': [118.326443, 35.065282], '德州': [116.30744, 37.453968], '聊城': [115.980367, 36.456013], '滨州': [118.016974, 37.383542],
  // 广东
  '广州': [113.264385, 23.129112], '深圳': [114.057868, 22.543099], '珠海': [113.552724, 22.255899], '汕头': [116.679202, 23.364001], '韶关': [113.591544, 24.801322], '佛山': [113.122717, 23.028762], '江门': [113.094942, 22.590431], '湛江': [110.364977, 21.274898], '茂名': [110.919229, 21.659751], '肇庆': [112.472529, 23.051546], '惠州': [114.412599, 23.079404], '梅州': [116.117582, 24.299112], '汕尾': [115.364238, 22.774485], '河源': [114.697802, 23.746266], '阳江': [111.975107, 21.859222], '清远': [113.051227, 23.689322], '东莞': [113.746262, 23.046237], '中山': [113.382391, 22.521113], '潮州': [116.632301, 23.661701], '揭阳': [116.355733, 23.543778], '云浮': [112.044439, 22.929801],
  // 湖南
  '长沙': [112.938814, 28.228209], '株洲': [113.151737, 27.835806], '湘潭': [112.944052, 27.82973], '衡阳': [112.607693, 26.900358], '邵阳': [111.46923, 27.237842], '岳阳': [113.132855, 29.37029], '常德': [111.691347, 29.040225], '张家界': [110.479921, 29.127401], '益阳': [112.355042, 28.570066], '郴州': [113.032067, 25.793534], '永州': [111.608019, 26.434516], '怀化': [109.97824, 27.550082], '娄底': [111.99513, 27.734134], '吉首': [109.739735, 28.314296],
  // 浙江
  '杭州': [120.153576, 30.287459], '宁波': [121.549792, 29.868388], '温州': [120.672111, 28.000575], '嘉兴': [120.750865, 30.762653], '湖州': [120.102398, 30.867198], '绍兴': [120.582112, 30.002454], '金华': [119.649506, 29.089524], '衢州': [118.87263, 28.941708], '舟山': [122.106863, 30.016028], '台州': [121.428599, 28.661378], '丽水': [119.921786, 28.451993],
  // 四川
  '成都': [104.065735, 30.659462], '自贡': [104.773447, 29.35204], '攀枝花': [101.716007, 26.580446], '泸州': [105.443348, 28.889138], '德阳': [104.398651, 31.127991], '绵阳': [104.741722, 31.46402], '广元': [105.829757, 32.433668], '遂宁': [105.571324, 30.513311], '内江': [105.066138, 29.58708], '乐山': [103.761263, 29.582024], '南充': [106.082974, 30.791223], '眉山': [103.831788, 30.048318], '宜宾': [104.630825, 28.760189], '广安': [106.633369, 30.456398], '达州': [107.502262, 31.209484], '雅安': [103.001033, 29.987722], '巴中': [106.753676, 31.858809], '资阳': [104.641917, 30.122211],
  // 江苏
  '南京': [118.767413, 32.041544], '无锡': [120.301663, 31.574729], '徐州': [117.184811, 34.261792], '常州': [119.946973, 31.772752], '苏州': [120.619585, 31.299379], '南通': [120.864608, 32.016212], '连云港': [119.178821, 34.596992], '淮安': [119.021265, 33.597506], '盐城': [120.139998, 33.377631], '扬州': [119.421003, 32.393159], '镇江': [119.452753, 32.204402], '泰州': [119.915176, 32.484341], '宿迁': [118.275162, 33.963008],
  // 福建
  '福州': [119.306239, 26.075302], '厦门': [118.11022, 24.490474], '莆田': [119.007558, 23.23926], '三明': [117.635001, 26.273372], '泉州': [118.589421, 24.908836], '漳州': [117.661801, 24.510878], '南平': [118.174293, 26.643626], '龙岩': [117.02978, 25.074793], '宁德': [119.527082, 26.65924],
  // ... (根据需要继续补充)
  '西安': [108.940174, 34.341568], '三亚': [109.508268, 18.247872], '海口': [110.33119, 20.031971], '昆明': [102.712251, 25.040609], '武汉': [114.305392, 30.593098], '郑州': [113.665412, 34.757975]
}

const initMap = async () => {
  if (!chinaMapRef.value) return
  if (!mapInstance) {
    mapInstance = echarts.init(chinaMapRef.value)
    try {
      const response = await axios.get('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      echarts.registerMap('china', response.data)
    } catch (error) {
      console.error('Failed to load China Map GeoJSON', error)
      return
    }
  }
  updateMapOption()
}

const updateMapOption = () => {
  const cityData = litCities.value.map(name => {
    const cleanName = name.replace(/(市|省|自治区|特别行政区)$/, '')
    const coords = cityCoords[cleanName] || cityCoords[name]
    
    return {
      name,
      // 如果找不到，使用随机兜底，但范围限制在核心区域
      value: coords || [105 + Math.random() * 8, 28 + Math.random() * 6]
    }
  })

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}' },
    geo: {
      map: 'china', roam: true, zoom: 1.25, top: '10%',
      label: { show: true, color: '#94a3b8', fontSize: 10 },
      itemStyle: { areaColor: '#fcfcfc', borderColor: '#e2e8f0', borderWidth: 1 },
      emphasis: { label: { show: true, color: '#6366f1' }, itemStyle: { areaColor: '#f1f5f9' } }
    },
    series: [
      {
        name: '足迹', type: 'scatter', coordinateSystem: 'geo', data: cityData,
        symbolSize: 12,
        itemStyle: { color: '#6366f1', shadowBlur: 10, shadowColor: 'rgba(99, 102, 241, 0.6)', borderColor: '#fff', borderWidth: 2 },
        label: {
          show: true, position: 'top', formatter: '{b}', color: '#4338ca', fontWeight: 'bold', fontSize: 12,
          backgroundColor: 'rgba(255,255,255,0.8)', padding: [4, 8], borderRadius: 4
        },
        emphasis: { scale: 1.5 },
        zlevel: 1
      }
    ]
  }
  mapInstance.setOption(option)
}

const addFootprint = () => {
  let city = newCity.value.trim()
  if (city && !litCities.value.includes(city)) {
    litCities.value.push(city)
    newCity.value = ''
    updateMapOption()
    ElMessage.success(`成功点亮 ${city}`)
  }
}

const removeFootprint = (city) => {
  litCities.value = litCities.value.filter(c => c !== city)
  updateMapOption()
}

const clearAll = () => {
  ElMessageBox.confirm('确定要清空所有点亮的足迹吗？此操作不可撤销。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    litCities.value = []
    updateMapOption()
    ElMessage.success('已清空所有足迹')
  })
}

onMounted(() => {
  const savedCities = localStorage.getItem('rich_lit_cities')
  if (savedCities) {
    try {
      litCities.value = JSON.parse(savedCities)
    } catch (e) {
      console.error('Failed to parse saved cities', e)
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
