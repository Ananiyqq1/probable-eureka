import { defineStore } from "pinia"

export const useAdminStore = defineStore("admin", {
  state: () => ({
    // Current admin section
    activeSection: "dashboard",

    // Dashboard data
    dashboardStats: {
      totalStudents: 0,
      totalCourses: 0,
      totalTopics: 0,
      activeRooms: 0,
      loading: false,
    },

    // Course management
    courses: [],
    coursesLoading: false,
    courseFilters: {
      search: "",
      category: "all",
      status: "all",
    },

    // Topic management
    topics: [],
    topicsLoading: false,
    topicFilters: {
      search: "",
      course: "all",
      difficulty: "all",
    },

    // User management
    users: [],
    usersLoading: false,
    userFilters: {
      search: "",
      role: "all",
      status: "all",
    },

    // Modal states
    modals: {
      addCourse: false,
      editCourse: false,
      addTopic: false,
      editTopic: false,
      addUser: false,
      editUser: false,
    },

    // Selected items for editing
    selectedCourse: null,
    selectedTopic: null,
    selectedUser: null,

    // Error handling
    error: null,
  }),

  getters: {
    filteredCourses: (state) => {
      let filtered = state.courses

      if (state.courseFilters.search) {
        filtered = filtered.filter(
          (course) =>
            course.title.toLowerCase().includes(state.courseFilters.search.toLowerCase()) ||
            course.description.toLowerCase().includes(state.courseFilters.search.toLowerCase()),
        )
      }

      if (state.courseFilters.category !== "all") {
        filtered = filtered.filter((course) => course.category === state.courseFilters.category)
      }

      if (state.courseFilters.status !== "all") {
        filtered = filtered.filter((course) => course.status === state.courseFilters.status)
      }

      return filtered
    },

    filteredTopics: (state) => {
      let filtered = state.topics

      if (state.topicFilters.search) {
        filtered = filtered.filter((topic) =>
          topic.title.toLowerCase().includes(state.topicFilters.search.toLowerCase()),
        )
      }

      if (state.topicFilters.course !== "all") {
        filtered = filtered.filter((topic) => topic.courseId === state.topicFilters.course)
      }

      if (state.topicFilters.difficulty !== "all") {
        filtered = filtered.filter((topic) => topic.difficulty === state.topicFilters.difficulty)
      }

      return filtered
    },

    filteredUsers: (state) => {
      let filtered = state.users

      if (state.userFilters.search) {
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(state.userFilters.search.toLowerCase()) ||
            user.email.toLowerCase().includes(state.userFilters.search.toLowerCase()),
        )
      }

      if (state.userFilters.role !== "all") {
        filtered = filtered.filter((user) => user.role === state.userFilters.role)
      }

      if (state.userFilters.status !== "all") {
        filtered = filtered.filter((user) => user.status === state.userFilters.status)
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

    // Dashboard actions
    async loadDashboardStats() {
      this.dashboardStats.loading = true

      try {
        // TODO: Replace with actual API call
        // const response = await adminAPI.getDashboardStats()

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.dashboardStats = {
          totalStudents: 1247,
          totalCourses: 45,
          totalTopics: 234,
          activeRooms: 12,
          loading: false,
        }
      } catch (error) {
        this.error = error.message
        this.dashboardStats.loading = false
      }
    },

    // Course management actions
    async loadCourses() {
      this.coursesLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await adminAPI.getCourses()

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.courses = [
          {
            id: 1,
            title: "Web Development Fundamentals",
            description: "Learn HTML, CSS, and JavaScript basics",
            category: "Programming",
            status: "active",
            students: 156,
            topics: 12,
            createdAt: "2024-01-15",
          },
          {
            id: 2,
            title: "Data Structures & Algorithms",
            description: "Master fundamental CS concepts",
            category: "Computer Science",
            status: "active",
            students: 89,
            topics: 18,
            createdAt: "2024-01-20",
          },
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.coursesLoading = false
      }
    },

    async createCourse(courseData) {
      try {
        // TODO: Replace with actual API call
        // const response = await adminAPI.createCourse(courseData)

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newCourse = {
          id: Date.now(),
          ...courseData,
          students: 0,
          topics: 0,
          createdAt: new Date().toISOString().split("T")[0],
        }

        this.courses.push(newCourse)
        this.modals.addCourse = false

        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    async updateCourse(courseId, courseData) {
      try {
        // TODO: Replace with actual API call
        // const response = await adminAPI.updateCourse(courseId, courseData)

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const index = this.courses.findIndex((c) => c.id === courseId)
        if (index !== -1) {
          this.courses[index] = { ...this.courses[index], ...courseData }
        }

        this.modals.editCourse = false
        this.selectedCourse = null

        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    async deleteCourse(courseId) {
      try {
        // TODO: Replace with actual API call
        // const response = await adminAPI.deleteCourse(courseId)

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.courses = this.courses.filter((c) => c.id !== courseId)

        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },

    // Topic management actions
    async loadTopics() {
      this.topicsLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await adminAPI.getTopics()

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.topics = [
          {
            id: 1,
            title: "HTML Basics",
            courseId: 1,
            courseName: "Web Development Fundamentals",
            difficulty: "beginner",
            description: "Introduction to HTML structure and elements",
            resources: 5,
            createdAt: "2024-01-16",
          },
          {
            id: 2,
            title: "CSS Styling",
            courseId: 1,
            courseName: "Web Development Fundamentals",
            difficulty: "beginner",
            description: "Learn CSS for styling web pages",
            resources: 8,
            createdAt: "2024-01-17",
          },
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.topicsLoading = false
      }
    },

    // User management actions
    async loadUsers() {
      this.usersLoading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await adminAPI.getUsers()

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.users = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "student",
            status: "active",
            joinedAt: "2024-01-10",
            lastActive: "2024-01-30",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "student",
            status: "active",
            joinedAt: "2024-01-12",
            lastActive: "2024-01-29",
          },
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.usersLoading = false
      }
    },

    // Modal management
    openModal(modalName, item = null) {
      this.modals[modalName] = true
      if (modalName.includes("edit")) {
        if (modalName === "editCourse") this.selectedCourse = item
        else if (modalName === "editTopic") this.selectedTopic = item
        else if (modalName === "editUser") this.selectedUser = item
      }
    },

    closeModal(modalName) {
      this.modals[modalName] = false
      if (modalName.includes("edit")) {
        this.selectedCourse = null
        this.selectedTopic = null
        this.selectedUser = null
      }
    },

    // Filter management
    setCourseFilter(key, value) {
      this.courseFilters[key] = value
    },

    setTopicFilter(key, value) {
      this.topicFilters[key] = value
    },

    setUserFilter(key, value) {
      this.userFilters[key] = value
    },
  },
})
