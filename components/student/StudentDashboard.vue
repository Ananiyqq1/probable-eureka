<template>
  <div class="student-dashboard">
    <!-- Content Header -->
    <div class="content-header">
      <h1 class="gradient-text">Discover Courses</h1>
      <p>Explore courses tailored to your academic journey</p>
    </div>

    <!-- Category Filters -->
    <div class="filter-buttons">
      <button 
        v-for="category in categories" 
        :key="category.value"
        class="filter-button" 
        :class="{ active: activeFilter === category.value }"
        @click="setActiveFilter(category.value)"
      >
        {{ category.label }}
      </button>
    </div>

    <!-- Courses Grid -->
    <div class="cards-grid">
      <div 
        v-for="course in filteredCourses" 
        :key="course.id"
        class="card transition-smooth"
        :data-category="course.category"
        @click="openCourse(course)"
      >
        <div class="card-image">{{ course.shortName }}</div>
        <div class="card-content">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
        </div>
      </div>
    </div>

    <!-- Topics Section -->
    <div class="content-header topics-section">
      <h1 class="gradient-text">Discover Topics</h1>
      <p>Explore topics tailored to your academic journey</p>
    </div>

    <div class="cards-grid">
      <div 
        v-for="topic in topics" 
        :key="topic.id"
        class="card transition-smooth"
        @click="openTopic(topic)"
      >
        <div class="card-image">{{ topic.shortName }}</div>
        <div class="card-content">
          <h3>{{ topic.title }}</h3>
          <p>{{ topic.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/useAppStore.js'

const appStore = useAppStore()
const activeFilter = ref('all')

const categories = ref([
  { value: 'all', label: 'All' },
  { value: 'AI', label: 'AI' },
  { value: 'Programming', label: 'Programming' },
  { value: 'Data Mining', label: 'Data Mining' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Graphics', label: 'Graphics' },
  { value: 'Web', label: 'Web' },
  { value: 'Common Courses', label: 'Common Courses' }
])

const courses = ref([
  {
    id: 1,
    title: 'Introduction to AI',
    shortName: 'AI',
    description: 'Learn the basics of Artificial Intelligence and its applications in modern technology. Explore machine learning, neural networks, and cutting-edge AI techniques.',
    category: 'AI'
  },
  {
    id: 2,
    title: 'Computer Networking',
    shortName: 'Networking',
    description: 'Explore the world of networking protocols, security, and infrastructure. Master TCP/IP, routing, switching, and network administration.',
    category: 'Networking'
  },
  {
    id: 3,
    title: 'Computer Programming',
    shortName: 'Programming',
    description: 'Master the fundamentals of programming and software development. Learn multiple languages, algorithms, and best practices.',
    category: 'Programming'
  },
  {
    id: 4,
    title: 'ICT Fundamentals',
    shortName: 'ICT',
    description: 'Learn the basics of ICT',
    category: 'Common Courses'
  },
  {
    id: 5,
    title: 'Mathematics for Natural Science',
    shortName: 'Mathematics',
    description: 'Learn the basics of Mathematics tailored to Natural Science Students',
    category: 'Common Courses'
  },
  {
    id: 6,
    title: 'Communicative English I',
    shortName: 'English I',
    description: 'Learn the basics of English tailored to Natural Science Students',
    category: 'Common Courses'
  }
])

const topics = ref([
  {
    id: 1,
    title: 'Linked Lists',
    shortName: 'Data Structures',
    description: 'Master linked lists in Data Structures and Algorithms with practical applications. Learn implementation and optimization techniques.'
  },
  {
    id: 2,
    title: 'First Order Language',
    shortName: 'Logic Systems',
    description: 'Understand the principles of first-order logic in artificial intelligence. Explore predicate logic and knowledge representation.'
  },
  {
    id: 3,
    title: 'Recursive Functions',
    shortName: 'Algorithms',
    description: 'Learn recursive problem-solving techniques and algorithm optimization. Master divide-and-conquer strategies.'
  }
])

const filteredCourses = computed(() => {
  if (activeFilter.value === 'all') {
    return courses.value
  }
  return courses.value.filter(course => course.category === activeFilter.value)
})

const setActiveFilter = (category) => {
  activeFilter.value = category
}

const openCourse = (course) => {
  console.log(`Opening course: ${course.title}`)
  // Add click animation
  // TODO: Navigate to course details or implement course opening logic
}

const openTopic = (topic) => {
  console.log(`Opening topic: ${topic.title}`)
  // TODO: Navigate to topic details or implement topic opening logic
}
</script>

<style scoped>
.student-dashboard {
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

.topics-section {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border-glass);
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-button {
  padding: 0.75rem 1.5rem;
  background: var(--bg-glass);
  border: 3px solid var(--border-glass);
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.filter-button:hover {
  background: var(--accent-primary);
  transform: translateY(-2px);
  color: var(--bg-glass-strong);
}

.filter-button.active {
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
  box-shadow: var(--shadow-card);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.card-image {
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-glass-strong);
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.card-content h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.card:hover .card-content h3 {
  color: var(--accent-secondary);
}

.card-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .content-header h1 {
    font-size: 1.875rem;
  }
  
  .filter-buttons {
    justify-content: center;
  }
}
</style>
