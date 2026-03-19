<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const mobileNavOpen = ref(false)

const role = computed(() => auth.user?.role || '')

const links = computed(() => {
  if (role.value === 'Admin') {
    return [
      { to: '/admin/dashboard', label: '概览' },
      { to: '/admin/specialists', label: '专家管理' },
      { to: '/admin/expertise', label: '专长类目' },
      { to: '/admin/slots', label: '时段管理' },
      { to: '/admin/pricing', label: '定价规则' },
      { to: '/admin/bookings', label: '预约管理' }
    ]
  }
  if (role.value === 'Specialist') {
    return [
      { to: '/specialist/dashboard', label: '仪表盘' },
      { to: '/specialist/requests', label: '待处理预约' },
      { to: '/specialist/schedule', label: '日程' }
    ]
  }
  if (role.value === 'Customer') {
    return [
      { to: '/customer/specialists', label: '专家' },
      { to: '/customer/bookings', label: '我的预约' },
      { to: '/customer/profile', label: '个人资料' }
    ]
  }
  return []
})

async function onLogout() {
  await auth.logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <div class="app">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <div class="brand__name">Consultancy Booking</div>
        <div v-if="auth.user" class="brand__meta">
          <span class="pill">{{ auth.user.role }}</span>
          <span class="muted">{{ auth.user.name || auth.user.email }}</span>
        </div>
      </div>

      <nav class="sidebar__nav">
        <router-link v-for="l in links" :key="l.to" :to="l.to">{{ l.label }}</router-link>
      </nav>

      <div class="sidebar__footer">
        <button class="btn btn--ghost" @click="onLogout">退出</button>
      </div>
    </aside>

    <div class="content">
      <header class="topbar">
        <button class="icon-btn" @click="mobileNavOpen = !mobileNavOpen" aria-label="Toggle navigation">
          ☰
        </button>
        <div class="topbar__title">{{ auth.user?.role || '' }}</div>
        <button class="btn btn--ghost" @click="onLogout">退出</button>
      </header>

      <nav v-if="mobileNavOpen" class="mobile-nav">
        <router-link
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          @click="mobileNavOpen = false"
        >
          {{ l.label }}
        </router-link>
      </nav>

      <main class="content__main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #F0EAE5;
  color: #111827;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 14px;
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
}
.sidebar__brand {
  padding: 10px 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.brand__name {
  font-weight: 800;
  letter-spacing: 0.4px;
}
.brand__meta {
  display: flex;
  gap: 10px;
  margin-top: 4px;
  align-items: center;
}
.pill {
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
}
.muted {
  opacity: 0.8;
  font-size: 13px;
}
.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 2px;
}
.sidebar__footer {
  padding: 8px 2px;
}
.content {
  min-width: 0;
  display: grid;
  grid-template-rows: auto auto 1fr;
}
a {
  color: #a9b6ff;
  text-decoration: none;
  padding: 10px 10px;
  border-radius: 12px;
}
a.router-link-active {
  color: #111827;
  background: rgba(169, 182, 255, 0.14);
}
.topbar {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.topbar__title {
  font-weight: 700;
  opacity: 0.9;
}
.icon-btn {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: #111827;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
}
.mobile-nav {
  display: none;
  padding: 10px 14px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.mobile-nav a {
  display: block;
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.content__main {
  padding: 18px 20px 60px;
  max-width: 1280px;
  width: 100%;
}
.btn {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: #111827;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}
.btn--ghost {
  background: transparent;
}

@media (max-width: 980px) {
  .app {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
  .topbar {
    display: flex;
  }
  .mobile-nav {
    display: block;
  }
  .content__main {
    padding: 16px 14px 50px;
  }
}
</style>
