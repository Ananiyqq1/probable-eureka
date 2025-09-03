<template>
  <header class="glass-card border-0 border-b border-white/10 sticky top-0 z-50">
    <div class="flex items-center justify-between p-4">
      <!-- Logo and Brand -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <!-- <span class="text-white font-bold text-lg">H</span> -->
        </div>
        <div>
          <h1 class="text-xl font-bold text-white">HiLCoE Peer</h1>
          <p class="text-xs text-gray-300">Learning Platform</p>
        </div>
      </div>

      <!-- Navigation Actions -->
      <div class="flex items-center space-x-4 ml-auto">
        <!-- Notifications -->
        <button class="relative p-2 glass-card hover:bg-white/10 transition-all duration-300 rounded-lg">
          <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 11h.01"/>
          </svg>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        <!-- Theme Toggle -->
        <button @click="toggleTheme" class="p-2 glass-card hover:bg-white/10 transition-all duration-300 rounded-lg">
          <svg v-if="isDark" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
          </svg>
          <svg v-else class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
          </svg>
        </button>

        <!-- User Profile -->
        <div class="relative">
          <button @click="showUserMenu = !showUserMenu" class="flex items-center space-x-2 p-2 glass-card hover:bg-white/10 transition-all duration-300 rounded-lg">
            <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
            </div>
            <span class="text-gray-300 text-sm hidden md:block">{{ currentUser?.name || 'User' }}</span>
          </button>

          <!-- User Dropdown -->
          <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-xl z-50">
            <div class="p-2">
              <button @click="logout" class="w-full text-left p-2 hover:bg-white/10 rounded-lg text-gray-300 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/useAppStore.js'

const appStore = useAppStore()
const showUserMenu = ref(false)

const isDark = computed(() => appStore.theme === 'dark')
const currentUser = computed(() => appStore.currentUser)

const userInitials = computed(() => {
  if (!currentUser.value?.name) return 'U'
  return currentUser.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const toggleTheme = () => {
  appStore.toggleTheme()
}

const logout = () => {
  // TODO: Implement logout API call
  appStore.logout()
  showUserMenu.value = false
}
</script>
