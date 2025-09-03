<template>
  <div id="app" :class="{ 'dark': appStore.theme === 'dark' }">
    <!-- Header Component -->
    <AppHeader />
    
    <!-- Main Layout -->
    <div class="app-layout">
      <!-- Sidebar for non-login views -->
      <AppSidebar v-if="appStore.currentView !== 'login'" />
      
      <!-- Main Content Area -->
      <main class="main-content" :class="{ 'full-width': appStore.currentView === 'login' }">
        <!-- Dynamic View Rendering -->
        <LoginView v-if="appStore.currentView === 'login'" />
        <AdminView v-else-if="appStore.currentView === 'admin'" />
        <StudentView v-else-if="appStore.currentView === 'student'" />
        <div v-else class="loading-view">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/useAppStore.js'
import AppHeader from './components/common/AppHeader.vue'
import AppSidebar from './components/common/AppSidebar.vue'
import LoginView from './views/login/LoginView.vue'
import AdminView from './views/admin/AdminView.vue'
import StudentView from './views/student/StudentView.vue'

const appStore = useAppStore()

onMounted(async () => {
  console.log('[v0] App mounted, initializing...')
  await appStore.initializeApp()
  console.log('[v0] App initialized, current view:', appStore.currentView)
})
</script>

<style scoped>
.app-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 100px);
}

.main-content.full-width {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-glass);
  border-top: 3px solid var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .app-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
