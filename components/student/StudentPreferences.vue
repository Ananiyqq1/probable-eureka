<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-5">
    <div class="w-full max-w-6xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-10">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Computer Science Courses
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Select your preferred courses to customize your learning journey. Choose at least 3 to get started.
        </p>
      </header>

      <!-- Selected Count -->
      <div class="text-center mb-6">
        <span class="text-gray-600">
          {{ selectedCourses.length }} of {{ courses.length }} courses selected
        </span>
      </div>

      <!-- Courses Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        <div
          v-for="course in courses"
          :key="course.id"
          @click="toggleCourse(course.id)"
          :class="[
            'glass-card p-6 cursor-pointer transition-all duration-300 hover:scale-105',
            selectedCourses.includes(course.id) 
              ? 'ring-2 ring-gray-900 bg-gray-900/5' 
              : 'hover:bg-white/90'
          ]"
        >
          <!-- Course Icon -->
          <div class="text-3xl mb-4 text-gray-900">
            <i :class="course.icon"></i>
          </div>

          <!-- Course Title -->
          <h3 class="text-xl font-bold text-gray-900 mb-3">
            {{ course.title }}
          </h3>

          <!-- Course Description -->
          <p class="text-sm text-gray-600 mb-4 leading-relaxed">
            {{ course.description }}
          </p>

          <!-- Selection Indicator -->
          <div class="flex justify-end">
            <div 
              :class="[
                'w-6 h-6 rounded-full border-2 transition-all duration-200',
                selectedCourses.includes(course.id)
                  ? 'bg-gray-900 border-gray-900'
                  : 'border-gray-300'
              ]"
            >
              <i 
                v-if="selectedCourses.includes(course.id)"
                class="fas fa-check text-white text-xs flex items-center justify-center h-full"
              ></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-5">
        <button
          @click="saveForLater"
          :disabled="isLoading"
          class="px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold text-sm uppercase tracking-wide rounded-full hover:bg-gray-900/10 transition-all duration-300 disabled:opacity-50"
        >
          {{ isLoading ? 'Saving...' : 'Save for Later' }}
        </button>
        
        <button
          @click="submitPreferences"
          :disabled="selectedCourses.length < 3 || isLoading"
          class="px-8 py-3 bg-gray-900 text-white font-bold text-sm uppercase tracking-wide rounded-full hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Processing...' : 'Continue' }}
        </button>
      </div>

      <!-- Minimum Selection Warning -->
      <div v-if="selectedCourses.length < 3" class="text-center mt-4">
        <p class="text-sm text-red-600">
          Please select at least 3 courses to continue
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStudentStore } from '../../stores/useStudentStore.js'
import { useAppStore } from '../../stores/useAppStore.js'
import { useUIStore } from '../../stores/useUIStore.js'

const studentStore = useStudentStore()
const appStore = useAppStore()
const uiStore = useUIStore()

const selectedCourses = ref([])
const isLoading = ref(false)

const courses = ref([
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Learn about arrays, linked lists, trees, graphs, sorting algorithms, and complexity analysis.',
    icon: 'fas fa-code'
  },
  {
    id: 'database',
    title: 'Database Systems',
    description: 'Study relational databases, SQL, normalization, transactions, and database design principles.',
    icon: 'fas fa-database'
  },
  {
    id: 'networks',
    title: 'Computer Networks',
    description: 'Explore network architectures, protocols, TCP/IP, routing algorithms, and network security.',
    icon: 'fas fa-network-wired'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Learn about encryption, network security, ethical hacking, and security protocols.',
    icon: 'fas fa-lock'
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    description: 'Study machine learning, neural networks, natural language processing, and AI ethics.',
    icon: 'fas fa-brain'
  },
  {
    id: 'cloud',
    title: 'Cloud Computing',
    description: 'Learn about cloud architectures, virtualization, distributed systems, and cloud services.',
    icon: 'fas fa-cloud'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    description: 'Build iOS and Android applications using modern frameworks and development practices.',
    icon: 'fas fa-mobile-alt'
  },
  {
    id: 'datascience',
    title: 'Data Science',
    description: 'Learn statistical analysis, data visualization, predictive modeling, and big data technologies.',
    icon: 'fas fa-chart-line'
  }
])

const toggleCourse = (courseId) => {
  const index = selectedCourses.value.indexOf(courseId)
  if (index > -1) {
    selectedCourses.value.splice(index, 1)
  } else {
    if (selectedCourses.value.length < 8) {
      selectedCourses.value.push(courseId)
    } else {
      uiStore.showToast({ message: 'You can only select up to 8 courses.', type: 'warning' })
    }
  }
}

const saveForLater = async () => {
  console.log('[v0] Saving preferences for later:', selectedCourses.value)
  isLoading.value = true
  
  try {
    await studentStore.savePreferences({
      selectedCourses: selectedCourses.value,
      completedAt: null // Not completed, just saved
    })
    
    uiStore.showToast({ message: 'Preferences saved! You can complete this later.', type: 'success' })
    
    // Navigate to student dashboard
    appStore.setCurrentView('student')
  } catch (error) {
    console.error('[v0] Error saving preferences:', error)
    uiStore.showToast({ message: 'Failed to save preferences. Please try again.', type: 'error' })
  } finally {
    isLoading.value = false
  }
}

const submitPreferences = async () => {
  if (selectedCourses.value.length < 3) {
    uiStore.showToast({ message: 'Please select at least 3 courses to continue.', type: 'warning' })
    return
  }
  
  console.log('[v0] Submitting preferences:', selectedCourses.value)
  isLoading.value = true
  
  try {
    await studentStore.savePreferences({
      selectedCourses: selectedCourses.value,
      completedAt: new Date().toISOString()
    })
    
    uiStore.showToast({ message: `Success! ${selectedCourses.value.length} courses selected. Preferences saved.`, type: 'success' })
    
    // Navigate to student dashboard
    appStore.setCurrentView('student')
  } catch (error) {
    console.error('[v0] Error submitting preferences:', error)
    uiStore.showToast({ message: 'Failed to save preferences. Please try again.', type: 'error' })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  console.log('[v0] Student preferences page loaded')
  // Load any existing preferences
  if (studentStore.preferences?.selectedCourses) {
    selectedCourses.value = [...studentStore.preferences.selectedCourses]
  }
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.glass-card:hover {
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
}
</style>
