<template>
  <div class="footprint-view animate-fade-in">
    <div class="page-title-section">
      <h2 class="section-title">幸福足迹</h2>
      <p class="section-subtitle">家庭旅行 · 地区点亮 · 幸福与足迹双重见证</p>
    </div>

    <!-- 顶部操作栏 -->
    <el-card class="glass-card control-panel-card" :body-style="{ padding: '24px 30px' }">
      <div class="input-header">
        <div class="input-with-button">
          <el-input 
            v-model="newPlace" 
            placeholder="输入已到访的城市或省份点亮（如：北京、铁岭、四川、湖南）" 
            class="city-input"
            @keyup.enter="addFootprint"
            clearable
          >
            <template #prefix>
              <el-icon class="el-input__icon"><Compass /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" class="lit-btn" @click="addFootprint">
            <el-icon class="btn-icon"><MapLocation /></el-icon>点亮区域
          </el-button>
        </div>
        <el-button @click="clearAll" type="danger" plain size="default" class="clear-btn">
          <el-icon><Delete /></el-icon>清空足迹
        </el-button>
      </div>

      <!-- 快速标签展示 -->
      <div class="tags-section" v-if="visitedPlaces.length > 0">
        <span class="tags-label">已记录地点：</span>
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
    </el-card>

    <!-- 主体双栏布局 -->
    <el-row :gutter="24" class="main-layout-row">
      <!-- 左侧：中国地图 -->
      <el-col :xs="24" :lg="16" class="layout-col">
        <el-card class="glass-card map-card" :body-style="{ padding: '0' }">
          <div class="card-header-glow">
            <el-icon class="header-icon"><Opportunity /></el-icon>
            <span>足迹可视化图景</span>
          </div>
          <div ref="chinaMapRef" class="china-map-container"></div>
        </el-card>
      </el-col>

      <!-- 右侧：文字版档案（列出全部省份，支持按省份折叠/查看城市） -->
      <el-col :xs="24" :lg="8" class="layout-col">
        <el-card class="glass-card text-archive-card" :body-style="{ padding: '24px' }">
          <div class="archive-header">
            <div class="header-title">
              <el-icon class="header-icon"><Notebook /></el-icon>
              <span>足迹文字档案 (文字版)</span>
            </div>
            <div class="stats-badge">
              已点亮 <strong>{{ visitedProvincesCount }}</strong> / 34 个省级行政区
            </div>
          </div>


          <!-- 点亮进度条 -->
          <div class="progress-container">
            <el-progress 
              :percentage="visitedPercentage" 
              :stroke-width="10"
              :color="customColors"
              class="custom-progress"
            />
          </div>

          <!-- 文字版展示 Tab 切换 -->
          <el-tabs v-model="activeArchiveTab" class="archive-tabs">
            <!-- Tab 1: 按省份分类查看城市 (仅显示已点亮的省份) -->
            <el-tab-pane name="visited">
              <template #label>
                <span class="custom-tab-label">
                  <el-icon><FolderChecked /></el-icon>已点亮区域 ({{ visitedProvincesCount }})
                </span>
              </template>

              <div class="scrollbar-container">
                <el-empty 
                  v-if="visitedProvincesCount === 0" 
                  description="暂无点亮区域，快去上方输入城市点亮吧！"
                  :image-size="120"
                />
                
                <div v-else class="province-collapse-list animate-slide-up">
                  <div 
                    v-for="prov in visitedProvincesList" 
                    :key="prov.name" 
                    class="province-item-card"
                  >
                    <div class="province-card-header">
                      <div class="prov-info">
                        <span class="prov-marker"></span>
                        <strong class="prov-name">{{ prov.name }}</strong>
                        <el-tag size="small" type="success" effect="plain" class="prov-count-tag">
                          已打卡 {{ prov.cities.length || 1 }} 处
                        </el-tag>
                      </div>
                      <el-button 
                        type="danger" 
                        link 
                        size="small" 
                        @click="removeWholeProvince(prov.name)"
                        class="delete-prov-btn"
                      >
                        清除省份
                      </el-button>
                    </div>

                    <!-- 该省份下的详细城市列表 -->
                    <div class="province-cities-box">
                      <template v-if="prov.cities.length > 0">
                        <span 
                          v-for="city in prov.cities" 
                          :key="city" 
                          class="city-bubble"
                        >
                          {{ city }}
                          <el-icon class="close-city-icon" @click.stop="removeFootprint(city)"><Close /></el-icon>
                        </span>
                      </template>
                      <template v-else>
                        <span class="city-bubble-province-only">已点亮整个省份</span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- Tab 2: 列出全部省份清单 (按七大地理分区展示) -->
            <el-tab-pane name="all">
              <template #label>
                <span class="custom-tab-label">
                  <el-icon><Menu /></el-icon>全国 34 省份清单
                </span>
              </template>

              <div class="scrollbar-container all-provinces-scroll">
                <div 
                  v-for="(provincesInRegion, regionName) in regionalProvinces" 
                  :key="regionName" 
                  class="region-group"
                >
                  <h4 class="region-title">{{ regionName }}</h4>
                  <div class="region-grid">
                    <div 
                      v-for="p in provincesInRegion" 
                      :key="p" 
                      class="province-grid-tile"
                      :class="{ 'is-active': groupedFootprints[p]?.visited }"
                      @click="handleTileClick(p)"
                    >
                      <div class="tile-top">
                        <span class="tile-name">{{ p }}</span>
                        <el-icon v-if="groupedFootprints[p]?.visited" class="tile-check-icon"><SuccessFilled /></el-icon>
                        <el-icon v-else class="tile-plus-icon"><Plus /></el-icon>
                      </div>
                      <div class="tile-bottom">
                        <span v-if="groupedFootprints[p]?.visited" class="tile-desc active">
                          {{ groupedFootprints[p].cities.length > 0 ? groupedFootprints[p].cities.join('、') : '已点亮' }}
                        </span>
                        <span v-else class="tile-desc unvisited">未到访</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Compass, 
  MapLocation, 
  Delete, 
  Opportunity, 
  Notebook, 
  FolderChecked, 
  Menu, 
  SuccessFilled, 
  Plus, 
  Close 
} from '@element-plus/icons-vue'

const chinaMapRef = ref(null)
let mapInstance = null
const newPlace = ref('')
const activeArchiveTab = ref('visited')
const visitedPlaces = ref(['北京', '铁岭', '长沙']) // 默认打卡数据

// 标准省份列表（简称，匹配 ECharts GeoJSON）
const provinceNames = [
  '北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', 
  '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', 
  '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', 
  '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'
]

// 七大地理分区规划（列出全部省份清单使用）
const regionalProvinces = {
  '华东地区': ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '台湾'],
  '华北地区': ['北京', '天津', '河北', '山西', '内蒙古'],
  '华中地区': ['河南', '湖北', '湖南'],
  '华南地区': ['广东', '广西', '海南', '香港', '澳门'],
  '东北地区': ['辽宁', '吉林', '黑龙江'],
  '西南地区': ['重庆', '四川', '贵州', '云南', '西藏'],
  '西北地区': ['陕西', '甘肃', '青海', '宁夏', '新疆']
}

// 城市与省份的归属映射字典（全面覆盖中国所有 300+ 地级市及主要旅游城市，确保石家庄、秦皇岛、徐州、苏州等 100% 精准匹配）
const cityMap = {
  // 直辖市
  '北京': '北京', '上海': '上海', '天津': '天津', '重庆': '重庆',
  
  // 河北
  '石家庄': '河北', '唐山': '河北', '秦皇岛': '河北', '邯郸': '河北', '邢台': '河北', 
  '保定': '河北', '张家口': '河北', '承德': '河北', '沧州': '河北', '廊坊': '河北', '衡水': '河北',
  
  // 江苏
  '南京': '江苏', '无锡': '江苏', '徐州': '江苏', '常州': '江苏', '苏州': '江苏', 
  '南通': '江苏', '连云港': '江苏', '淮安': '江苏', '盐城': '江苏', '扬州': '江苏', 
  '镇江': '江苏', '泰州': '江苏', '宿迁': '江苏',
  
  // 辽宁
  '沈阳': '辽宁', '大连': '辽宁', '鞍山': '辽宁', '抚顺': '辽宁', '本溪': '辽宁', 
  '丹东': '辽宁', '锦州': '辽宁', '营口': '辽宁', '阜新': '辽宁', '辽阳': '辽宁', 
  '盘锦': '辽宁', '朝阳': '辽宁', '葫芦岛': '辽宁', '铁岭': '辽宁',
  
  // 湖南
  '长沙': '湖南', '株洲': '湖南', '湘潭': '湖南', '衡阳': '湖南', '邵阳': '湖南', 
  '岳阳': '湖南', '常德': '湖南', '张家界': '湖南', '益阳': '湖南', '郴州': '湖南', 
  '永州': '湖南', '怀化': '湖南', '娄底': '湖南', '湘西': '湖南',
  
  // 山东
  '济南': '山东', '青岛': '山东', '淄博': '山东', '枣庄': '山东', '东营': '山东', 
  '烟台': '山东', '潍坊': '山东', '济宁': '山东', '泰安': '山东', '威海': '山东', 
  '日照': '山东', '临沂': '山东', '德州': '山东', '聊城': '山东', '滨州': '山东', '菏泽': '山东',
  
  // 四川
  '成都': '四川', '自贡': '四川', '攀枝花': '四川', '泸州': '四川', '德阳': '四川', 
  '绵阳': '四川', '广元': '四川', '遂宁': '四川', '内江': '四川', '乐山': '四川', 
  '南充': '四川', '眉山': '四川', '宜宾': '四川', '广安': '四川', '达州': '四川', 
  '雅安': '四川', '巴中': '四川', '资阳': '四川', '阿坝': '四川', '甘孜': '四川', '凉山': '四川', '九寨沟': '四川',
  
  // 广东
  '广州': '广东', '深圳': '广东', '珠海': '广东', '汕头': '广东', '佛山': '广东', 
  '韶关': '广东', '湛江': '广东', '肇庆': '广东', '江门': '广东', '茂名': '广东', 
  '惠州': '广东', '梅州': '广东', '汕尾': '广东', '河源': '广东', '阳江': '广东', 
  '清远': '广东', '东莞': '广东', '中山': '广东', '潮州': '广东', '揭阳': '广东', '云浮': '广东',
  
  // 浙江
  '杭州': '浙江', '宁波': '浙江', '温州': '浙江', '嘉兴': '浙江', '湖州': '浙江', 
  '绍兴': '浙江', '金华': '浙江', '衢州': '浙江', '舟山': '浙江', '台州': '浙江', '丽水': '浙江', '乌镇': '浙江',
  
  // 安徽
  '合肥': '安徽', '芜湖': '安徽', '蚌埠': '安徽', '淮南': '安徽', '马鞍山': '安徽', 
  '淮北': '安徽', '铜陵': '安徽', '安庆': '安徽', '黄山': '安徽', '滁州': '安徽', 
  '阜阳': '安徽', '宿州': '安徽', '六安': '安徽', '亳州': '安徽', '池州': '安徽', '宣城': '安徽',
  
  // 福建
  '福州': '福建', '厦门': '福建', '莆田': '福建', '三明': '福建', '泉州': '福建', 
  '漳州': '福建', '南平': '福建', '龙岩': '福建', '宁德': '福建',
  
  // 江西
  '南昌': '江西', '景德镇': '江西', '萍乡': '江西', '九江': '江西', '新余': '江西', 
  '鹰潭': '江西', '赣州': '江西', '吉安': '江西', '宜春': '江西', '抚州': '江西', '上饶': '江西',
  
  // 河南
  '郑州': '河南', '开封': '河南', '洛阳': '河南', '平顶山': '河南', '安阳': '河南', 
  '鹤壁': '河南', '新乡': '河南', '焦作': '河南', '濮阳': '河南', '许昌': '河南', 
  '漯河': '河南', '三门峡': '河南', '南阳': '河南', '商丘': '河南', '信阳': '河南', 
  '周口': '河南', '驻马店': '河南', '济源': '河南',
  
  // 湖北
  '武汉': '湖北', '黄石': '湖北', '十堰': '湖北', '宜昌': '湖北', '襄阳': '湖北', 
  '鄂州': '湖北', '荆门': '湖北', '孝感': '湖北', '荆州': '湖北', '黄冈': '湖北', 
  '咸宁': '湖北', '随州': '湖北', '恩施': '湖北', '仙桃': '湖北', '潜江': '湖北', '天门': '湖北', '神农架': '湖北',
  
  // 海南
  '海口': '海南', '三亚': '海南', '三沙': '海南', '儋州': '海南',
  
  // 贵州
  '贵阳': '贵州', '六盘水': '贵州', '遵义': '贵州', '安顺': '贵州', '毕节': '贵州', 
  '铜仁': '贵州', '黔西南': '贵州', '黔东南': '贵州', '黔南': '贵州',
  
  // 云南
  '昆明': '云南', '曲靖': '云南', '玉溪': '云南', '保山': '云南', '昭通': '云南', 
  '丽江': '云南', '普洱': '云南', '临沧': '云南', '楚雄': '云南', '红河': '云南', 
  '文山': '云南', '西双版纳': '云南', '大理': '云南', '德宏': '云南', '怒江': '云南', '迪庆': '云南',
  
  // 陕西
  '西安': '陕西', '铜川': '陕西', '宝鸡': '陕西', '咸阳': '陕西', '渭南': '陕西', 
  '延安': '陕西', '汉中': '陕西', '榆林': '陕西', '安康': '陕西', '商洛': '陕西',
  
  // 甘肃
  '兰州': '甘肃', '嘉峪关': '甘肃', '金昌': '甘肃', '白银': '甘肃', '天水': '甘肃', 
  '武威': '甘肃', '张掖': '甘肃', '平凉': '甘肃', '酒泉': '甘肃', '庆阳': '甘肃', 
  '定西': '甘肃', '陇南': '甘肃', '临夏': '甘肃', '甘南': '甘肃',
  
  // 青海
  '西宁': '青海', '海东': '青海', '海北': '青海', '黄南': '青海', '海南': '青海', 
  '果洛': '青海', '玉树': '青海', '海西': '青海',
  
  // 宁夏
  '银川': '宁夏', '石嘴山': '宁夏', '吴忠': '宁夏', '固原': '宁夏', '中卫': '宁夏',
  
  // 新疆
  '乌鲁木齐': '新疆', '克拉玛依': '新疆', '吐鲁番': '新疆', '哈密': '新疆', '昌吉': '新疆', 
  '博尔塔拉': '新疆', '巴音郭楞': '新疆', '阿克苏': '新疆', '克孜勒苏': '新疆', '喀什': '新疆', 
  '和田': '新疆', '伊犁': '新疆', '塔城': '新疆', '阿勒泰': '新疆',
  
  // 广西
  '南宁': '广西', '柳州': '广西', '桂林': '广西', '梧州': '广西', '北海': '广西', 
  '防城港': '广西', '钦州': '广西', '贵港': '广西', '玉林': '广西', '百色': '广西', 
  '贺州': '广西', '河池': '广西', '来宾': '广西', '崇左': '广西',
  
  // 内蒙古
  '呼和浩特': '内蒙古', '包头': '内蒙古', '乌海': '内蒙古', '赤峰': '内蒙古', '通辽': '内蒙古', 
  '鄂尔多斯': '内蒙古', '呼伦贝尔': '内蒙古', '巴意郭楞': '内蒙古', '巴彦淖尔': '内蒙古', '乌兰察布': '内蒙古', 
  '兴安盟': '内蒙古', '锡林郭勒盟': '内蒙古', '阿拉善盟': '内蒙古',
  
  // 西藏
  '拉萨': '西藏', '日喀则': '西藏', '昌都': '西藏', '林芝': '西藏', '山南': '西藏', 
  '那曲': '西藏', '阿里': '西藏',
  
  // 山西
  '太原': '山西', '大同': '山西', '阳泉': '山西', '长治': '山西', '晋城': '山西', 
  '朔州': '山西', '晋中': '山西', '运城': '山西', '忻州': '山西', '临汾': '山西', '吕梁': '山西',
  
  // 吉林
  '长春': '吉林', '吉林': '吉林', '四平': '吉林', '辽源': '吉林', '通化': '吉林', 
  '白山': '吉林', '松原': '吉林', '白城': '吉林', '延边': '吉林',
  
  // 黑龙江
  '哈尔滨': '黑龙江', '齐齐哈尔': '黑龙江', '鸡西': '黑龙江', '鹤岗': '黑龙江', '双鸭山': '黑龙江', 
  '大庆': '黑龙江', '伊春': '黑龙江', '佳木斯': '黑龙江', '七台河': '黑龙江', '牡丹江': '黑龙江', 
  '黑河': '黑龙江', '绥化': '黑龙江', '大兴安岭': '黑龙江'
}


// 进度条炫彩渐变色
const customColors = [
  { color: '#818cf8', percentage: 20 },
  { color: '#6366f1', percentage: 40 },
  { color: '#4f46e5', percentage: 60 },
  { color: '#4338ca', percentage: 80 },
  { color: '#3730a3', percentage: 100 }
]

// 数据持久化
watch(visitedPlaces, (newVal) => {
  localStorage.setItem('visited_places_final', JSON.stringify(newVal))
}, { deep: true })

// 核心计算属性：将打卡数据归类到对应省份下
const groupedFootprints = computed(() => {
  const groups = {}
  
  // 初始化 34 省份结构
  provinceNames.forEach(prov => {
    groups[prov] = {
      name: prov,
      visited: false,
      cities: []
    }
  })
  
  // 根据 visitedPlaces 填充数据
  visitedPlaces.value.forEach(input => {
    const name = input.trim()
    const clean = name.replace(/(市|省|自治区|特别行政区|壮族|回族|维吾尔)$/, '')
    
    let matchedProvince = null
    if (provinceNames.includes(clean)) {
      matchedProvince = clean
    } else if (cityMap[clean]) {
      matchedProvince = cityMap[clean]
    } else {
      // 模糊匹配省份名称
      matchedProvince = provinceNames.find(p => p.includes(clean) || clean.includes(p))
    }
    
    if (matchedProvince) {
      groups[matchedProvince].visited = true
      
      // 如果输入的是具体的城市名字（且不是直辖市本身），则将其加入省份的城市列表
      const isMunicipality = ['北京', '上海', '天津', '重庆'].includes(matchedProvince)
      if (clean !== matchedProvince || isMunicipality) {
        if (!groups[matchedProvince].cities.includes(name)) {
          groups[matchedProvince].cities.push(name)
        }
      }
    }
  })
  
  return groups
})

// 计算已点亮的省份总数
const visitedProvincesCount = computed(() => {
  return Object.values(groupedFootprints.value).filter(p => p.visited).length
})

// 计算已到访省份列表 (仅包含 visited 为 true 的)
const visitedProvincesList = computed(() => {
  return Object.values(groupedFootprints.value)
    .filter(p => p.visited)
    .sort((a, b) => b.cities.length - a.cities.length) // 城市多的排在前面
})

// 点亮百分比
const visitedPercentage = computed(() => {
  return Math.round((visitedProvincesCount.value / 34) * 100)
})

// 初始化地图
const initMap = async () => {
  if (!chinaMapRef.value) return
  if (!mapInstance) {
    mapInstance = echarts.init(chinaMapRef.value)
    try {
      const response = await axios.get('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json')
      echarts.registerMap('china', response.data)
    } catch (error) {
      console.error('地图数据加载失败', error)
      return
    }
  }
  renderMap()
}

// 渲染地图
const renderMap = () => {
  const mapData = provinceNames.map(name => {
    const isLit = groupedFootprints.value[name]?.visited
    return {
      name: name,
      value: isLit ? 1 : 0,
      itemStyle: {
        areaColor: isLit ? '#6366f1' : '#f8fafc',
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
        selectedMode: false 
      }
    ]
  }
  
  mapInstance.setOption(option, true)
}

// 添加足迹
const addFootprint = () => {
  const val = newPlace.value.trim()
  if (val && !visitedPlaces.value.includes(val)) {
    visitedPlaces.value.push(val)
    newPlace.value = ''
    renderMap()
    ElMessage.success(`已点亮地区: ${val}`)
  }
}

// 移除足迹
const removeFootprint = (place) => {
  visitedPlaces.value = visitedPlaces.value.filter(p => p !== place)
  renderMap()
}

// 快速点击列表方块直接点亮/取消点亮省份
const handleTileClick = (province) => {
  const isVisited = groupedFootprints.value[province]?.visited
  if (isVisited) {
    ElMessageBox.confirm(`确定要移除对 ${province} 的所有足迹记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 过滤掉所有属于该省份的输入项以及省份本身
      visitedPlaces.value = visitedPlaces.value.filter(place => {
        const clean = place.trim().replace(/(市|省|自治区|特别行政区|壮族|回族|维吾尔)$/, '')
        return clean !== province && cityMap[clean] !== province
      })
      renderMap()
      ElMessage.success(`已清除 ${province} 的打卡足迹`)
    })
  } else {
    visitedPlaces.value.push(province)
    renderMap()
    ElMessage.success(`已成功点亮 ${province}`)
  }
}

// 清除整个省份的足迹记录
const removeWholeProvince = (provName) => {
  handleTileClick(provName)
}

// 清空所有
const clearAll = () => {
  ElMessageBox.confirm('确定要清空所有点亮的足迹吗？此操作不可撤销。', '重置提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    visitedPlaces.value = []
    renderMap()
    ElMessage.success('已清空全部足迹')
  })
}

// 窗口尺寸自适应
const handleResize = () => {
  if (mapInstance) {
    mapInstance.resize()
  }
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
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.footprint-view { padding: 20px; margin: 0 auto; }
.page-title-section { margin-bottom: 24px; border-left: 4px solid #6366f1; padding-left: 20px; }
.section-title { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0; }
.section-subtitle { color: #64748b; margin-top: 5px; font-size: 14px; }

/* 玻璃拟态卡片通用样式 */
.glass-card { 
  border-radius: 24px; 
  background: rgba(255, 255, 255, 0.75) !important; 
  backdrop-filter: blur(20px); 
  border: 1px solid rgba(255, 255, 255, 0.5); 
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.05); 
  margin-bottom: 24px;
}

/* 控制操作栏 */
.control-panel-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6)) !important;
}
.input-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
.input-with-button { display: flex; gap: 12px; align-items: center; flex: 1; max-width: 650px; }
.city-input { max-width: 500px; flex: 1; }
.city-input :deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02) !important;
  border: 1px solid #e2e8f0;
}
.city-input :deep(.el-input__wrapper.is-focus) {
  border-color: #6366f1;
}

.lit-btn {
  background: #6366f1 !important;
  border-color: #6366f1 !important;
  color: #ffffff !important;
  font-weight: 600;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 0 24px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}
.lit-btn:hover {
  background: #4f46e5 !important;
  border-color: #4f46e5 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
}

.clear-btn {
  border-radius: 10px;
  gap: 6px;
}

/* 标签展示 */
.tags-section {
  display: flex;
  align-items: center;
  margin-top: 18px;
  border-top: 1px dashed #e2e8f0;
  padding-top: 18px;
  gap: 12px;
}
.tags-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}
.city-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.city-tag { 
  border-radius: 8px; 
  font-weight: 500; 
  padding: 6px 12px; 
  height: auto; 
  font-size: 13px; 
  border: none; 
  background: #4f46e5; 
  color: #fff;
  box-shadow: 0 3px 8px rgba(79, 70, 229, 0.2); 
}

/* 双栏主布局 */
.main-layout-row {
  margin-bottom: 24px;
}
.layout-col {
  display: flex;
  flex-direction: column;
}

/* 左栏：地图 */
.map-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.card-header-glow {
  padding: 16px 24px;
  background: linear-gradient(90deg, rgba(99,102,241,0.06), transparent);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}
.header-icon {
  color: #6366f1;
}
.china-map-container { 
  width: 100%; 
  height: 650px; 
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6), transparent);
}

/* 右栏：足迹文字档案 */
.text-archive-card {
  display: flex;
  flex-direction: column;
  height: auto;
}
.archive-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.header-title {
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}
.stats-badge {
  font-size: 13px;
  color: #64748b;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 30px;
  border: 1px solid #e2e8f0;
}
.stats-badge strong {
  color: #6366f1;
  font-size: 15px;
}

.progress-container {
  margin-bottom: 20px;
}
.custom-progress :deep(.el-progress-bar__inner) {
  border-radius: 30px;
}

/* Tabs样式自定义 */
.archive-tabs :deep(.el-tabs__header) {
  margin-bottom: 18px;
}
.archive-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e2e8f0;
}
.archive-tabs :deep(.el-tabs__active-bar) {
  background-color: #6366f1;
  height: 3px;
  border-radius: 3px;
}
.custom-tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}

/* 滚动容器 */
.scrollbar-container {
  height: 480px;
  overflow-y: auto;
  padding-right: 8px;
}
/* 隐藏滚动条但保留功能 */
.scrollbar-container::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
.scrollbar-container::-webkit-scrollbar-track {
  background: transparent;
}

/* Tab 1: 已到访卡片式列表 */
.province-collapse-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.province-item-card {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  transition: all 0.25s;
}
.province-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.04);
  border-color: rgba(99, 102, 241, 0.15);
}
.province-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.prov-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.prov-marker {
  width: 4px;
  height: 14px;
  background: #6366f1;
  border-radius: 4px;
}
.prov-name {
  font-size: 15px;
  color: #1e293b;
  font-weight: 700;
}
.prov-count-tag {
  border-radius: 6px;
  font-weight: 600;
  font-size: 11px;
}
.delete-prov-btn {
  font-size: 12px;
  color: #ef4444;
}
.delete-prov-btn:hover {
  color: #dc2626;
}

.province-cities-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
}
.city-bubble {
  font-size: 12px;
  background: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 4px 8px 4px 10px;
  border-radius: 6px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: default;
  transition: all 0.2s;
}
.city-bubble:hover {
  border-color: #cbd5e1;
  color: #334155;
}
.close-city-icon {
  font-size: 11px;
  cursor: pointer;
  color: #94a3b8;
  border-radius: 50%;
  padding: 1px;
  transition: all 0.15s;
}
.close-city-icon:hover {
  background-color: #ef4444;
  color: #ffffff;
}
.city-bubble-province-only {
  font-size: 12px;
  color: #94a3b8;
  font-style: italic;
}

/* Tab 2: 全国清单宫格磁贴 */
.region-group {
  margin-bottom: 20px;
}
.region-title {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  margin: 0 0 10px 0;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 6px;
}
.region-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
  gap: 8px;
}
.province-grid-tile {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 52px;
}
.province-grid-tile:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border-color: #cbd5e1;
}

.tile-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tile-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}
.tile-check-icon {
  color: #6366f1;
  font-size: 14px;
}
.tile-plus-icon {
  color: #94a3b8;
  font-size: 11px;
  opacity: 0;
  transition: opacity 0.2s;
}
.province-grid-tile:hover .tile-plus-icon {
  opacity: 1;
}

.tile-bottom {
  margin-top: 4px;
}
.tile-desc {
  font-size: 9px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.tile-desc.unvisited {
  color: #94a3b8;
}
.tile-desc.active {
  color: #4f46e5;
  font-weight: 600;
}

/* 激活磁贴样式 */
.province-grid-tile.is-active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.03));
  border-color: rgba(99, 102, 241, 0.3);
}
.province-grid-tile.is-active:hover {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
}
.province-grid-tile.is-active .tile-name {
  color: #4f46e5;
}

@media (max-width: 992px) {
  .china-map-container {
    height: 450px;
  }
  .scrollbar-container {
    height: 380px;
  }
}

@media (max-width: 768px) {
  .footprint-view {
    padding: 10px;
  }
  .input-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .input-with-button {
    width: 100%;
    max-width: 100%;
  }
  .clear-btn {
    align-self: flex-start;
  }
  .china-map-container {
    height: 320px !important;
  }
  .scrollbar-container {
    height: 340px;
  }
  .tags-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 576px) {
  .input-with-button {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .city-input {
    max-width: 100%;
  }
  .lit-btn {
    width: 100%;
  }
}
</style>
