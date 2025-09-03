<template>
  <div class="resources">
     Content Header 
    <div class="content-header">
      <h1 class="gradient-text">Learning Resources</h1>
      <p>Access comprehensive study materials and references</p>
    </div>

     Filter Bar 
    <div class="filter-bar">
      <div class="filter-buttons">
        <button 
          v-for="type in resourceTypes" 
          :key="type.value"
          class="filter-button" 
          :class="{ active: activeFilter === type.value }"
          @click="setActiveFilter(type.value)"
        >
          <i :class="type.icon"></i>
          {{ type.label }}
        </button>
      </div>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search resources..."
          class="search-input"
        >
      </div>
    </div>

     Resources Grid 
    <div class="resources-grid">
      <div 
        v-for="resource in filteredResources" 
        :key="resource.id"
        class="resource-card glass-strong transition-smooth"
        @click="openResource(resource)"
      >
        <div class="resource-header">
          <div class="resource-type" :class="resource.type">
            <i :class="getTypeIcon(resource.type)"></i>
            {{ resource.type }}
          </div>
          <div class="resource-rating">
            <i class="fas fa-star"></i>
            {{ resource.rating }}
          </div>
        </div>
        
        <div class="resource-content">
          <h3>{{ resource.title }}</h3>
          <p>{{ resource.description }}</p>
          
          <div class="resource-meta">
            <span class="meta-item">
              <i class="fas fa-book"></i>
              {{ resource.subject }}
            </span>
            <span class="meta-item">
              <i class="fas fa-download"></i>
              {{ resource.downloads }}
            </span>
            <span class="meta-item">
              <i class="fas fa-clock"></i>
              {{ resource.uploadDate }}
            </span>
          </div>
          
          <div class="resource-actions">
            <button class="action-btn primary" @click.stop="downloadResource(resource)">
              <i class="fas fa-download"></i>
              Download
            </button>
            <button class="action-btn secondary" @click.stop="previewResource(resource)">
              <i class="fas fa-eye"></i>
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>

     Empty State 
    <div v-if="filteredResources.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-folder-open"></i>
      </div>
      <h3>No resources found</h3>
      <p>Try adjusting your search or filter criteria</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const activeFilter = ref('all')

const resourceTypes = ref([
  { value: 'all', label: 'All', icon: 'fas fa-th' },
  { value: 'pdf', label: 'PDFs', icon: 'fas fa-file-pdf' },
  { value: 'video', label: 'Videos', icon: 'fas fa-video' },
  { value: 'slides', label: 'Slides', icon: 'fas fa-presentation' },
  { value: 'code', label: 'Code', icon: 'fas fa-code' },
  { value: 'quiz', label: 'Quizzes', icon: 'fas fa-question-circle' }
])

// Mock resources data - replace with API calls
const resources = ref([
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    description: 'Comprehensive guide covering ML fundamentals, algorithms, and practical applications',
    type: 'pdf',
    subject: 'AI',
    rating: 4.8,
    downloads: 1247,
    uploadDate: '2 days ago',
    size: '2.4 MB'
  },
  {
    id: 2,
    title: 'Python Programming Basics',
    description: 'Video tutorial series for beginners learning Python programming',
    type: 'video',
    subject: 'Programming',
    rating: 4.9,
    downloads: 2156,
    uploadDate: '1 week ago',
    size: '450 MB'
  },
  {
    id: 3,
    title: 'Data Structures Presentation',
    description: 'Interactive slides covering arrays, linked lists, stacks, and queues',
    type: 'slides',
    subject: 'Programming',
    rating: 4.6,
    downloads: 892,
    uploadDate: '3 days ago',
    size: '15 MB'
  },
  {
    id: 4,
    title: 'Networking Protocols Quiz',
    description: 'Test your knowledge of TCP/IP, HTTP, and other networking protocols',
    type: 'quiz',
    subject: 'Networking',
    rating: 4.7,
    downloads: 634,
    uploadDate: '5 days ago',
    size: 'Online'
  },
  {
    id: 5,
    title: 'JavaScript Code Examples',
    description: 'Collection of practical JavaScript code snippets and examples',
    type: 'code',
    subject: 'Web Development',
    rating: 4.5,
    downloads: 1089,
    uploadDate: '1 week ago',
    size: '5.2 MB'
  }
])

const filteredResources = computed(() => {
  return resources.value.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = activeFilter.value === 'all' || resource.type === activeFilter.value
    
    return matchesSearch && matchesType
  })
})

const setActiveFilter = (type) => {
  activeFilter.value = type
}

const getTypeIcon = (type) => {
  const icons = {
    pdf: 'fas fa-file-pdf',
    video: 'fas fa-video',
    slides: 'fas fa-presentation',
    code: 'fas fa-code',
    quiz: 'fas fa-question-circle'
  }
  return icons[type] || 'fas fa-file'
}

const openResource = (resource) => {
  console.log(`Opening resource: ${resource.title}`)
  // TODO: Implement resource opening logic
}

const downloadResource = (resource) => {
  console.log(`Downloading: ${resource.title}`)
  // TODO: Implement download functionality
  resource.downloads++
}

const previewResource = (resource) => {
  console.log(`Previewing: ${resource.title}`)
  // TODO: Implement preview functionality
}
</script>

<style scoped>
.resources {
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

.search-container {
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 0.5rem;
  background: var(--input-bg);
  color: var(--text-primary);
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.resource-card {
  padding: 1.5rem;
  border-radius: 1rem;
  cursor: pointer;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.resource-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.resource-type.pdf {
  background: #ef4444;
  color: white;
}

.resource-type.video {
  background: #8b5cf6;
  color: white;
}

.resource-type.slides {
  background: #f59e0b;
  color: white;
}

.resource-type.code {
  background: #10b981;
  color: white;
}

.resource-type.quiz {
  background: #3b82f6;
  color: white;
}

.resource-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #f59e0b;
  font-weight: 600;
}

.resource-content h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.resource-content p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.resource-meta {
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

.resource-actions {
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
  
  .search-container {
    max-width: none;
  }
  
  .resources-grid {
    grid-template-columns: 1fr;
  }
  
  .resource-actions {
    flex-direction: column;
  }
}
</style>
