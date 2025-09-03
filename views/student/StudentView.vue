<template>
  <div class="student-view">
     Main Content Area 
    <div class="student-content glass-effect">
       Dynamic Component Rendering 
      <StudentDashboard v-if="appStore.studentActiveSection === 'dashboard'" />
      <StudyRooms v-else-if="appStore.studentActiveSection === 'rooms'" />
      <Resources v-else-if="appStore.studentActiveSection === 'resources'" />
      <MySessions v-else-if="appStore.studentActiveSection === 'sessions'" />
      <Evaluations v-else-if="appStore.studentActiveSection === 'evaluations'" />
      <TopContributors v-else-if="appStore.studentActiveSection === 'contributors'" />
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/useAppStore.js'
import StudentDashboard from '../../components/student/StudentDashboard.vue'
import StudyRooms from '../../components/student/StudyRooms.vue'
import Resources from '../../components/student/Resources.vue'
import MySessions from '../../components/student/MySessions.vue'
import Evaluations from '../../components/student/Evaluations.vue'
import TopContributors from '../../components/student/TopContributors.vue'

const appStore = useAppStore()
</script>

<style scoped>
.student-view {
  width: 100%;
}

.student-content {
  padding: 2rem;
  min-height: 600px;
}

@media (max-width: 768px) {
  .student-content {
    padding: 1.5rem;
  }
}
</style>
