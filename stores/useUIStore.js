import { defineStore } from "pinia"

export const useUIStore = defineStore("ui", {
  state: () => ({
    // Theme management
    theme: "dark", // 'light' | 'dark'

    // Navigation state
    currentView: "login", // 'login' | 'admin' | 'student'
    sidebarCollapsed: false,

    // Modal states
    modals: {
      // Global modals
      confirmDialog: false,
      imageViewer: false,
      profileSettings: false,

      // Auth modals
      forgotPassword: false,

      // Student modals
      joinRoom: false,
      resourcePreview: false,
      evaluationDetails: false,

      // Admin modals (handled in adminStore but can be tracked here for global state)
    },

    // Loading states
    globalLoading: false,
    pageTransition: false,

    // Notifications
    notifications: [],
    maxNotifications: 5,

    // Confirm dialog data
    confirmDialog: {
      title: "",
      message: "",
      confirmText: "Confirm",
      cancelText: "Cancel",
      onConfirm: null,
      onCancel: null,
      variant: "default", // 'default' | 'danger'
    },

    // Toast notifications
    toasts: [],

    // Mobile responsiveness
    isMobile: false,
    screenSize: "desktop", // 'mobile' | 'tablet' | 'desktop'

    // Search state (global search)
    globalSearch: {
      query: "",
      isOpen: false,
      results: [],
      loading: false,
    },

    authMode: "signin", // 'signin' | 'signup' | 'otp'
  }),

  getters: {
    isDarkMode: (state) => state.theme === "dark",
    isLightMode: (state) => state.theme === "light",

    hasNotifications: (state) => state.notifications.length > 0,
    unreadNotifications: (state) => state.notifications.filter((n) => !n.read).length,

    isModalOpen: (state) => (modalName) => state.modals[modalName] || false,

    recentToasts: (state) => state.toasts.slice(-3), // Show last 3 toasts

    isSignUpMode: (state) => state.authMode === "signup",
    isSignInMode: (state) => state.authMode === "signin",
    isOTPMode: (state) => state.authMode === "otp",
  },

  actions: {
    // Theme management
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem("hilcoe_theme", theme)
      this.applyTheme()
    },

    toggleTheme() {
      const newTheme = this.theme === "dark" ? "light" : "dark"
      this.setTheme(newTheme)
    },

    initializeTheme() {
      const savedTheme = localStorage.getItem("hilcoe_theme")
      if (savedTheme && ["light", "dark"].includes(savedTheme)) {
        this.theme = savedTheme
      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        this.theme = prefersDark ? "dark" : "light"
      }
      this.applyTheme()
    },

    applyTheme() {
      document.documentElement.classList.toggle("dark", this.theme === "dark")
      document.documentElement.classList.toggle("light", this.theme === "light")
    },

    // Navigation management
    setCurrentView(view) {
      this.pageTransition = true
      setTimeout(() => {
        this.currentView = view
        this.pageTransition = false
      }, 150)
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setSidebarCollapsed(collapsed) {
      this.sidebarCollapsed = collapsed
    },

    // Modal management
    openModal(modalName, data = null) {
      this.modals[modalName] = true

      // Handle special modal data
      if (modalName === "confirmDialog" && data) {
        this.confirmDialog = { ...this.confirmDialog, ...data }
      }
    },

    closeModal(modalName) {
      this.modals[modalName] = false

      // Reset confirm dialog data
      if (modalName === "confirmDialog") {
        this.confirmDialog = {
          title: "",
          message: "",
          confirmText: "Confirm",
          cancelText: "Cancel",
          onConfirm: null,
          onCancel: null,
          variant: "default",
        }
      }
    },

    // Confirm dialog helper
    showConfirmDialog({
      title,
      message,
      onConfirm,
      onCancel,
      confirmText = "Confirm",
      cancelText = "Cancel",
      variant = "default",
    }) {
      this.confirmDialog = {
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        variant,
      }
      this.openModal("confirmDialog")
    },

    // Loading states
    setGlobalLoading(loading) {
      this.globalLoading = loading
    },

    // Notification management
    addNotification(notification) {
      const newNotification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification,
      }

      this.notifications.unshift(newNotification)

      // Limit notifications
      if (this.notifications.length > this.maxNotifications) {
        this.notifications = this.notifications.slice(0, this.maxNotifications)
      }

      return newNotification.id
    },

    markNotificationRead(id) {
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.read = true
      }
    },

    markAllNotificationsRead() {
      this.notifications.forEach((n) => (n.read = true))
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },

    clearAllNotifications() {
      this.notifications = []
    },

    // Toast management
    showToast({ message, type = "info", duration = 5000 }) {
      const toast = {
        id: Date.now() + Math.random(),
        message,
        type, // 'success' | 'error' | 'warning' | 'info'
        timestamp: Date.now(),
        duration,
      }

      this.toasts.push(toast)

      // Auto remove toast
      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(toast.id)
        }, duration)
      }

      return toast.id
    },

    removeToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    // Screen size management
    updateScreenSize() {
      const width = window.innerWidth

      if (width < 768) {
        this.screenSize = "mobile"
        this.isMobile = true
      } else if (width < 1024) {
        this.screenSize = "tablet"
        this.isMobile = false
      } else {
        this.screenSize = "desktop"
        this.isMobile = false
      }

      // Auto-collapse sidebar on mobile
      if (this.isMobile) {
        this.sidebarCollapsed = true
      }
    },

    // Global search
    setGlobalSearchQuery(query) {
      this.globalSearch.query = query
    },

    toggleGlobalSearch() {
      this.globalSearch.isOpen = !this.globalSearch.isOpen
      if (!this.globalSearch.isOpen) {
        this.globalSearch.query = ""
        this.globalSearch.results = []
      }
    },

    async performGlobalSearch(query) {
      if (!query.trim()) {
        this.globalSearch.results = []
        return
      }

      this.globalSearch.loading = true

      try {
        // TODO: Replace with actual API call
        // const response = await searchAPI.globalSearch(query)

        // Mock search results
        await new Promise((resolve) => setTimeout(resolve, 500))

        this.globalSearch.results = [
          {
            id: 1,
            type: "course",
            title: "Web Development Fundamentals",
            description: "Learn HTML, CSS, and JavaScript basics",
            url: "/courses/1",
          },
          {
            id: 2,
            type: "topic",
            title: "JavaScript Functions",
            description: "Understanding function declarations and expressions",
            url: "/topics/2",
          },
        ]
      } catch (error) {
        this.showToast({
          message: "Search failed. Please try again.",
          type: "error",
        })
      } finally {
        this.globalSearch.loading = false
      }
    },

    setAuthMode(mode) {
      this.authMode = mode
    },

    switchToSignIn() {
      this.authMode = "signin"
    },

    switchToSignUp() {
      this.authMode = "signup"
    },

    switchToOTP() {
      this.authMode = "otp"
    },
  },
})
