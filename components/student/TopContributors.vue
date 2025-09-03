<template>
  <div class="top-contributors">
     Content Header 
    <div class="content-header">
      <h1 class="gradient-text">Top Contributors</h1>
      <p>Recognize outstanding community members and their achievements</p>
    </div>

     Leaderboard Stats 
    <div class="leaderboard-stats">
      <div class="stat-card glass-strong">
        <div class="stat-icon">
          <i class="fas fa-trophy"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalContributors }}</div>
          <div class="stat-label">Total Contributors</div>
        </div>
      </div>
      <div class="stat-card glass-strong">
        <div class="stat-icon">
          <i class="fas fa-star"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalPoints }}</div>
          <div class="stat-label">Total Points</div>
        </div>
      </div>
      <div class="stat-card glass-strong">
        <div class="stat-icon">
          <i class="fas fa-calendar"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ currentMonth }}</div>
          <div class="stat-label">Current Period</div>
        </div>
      </div>
    </div>

     Filter Tabs 
    <div class="filter-tabs">
      <button 
        v-for="period in periods" 
        :key="period.value"
        class="tab-button" 
        :class="{ active: activePeriod === period.value }"
        @click="setActivePeriod(period.value)"
      >
        {{ period.label }}
      </button>
    </div>

     Top 3 Podium 
    <div class="podium-section">
      <div class="podium">
         Second Place 
        <div class="podium-position second" v-if="topThree[1]">
          <div class="podium-rank">2</div>
          <div class="contributor-avatar">
            {{ topThree[1].name.charAt(0).toUpperCase() }}
          </div>
          <h3>{{ topThree[1].name }}</h3>
          <p class="points">{{ topThree[1].points }} pts</p>
          <div class="achievements">
            <span v-for="badge in topThree[1].badges.slice(0, 2)" :key="badge" class="badge">
              {{ badge }}
            </span>
          </div>
        </div>

         First Place 
        <div class="podium-position first" v-if="topThree[0]">
          <div class="crown">
            <i class="fas fa-crown"></i>
          </div>
          <div class="podium-rank">1</div>
          <div class="contributor-avatar champion">
            {{ topThree[0].name.charAt(0).toUpperCase() }}
          </div>
          <h3>{{ topThree[0].name }}</h3>
          <p class="points">{{ topThree[0].points }} pts</p>
          <div class="achievements">
            <span v-for="badge in topThree[0].badges.slice(0, 3)" :key="badge" class="badge gold">
              {{ badge }}
            </span>
          </div>
        </div>

         Third Place 
        <div class="podium-position third" v-if="topThree[2]">
          <div class="podium-rank">3</div>
          <div class="contributor-avatar">
            {{ topThree[2].name.charAt(0).toUpperCase() }}
          </div>
          <h3>{{ topThree[2].name }}</h3>
          <p class="points">{{ topThree[2].points }} pts</p>
          <div class="achievements">
            <span v-for="badge in topThree[2].badges.slice(0, 2)" :key="badge" class="badge">
              {{ badge }}
            </span>
          </div>
        </div>
      </div>
    </div>

     Full Leaderboard 
    <div class="leaderboard-section">
      <h2 class="section-title">Full Leaderboard</h2>
      <div class="leaderboard-list">
        <div 
          v-for="(contributor, index) in remainingContributors" 
          :key="contributor.id"
          class="contributor-row glass-strong transition-smooth"
        >
          <div class="contributor-rank">
            {{ index + 4 }}
          </div>
          <div class="contributor-info">
            <div class="contributor-avatar small">
              {{ contributor.name.charAt(0).toUpperCase() }}
            </div>
            <div class="contributor-details">
              <h4>{{ contributor.name }}</h4>
              <p>{{ contributor.contributions }} contributions</p>
            </div>
          </div>
          <div class="contributor-stats">
            <div class="stat-item">
              <span class="stat-value">{{ contributor.points }}</span>
              <span class="stat-label">Points</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ contributor.helpfulAnswers }}</span>
              <span class="stat-label">Helpful</span>
            </div>
          </div>
          <div class="contributor-badges">
            <span v-for="badge in contributor.badges.slice(0, 2)" :key="badge" class="badge small">
              {{ badge }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activePeriod = ref('month')

const periods = ref([
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' }
])

// Mock contributors data - replace with API calls
const contributors = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    points: 2847,
    contributions: 156,
    helpfulAnswers: 89,
    badges: ['Expert', 'Mentor', 'Helper']
  },
  {
    id: 2,
    name: 'Mike Chen',
    points: 2634,
    contributions: 142,
    helpfulAnswers: 76,
    badges: ['Guru', 'Problem Solver']
  },
  {
    id: 3,
    name: 'Emily Davis',
    points: 2401,
    contributions: 128,
    helpfulAnswers: 71,
    badges: ['Scholar', 'Contributor']
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    points: 2156,
    contributions: 98,
    helpfulAnswers: 54,
    badges: ['Helper', 'Active']
  },
  {
    id: 5,
    name: 'Lisa Wang',
    points: 1987,
    contributions: 87,
    helpfulAnswers: 48,
    badges: ['Supporter', 'Friendly']
  },
  {
    id: 6,
    name: 'David Kim',
    points: 1834,
    contributions: 76,
    helpfulAnswers: 42,
    badges: ['Contributor', 'Reliable']
  },
  {
    id: 7,
    name: 'Anna Thompson',
    points: 1672,
    contributions: 65,
    helpfulAnswers: 38,
    badges: ['Helper', 'Kind']
  },
  {
    id: 8,
    name: 'James Wilson',
    points: 1543,
    contributions: 58,
    helpfulAnswers: 34,
    badges: ['Active', 'Helpful']
  }
])

const topThree = computed(() => {
  return contributors.value.slice(0, 3)
})

const remainingContributors = computed(() => {
  return contributors.value.slice(3)
})

const totalContributors = computed(() => {
  return contributors.value.length
})

const totalPoints = computed(() => {
  return contributors.value.reduce((sum, contributor) => sum + contributor.points, 0)
})

const currentMonth = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long' })
})

const setActivePeriod = (period) => {
  activePeriod.value = period
  // TODO: Fetch data for the selected period
  console.log(`Switching to ${period} leaderboard`)
}
</script>

<style scoped>
.top-contributors {
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

.leaderboard-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  padding: 1rem;
  background: var(--accent-primary);
  border-radius: 0.75rem;
  color: var(--bg-glass-strong);
  font-size: 1.25rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-glass);
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: var(--text-primary);
}

.tab-button.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.podium-section {
  margin-bottom: 3rem;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 2rem;
  padding: 2rem;
}

.podium-position {
  text-align: center;
  position: relative;
  padding: 2rem 1.5rem;
  background: var(--bg-glass-strong);
  border-radius: 1rem;
  border: 1px solid var(--border-glass);
  transition: all 0.3s ease;
}

.podium-position:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-elegant);
}

.podium-position.first {
  order: 2;
  transform: scale(1.1);
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1a1a1a;
  border-color: #ffd700;
}

.podium-position.second {
  order: 1;
  background: linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%);
  color: #1a1a1a;
  border-color: #c0c0c0;
}

.podium-position.third {
  order: 3;
  background: linear-gradient(135deg, #cd7f32 0%, #daa520 100%);
  color: #1a1a1a;
  border-color: #cd7f32;
}

.crown {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  color: #ffd700;
}

.podium-rank {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  background: var(--accent-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
}

.contributor-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.contributor-avatar.champion {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1a1a1a;
  border: 3px solid #ffd700;
}

.contributor-avatar.small {
  width: 50px;
  height: 50px;
  font-size: 1.25rem;
}

.podium-position h3 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.points {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.achievements {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.badge {
  padding: 0.25rem 0.75rem;
  background: var(--accent-primary);
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.gold {
  background: #ffd700;
  color: #1a1a1a;
}

.badge.small {
  padding: 0.125rem 0.5rem;
  font-size: 0.625rem;
}

.leaderboard-section {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contributor-row {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 1rem;
  gap: 1rem;
}

.contributor-rank {
  width: 40px;
  height: 40px;
  background: var(--accent-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.125rem;
}

.contributor-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.contributor-details h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.contributor-details p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.contributor-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.125rem;
  font-weight: bold;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.contributor-badges {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .leaderboard-stats {
    grid-template-columns: 1fr;
  }
  
  .podium {
    flex-direction: column;
    align-items: center;
  }
  
  .podium-position {
    order: unset !important;
    transform: none !important;
  }
  
  .contributor-row {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .contributor-info {
    flex-direction: column;
    text-align: center;
  }
  
  .contributor-stats {
    justify-content: center;
  }
  
  .filter-tabs {
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
