<template>
  <el-container class="owner-layout">
    <el-aside width="200px">
      <div class="logo">业主服务中心</div>
      <el-menu router background-color="#1a73e8" text-color="#fff" active-text-color="#ffd04b" :default-active="$route.path">
        <el-menu-item index="/owner/home"><el-icon><HomeFilled /></el-icon><span>首页</span></el-menu-item>
        <el-menu-item index="/owner/bills"><el-icon><Money /></el-icon><span>在线缴费</span></el-menu-item>
        <el-menu-item index="/owner/repairs"><el-icon><Tools /></el-icon><span>设施报修</span></el-menu-item>
        <el-menu-item index="/owner/parking"><el-icon><Car /></el-icon><span>车位管理</span></el-menu-item>
        <el-menu-item index="/owner/announcements"><el-icon><Bell /></el-icon><span>社区公告</span></el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span>欢迎回来，{{ userInfo?.realName || '业主' }}</span>
        <el-button type="danger" size="small" @click="logout">退出登录</el-button>
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
.owner-layout { height: 100vh; }
.logo { height: 60px; line-height: 60px; text-align: center; color: #fff; font-weight: bold; background: #155bb5; }
.header { background: #fff; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
.main-content { background: #f0f2f5; padding: 20px; }
</style>
