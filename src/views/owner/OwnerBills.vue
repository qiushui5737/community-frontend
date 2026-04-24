<template>
  <el-card class="bills-card">
    <template #header>
      <div class="flex-between">
        <span>💰 在线缴费</span>
        <el-tag type="info">当前业主: {{ userInfo?.realName || '未知' }}</el-tag>
      </div>
    </template>

    <!-- 状态筛选 -->
    <el-tabs v-model="activeStatus" @tab-click="handleTabChange" class="mb-4">
      <el-tab-pane label="全部账单" name="ALL"></el-tab-pane>
      <el-tab-pane label="待缴费" name="PENDING"></el-tab-pane>
      <el-tab-pane label="已缴费" name="PAID"></el-tab-pane>
      <el-tab-pane label="已逾期" name="OVERDUE"></el-tab-pane>
    </el-tabs>


    <!-- 账单表格 -->
    <el-table :data="bills" v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="id" label="账单编号" width="100" />
      <el-table-column label="费用类型" width="150">
        <template #default="{row}">{{ getFeeTypeName(row.feeItemId) }}</template>
      </el-table-column>
      <el-table-column prop="amount" label="金额(元)" width="120">
        <template #default="{row}">¥{{ row.amount.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="dueDate" label="到期日期" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{row}">
          <el-tag :type="statusMap[row.status]?.type">{{ statusMap[row.status]?.text }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template #default="{row}">
          <el-button
              v-if="row.status === 'PENDING'"
              type="primary"
              size="small"
              @click="handlePay(row)"
          >
            立即缴费
          </el-button>
          <span v-else class="text-gray">--</span>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && bills.length === 0" description="暂无账单记录" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const userInfo = ref(JSON.parse(sessionStorage.getItem('userInfo') || '{}'))

const activeStatus = ref('ALL')
const bills = ref([])
const loading = ref(false)

const statusMap = {
  PENDING: { text: '待缴费', type: 'warning' },
  PAID:    { text: '已缴费', type: 'success' },
  OVERDUE: { text: '已逾期', type: 'danger' }
}

const getFeeTypeName = (id) => {
  const map = { 1: '物业管理费', 2: '垃圾清运费', 3: '车位管理费', 4: '公摊水电费' }
  return map[id] || `费用项目-${id}`
}

// 👇 关键修复：使用 tab-click 事件，显式获取点击的 pane name
const handleTabChange = async (pane) => {
  const status = pane.props.name // 获取点击的 tab 名称 (ALL, PENDING, PAID, OVERDUE)
  activeStatus.value = status // 同步状态

  loading.value = true
  try {
    // 如果是 ALL，不传 status 参数；否则传具体状态
    const params = status === 'ALL' ? {} : { status: status }
    const res = await request.get('/owner/bills', { params })
    bills.value = res.data || []
  } finally {
    loading.value = false
  }
}

const handlePay = async (bill) => {
  ElMessageBox.confirm(`确认支付 ¥${bill.amount.toFixed(2)} 吗？`, '缴费确认', {
    confirmButtonText: '确认支付',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await request.put(`/owner/bills/${bill.id}/pay`)
      ElMessage.success('支付成功！')
      handleTabChange({ props: { name: activeStatus.value } }) // 支付后刷新当前 tab
    } catch (e) {}
  }).catch(() => {})
}

onMounted(() => {
  // 模拟点击第一个 tab 初始化数据
  handleTabChange({ props: { name: 'ALL' } })
})
</script>


<style scoped>
.bills-card { min-height: 500px; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.mb-4 { margin-bottom: 16px; }
.text-gray { color: #909399; font-size: 12px; }
</style>
