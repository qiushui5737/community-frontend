<template>
  <div class="register-container">
    <div class="register-box">
      <h2>业主注册</h2>
      <p class="subtitle">加入智慧社区</p>
      <el-form :model="form" @submit.prevent="handleRegister">
        <el-form-item><el-input v-model="form.username" placeholder="用户名" prefix-icon="User" /></el-form-item>
        <el-form-item><el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" show-password /></el-form-item>
        <el-form-item><el-input v-model="form.realName" placeholder="真实姓名" prefix-icon="Avatar" /></el-form-item>
        <el-form-item><el-input v-model="form.phone" placeholder="手机号" prefix-icon="Phone" /></el-form-item>
        <el-button type="primary" @click="handleRegister" class="full-width">注册</el-button>
        <div class="links">
          <el-link type="primary" @click="$router.push('/login')">返回登录</el-link>
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
const form = ref({ username: '', password: '', realName: '', phone: '' })

const handleRegister = async () => {
  if(!form.value.username || !form.value.password) return ElMessage.warning('请填写完整')
  try {
    await request.post('/auth/register', form.value)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (e) {
    // 错误已经在 request.js 里统一处理了，这里不需要重复提示
  }
}
</script>
<style scoped>
.register-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.register-box { background: #fff; padding: 40px; border-radius: 12px; width: 400px; }
h2 { text-align: center; margin-bottom: 10px; }
.subtitle { text-align: center; color: #666; margin-bottom: 30px; }
.full-width { width: 100%; margin-top: 10px; }
.links { text-align: right; margin-top: 20px; }
</style>
