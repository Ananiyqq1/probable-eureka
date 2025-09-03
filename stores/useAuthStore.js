import { defineStore } from "pinia"
import { useAppStore } from "./useAppStore.js"
import { useUIStore } from "./useUIStore.js"
import { useStudentStore } from "./useStudentStore.js"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // User authentication state
    user: null,
    isAuthenticated: false,
    isLoading: false,

    // Auth flow state
    authMode: "signin", // 'signin', 'signup', 'otp'
    otpEmail: null,

    // Session management
    sessionToken: null,
    refreshToken: null,
    sessionExpiry: null,

    // Error handling
    authError: null,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === "admin",
    isStudent: (state) => state.user?.role === "student",
    userInitials: (state) => {
      if (!state.user?.name) return "U"
      return state.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    },
    isSessionValid: (state) => {
      if (!state.sessionExpiry) return false
      return new Date() < new Date(state.sessionExpiry)
    },
  },

  actions: {
    // Auth mode management
    setAuthMode(mode) {
      this.authMode = mode
      this.authError = null
      const uiStore = useUIStore()
      if (mode === "otp") {
        uiStore.switchToOTP()
      } else if (mode === "signin") {
        uiStore.switchToSignIn()
      } else if (mode === "signup") {
        uiStore.switchToSignUp()
      }
    },

    async determineTargetView(user) {
      const studentStore = useStudentStore()
      if (user.role === "admin") {
        return "admin"
      } else if (user.role === "student") {
        await studentStore.loadPreferences()

        // If student hasn't completed preferences, show preferences page
        if (!studentStore.hasCompletedPreferences) {
          return "preferences"
        }
        return "student"
      }
      return "login"
    },

    // Sign in action
    async signIn(credentials) {
      const appStore = useAppStore()
      this.isLoading = true
      this.authError = null

      console.log("[v0] Starting sign in process for:", credentials.email)

      try {
        // TODO: Replace with actual API call
        // const response = await authAPI.signIn(credentials)

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock user data based on email
        const mockUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: credentials.email.includes("admin") ? "Admin User" : "Student User",
          email: credentials.email,
          role: credentials.email.includes("admin") ? "admin" : "student",
          avatar: null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        }

        console.log("[v0] Mock user created:", mockUser)

        // Set user and session data
        this.user = mockUser
        this.isAuthenticated = true
        this.sessionToken = "mock-session-token-" + Date.now()
        this.refreshToken = "mock-refresh-token-" + Date.now()
        this.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

        // Store session in localStorage
        this.persistSession()

        const targetView = await this.determineTargetView(mockUser)
        console.log("[v0] Navigating to view:", targetView)

        try {
          await appStore.navigateToView(targetView)
          console.log("[v0] Navigation completed successfully")
        } catch (navError) {
          console.error("[v0] Navigation failed:", navError)
        }

        return { success: true, user: mockUser }
      } catch (error) {
        console.error("[v0] Sign in error:", error)
        this.authError = error.message || "Sign in failed"
        return { success: false, error: this.authError }
      } finally {
        this.isLoading = false
      }
    },

    // Sign up action
    async signUp(userData) {
      this.isLoading = true
      this.authError = null

      try {
        // TODO: Replace with actual API call
        // const response = await authAPI.signUp(userData)

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Store email for OTP verification
        this.otpEmail = userData.email
        this.setAuthMode("otp")

        return { success: true, message: "OTP sent to your email" }
      } catch (error) {
        this.authError = error.message || "Sign up failed"
        return { success: false, error: this.authError }
      } finally {
        this.isLoading = false
      }
    },

    // OTP verification
    async verifyOTP(otp) {
      const appStore = useAppStore()
      this.isLoading = true
      this.authError = null

      console.log("[v0] Starting OTP verification for:", this.otpEmail)

      try {
        // TODO: Replace with actual API call
        // const response = await authAPI.verifyOTP({ email: this.otpEmail, otp })

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Create new user after OTP verification
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: "New User",
          email: this.otpEmail,
          role: "student",
          avatar: null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        }

        console.log("[v0] New user created after OTP:", newUser)

        this.user = newUser
        this.isAuthenticated = true
        this.sessionToken = "mock-session-token-" + Date.now()
        this.refreshToken = "mock-refresh-token-" + Date.now()
        this.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        this.otpEmail = null

        // Store session in localStorage
        this.persistSession()

        const targetView = await this.determineTargetView(newUser)
        console.log("[v0] Navigating to view after OTP verification:", targetView)

        try {
          await appStore.navigateToView(targetView)
          console.log("[v0] Navigation completed successfully")
        } catch (navError) {
          console.error("[v0] Navigation failed after OTP:", navError)
        }

        return { success: true, user: newUser }
      } catch (error) {
        console.error("[v0] OTP verification error:", error)
        this.authError = error.message || "OTP verification failed"
        return { success: false, error: this.authError }
      } finally {
        this.isLoading = false
      }
    },

    // Session management
    persistSession() {
      const sessionData = {
        user: this.user,
        sessionToken: this.sessionToken,
        refreshToken: this.refreshToken,
        sessionExpiry: this.sessionExpiry,
      }
      localStorage.setItem("hilcoe_session", JSON.stringify(sessionData))
    },

    restoreSession() {
      const sessionData = localStorage.getItem("hilcoe_session")
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData)
          if (new Date() < new Date(parsed.sessionExpiry)) {
            this.user = parsed.user
            this.sessionToken = parsed.sessionToken
            this.refreshToken = parsed.refreshToken
            this.sessionExpiry = parsed.sessionExpiry
            this.isAuthenticated = true
            return true
          } else {
            this.clearSession()
          }
        } catch (error) {
          this.clearSession()
        }
      }
      return false
    },

    clearSession() {
      localStorage.removeItem("hilcoe_session")
      this.user = null
      this.isAuthenticated = false
      this.sessionToken = null
      this.refreshToken = null
      this.sessionExpiry = null
    },

    // Sign out
    async signOut() {
      const appStore = useAppStore()
      this.isLoading = true

      try {
        // TODO: Call API to invalidate session
        // await authAPI.signOut(this.sessionToken)

        this.clearSession()
        this.authMode = "signin"
        this.authError = null

        return { success: true }
      } catch (error) {
        // Even if API call fails, clear local session
        this.clearSession()
        return { success: true }
      } finally {
        this.isLoading = false
      }
    },

    // Refresh token
    async refreshSession() {
      const appStore = useAppStore()
      if (!this.refreshToken) return false

      try {
        // TODO: Call refresh token API
        // const response = await authAPI.refreshToken(this.refreshToken)

        // Mock refresh
        this.sessionToken = "mock-session-token-" + Date.now()
        this.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        this.persistSession()

        return true
      } catch (error) {
        this.clearSession()
        return false
      }
    },
  },
})
