<template>
  <el-container class="admin-layout">
    <el-aside width="220px">
      <div class="logo">物业管理系统</div>
      <el-menu router background-color="#304156" text-color="#fff" active-text-color="#409EFF" :default-active="$route.path">
        <el-menu-item index="/admin/dashboard"><el-icon><DataAnalysis /></el-icon><span>数据概览</span></el-menu-item>
        <el-menu-item index="/admin/users"><el-icon><UserFilled /></el-icon><span>用户管理</span></el-menu-item>
        <el-menu-item index="/admin/buildings"><el-icon><OfficeBuilding /></el-icon><span>楼栋管理</span></el-menu-item>
        <el-menu-item index="/admin/parking"><el-icon><Car /></el-icon><span>车位管理</span></el-menu-item>
        <el-menu-item index="/admin/fee"><el-icon><Money /></el-icon><span>费用管理</span></el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span class="welcome">欢迎回来，{{ userInfo?.realName || '管理员' }}</span>
        <el-button type="danger" size="small" @click="logout">退出</el-button>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const userInfo = ref(null)

onMounted(() => {
  userInfo.value = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
})

const logout = () => {
  sessionStorage.clear() // 或 sessionStorage.removeItem('token'); sessionStorage.removeItem('userInfo')
  router.push('/login')
}

</script>
<style scoped>
.admin-layout { height: 100vh; }
.logo { height: 60px; line-height: 60px; text-align: center; color: #fff; font-weight: bold; background: #263445; }
.header { background: #fff; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
.main-content { background: #f5f7fa; padding: 20px; }
</style>
