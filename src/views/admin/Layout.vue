<template>
  <el-container class="admin-layout">
    <el-aside :width="isCollapse ? '64px' : '240px'" class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo" v-show="!isCollapse">
          <el-icon :size="24"><HomeFilled /></el-icon>
          <span class="logo-text">智慧社区管理</span>
        </div>
        <el-icon :size="20" class="collapse-btn" @click="isCollapse = !isCollapse">
          <DArrowLeft v-if="!isCollapse" />
          <DArrowRight v-else />
        </el-icon>
      </div>
      <el-menu
        router
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="$route.path"
        class="sidebar-menu"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>数据概览</template>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><UserFilled /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/building-house">
          <el-icon><OfficeBuilding /></el-icon>
          <template #title>楼栋房屋</template>
        </el-menu-item>
        <el-menu-item index="/admin/building-visual">
          <el-icon><Location /></el-icon>
          <template #title>楼栋平面图</template>
        </el-menu-item>
        <el-menu-item index="/admin/fee">
          <el-icon><Money /></el-icon>
          <template #title>费用管理</template>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-footer" v-show="!isCollapse">
        <div class="user-info">
          <el-avatar :size="32" class="user-avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="user-detail">
            <div class="user-name">{{ userInfo?.realName || '管理员' }}</div>
            <div class="user-role">管理员</div>
          </div>
        </div>
      </div>
    </el-aside>
    <el-container class="main-wrapper">
      <el-header class="top-header">
        <div class="breadcrumb">
          <span class="page-title">{{ currentPageTitle }}</span>
        </div>
        <div class="header-actions">
          <el-badge :value="3" class="action-item">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>
          <el-icon :size="20" class="action-item"><Operation /></el-icon>
          <el-divider direction="vertical" />
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :size="28" class="header-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="header-username">{{ userInfo?.realName || '管理员' }}</span>
              <el-icon><ArrowDownBold /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)
const userInfo = ref(null)

onMounted(() => {
  userInfo.value = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
})

const currentPageTitle = computed(() => {
  const titles = {
    '/admin/dashboard': '数据概览',
    '/admin/users': '用户管理',
    '/admin/building-house': '楼栋房屋管理',
    '/admin/building-visual': '楼栋平面图',
    '/admin/fee': '费用管理'
  }
  return titles[route.path] || '智慧社区管理'
})

const handleCommand = (cmd) => {
  if (cmd === 'logout') {
    sessionStorage.clear()
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.admin-layout { height: 100vh; }

.sidebar {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  z-index: 10;

  .sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;
      font-weight: 700;
      font-size: 16px;

      .logo-text {
        white-space: nowrap;
      }
    }

    .collapse-btn {
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: color 0.2s;
      padding: 4px;
      border-radius: 6px;

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .sidebar-menu {
    flex: 1;
    background: transparent !important;
    border-right: none;
    padding: 12px 0;

    :deep(.el-menu-item) {
      color: rgba(255, 255, 255, 0.7) !important;
      margin: 4px 12px;
      border-radius: 10px;
      height: 44px;
      line-height: 44px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08) !important;
        color: white !important;
      }

      &.is-active {
        background: linear-gradient(135deg, $primary, $primary-light) !important;
        color: white !important;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }

      .el-icon {
        font-size: 18px;
        margin-right: 8px;
      }
    }
  }

  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .user-avatar {
        background: linear-gradient(135deg, $primary, $primary-light);
        color: white;
        flex-shrink: 0;
      }

      .user-detail {
        overflow: hidden;

        .user-name {
          color: white;
          font-weight: 600;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          margin-top: 2px;
        }
      }
    }
  }
}

.main-wrapper {
  background: $bg-secondary;
  overflow: hidden;
}

.top-header {
  height: 64px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid $border-color;
  box-shadow: $shadow-sm;

  .page-title {
    font-size: 18px;
    font-weight: 700;
    color: $text-primary;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .action-item {
      color: $text-secondary;
      cursor: pointer;
      transition: color 0.2s;
      padding: 6px;
      border-radius: 8px;

      &:hover {
        color: $primary;
        background: $primary-50;
      }
    }

    .user-dropdown {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background 0.2s;

      &:hover {
        background: $gray-100;
      }

      .header-avatar {
        background: linear-gradient(135deg, $primary, $primary-light);
        color: white;
      }

      .header-username {
        font-weight: 500;
        color: $text-primary;
        font-size: 13px;
      }
    }
  }
}

.main-content {
  padding: 24px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
