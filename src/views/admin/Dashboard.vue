<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in statsList" :key="item.label">
        <el-card shadow="hover"><template #header>{{ item.label }}</template><h2>{{ item.value }}</h2></el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="charts">
      <el-col :span="12"><el-card><div id="feeChart" style="height: 300px;"></div></el-card></el-col>
      <el-col :span="12"><el-card><div id="houseChart" style="height: 300px;"></div></el-card></el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
const statsList = ref([{ label: '用户总数', value: 1280 }, { label: '待办报修', value: 15 }, { label: '房屋总数', value: 856 }, { label: '空闲车位', value: 120 }])
let feeChart, houseChart
onMounted(() => {
  feeChart = echarts.init(document.getElementById('feeChart'))
  feeChart.setOption({ title: { text: '缴费状态统计' }, tooltip: {}, xAxis: { data: ['已缴', '待缴', '逾期'] }, yAxis: {}, series: [{ type: 'bar', data: [320, 150, 45], itemStyle: { color: ['#67C23A', '#E6A23C', '#F56C6C'] } }] })
  houseChart = echarts.init(document.getElementById('houseChart'))
  houseChart.setOption({ title: { text: '房屋入住统计' }, tooltip: { trigger: 'item' }, series: [{ type: 'pie', radius: '50%', data: [{ value: 780, name: '已入住' }, { value: 76, name: '空置' }], emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } } }] })
  window.addEventListener('resize', () => { feeChart?.resize(); houseChart?.resize() })
})
onUnmounted(() => { feeChart?.dispose(); houseChart?.dispose() })
</script>
<style scoped>.dashboard { padding: 20px 0; } .charts { margin-top: 20px; }</style>
