<template>
  <el-card class="glass-card expense-section animate-fade-in mb-20">
    <template #header>
      <div class="card-header justify-between">
        <div style="display:flex;align-items:center;gap:8px">
          <el-icon><MagicStick /></el-icon><span>保险支出管理</span>
        </div>
        <el-button class="header-action-btn" size="small" @click="$emit('open-drawer')">
          <el-icon><InfoFilled /></el-icon><span>保单说明</span>
        </el-button>
      </div>
    </template>

    <el-form label-position="top">
      <el-table :data="insuranceList" style="width: 100%" size="small" class="mini-table" :row-class-name="({row}) => !row.enabled ? 'disabled-row' : ''">
        <el-table-column width="45"><template #default="scope"><el-switch v-model="scope.row.enabled" size="small" /></template></el-table-column>
        <el-table-column prop="name" label="保单名称" min-width="120" />
        <el-table-column label="剩余年限" width="80" align="center">
          <template #default="scope">
            <span style="color: #64748b;">{{ scope.row.yearsLeft }} 年</span>
          </template>
        </el-table-column>
        <el-table-column label="年交金额" min-width="90" align="right">
          <template #default="scope">
            <span style="font-weight: 600; color: #475569;">¥{{ Math.round(scope.row.premium).toLocaleString() }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </el-card>
</template>

<script setup>
import { MagicStick, InfoFilled } from '@element-plus/icons-vue'

defineProps({
  insuranceList: { type: Array, required: true }
})

defineEmits(['open-drawer'])
</script>

<style scoped>
.glass-card { background: rgba(255, 255, 255, 0.9); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.3); }
.card-header { display: flex; align-items: center; gap: 8px; font-weight: bold; color: #1e293b; }
.justify-between { justify-content: space-between; }
.mb-20 { margin-bottom: 20px; }

/* 统一的高级胶囊型按钮样式 */
.header-action-btn {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #6366f1 !important;
  background: rgba(99, 102, 241, 0.08) !important;
  border: 1px solid rgba(99, 102, 241, 0.15) !important;
  padding: 4px 12px !important;
  height: 24px !important;
  border-radius: 20px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.header-action-btn:hover {
  background: rgba(99, 102, 241, 0.18) !important;
  border-color: rgba(99, 102, 241, 0.3) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.mini-table :deep(.el-table__cell) { padding: 4px 0; }
:deep(.disabled-row) {
  opacity: 0.4;
  transition: opacity 0.3s ease;
}
.expense-section :deep(.el-switch) { --el-switch-on-color: #4f46e5; }
</style>
