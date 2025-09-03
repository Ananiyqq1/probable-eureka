<template>
  <div class="study-rooms">
     Content Header 
    <div class="content-header">
      <h1 class="gradient-text">Study Rooms</h1>
      <p>Join collaborative learning spaces and connect with peers</p>
    </div>

     Action Bar 
    <div class="action-bar">
      <button class="primary-btn" @click="createRoom">
        <i class="fas fa-plus"></i>
        Create Room
      </button>
      <div class="search-filter">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search rooms..."
          class="search-input"
        >
        <select v-model="filterSubject" class="filter-select">
          <option value="">All Subjects</option>
          <option value="AI">AI</option>
          <option value="Programming">Programming</option>
          <option value="Networking">Networking</option>
          <option value="Mathematics">Mathematics</option>
        </select>
      </div>
    </div>

     Rooms Grid 
    <div class="rooms-grid">
      <div 
        v-for="room in filteredRooms" 
        :key="room.id"
        class="room-card glass-strong transition-smooth"
      >
        <div class="room-header">
          <div class="room-status" :class="room.status">
            <i class="fas fa-circle"></i>
            {{ room.status }}
          </div>
          <div class="room-participants">
            <i class="fas fa-users"></i>
            {{ room.participants }}/{{ room.maxParticipants }}
          </div>
        </div>
        
        <div class="room-image">{{ room.subject }}</div>
        
        <div class="room-content">
          <h3>{{ room.name }}</h3>
          <p>{{ room.description }}</p>
          
          <div class="room-meta">
            <span class="meta-item">
              <i class="fas fa-book"></i>
              {{ room.subject }}
            </span>
            <span class="meta-item">
              <i class="fas fa-clock"></i>
              {{ room.duration }}
            </span>
            <span class="meta-item">
              <i class="fas fa-user"></i>
              {{ room.host }}
            </span>
          </div>
          
          <button 
            class="join-btn" 
            :class="{ 'full': room.participants >= room.maxParticipants }"
            :disabled="room.participants >= room.maxParticipants"
            @click="joinRoom(room)"
          >
            {{ room.participants >= room.maxParticipants ? 'Room Full' : 'Join Room' }}
          </button>
        </div>
      </div>
    </div>

     Empty State 
    <div v-if="filteredRooms.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-users"></i>
      </div>
      <h3>No study rooms found</h3>
      <p>Try adjusting your search or create a new room</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterSubject = ref('')

// Mock rooms data - replace with API calls
const rooms = ref([
  {
    id: 1,
    name: 'AI Study Group',
    description: 'Discussing machine learning algorithms and neural networks',
    subject: 'AI',
    host: 'John Doe',
    participants: 8,
    maxParticipants: 12,
    duration: '2 hours',
    status: 'active'
  },
  {
    id: 2,
    name: 'Programming Bootcamp',
    description: 'Collaborative coding session for beginners',
    subject: 'Programming',
    host: 'Jane Smith',
    participants: 15,
    maxParticipants: 15,
    duration: '3 hours',
    status: 'full'
  },
  {
    id: 3,
    name: 'Network Security Discussion',
    description: 'Exploring cybersecurity concepts and best practices',
    subject: 'Networking',
    host: 'Mike Johnson',
    participants: 6,
    maxParticipants: 10,
    duration: '1.5 hours',
    status: 'active'
  },
  {
    id: 4,
    name: 'Math Problem Solving',
    description: 'Working through calculus and algebra problems together',
    subject: 'Mathematics',
    host: 'Sarah Wilson',
    participants: 4,
    maxParticipants: 8,
    duration: '2 hours',
    status: 'active'
  }
])

const filteredRooms = computed(() => {
  return rooms.value.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesSubject = !filterSubject.value || room.subject === filterSubject.value
    
    return matchesSearch && matchesSubject
  })
})

const createRoom = () => {
  console.log('Creating new room...')
  // TODO: Implement room creation modal/functionality
}

const joinRoom = (room) => {
  if (room.participants >= room.maxParticipants) return
  
  console.log(`Joining room: ${room.name}`)
  // TODO: Implement room joining logic
  room.participants++
  if (room.participants >= room.maxParticipants) {
    room.status = 'full'
  }
}
</script>

<style scoped>
.study-rooms {
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

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.room-card {
  padding: 1.5rem;
  border-radius: 1rem;
  position: relative;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.room-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.room-status.active {
  background: #10b981;
  color: white;
}

.room-status.full {
  background: #ef4444;
  color: white;
}

.room-participants {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.room-image {
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

.room-content h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.room-content p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.room-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.meta-item i {
  font-size: 0.75rem;
}

.join-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--accent-primary);
  color: var(--bg-glass-strong);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn:hover:not(:disabled) {
  background: var(--accent-secondary);
  transform: translateY(-2px);
}

.join-btn.full {
  background: #6b7280;
  cursor: not-allowed;
}

.join-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    flex-direction: column;
  }
  
  .rooms-grid {
    grid-template-columns: 1fr;
  }
}
</style>
