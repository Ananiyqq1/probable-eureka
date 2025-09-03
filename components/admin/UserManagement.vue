<template>
  <div class="user-management">
     Content Header 
    <div class="content-header">
      <h1 class="gradient-text">User Management</h1>
      <p>Manage student accounts and permissions</p>
    </div>

     Action Bar 
    <div class="action-bar">
      <button class="primary-btn" @click="showCreateModal = true">
        <i class="fas fa-user-plus"></i>
        Add New User
      </button>
      <div class="search-filter">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search users..."
          class="search-input"
        >
        <select v-model="filterRole" class="filter-select">
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
          <option value="instructor">Instructors</option>
        </select>
      </div>
    </div>

     Users Table 
    <div class="users-table-container glass-strong">
      <table class="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-id">ID: {{ user.id }}</div>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="user.status">
                {{ user.status }}
              </span>
            </td>
            <td>{{ formatDate(user.joinedDate) }}</td>
            <td>
              <div class="action-buttons">
                <button @click="editUser(user)" class="action-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="toggleUserStatus(user)" class="action-btn">
                  <i :class="user.status === 'active' ? 'fas fa-ban' : 'fas fa-check'"></i>
                </button>
                <button @click="deleteUser(user)" class="action-btn danger">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

     Create/Edit Modal 
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal glass-effect" @click.stop>
        <div class="modal-header">
          <h2>{{ editingUser ? 'Edit User' : 'Add New User' }}</h2>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" v-model="userForm.name" required>
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="userForm.email" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Role</label>
              <select v-model="userForm.role" required>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Status</label>
              <select v-model="userForm.status" required>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="secondary-btn">Cancel</button>
            <button type="submit" class="primary-btn">
              {{ editingUser ? 'Update User' : 'Add User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const searchQuery = ref('')
const filterRole = ref('')
const showCreateModal = ref(false)
const editingUser = ref(null)

const userForm = reactive({
  name: '',
  email: '',
  role: '',
  status: 'active'
})

// Mock users data - replace with API calls
const users = ref([
  {
    id: 1001,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student',
    status: 'active',
    joinedDate: '2024-01-15'
  },
  {
    id: 1002,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'instructor',
    status: 'active',
    joinedDate: '2024-01-10'
  },
  {
    id: 1003,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'admin',
    status: 'active',
    joinedDate: '2024-01-05'
  },
  {
    id: 1004,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'student',
    status: 'inactive',
    joinedDate: '2024-01-20'
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !filterRole.value || user.role === filterRole.value
    
    return matchesSearch && matchesRole
  })
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const editUser = (user) => {
  editingUser.value = user
  Object.assign(userForm, user)
  showCreateModal.value = true
}

const toggleUserStatus = (user) => {
  user.status = user.status === 'active' ? 'inactive' : 'active'
}

const deleteUser = (user) => {
  if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  }
}

const saveUser = () => {
  if (editingUser.value) {
    // Update existing user
    Object.assign(editingUser.value, userForm)
  } else {
    // Create new user
    const newUser = {
      id: Date.now(),
      ...userForm,
      joinedDate: new Date().toISOString().split('T')[0]
    }
    users.value.push(newUser)
  }
  
  closeModal()
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
  Object.assign(userForm, {
    name: '',
    email: '',
    role: '',
    status: 'active'
  })
}
</script>

<style scoped>
.user-management {
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

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background: var(--accent-secondary);
  transform: translateY(-2px);
}

.search-filter {
  display: flex;
  gap: 1rem;
}

.search-input, .filter-select {
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 0.5rem;
  background: var(--input-bg);
  color: var(--text-primary);
}

.users-table-container {
  border-radius: 1rem;
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: var(--bg-glass);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-glass);
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-glass);
}

.user-row:hover {
  background: var(--bg-glass);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
}

.user-id {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.role-badge, .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.student {
  background: #3b82f6;
  color: white;
}

.role-badge.instructor {
  background: #8b5cf6;
  color: white;
}

.role-badge.admin {
  background: #ef4444;
  color: white;
}

.status-badge.active {
  background: #10b981;
  color: white;
}

.status-badge.inactive {
  background: #6b7280;
  color: white;
}

.status-badge.suspended {
  background: #f59e0b;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  background: var(--bg-glass);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
}

.action-btn.danger:hover {
  background: #ef4444;
}

/* Modal Styles - Same as other components */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.secondary-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--input-border);
  background: transparent;
  color: var(--text-primary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: var(--bg-glass);
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    flex-direction: column;
  }
  
  .users-table-container {
    overflow-x: auto;
  }
  
  .users-table {
    min-width: 600px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
