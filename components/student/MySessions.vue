<template>
  <div class="my-sessions">
     Content Header 
    <div class="content-header">
      <h1 class="gradient-text">My Sessions</h1>
      <p>Track your active study sessions and progress</p>
    </div>

     Sessions Stats 
    <div class="stats-grid">
      <div class="stat-card glass-strong">
        <div class="stat-icon">
          <i class="fas fa-play-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ activeSessionsCount }}</div>
          <div class="stat-label">Active Sessions</div>
        </div>
      </div>
      <div class="stat-card glass-strong">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalHours }}h</div>
          <div class="stat-label">Total Hours</div>
        </div>
      </div>
      <div class="stat-card glass-strong">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ completedSessions }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>
    </div>

     Filter Tabs 
    <div class="filter-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-button" 
        :class="{ active: activeTab === tab.value }"
        @click="setActiveTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

     Sessions List 
    <div class="sessions-list">
      <div 
        v-for="session in filteredSessions" 
        :key="session.id"
        class="session-card glass-strong transition-smooth"
      >
        <div class="session-header">
          <div class="session-info">
            <h3>{{ session.title }}</h3>
            <span class="session-subject">{{ session.subject }}</span>
          </div>
          <div class="session-status" :class="session.status">
            <i :class="getStatusIcon(session.status)"></i>
            {{ session.status }}
          </div>
        </div>
        
        <p class="session-description">{{ session.description }}</p>
        
        <div class="session-progress" v-if="session.status === 'in-progress'">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: session.progress + '%' }"></div>
          </div>
          <span class="progress-text">{{ session.progress }}% Complete</span>
        </div>
        
        <div class="session-meta">
          <span class="meta-item">
            <i class="fas fa-calendar"></i>
            {{ session.startDate }}
          </span>
          <span class="meta-item">
            <i class="fas fa-clock"></i>
            {{ session.duration }}
          </span>
          <span class="meta-item" v-if="session.participants">
            <i class="fas fa-users"></i>
            {{ session.participants }} participants
          </span>
        </div>
        
        <div class="session-actions">
          <button 
            v-if="session.status === 'in-progress'" 
            class="action-btn primary"
            @click="continueSession(session)"
          >
            <i class="fas fa-play"></i>
            Continue
          </button>
          <button 
            v-else-if="session.status === 'scheduled'" 
            class="action-btn primary"
            @click="startSession(session)"
          >
            <i class="fas fa-play"></i>
            Start
          </button>
          <button 
            v-else 
            class="action-btn secondary"
            @click="viewSession(session)"
          >
            <i class="fas fa-eye"></i>
            View Details
          </button>
          <button class="action-btn secondary" @click="shareSession(session)">
            <i class="fas fa-share"></i>
            Share
          </button>
        </div>
      </div>
    </div>

     Empty State 
    <div v-if="filteredSessions.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-calendar-times"></i>
      </div>
      <h3>No sessions found</h3>
      <p>{{ getEmptyStateMessage() }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')

const tabs = ref([
  { value: 'all', label: 'All Sessions' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' }
])

// Mock sessions data - replace with API calls
const sessions = ref([
  {
    id: 1,
    title: 'Machine Learning Study Group',
    subject: 'AI',
    description: 'Deep dive into neural networks and supervised learning algorithms',
    status: 'in-progress',
    progress: 65,
    startDate: 'Today, 2:00 PM',
    duration: '2 hours',
    participants: 8
  },
  {
    id: 2,
    title: 'JavaScript Fundamentals',
    subject: 'Programming',
    description: 'Learning ES6+ features and modern JavaScript development',
    status: 'scheduled',
    progress: 0,
    startDate: 'Tomorrow, 10:00 AM',
    duration: '1.5 hours',
    participants: 12
  },
  {
    id: 3,
    title: 'Data Structures Review',
    subject: 'Programming',
    description: 'Comprehensive review of arrays, linked lists, and trees',
    status: 'completed',
    progress: 100,
    startDate: 'Yesterday, 3:00 PM',
    duration: '3 hours',
    participants: 15
  },
  {
    id: 4,
    title: 'Network Security Workshop',
    subject: 'Networking',
    description: 'Hands-on cybersecurity practices and threat analysis',
    status: 'in-progress',
    progress: 30,
    startDate: 'Today, 9:00 AM',
    duration: '4 hours',
    participants: 6
  }
])

const filteredSessions = computed(() => {
  if (activeTab.value === 'all') {
    return sessions.value
  }
  return sessions.value.filter(session => session.status === activeTab.value)
})

const activeSessionsCount = computed(() => {
  return sessions.value.filter(s => s.status === 'in-progress').length
})

const totalHours = computed(() => {
  return sessions.value.reduce((total, session) => {
    const hours = parseFloat(session.duration.match(/[\d.]+/)[0])
    return total + hours
  }, 0)
})

const completedSessions = computed(() => {
  return sessions.value.filter(s => s.status === 'completed').length
})

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const getStatusIcon = (status) => {
  const icons = {
    'in-progress': 'fas fa-play-circle',
    'scheduled': 'fas fa-clock',
    'completed': 'fas fa-check-circle'
  }
  return icons[status] || 'fas fa-circle'
}

const getEmptyStateMessage = () => {
  const messages = {
    all: 'Start your first study session to see it here',
    'in-progress': 'No sessions currently in progress',
    scheduled: 'No upcoming sessions scheduled',
    completed: 'No completed sessions yet'
  }
  return messages[activeTab.value] || 'No sessions found'
}

const continueSession = (session) => {
  console.log(`Continuing session: ${session.title}`)
  // TODO: Implement session continuation logic
}

const startSession = (session) => {
  console.log(`Starting session: ${session.title}`)
  // TODO: Implement session start logic
  session.status = 'in-progress'
  session.progress = 5
}

const viewSession = (session) => {
  console.log(`Viewing session: ${session.title}`)
  // TODO: Implement session details view
}

const shareSession = (session) => {
  console.log(`Sharing session: ${session.title}`)
  // TODO: Implement session sharing functionality
}
</script>

<style scoped>
.my-sessions {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  padding: 1rem;
  background: var(--accent-primary);
  border-radius: 0.75rem;
  color: var(--bg-glass-strong);
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

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-glass);
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: var(--text-primary);
}

.tab-button.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.session-card {
  padding: 1.5rem;
  border-radius: 1rem;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.session-info h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.session-subject {
  font-size: 0.875rem;
  color: var(--accent-primary);
  font-weight: 600;
}

.session-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.session-status.in-progress {
  background: #10b981;
  color: white;
}

.session-status.scheduled {
  background: #f59e0b;
  color: white;
}

.session-status.completed {
  background: #6b7280;
  color: white;
}

.session-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.session-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-glass);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--accent-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.session-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.meta-item i {
  font-size: 0.75rem;
}

.session-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
}

.action-btn.primary:hover {
  background: var(--accent-secondary);
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: var(--bg-glass);
  color: var(--text-primary);
  border: 1px solid var(--border-glass);
}

.action-btn.secondary:hover {
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .session-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .session-actions {
    flex-direction: column;
  }
  
  .filter-tabs {
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
