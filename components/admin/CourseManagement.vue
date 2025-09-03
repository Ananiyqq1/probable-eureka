<template>
  <div class="course-management">
     Content Header 
    <div class="content-header">
      <h1 class="gradient-text">Course Management</h1>
      <p>Create, edit, and organize educational courses</p>
    </div>

     Action Bar 
    <div class="action-bar">
      <button class="primary-btn" @click="showCreateModal = true">
        <i class="fas fa-plus"></i>
        Create New Course
      </button>
      <div class="search-filter">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search courses..."
          class="search-input"
        >
        <select v-model="filterCategory" class="filter-select">
          <option value="">All Categories</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="science">Science</option>
        </select>
      </div>
    </div>

     Courses Grid 
    <div class="courses-grid">
      <div 
        v-for="course in filteredCourses" 
        :key="course.id"
        class="course-card glass-strong transition-smooth"
      >
        <div class="course-header">
          <div class="course-status" :class="course.status">
            {{ course.status }}
          </div>
          <div class="course-actions">
            <button @click="editCourse(course)" class="action-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteCourse(course)" class="action-btn danger">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="course-content">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
          
          <div class="course-meta">
            <span class="meta-item">
              <i class="fas fa-users"></i>
              {{ course.enrolledStudents }} students
            </span>
            <span class="meta-item">
              <i class="fas fa-clock"></i>
              {{ course.duration }}
            </span>
            <span class="meta-item">
              <i class="fas fa-tag"></i>
              {{ course.category }}
            </span>
          </div>
        </div>
      </div>
    </div>

     Create/Edit Modal 
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal glass-effect" @click.stop>
        <div class="modal-header">
          <h2>{{ editingCourse ? 'Edit Course' : 'Create New Course' }}</h2>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveCourse" class="modal-form">
          <div class="form-group">
            <label>Course Title</label>
            <input type="text" v-model="courseForm.title" required>
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="courseForm.description" rows="3" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select v-model="courseForm.category" required>
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="science">Science</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Duration</label>
              <input type="text" v-model="courseForm.duration" placeholder="e.g., 8 weeks" required>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="secondary-btn">Cancel</button>
            <button type="submit" class="primary-btn">
              {{ editingCourse ? 'Update Course' : 'Create Course' }}
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
const filterCategory = ref('')
const showCreateModal = ref(false)
const editingCourse = ref(null)

const courseForm = reactive({
  title: '',
  description: '',
  category: '',
  duration: ''
})

// Mock courses data - replace with API calls
const courses = ref([
  {
    id: 1,
    title: 'Introduction to Vue.js',
    description: 'Learn the fundamentals of Vue.js framework',
    category: 'programming',
    duration: '6 weeks',
    enrolledStudents: 124,
    status: 'active'
  },
  {
    id: 2,
    title: 'UI/UX Design Principles',
    description: 'Master the art of user interface design',
    category: 'design',
    duration: '8 weeks',
    enrolledStudents: 89,
    status: 'active'
  },
  {
    id: 3,
    title: 'Business Analytics',
    description: 'Data-driven decision making for businesses',
    category: 'business',
    duration: '10 weeks',
    enrolledStudents: 67,
    status: 'draft'
  }
])

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !filterCategory.value || course.category === filterCategory.value
    
    return matchesSearch && matchesCategory
  })
})

const editCourse = (course) => {
  editingCourse.value = course
  Object.assign(courseForm, course)
  showCreateModal.value = true
}

const deleteCourse = (course) => {
  if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
    const index = courses.value.findIndex(c => c.id === course.id)
    if (index > -1) {
      courses.value.splice(index, 1)
    }
  }
}

const saveCourse = () => {
  if (editingCourse.value) {
    // Update existing course
    Object.assign(editingCourse.value, courseForm)
  } else {
    // Create new course
    const newCourse = {
      id: Date.now(),
      ...courseForm,
      enrolledStudents: 0,
      status: 'draft'
    }
    courses.value.push(newCourse)
  }
  
  closeModal()
}

const closeModal = () => {
  showCreateModal.value = false
  editingCourse.value = null
  Object.assign(courseForm, {
    title: '',
    description: '',
    category: '',
    duration: ''
  })
}
</script>

<style scoped>
.course-management {
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

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.course-card {
  padding: 1.5rem;
  border-radius: 1rem;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.course-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.course-status.active {
  background: #10b981;
  color: white;
}

.course-status.draft {
  background: #f59e0b;
  color: white;
}

.course-actions {
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

.course-content h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.course-content p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.course-meta {
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

/* Modal Styles */
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
