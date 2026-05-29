<template>
  <div class="auth-page">
    <div class="auth-bg">
      <div class="auth-shape shape-1" />
      <div class="auth-shape shape-2" />
      <div class="auth-shape shape-3" />
    </div>
    <div class="auth-container">
      <div class="auth-brand">
        <div class="brand-logo">
          <el-icon :size="32"><User /></el-icon>
        </div>
        <h1 class="brand-name">智慧社区</h1>
        <p class="brand-slogan">加入我们，开启智慧生活</p>
      </div>
      <div class="auth-card">
        <div class="auth-card-header">
          <h2 class="auth-title">业主注册</h2>
          <p class="auth-subtitle">创建您的专属账号</p>
        </div>
        <el-form :model="form" @submit.prevent="handleRegister" class="auth-form">
          <el-form-item>
            <el-input v-model="form.username" placeholder="用户名" size="large">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.realName" placeholder="真实姓名" size="large">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.phone" placeholder="手机号" size="large">
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-button type="primary" size="large" @click="handleRegister" class="auth-btn">
            注册
          </el-button>
          <div class="auth-links">
            <el-link type="primary" @click="$router.push('/login')">已有账号？返回登录</el-link>
          </div>
        </el-form>
      </div>
      <p class="auth-footer">智慧社区管理系统 v1.0</p>
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
  if (!form.value.username || !form.value.password) return ElMessage.warning('请填写完整')
  try {
    await request.post('/auth/register', form.value)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (e) {}
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;

  .auth-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.4;
    animation: float 8s ease-in-out infinite;
  }

  .shape-1 {
    width: 400px;
    height: 400px;
    background: #60a5fa;
    top: -100px;
    right: -50px;
    animation-delay: 0s;
  }

  .shape-2 {
    width: 300px;
    height: 300px;
    background: #a78bfa;
    bottom: -80px;
    left: -80px;
    animation-delay: 2s;
  }

  .shape-3 {
    width: 200px;
    height: 200px;
    background: #34d399;
    top: 50%;
    left: 50%;
    animation-delay: 4s;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.auth-brand {
  text-align: center;
  margin-bottom: 32px;

  .brand-logo {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: white;
    font-size: 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .brand-name {
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
  }

  .brand-slogan {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }
}

.auth-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-card-header {
  text-align: center;
  margin-bottom: 28px;

  .auth-title {
    font-size: 22px;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 6px;
  }

  .auth-subtitle {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }
}

.auth-form {
  :deep(.el-input__wrapper) {
    border-radius: 12px !important;
    padding: 4px 16px !important;
    box-shadow: 0 0 0 1px $border-color inset !important;
    transition: all 0.2s ease;

    &:hover, &.is-focus {
      box-shadow: 0 0 0 1px $primary inset !important;
    }
  }

  :deep(.el-input__inner) {
    height: 44px;
    font-size: 14px;
  }

  :deep(.el-input__prefix) {
    color: $text-tertiary;
    margin-right: 8px;
  }
}

.auth-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px !important;
  font-size: 16px;
  font-weight: 600;
  margin-top: 12px;
  background: linear-gradient(135deg, $primary, $primary-light) !important;
  border: none !important;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4) !important;
  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5) !important;
  }
}

.auth-links {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.auth-footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-top: 24px;
}
</style>
