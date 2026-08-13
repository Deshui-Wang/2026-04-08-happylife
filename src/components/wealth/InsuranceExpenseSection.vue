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
