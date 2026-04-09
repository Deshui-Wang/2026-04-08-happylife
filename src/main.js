import { createApp } from 'vue'
import App from './App.vue'
import './style.css' // 导入我们匠心打造的设计系统

// 导入 Element Plus 全量样式：确保所有组件样式一致且呈现最佳视觉形态
import 'element-plus/dist/index.css'
// 导入深色模式变量 (如果需要)
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
app.mount('#app')
