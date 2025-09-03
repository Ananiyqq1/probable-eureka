<template>
  <div class="admin-view">
    Main Content Area 
    <div class="admin-content glass-effect">
      Dynamic Component Rendering 
      <AdminDashboard v-if="appStore.adminActiveSection === 'dashboard'" />
      <CourseManagement v-else-if="appStore.adminActiveSection === 'courses'" />
      <TopicManagement v-else-if="appStore.adminActiveSection === 'topics'" />
      <UserManagement v-else-if="appStore.adminActiveSection === 'users'" />
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/useAppStore.js'
import AdminDashboard from '../../components/admin/AdminDashboard.vue'
import CourseManagement from '../../components/admin/CourseManagement.vue'
import TopicManagement from '../../components/admin/TopicManagement.vue'
import UserManagement from '../../components/admin/UserManagement.vue'

const appStore = useAppStore()
</script>

<style scoped>
.admin-view {
  width: 100%;
}

.admin-content {
  padding: 2rem;
  min-height: 600px;
}

@media (max-width: 768px) {
  .admin-content {
    padding: 1.5rem;
  }
}
</style>
