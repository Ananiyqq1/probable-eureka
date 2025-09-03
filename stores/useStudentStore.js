import { defineStore } from "pinia"

export const useStudentStore = defineStore("student", {
  state: () => ({
    // Current student section
    activeSection: "dashboard",

    preferences: null,
    preferencesLoading: false,

    // Dashboard data
    enrolledCourses: [],
    recentSessions: [],
    upcomingEvaluations: [],
    dashboardLoading: false,

    // Study rooms
    studyRooms: [],
    roomsLoading: false,
    roomFilters: {
      search: "",
      subject: "all",
      difficulty: "all",
      status: "all",
    },

    // Resources
    resources: [],
    resourcesLoading: false,
    resourceFilters: {
      search: "",
      type: "all",
      subject: "all",
    },

    // My sessions
    mySessions: [],
    sessionsLoading: false,

    // Evaluations
    evaluations: [],
    evaluationsLoading: false,
    evaluationFilters: {
      search: "",
      status: "all",
      subject: "all",
    },

    // Top contributors
    topContributors: [],
    contributorsLoading: false,

    // User progress
    userProgress: {
      totalPoints: 0,
      rank: 0,
      completedSessions: 0,
      averageScore: 0,
    },

    // Error handling
    error: null,
  }),

  getters: {
    hasCompletedPreferences: (state) => {
      return state.preferences && state.preferences.completedAt
    },

    selectedCoursesCount: (state) => {
      return state.preferences?.selectedCourses?.length || 0
    },

    filteredStudyRooms: (state) => {
      let filtered = state.studyRooms

      if (state.roomFilters.search) {
        filtered = filtered.filter(
          (room) =>
            room.title.toLowerCase().includes(state.roomFilters.search.toLowerCase()) ||
            room.description.toLowerCase().includes(state.roomFilters.search.toLowerCase()),
        )
      }

      if (state.roomFilters.subject !== "all") {
        filtered = filtered.filter((room) => room.subject === state.roomFilters.subject)
      }

      if (state.roomFilters.difficulty !== "all") {
        filtered = filtered.filter((room) => room.difficulty === state.roomFilters.difficulty)
      }

      if (state.roomFilters.status !== "all") {
        filtered = filtered.filter((room) => room.status === state.roomFilters.status)
      }

      return filtered
    },

    filteredResources: (state) => {
      let filtered = state.resources

      if (state.resourceFilters.search) {
        filtered = filtered.filter((resource) =>
          resource.title.toLowerCase().includes(state.resourceFilters.search.toLowerCase()),
        )
      }

      if (state.resourceFilters.type !== "all") {
        filtered = filtered.filter((resource) => resource.type === state.resourceFilters.type)
      }

      if (state.resourceFilters.subject !== "all") {
        filtered = filtered.filter((resource) => resource.subject === state.resourceFilters.subject)
      }

      return filtered
    },

    filteredEvaluations: (state) => {
      let filtered = state.evaluations

      if (state.evaluationFilters.search) {
        filtered = filtered.filter((evaluation) =>
          evaluation.title.toLowerCase().includes(state.evaluationFilters.search.toLowerCase()),
        )
      }

      if (state.evaluationFilters.status !== "all") {
        filtered = filtered.filter((evaluation) => evaluation.status === state.evaluationFilters.status)
      }

      if (state.evaluationFilters.subject !== "all") {
        filtered = filtered.filter((evaluation) => evaluation.subject === state.evaluationFilters.subject)
      }

      return filtered
    },
  },

  actions: {
    // Section management
    setActiveSection(section) {
      this.activeSection = section
      this.error = null
    },

    async savePreferences(preferencesData) {
      this.preferencesLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await studentAPI.savePreferences(preferencesData)

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.preferences = {
          ...preferencesData,
          savedAt: new Date().toISOString(),
        }

        // Store in localStorage for persistence
        localStorage.setItem("studentPreferences", JSON.stringify(this.preferences))

        return { success: true, message: "Preferences saved successfully!" }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.preferencesLoading = false
      }
    },

    async loadPreferences() {
      this.preferencesLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await studentAPI.getPreferences()

        // Mock API call - load from localStorage
        await new Promise((resolve) => setTimeout(resolve, 500))

        const stored = localStorage.getItem("studentPreferences")
        if (stored) {
          this.preferences = JSON.parse(stored)
        }

        return this.preferences
      } catch (error) {
        this.error = error.message
        return null
      } finally {
        this.preferencesLoading = false
      }
    },

    // Dashboard actions
    async loadDashboardData() {
      this.dashboardLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API calls
        // const [courses, sessions, evaluations] = await Promise.all([
        //   studentAPI.getEnrolledCourses(),
        //   studentAPI.getRecentSessions(),
        //   studentAPI.getUpcomingEvaluations()
        // ])

        // Mock API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.enrolledCourses = [
          {
            id: 1,
            title: "Web Development Fundamentals",
            progress: 75,
            nextSession: "2024-02-01T10:00:00Z",
            instructor: "Dr. Smith",
          },
          {
            id: 2,
            title: "Data Structures & Algorithms",
            progress: 45,
            nextSession: "2024-02-02T14:00:00Z",
            instructor: "Prof. Johnson",
          },
        ]

        this.recentSessions = [
          {
            id: 1,
            title: "JavaScript Fundamentals",
            date: "2024-01-29T15:00:00Z",
            duration: 120,
            participants: 8,
          },
          {
            id: 2,
            title: "CSS Grid Layout",
            date: "2024-01-28T10:00:00Z",
            duration: 90,
            participants: 12,
          },
        ]

        this.upcomingEvaluations = [
          {
            id: 1,
            title: "HTML/CSS Assessment",
            dueDate: "2024-02-05T23:59:00Z",
            subject: "Web Development",
            points: 100,
          },
        ]

        this.userProgress = {
          totalPoints: 1250,
          rank: 23,
          completedSessions: 15,
          averageScore: 87.5,
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.dashboardLoading = false
      }
    },

    // Study rooms actions
    async loadStudyRooms() {
      this.roomsLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await studentAPI.getStudyRooms()

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.studyRooms = [
          {
            id: 1,
            title: "JavaScript Study Group",
            description: "Learn JS fundamentals together",
            subject: "Programming",
            difficulty: "beginner",
            status: "active",
            participants: 8,
            maxParticipants: 12,
            startTime: "2024-02-01T15:00:00Z",
            duration: 120,
            host: "Alice Johnson",
          },
          {
            id: 2,
            title: "Algorithm Problem Solving",
            description: "Practice coding challenges",
            subject: "Computer Science",
            difficulty: "intermediate",
            status: "active",
            participants: 6,
            maxParticipants: 10,
            startTime: "2024-02-01T18:00:00Z",
            duration: 90,
            host: "Bob Smith",
          },
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.roomsLoading = false
      }
    },

    async joinStudyRoom(roomId) {
      try {
        // TODO: Replace with actual API call
        // const response = await studentAPI.joinStudyRoom(roomId)

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const room = this.studyRooms.find((r) => r.id === roomId)
        if (room && room.participants < room.maxParticipants) {
          room.participants += 1
        }

        return { success: true, message: "Successfully joined the study room!" }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Resources actions
    async loadResources() {
      this.resourcesLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await studentAPI.getResources()

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.resources = [
          {
            id: 1,
            title: "HTML5 Complete Guide",
            type: "pdf",
            subject: "Web Development",
            size: "2.5 MB",
            downloads: 156,
            uploadedAt: "2024-01-15",
          },
          {
            id: 2,
            title: "JavaScript Tutorial Video",
            type: "video",
            subject: "Programming",
            size: "45 MB",
            downloads: 89,
            uploadedAt: "2024-01-20",
          },
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.resourcesLoading = false
      }
    },

    // Sessions actions
    async loadMySessions() {
      this.sessionsLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await studentAPI.getMySessions()

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.mySessions = [
          {
            id: 1,
            title: "React Hooks Deep Dive",
            status: "completed",
            date: "2024-01-28T14:00:00Z",
            duration: 120,
            participants: 10,
            score: 85,
            feedback: "Great participation!",
          },
          {
            id: 2,
            title: "CSS Flexbox Workshop",
            status: "in-progress",
            date: "2024-01-30T16:00:00Z",
            duration: 90,
            participants: 8,
            progress: 60,
          },
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.sessionsLoading = false
      }
    },

    // Evaluations actions
    async loadEvaluations() {
      this.evaluationsLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await studentAPI.getEvaluations()

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.evaluations = [
          {
            id: 1,
            title: "Web Development Midterm",
            subject: "Web Development",
            status: "completed",
            score: 92,
            maxScore: 100,
            dueDate: "2024-01-25T23:59:00Z",
            submittedAt: "2024-01-24T18:30:00Z",
          },
          {
            id: 2,
            title: "JavaScript Fundamentals Quiz",
            subject: "Programming",
            status: "pending",
            maxScore: 50,
            dueDate: "2024-02-05T23:59:00Z",
          },
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.evaluationsLoading = false
      }
    },

    // Top contributors actions
    async loadTopContributors() {
      this.contributorsLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await studentAPI.getTopContributors()

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.topContributors = [
          {
            id: 1,
            name: "Alice Johnson",
            points: 2450,
            rank: 1,
            sessionsHosted: 15,
            helpfulAnswers: 89,
            avatar: null,
          },
          {
            id: 2,
            name: "Bob Smith",
            points: 2180,
            rank: 2,
            sessionsHosted: 12,
            helpfulAnswers: 76,
            avatar: null,
          },
          {
            id: 3,
            name: "Carol Davis",
            points: 1950,
            rank: 3,
            sessionsHosted: 10,
            helpfulAnswers: 65,
            avatar: null,
          },
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.contributorsLoading = false
      }
    },

    // Filter management
    setRoomFilter(key, value) {
      this.roomFilters[key] = value
    },

    setResourceFilter(key, value) {
      this.resourceFilters[key] = value
    },

    setEvaluationFilter(key, value) {
      this.evaluationFilters[key] = value
    },
  },
})
