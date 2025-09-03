<template>
  <div class="admin-dashboard">
    <!-- Content Header -->
    <div class="content-header">
      <h1 class="gradient-text">Admin Dashboard</h1>
      <p>Manage students, courses, and topics with powerful tools</p>
    </div>

    <!-- Dashboard Cards Grid -->
    <div class="cards-grid">
      <div 
        v-for="card in dashboardCards" 
        :key="card.id"
        class="card transition-smooth"
        :data-category="card.category"
        @click="handleCardClick(card)"
      >
        <div class="card-header">
          <div class="card-icon">
            <i :class="card.icon"></i>
          </div>
        </div>
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </div>
    </div>

    <!-- Quick Stats Section -->
    <div class="stats-section">
      <h2 class="gradient-text">Quick Statistics</h2>
      <div class="stats-grid">
        <div v-for="stat in quickStats" :key="stat.label" class="stat-card glass-strong">
          <div class="stat-icon">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../stores/useAppStore.js'

const appStore = useAppStore()

const dashboardCards = ref([
  {
    id: 1,
    title: 'Student Statistics',
    description: 'Generate comprehensive analytics and insights',
    icon: 'fas fa-chart-bar',
    category: 'analytics',
    action: 'users'
  },
  {
    id: 2,
    title: 'AI Analytics',
    description: 'Advanced AI-powered statistical analysis',
    icon: 'fas fa-brain',
    category: 'ai',
    action: 'analytics'
  },
  {
    id: 3,
    title: 'Course Management',
    description: 'Create, edit, and organize educational courses',
    icon: 'fas fa-book-open',
    category: 'courses',
    action: 'courses'
  },
  {
    id: 4,
    title: 'Topic Library',
    description: 'Organize and structure learning materials',
    icon: 'fas fa-folder-open',
    category: 'topics',
    action: 'topics'
  }
])

const quickStats = ref([
  {
    label: 'Total Students',
    value: '1,247',
    icon: 'fas fa-users'
  },
  {
    label: 'Active Courses',
    value: '89',
    icon: 'fas fa-book'
  },
  {
    label: 'Study Sessions',
    value: '3,456',
    icon: 'fas fa-clock'
  },
  {
    label: 'Completion Rate',
    value: '87%',
    icon: 'fas fa-chart-line'
  }
])

const handleCardClick = (card) => {
  console.log(`Clicked on: ${card.title}`)
  
  // Navigate to appropriate section
  if (card.action && ['courses', 'topics', 'users'].includes(card.action)) {
    appStore.setAdminSection(card.action)
  }
  
  // Add click animation
  const cardElement = event.currentTarget
  cardElement.style.transform = 'translateY(-8px) scale(0.98)'
  setTimeout(() => {
    cardElement.style.transform = 'translateY(-4px) scale(1)'
  }, 150)
}
</script>

<style scoped>
.admin-dashboard {
  width: 100%;
}

.content-header {
  margin-bottom: 2rem;
}

.content-header h1 {
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.content-header p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-icon {
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  border-radius: 0.75rem;
  transition: transform 0.3s ease;
}

.card:hover .card-icon {
  transform: scale(1.1);
}

.card-icon i {
  font-size: 1.5rem;
  color: var(--bg-glass-strong);
}

.card h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.card:hover h3 {
  color: var(--accent-secondary);
}

.card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.stats-section {
  margin-top: 2rem;
}

.stats-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  padding: 1rem;
  background: var(--bg-glass);
  border-radius: 0.75rem;
  color: var(--accent-primary);
}

.stat-icon i {
  font-size: 1.25rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .content-header h1 {
    font-size: 1.875rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
