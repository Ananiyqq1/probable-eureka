import { defineStore } from "pinia"
import { useAuthStore } from "./useAuthStore.js"
import { useUIStore } from "./useUIStore.js"
import { useAdminStore } from "./useAdminStore.js"
import { useStudentStore } from "./useStudentStore.js"

export const useAppStore = defineStore("app", {
  state: () => ({
    // App initialization state
    isInitialized: false,
    initializationError: null,

    // App version and info
    version: "1.0.0",
    buildDate: new Date().toISOString(),

    // Feature flags
    features: {
      globalSearch: true,
      darkMode: true,
      notifications: true,
      realTimeUpdates: false,
    },
  }),

  getters: {
    // Computed properties that combine multiple stores
    currentUser: (state) => {
      const authStore = useAuthStore()
      return authStore.user
    },

    isAuthenticated: (state) => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated
    },

    currentView: (state) => {
      const uiStore = useUIStore()
      return uiStore.currentView
    },

    isAdmin: (state) => {
      const authStore = useAuthStore()
      return authStore.isAdmin
    },

    isStudent: (state) => {
      const authStore = useAuthStore()
      return authStore.isStudent
    },

    theme: (state) => {
      const uiStore = useUIStore()
      return uiStore.theme
    },
  },

  actions: {
    // App initialization
    async initializeApp() {
      const uiStore = useUIStore()
      const authStore = useAuthStore()
      try {
        this.isInitialized = false

        // Initialize UI store (theme, screen size, etc.)
        uiStore.initializeTheme()
        uiStore.updateScreenSize()

        // Try to restore user session
        const sessionRestored = authStore.restoreSession()

        if (sessionRestored) {
          // Set appropriate view based on user role
          if (authStore.isAdmin) {
            uiStore.setCurrentView("admin")
          } else if (authStore.isStudent) {
            uiStore.setCurrentView("student")
          }
        } else {
          uiStore.setCurrentView("login")
        }

        // Set up window resize listener
        window.addEventListener("resize", () => {
          uiStore.updateScreenSize()
        })

        this.isInitialized = true

        return { success: true }
      } catch (error) {
        this.initializationError = error.message
        return { success: false, error: error.message }
      }
    },

    // Navigation helper that coordinates between stores
    async navigateToView(view) {
      const uiStore = useUIStore()
      const authStore = useAuthStore()
      const adminStore = useAdminStore()
      const studentStore = useStudentStore()

      // Check authentication for protected routes
      if (["admin", "student", "preferences"].includes(view) && !authStore.isAuthenticated) {
        uiStore.setCurrentView("login")
        uiStore.showToast({
          message: "Please sign in to access this page",
          type: "warning",
        })
        return
      }

      // Check role permissions
      if (view === "admin" && !authStore.isAdmin) {
        uiStore.showToast({
          message: "Access denied. Admin privileges required.",
          type: "error",
        })
        return
      }

      if ((view === "student" || view === "preferences") && !authStore.isStudent) {
        uiStore.showToast({
          message: "Access denied. Student account required.",
          type: "error",
        })
        return
      }

      // Set the view
      uiStore.setCurrentView(view)

      // Load initial data for the view
      if (view === "admin") {
        adminStore.loadDashboardStats()
      } else if (view === "student") {
        studentStore.loadDashboardData()
      }
    },

    // Logout helper that coordinates between stores
    async logout() {
      const authStore = useAuthStore()
      const uiStore = useUIStore()
      const adminStore = useAdminStore()
      const studentStore = useStudentStore()

      // Sign out from auth store
      await authStore.signOut()

      // Reset UI state
      uiStore.setCurrentView("login")
      uiStore.clearAllNotifications()

      // Reset admin state
      adminStore.$reset()

      // Reset student state
      studentStore.$reset()

      uiStore.showToast({
        message: "Successfully signed out",
        type: "success",
      })
    },

    // Feature flag helpers
    isFeatureEnabled(featureName) {
      return this.features[featureName] || false
    },

    toggleFeature(featureName) {
      if (this.features.hasOwnProperty(featureName)) {
        this.features[featureName] = !this.features[featureName]
      }
    },
  },
})