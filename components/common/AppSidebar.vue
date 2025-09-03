<template>
  <aside :class="sidebarClasses">
    <!-- Sidebar Header -->
    <div class="p-4 border-b border-white/10">
      <button @click="toggleSidebar" class="w-full flex items-center justify-between text-gray-300 hover:text-white transition-colors">
        <span v-if="!isCollapsed" class="font-semibold">Navigation</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>

    <!-- Navigation Items -->
    <nav class="flex-1 p-4 space-y-2">
      <template v-for="item in navigationItems" :key="item.id">
        <button
          @click="navigateTo(item.route)"
          :class="getNavItemClasses(item.route)"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-medium">{{ item.label }}</span>
        </button>
      </template>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-white/10">
      <div v-if="!isCollapsed" class="text-xs text-gray-400 text-center">
        HiLCoE Peer v1.0
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/useAppStore.js'

const props = defineProps({
  userRole: {
    type: String,
    default: 'student'
  }
})

const appStore = useAppStore()
const isCollapsed = ref(false)

// Computed properties for class management
const sidebarClasses = computed(() => [
  'glass-card border-0 border-r border-white/10 transition-all duration-300 flex flex-col',
  isCollapsed.value ? 'w-16' : 'w-64'
])

const getNavItemClasses = (route) => [
  'w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300',
  isActive(route) 
    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30' 
    : 'text-gray-300 hover:text-white hover:bg-white/10'
]

const navigationItems = computed(() => {
  if (props.userRole === 'admin') {
    return [
      { id: 'dashboard', label: 'Dashboard', route: 'admin-dashboard', icon: 'DashboardIcon' },
      { id: 'courses', label: 'Courses', route: 'course-management', icon: 'BookIcon' },
      { id: 'topics', label: 'Topics', route: 'topic-management', icon: 'TagIcon' },
      { id: 'users', label: 'Users', route: 'user-management', icon: 'UsersIcon' },
    ]
  } else {
    return [
      { id: 'dashboard', label: 'Dashboard', route: 'student-dashboard', icon: 'HomeIcon' },
      { id: 'rooms', label: 'Study Rooms', route: 'study-rooms', icon: 'RoomIcon' },
      { id: 'resources', label: 'Resources', route: 'resources', icon: 'LibraryIcon' },
      { id: 'sessions', label: 'My Sessions', route: 'my-sessions', icon: 'ClockIcon' },
      { id: 'evaluations', label: 'Evaluations', route: 'evaluations', icon: 'TestIcon' },
      { id: 'contributors', label: 'Top Contributors', route: 'top-contributors', icon: 'TrophyIcon' },
    ]
  }
})

const isActive = (route) => {
  return appStore.currentView === route
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const navigateTo = (route) => {
  appStore.setCurrentView(route)
}

// Icon components (simplified SVG icons)
const DashboardIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/></svg>' }
const BookIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>' }
const TagIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>' }
const UsersIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>' }
const HomeIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' }
const RoomIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>' }
const LibraryIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>' }
const ClockIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' }
const TestIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' }
const TrophyIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>' }
</script>
