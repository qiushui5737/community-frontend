<template>
  <el-container class="owner-layout">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo" v-show="!isCollapse">
          <el-icon :size="24"><HomeFilled /></el-icon>
          <span class="logo-text">业主服务中心</span>
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
        <el-menu-item index="/owner/home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/owner/bills">
          <el-icon><Money /></el-icon>
          <template #title>在线缴费</template>
        </el-menu-item>
        <el-menu-item index="/owner/repairs">
          <el-icon><Tools /></el-icon>
          <template #title>设施报修</template>
        </el-menu-item>
        <el-menu-item index="/owner/parking">
          <el-icon><Car /></el-icon>
          <template #title>车位管理</template>
        </el-menu-item>
        <el-menu-item index="/owner/announcements">
          <el-icon><Bell /></el-icon>
          <template #title>社区公告</template>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-footer" v-show="!isCollapse">
        <div class="user-info">
          <el-avatar :size="32" class="user-avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="user-detail">
            <div class="user-name">{{ userInfo?.realName || '业主' }}</div>
            <div class="user-role">业主</div>
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
          <el-badge :value="2" class="action-item">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :size="28" class="header-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="header-username">{{ userInfo?.realName || '业主' }}</span>
              <el-icon><ArrowDownBold /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
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
    '/owner/home': '业主首页',
    '/owner/bills': '在线缴费',
    '/owner/repairs': '设施报修',
    '/owner/parking': '车位管理',
    '/owner/announcements': '社区公告'
  }
  return titles[route.path] || '业主服务中心'
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

.owner-layout { height: 100vh; }

.sidebar {
  background: linear-gradient(180deg, #0f766e 0%, #115e59 100%);
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
        background: rgba(255, 255, 255, 0.15) !important;
        color: white !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 600;
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
        background: linear-gradient(135deg, #14b8a6, #0d9488);
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
        background: linear-gradient(135deg, #14b8a6, #0d9488);
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
