<template>
  <div class="topic-management">
     Content Header 
    <div class="content-header">
      <h1 class="gradient-text">Topic Management</h1>
      <p>Organize and structure learning materials</p>
    </div>

     Action Bar 
    <div class="action-bar">
      <button class="primary-btn" @click="showCreateModal = true">
        <i class="fas fa-plus"></i>
        Create New Topic
      </button>
      <div class="search-filter">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search topics..."
          class="search-input"
        >
        <select v-model="filterCourse" class="filter-select">
          <option value="">All Courses</option>
          <option value="vue">Vue.js</option>
          <option value="design">UI/UX Design</option>
          <option value="business">Business Analytics</option>
        </select>
      </div>
    </div>

     Topics List 
    <div class="topics-list">
      <div 
        v-for="topic in filteredTopics" 
        :key="topic.id"
        class="topic-item glass-strong transition-smooth"
      >
        <div class="topic-header">
          <div class="topic-info">
            <h3>{{ topic.title }}</h3>
            <span class="topic-course">{{ topic.course }}</span>
          </div>
          <div class="topic-actions">
            <button @click="editTopic(topic)" class="action-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteTopic(topic)" class="action-btn danger">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <p class="topic-description">{{ topic.description }}</p>
        
        <div class="topic-meta">
          <span class="meta-item">
            <i class="fas fa-file-alt"></i>
            {{ topic.resources }} resources
          </span>
          <span class="meta-item">
            <i class="fas fa-users"></i>
            {{ topic.studentsEngaged }} students
          </span>
          <span class="meta-item">
            <i class="fas fa-clock"></i>
            {{ topic.estimatedTime }}
          </span>
        </div>
      </div>
    </div>

     Create/Edit Modal 
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal glass-effect" @click.stop>
        <div class="modal-header">
          <h2>{{ editingTopic ? 'Edit Topic' : 'Create New Topic' }}</h2>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveTopic" class="modal-form">
          <div class="form-group">
            <label>Topic Title</label>
            <input type="text" v-model="topicForm.title" required>
          </div>
          
          <div class="form-group">
            <label>Course</label>
            <select v-model="topicForm.course" required>
              <option value="">Select Course</option>
              <option value="vue">Vue.js</option>
              <option value="design">UI/UX Design</option>
              <option value="business">Business Analytics</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="topicForm.description" rows="4" required></textarea>
          </div>
          
          <div class="form-group">
            <label>Estimated Time</label>
            <input type="text" v-model="topicForm.estimatedTime" placeholder="e.g., 2 hours" required>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="secondary-btn">Cancel</button>
            <button type="submit" class="primary-btn">
              {{ editingTopic ? 'Update Topic' : 'Create Topic' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const searchQuery = ref('')
const filterCourse = ref('')
const showCreateModal = ref(false)
const editingTopic = ref(null)

const topicForm = reactive({
  title: '',
  course: '',
  description: '',
  estimatedTime: ''
})

// Mock topics data - replace with API calls
const topics = ref([
  {
    id: 1,
    title: 'Vue.js Components',
    course: 'Vue.js',
    description: 'Learn how to create and use Vue.js components effectively',
    resources: 8,
    studentsEngaged: 124,
    estimatedTime: '3 hours'
  },
  {
    id: 2,
    title: 'Color Theory',
    course: 'UI/UX Design',
    description: 'Understanding color psychology and application in design',
    resources: 12,
    studentsEngaged: 89,
    estimatedTime: '2 hours'
  },
  {
    id: 3,
    title: 'Data Visualization',
    course: 'Business Analytics',
    description: 'Creating effective charts and graphs for business insights',
    resources: 15,
    studentsEngaged: 67,
    estimatedTime: '4 hours'
  }
])

const filteredTopics = computed(() => {
  return topics.value.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCourse = !filterCourse.value || topic.course.toLowerCase().includes(filterCourse.value.toLowerCase())
    
    return matchesSearch && matchesCourse
  })
})

const editTopic = (topic) => {
  editingTopic.value = topic
  Object.assign(topicForm, topic)
  showCreateModal.value = true
}

const deleteTopic = (topic) => {
  if (confirm(`Are you sure you want to delete "${topic.title}"?`)) {
    const index = topics.value.findIndex(t => t.id === topic.id)
    if (index > -1) {
      topics.value.splice(index, 1)
    }
  }
}

const saveTopic = () => {
  if (editingTopic.value) {
    // Update existing topic
    Object.assign(editingTopic.value, topicForm)
  } else {
    // Create new topic
    const newTopic = {
      id: Date.now(),
      ...topicForm,
      resources: 0,
      studentsEngaged: 0
    }
    topics.value.push(newTopic)
  }
  
  closeModal()
}

const closeModal = () => {
  showCreateModal.value = false
  editingTopic.value = null
  Object.assign(topicForm, {
    title: '',
    course: '',
    description: '',
    estimatedTime: ''
  })
}
</script>

<style scoped>
/* Reuse similar styles from CourseManagement */
.topic-management {
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

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background: var(--accent-secondary);
  transform: translateY(-2px);
}

.search-filter {
  display: flex;
  gap: 1rem;
}

.search-input, .filter-select {
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 0.5rem;
  background: var(--input-bg);
  color: var(--text-primary);
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.topic-item {
  padding: 1.5rem;
  border-radius: 1rem;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.topic-info h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.topic-course {
  font-size: 0.875rem;
  color: var(--accent-primary);
  font-weight: 600;
}

.topic-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  background: var(--bg-glass);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
}

.action-btn.danger:hover {
  background: #ef4444;
}

.topic-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.topic-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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

/* Modal Styles - Same as CourseManagement */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.secondary-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--input-border);
  background: transparent;
  color: var(--text-primary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: var(--bg-glass);
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    flex-direction: column;
  }
  
  .topic-header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
