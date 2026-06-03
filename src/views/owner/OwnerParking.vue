<template>
  <el-card shadow="never">
    <el-tabs v-model="activeTab">
      <!-- Tab 1: 可视化选购 -->
      <el-tab-pane label="️ 车位选购" name="visual">
        <div class="chart-wrapper">
          <div ref="chartRef" style="width: 100%; height: 500px"></div>
        </div>
        <div class="legend">
          <span class="dot free"></span> 空闲 (可购买)
          <span class="dot sold"></span> 已售
          <span class="dot ev"></span> 新能源车位
        </div>
      </el-tab-pane>

      <!-- Tab 2: 我的车位 -->
      <el-tab-pane label="🔑 我的车位" name="mine">
        <el-table :data="mySpaces" stripe border>
          <el-table-column prop="spaceNo" label="车位编号" width="120" />
          <el-table-column prop="zone" label="所属区域" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="price" label="购买价格" width="120">
            <template #default="{row}">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="购买时间" width="160" />
        </el-table>
        <el-empty v-if="mySpaces.length===0" description="暂无已购车位" />
      </el-tab-pane>
    </el-tabs>
  </el-card>

  <!-- 购买确认弹窗 -->
  <el-dialog v-model="buyDialog" title="确认购买车位" width="400px">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="车位编号">{{ targetSpace.spaceNo }}</el-descriptions-item>
      <el-descriptions-item label="类型">{{ typeMap[targetSpace.type] }}</el-descriptions-item>
      <el-descriptions-item label="售价">
        <span style="color:#F56C6C; font-weight:bold">¥{{ targetSpace.price }}</span>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="buyDialog=false">取消</el-button>
      <el-button type="primary" @click="confirmPurchase" :loading="buying">确认购买</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('visual')
const chartRef = ref(null)
let chart = null
const mySpaces = ref([])
const buyDialog = ref(false)
const buying = ref(false)
const targetSpace = ref({})
const typeMap = { STANDARD: '标准车位', MINI: '微型车位', EV: '新能源车位' }

// 颜色映射
const colorMap = { FREE: '#67C23A', SOLD: '#909399', EV: '#409EFF' }

const loadVisual = async () => {
  const res = await request.get('/parking/visual')
  renderChart(res.data)
}

const loadMySpaces = async () => {
  const res = await request.get('/parking/my')
  mySpaces.value = res.data
}

const renderChart = (data) => {
  if (!chartRef.value) return
  if (!chart) {
    chart = echarts.init(chartRef.value)
    chart.on('click', (params) => {
      if (params.data.status === 'FREE') {
        targetSpace.value = params.data
        buyDialog.value = true
      }
    })
  }

  // 提取行列范围
  const maxCol = Math.max(...data.map(d => d.colNo))
  const maxRow = Math.max(...data.map(d => d.rowNo))

  chart.setOption({
    tooltip: {
      formatter: p => `<b>${p.data.spaceNo}</b><br/>状态: ${p.data.status}<br/>价格: ¥${p.data.price}`
    },
    xAxis: { type: 'category', data: Array.from({length: maxCol}, (_, i) => i + 1), axisLabel: {fontSize: 12} },
    yAxis: { type: 'category', data: Array.from({length: maxRow}, (_, i) => i + 1), inverse: true, axisLabel: {fontSize: 12} },
    series: [{
      type: 'custom',
      renderItem: (params, api) => {
        const pt = api.coord([api.value(0), api.value(1)])
        const sz = api.size([1, 1])
        return {
          type: 'rect',
          shape: { x: pt[0]-sz[0]/2+2, y: pt[1]-sz[1]/2+2, width: sz[0]-4, height: sz[1]-4, r: 4 },
          style: { fill: colorMap[api.value(3)] || '#ccc' }
        }
      },
      data: data.map(d => ({ ...d })),
      label: { show: true, formatter: p => p.data.spaceNo, fontSize: 11, color: '#fff', textShadowBlur: 2 }
    }],
    grid: { left: '5%', right: '5%', top: '5%', bottom: '5%' }
  })
}

const confirmPurchase = async () => {
  buying.value = true
  try {
    await request.post(`/parking/purchase/${targetSpace.value.id}`)
    ElMessage.success('购买成功！')
    buyDialog.value = false
    loadVisual() // 刷新图表状态
    loadMySpaces() // 刷新我的车位
  } finally { buying.value = false }
}

onMounted(() => {
  loadVisual()
  loadMySpaces()
  window.addEventListener('resize', () => chart?.resize())
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', () => chart?.resize())
  chart?.dispose()
})
</script>
<style scoped>
.chart-wrapper { background: #f5f7fa; border-radius: 8px; padding: 10px; }
.legend { display: flex; justify-content: center; gap: 20px; margin-top: 10px; font-size: 13px; }
.dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 5px; }
.free { background: #67C23A; } .sold { background: #909399; } .ev { background: #409EFF; }
</style>
