<template>
  <div class="building-visual">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <div class="header-icon">
              <el-icon :size="20"><Location /></el-icon>
            </div>
            <div>
              <div class="header-title">楼栋平面图可视化</div>
              <div class="header-desc">直观查看各楼栋房屋分布及入住状态</div>
            </div>
          </div>
          <div class="header-right">
            <el-select v-model="buildingId" placeholder="选择楼栋" style="width: 200px" @change="loadMap">
              <el-option v-for="b in buildings" :key="b.id" :label="`${b.buildingNo}-${b.name}`" :value="b.id" />
            </el-select>
          </div>
        </div>
      </template>
      <div ref="chartRef" class="chart-area"></div>
      <div class="legend">
        <div class="legend-item"><span class="dot" style="background:#67C23A"></span> 已入住</div>
        <div class="legend-item"><span class="dot" style="background:#E6A23C"></span> 已出租</div>
        <div class="legend-item"><span class="dot" style="background:#909399"></span> 空置</div>
        <div class="legend-item"><span class="dot" style="background:#F56C6C"></span> 异常/维修</div>
      </div>
    </el-card>
    <el-dialog v-model="showDetail" title="房屋详情" width="350px" class="detail-dialog">
      <div class="detail-content">
        <div class="detail-row"><span class="detail-label">房间号</span><span class="detail-value">{{ detail.roomNo }}</span></div>
        <div class="detail-row"><span class="detail-label">面积</span><span class="detail-value">{{ detail.area }} ㎡</span></div>
        <div class="detail-row"><span class="detail-label">状态</span><el-tag :type="statusType[detail.status]">{{ statusText[detail.status] }}</el-tag></div>
        <div class="detail-row"><span class="detail-label">所属</span><span class="detail-value">{{ detail.unitNo }}</span></div>
      </div>
      <template #footer><el-button @click="showDetail=false">关闭</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
import { Location } from '@element-plus/icons-vue'

const chartRef = ref(null)
let chart = null
const buildings = ref([])
const buildingId = ref(null)
const showDetail = ref(false)
const detail = ref({})
const statusType = { OCCUPIED:'success', RENTED:'warning', VACANT:'info' }
const statusText = { OCCUPIED:'已入住', RENTED:'已出租', VACANT:'空置' }

const loadBuildings = async () => {
  const res = await request.get('/buildings/page', { params: { current:1, size:100 } })
  buildings.value = res.data.records
  if (buildings.value.length) { buildingId.value = buildings.value[0].id; loadMap() }
}

const loadMap = async () => {
  const res = await request.get('/houses/map-data', { params: { buildingId: buildingId.value } })
  renderChart(res.data)
}

const renderChart = (data) => {
  if (!chartRef.value) return
  if (!chart) {
    chart = echarts.init(chartRef.value)
    chart.on('click', p => { detail.value = p.data; showDetail.value = true })
  }
  const units = [...new Set(data.map(d=>d.unitNo))]
  const floors = [...new Set(data.map(d=>d.floorNum))].sort((a,b)=>b-a)
  const colorMap = { OCCUPIED:'#67C23A', RENTED:'#E6A23C', VACANT:'#909399' }

  chart.setOption({
    tooltip: { formatter: p => `房间: ${p.data.roomNo}<br/>状态: ${statusText[p.data.status]}` },
    xAxis: { type:'category', data: units, axisLabel:{fontSize:13, fontWeight:'bold'} },
    yAxis: { type:'category', data: floors.map(f=>f+'F'), inverse:true },
    series: [{
      type:'custom',
      renderItem: (p, api) => {
        const pt = api.coord([api.value(0), api.value(1)])
        const sz = api.size([1,1])
        return { type:'rect', shape:{x:pt[0]-sz[0]/2+2, y:pt[1]-sz[1]/2+2, width:sz[0]-4, height:sz[1]-4, r:3}, style:{fill: colorMap[p.data.status]||'#ccc'} }
      },
      data: data.map(d => ({ ...d, value:[units.indexOf(d.unitNo), floors.indexOf(d.floorNum), d] })),
      label: { show:true, formatter: p=>p.data.roomNo, fontSize:11, color:'#fff', textShadowBlur:2 }
    }],
    grid: { left:'8%', right:'5%', top:'5%', bottom:'10%' }
  })
}

onMounted(() => { loadBuildings(); window.addEventListener('resize', ()=>chart?.resize()) })
onBeforeUnmount(() => { window.removeEventListener('resize', ()=>chart?.resize()); chart?.dispose() })
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.building-visual {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .header-title { font-size: 16px; font-weight: 700; color: $text-primary; }
      .header-desc { font-size: 12px; color: $text-secondary; margin-top: 2px; }
    }
  }

  .chart-area {
    width: 100%;
    height: 650px;
  }

  .legend {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 24px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: $text-secondary;
      font-weight: 500;
      padding: 6px 12px;
      background: $gray-50;
      border-radius: 8px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
  }
}

.detail-dialog {
  .detail-content {
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid $border-color;

      &:last-child { border-bottom: none; }

      .detail-label {
        color: $text-secondary;
        font-size: 14px;
      }

      .detail-value {
        font-weight: 600;
        color: $text-primary;
        font-size: 14px;
      }
    }
  }
}
</style>
