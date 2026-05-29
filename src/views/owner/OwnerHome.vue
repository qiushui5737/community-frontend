<template>
  <div class="owner-home">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎回来，{{ userInfo?.realName || '业主' }}</h1>
        <p class="welcome-desc">这里是您的智慧社区服务中心，为您提供便捷的社区服务</p>
      </div>
      <div class="welcome-illustration">
        <el-icon :size="80" color="#e2e8f0"><HomeFilled /></el-icon>
      </div>
    </div>

    <!-- 快捷入口 -->
    <el-row :gutter="20">
      <el-col :span="8" v-for="card in quickLinks" :key="card.title">
        <div class="quick-card" @click="$router.push(card.path)">
          <div class="quick-icon" :style="{ background: card.bg, color: card.color }">
            <el-icon :size="28"><component :is="card.icon" /></el-icon>
          </div>
          <div class="quick-info">
            <h3 class="quick-title">{{ card.title }}</h3>
            <p class="quick-desc">{{ card.desc }}</p>
          </div>
          <el-icon class="quick-arrow"><ArrowRight /></el-icon>
        </div>
      </el-col>
    </el-row>

    <!-- 公告区域 -->
    <el-card class="announcement-card" shadow="never">
      <template #header>
        <div class="announcement-header">
          <div class="announcement-title">
            <el-icon><Bell /></el-icon>
            <span>最新公告</span>
          </div>
          <el-link type="primary" @click="$router.push('/owner/announcements')">查看全部</el-link>
        </div>
      </template>
      <div class="announcement-list">
        <div v-for="i in 3" :key="i" class="announcement-item">
          <div class="announcement-dot" />
          <div class="announcement-content">
            <div class="announcement-text">社区春季绿化维护通知 - 将于下周一开始进行</div>
            <div class="announcement-date">2024-03-{{ 20 + i }}</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 快捷统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8" v-for="stat in stats" :key="stat.label">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: stat.bg, color: stat.color }">
            <el-icon :size="22"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { HomeFilled, Money, Tools, Bell, ArrowRight, Calendar, Document, CreditCard } from '@element-plus/icons-vue'

const userInfo = ref(JSON.parse(sessionStorage.getItem('userInfo') || '{}'))

const quickLinks = [
  { title: '在线缴费', desc: '查看并缴纳物业费', icon: 'Money', bg: '#dbeafe', color: '#2563eb', path: '/owner/bills' },
  { title: '设施报修', desc: '提交家庭/公共报修', icon: 'Tools', bg: '#fef3c7', color: '#d97706', path: '/owner/repairs' },
  { title: '社区公告', desc: '浏览物业最新通知', icon: 'Bell', bg: '#d1fae5', color: '#059669', path: '/owner/announcements' }
]

const stats = [
  { label: '待缴账单', value: '3 笔', icon: 'CreditCard', bg: '#fee2e2', color: '#ef4444' },
  { label: '本月已缴', value: '¥ 280.00', icon: 'Money', bg: '#d1fae5', color: '#10b981' },
  { label: '维修进度', value: '1 项', icon: 'Tools', bg: '#dbeafe', color: '#3b82f6' }
]
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.owner-home {
  .welcome-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 32px 40px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
    }

    .welcome-title {
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin: 0 0 8px;
    }

    .welcome-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    .welcome-illustration {
      opacity: 0.3;
    }
  }

  .quick-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid $border-color;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      box-shadow: $shadow-md;
      transform: translateY(-4px);
      border-color: $primary-200;
    }

    .quick-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .quick-info {
      flex: 1;

      .quick-title {
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
        margin: 0 0 4px;
      }

      .quick-desc {
        font-size: 13px;
        color: $text-secondary;
        margin: 0;
      }
    }

    .quick-arrow {
      color: $text-tertiary;
      transition: transform 0.3s;
    }

    &:hover .quick-arrow {
      transform: translateX(4px);
      color: $primary;
    }
  }

  .announcement-card {
    margin-top: 24px;

    :deep(.el-card__header) {
      padding: 16px 20px;
    }

    .announcement-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .announcement-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 15px;
        color: $text-primary;

        .el-icon { color: $primary; }
      }
    }

    .announcement-list {
      .announcement-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 0;
        border-bottom: 1px solid $border-color;

        &:last-child { border-bottom: none; }

        .announcement-dot {
          width: 8px;
          height: 8px;
          background: $primary;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .announcement-content {
          flex: 1;

          .announcement-text {
            font-size: 14px;
            color: $text-primary;
            font-weight: 500;
          }

          .announcement-date {
            font-size: 12px;
            color: $text-tertiary;
            margin-top: 4px;
          }
        }
      }
    }
  }

  .stats-row { margin-top: 24px; }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    border: 1px solid $border-color;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: $shadow-md;
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-info {
      .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: $text-primary;
      }

      .stat-label {
        font-size: 13px;
        color: $text-secondary;
        margin-top: 2px;
      }
    }
  }
}
</style>
