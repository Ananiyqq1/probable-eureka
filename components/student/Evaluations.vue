<template>
  <div class="evaluations">
     Content Header 
    <div class="content-header">
      <h1 class="gradient-text">Evaluations</h1>
      <p>Track your assessments and test results</p>
    </div>

     Filter Bar 
    <div class="filter-bar">
      <div class="filter-buttons">
        <button 
          v-for="status in statusFilters" 
          :key="status.value"
          class="filter-button" 
          :class="{ active: activeFilter === status.value }"
          @click="setActiveFilter(status.value)"
        >
          <i :class="status.icon"></i>
          {{ status.label }}
        </button>
      </div>
      <select v-model="subjectFilter" class="subject-select">
        <option value="">All Subjects</option>
        <option value="AI">AI</option>
        <option value="Programming">Programming</option>
        <option value="Networking">Networking</option>
        <option value="Mathematics">Mathematics</option>
      </select>
    </div>

     Evaluations Grid 
    <div class="evaluations-grid">
      <div 
        v-for="evaluation in filteredEvaluations" 
        :key="evaluation.id"
        class="evaluation-card glass-strong transition-smooth"
      >
        <div class="evaluation-header">
          <div class="evaluation-info">
            <h3>{{ evaluation.title }}</h3>
            <span class="evaluation-subject">{{ evaluation.subject }}</span>
          </div>
          <div class="evaluation-status" :class="evaluation.status">
            <i :class="getStatusIcon(evaluation.status)"></i>
            {{ evaluation.status }}
          </div>
        </div>
        
        <p class="evaluation-description">{{ evaluation.description }}</p>
        
         Score Display for Completed 
        <div v-if="evaluation.status === 'completed'" class="score-display">
          <div class="score-circle" :class="getScoreClass(evaluation.score)">
            <span class="score-value">{{ evaluation.score }}%</span>
          </div>
          <div class="score-details">
            <div class="score-label">Your Score</div>
            <div class="score-grade">{{ getGrade(evaluation.score) }}</div>
          </div>
        </div>
        
         Progress for In Progress 
        <div v-if="evaluation.status === 'in-progress'" class="progress-display">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: evaluation.progress + '%' }"></div>
          </div>
          <span class="progress-text">{{ evaluation.progress }}% Complete</span>
        </div>
        
        <div class="evaluation-meta">
          <span class="meta-item">
            <i class="fas fa-calendar"></i>
            {{ evaluation.dueDate }}
          </span>
          <span class="meta-item">
            <i class="fas fa-clock"></i>
            {{ evaluation.duration }}
          </span>
          <span class="meta-item">
            <i class="fas fa-question-circle"></i>
            {{ evaluation.questions }} questions
          </span>
        </div>
        
        <div class="evaluation-actions">
          <button 
            v-if="evaluation.status === 'available'" 
            class="action-btn primary"
            @click="startEvaluation(evaluation)"
          >
            <i class="fas fa-play"></i>
            Start Test
          </button>
          <button 
            v-else-if="evaluation.status === 'in-progress'" 
            class="action-btn primary"
            @click="continueEvaluation(evaluation)"
          >
            <i class="fas fa-play"></i>
            Continue
          </button>
          <button 
            v-else-if="evaluation.status === 'completed'" 
            class="action-btn secondary"
            @click="viewResults(evaluation)"
          >
            <i class="fas fa-chart-line"></i>
            View Results
          </button>
          <button 
            v-else 
            class="action-btn disabled"
            disabled
          >
            <i class="fas fa-lock"></i>
            Locked
          </button>
        </div>
      </div>
    </div>

     Empty State 
    <div v-if="filteredEvaluations.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <h3>No evaluations found</h3>
      <p>Check back later for new assessments</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeFilter = ref('all')
const subjectFilter = ref('')

const statusFilters = ref([
  { value: 'all', label: 'All', icon: 'fas fa-th' },
  { value: 'available', label: 'Available', icon: 'fas fa-play-circle' },
  { value: 'in-progress', label: 'In Progress', icon: 'fas fa-clock' },
  { value: 'completed', label: 'Completed', icon: 'fas fa-check-circle' },
  { value: 'locked', label: 'Locked', icon: 'fas fa-lock' }
])

// Mock evaluations data - replace with API calls
const evaluations = ref([
  {
    id: 1,
    title: 'Machine Learning Midterm',
    subject: 'AI',
    description: 'Comprehensive test covering supervised and unsupervised learning algorithms',
    status: 'completed',
    score: 87,
    progress: 100,
    dueDate: 'Dec 15, 2024',
    duration: '2 hours',
    questions: 50
  },
  {
    id: 2,
    title: 'JavaScript Fundamentals Quiz',
    subject: 'Programming',
    description: 'Test your knowledge of ES6+ features and modern JavaScript',
    status: 'in-progress',
    score: null,
    progress: 60,
    dueDate: 'Dec 20, 2024',
    duration: '1 hour',
    questions: 25
  },
  {
    id: 3,
    title: 'Network Security Assessment',
    subject: 'Networking',
    description: 'Evaluate understanding of cybersecurity principles and practices',
    status: 'available',
    score: null,
    progress: 0,
    dueDate: 'Dec 25, 2024',
    duration: '1.5 hours',
    questions: 30
  },
  {
    id: 4,
    title: 'Data Structures Final',
    subject: 'Programming',
    description: 'Final examination covering all data structure concepts',
    status: 'locked',
    score: null,
    progress: 0,
    dueDate: 'Jan 10, 2025',
    duration: '3 hours',
    questions: 75
  },
  {
    id: 5,
    title: 'Calculus Quiz 3',
    subject: 'Mathematics',
    description: 'Integration and differentiation problems',
    status: 'completed',
    score: 92,
    progress: 100,
    dueDate: 'Dec 10, 2024',
    duration: '45 minutes',
    questions: 15
  }
])

const filteredEvaluations = computed(() => {
  return evaluations.value.filter(evaluation => {
    const matchesStatus = activeFilter.value === 'all' || evaluation.status === activeFilter.value
    const matchesSubject = !subjectFilter.value || evaluation.subject === subjectFilter.value
    
    return matchesStatus && matchesSubject
  })
})

const setActiveFilter = (status) => {
  activeFilter.value = status
}

const getStatusIcon = (status) => {
  const icons = {
    available: 'fas fa-play-circle',
    'in-progress': 'fas fa-clock',
    completed: 'fas fa-check-circle',
    locked: 'fas fa-lock'
  }
  return icons[status] || 'fas fa-circle'
}

const getScoreClass = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  return 'needs-improvement'
}

const getGrade = (score) => {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

const startEvaluation = (evaluation) => {
  console.log(`Starting evaluation: ${evaluation.title}`)
  // TODO: Implement evaluation start logic
  evaluation.status = 'in-progress'
  evaluation.progress = 5
}

const continueEvaluation = (evaluation) => {
  console.log(`Continuing evaluation: ${evaluation.title}`)
  // TODO: Implement evaluation continuation logic
}

const viewResults = (evaluation) => {
  console.log(`Viewing results for: ${evaluation.title}`)
  // TODO: Implement results view logic
}
</script>

<style scoped>
.evaluations {
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

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.filter-button:hover {
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
}

.filter-button.active {
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
  box-shadow: var(--shadow-card);
}

.subject-select {
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 0.5rem;
  background: var(--input-bg);
  color: var(--text-primary);
}

.evaluations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.evaluation-card {
  padding: 1.5rem;
  border-radius: 1rem;
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.evaluation-info h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.evaluation-subject {
  font-size: 0.875rem;
  color: var(--accent-primary);
  font-weight: 600;
}

.evaluation-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.evaluation-status.available {
  background: #10b981;
  color: white;
}

.evaluation-status.in-progress {
  background: #f59e0b;
  color: white;
}

.evaluation-status.completed {
  background: #6b7280;
  color: white;
}

.evaluation-status.locked {
  background: #ef4444;
  color: white;
}

.evaluation-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-glass);
  border-radius: 0.75rem;
}

.score-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.score-circle.excellent {
  background: #10b981;
}

.score-circle.good {
  background: #3b82f6;
}

.score-circle.average {
  background: #f59e0b;
}

.score-circle.needs-improvement {
  background: #ef4444;
}

.score-value {
  font-size: 0.875rem;
}

.score-details {
  flex: 1;
}

.score-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.score-grade {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.progress-display {
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

.evaluation-meta {
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

.evaluation-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
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

.action-btn.disabled {
  background: #6b7280;
  color: white;
  cursor: not-allowed;
  opacity: 0.6;
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
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .evaluations-grid {
    grid-template-columns: 1fr;
  }
  
  .score-display {
    flex-direction: column;
    text-align: center;
  }
}
</style>
