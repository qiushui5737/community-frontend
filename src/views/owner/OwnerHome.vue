<template>
  <div class="owner-home">
    <el-row :gutter="20">
      <el-col :span="8" v-for="card in quickLinks" :key="card.title">
        <el-card shadow="hover" class="quick-card" @click="$router.push(card.path)">
          <el-icon :size="40" :color="card.color"><component :is="card.icon" /></el-icon>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="mt-4">
      <template #header><span>📢 最新公告</span></template>
      <el-empty description="暂无最新公告，请前往公告栏查看" />
    </el-card>
  </div>
</template>
<script setup>
const quickLinks = [
  { title: '在线缴费', desc: '查看并缴纳物业费', icon: 'Money', color: '#67C23A', path: '/owner/bills' },
  { title: '设施报修', desc: '提交家庭/公共报修', icon: 'Tools', color: '#E6A23C', path: '/owner/repairs' },
  { title: '社区公告', desc: '浏览物业最新通知', icon: 'Bell', color: '#409EFF', path: '/owner/announcements' }
]
</script>
<style scoped>
.quick-card { text-align: center; cursor: pointer; transition: transform 0.3s; }
.quick-card:hover { transform: translateY(-5px); }
.mt-4 { margin-top: 20px; }
</style>
