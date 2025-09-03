<template>
  <form @submit.prevent="handleSignIn" class="auth-form">
    <h1>Sign In</h1>
    <div class="social-container">
      <a href="#" class="social" aria-label="Sign in with Facebook">
        <i class="fab fa-facebook-f"></i>
      </a>
      <a href="#" class="social" aria-label="Sign in with Google">
        <i class="fab fa-google-plus-g"></i>
      </a>
      <a href="#" class="social" aria-label="Sign in with LinkedIn">
        <i class="fab fa-linkedin-in"></i>
      </a>
    </div>
    <span>or use your account</span>
    
    <label for="signin-email">Email</label>
    <input
      type="email"
      id="signin-email"
      v-model="formData.email"
      placeholder="Email"
      required
      :class="{ 'error': errors.email }"
    />
    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
    
    <label for="signin-password">Password</label>
    <input
      type="password"
      id="signin-password"
      v-model="formData.password"
      placeholder="Password"
      required
      minlength="8"
      :class="{ 'error': errors.password }"
    />
    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
    
    <a href="#" class="forgot-link">Forgot your password?</a>
    
    <button type="submit" :disabled="authStore.isLoading">
      {{ authStore.isLoading ? 'Signing In...' : 'Sign In' }}
    </button>
    
    <div v-if="errors.general" class="error-message general-error">{{ errors.general }}</div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore.js'

const authStore = useAuthStore()

const formData = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  errors.general = ''
  
  let isValid = true
  
  if (!formData.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
    isValid = false
  }
  
  return isValid
}

const handleSignIn = async () => {
  console.log('[v0] Sign in form submitted')
  if (!validateForm()) return
  
  const result = await authStore.signIn(formData)
  
  if (!result.success) {
    errors.general = result.error || 'Sign in failed. Please try again.'
  }
}
</script>

<style scoped>
.auth-form {
  background-color: var(--bg-glass-strong);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
  border-radius: 10px;
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid var(--input-border);
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
  transition: all 0.3s ease;
  background-color: var(--input-bg);
  color: var(--text-secondary);
}

.social-container a:hover {
  background-color: var(--accent-primary);
  color: var(--bg-glass-strong);
  transform: translateY(-3px);
  box-shadow: var(--shadow-card);
}

.forgot-link {
  color: var(--text-secondary);
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: var(--accent-primary);
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
  width: 100%;
}

.general-error {
  text-align: center;
  margin-top: 15px;
}

input.error {
  border-color: #ef4444;
}

span {
  font-size: 12px;
  color: var(--text-muted);
}

label {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: left;
  width: 100%;
  margin-bottom: 5px;
}
</style>
