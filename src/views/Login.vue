<template>
  <div class="login-container">
    <div class="login-box">
      <h2>欢迎回家</h2>
      <p class="subtitle">智慧社区 · 共建美好家园</p>
      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
        </el-form-item>

        <el-button type="primary" @click="handleLogin" class="full-width" :loading="loading">
          登录
        </el-button>

        <div class="links">
          <el-link type="primary" @click="toggleRole">
            切换为{{ isOwner ? '管理员' : '业主' }}登录
          </el-link>
          <el-link type="info" @click="$router.push('/register')">没有账号? 立即注册</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const router = useRouter()
const isOwner = ref(true) // true 代表业主，false 代表管理员
const loading = ref(false)
const form = ref({ username: 'testuser', password: '123456' })

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    return ElMessage.warning('请输入用户名和密码')
  }

  loading.value = true
  try {
    // 👇 核心修改：将角色状态映射为后端要求的枚举值，并加入请求体
    const payload = {
      username: form.value.username,
      password: form.value.password,
      role: isOwner.value ? 'OWNER' : 'ADMIN'
    }

    const res = await request.post('/auth/login', payload)


    sessionStorage.setItem('token', res.data.token)
    sessionStorage.setItem('userInfo', JSON.stringify(res.data.user))

    ElMessage.success('登录成功')

    // 👇 根据后端返回的实际角色跳转不同端（防篡改）
    const role = res.data.user.role
    if (role === 'ADMIN' || role === 'STAFF') {
      router.push('/admin')
    } else {
      router.push('/owner') // 业主端路由，后续可补充
    }
  } catch (error) {
    // 错误已在 request.js 拦截器统一提示，此处无需重复处理
  } finally {
    loading.value = false
  }
}

const toggleRole = () => {
  isOwner.value = !isOwner.value
  // 切换角色时可清空密码框，体验更佳
  form.value.password = ''
}
</script>

<style scoped>
.login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.login-box { background: #fff; padding: 40px; border-radius: 12px; width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
h2 { text-align: center; color: #333; margin-bottom: 10px; }
.subtitle { text-align: center; color: #666; margin-bottom: 30px; }
.full-width { width: 100%; margin-top: 10px; }
.links { display: flex; justify-content: space-between; margin-top: 20px; font-size: 12px; }
</style>
