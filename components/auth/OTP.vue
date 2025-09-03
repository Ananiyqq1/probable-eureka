<template>
  <div class="otp-container">
    <button class="back-button" @click="goBack">
      <i class="fas fa-arrow-left"></i> Back
    </button>
    
    <div class="otp-form">
      <h1>OTP Verification</h1>
      <p>Enter the 6-digit code sent to your email</p>
      
      <div class="otp-inputs">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          :ref="el => otpInputs[index] = el"
          class="otp-input"
          type="text"
          maxlength="1"
          pattern="[0-9]"
          inputmode="numeric"
          v-model="otpDigits[index]"
          @input="handleInput(index, $event)"
          @keydown="handleKeydown(index, $event)"
          :autofocus="index === 0"
        />
      </div>
      
      <button @click="verifyOtp" :disabled="authStore.isLoading || !isOtpComplete">
        {{ authStore.isLoading ? 'Verifying...' : 'Verify' }}
      </button>
      
      <div class="resend-option">
        Didn't receive the code? 
        <a @click="resendOtp" :class="{ 'disabled': resendCooldown > 0 }">
          {{ resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend' }}
        </a>
      </div>
      
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useUIStore } from '../../stores/useUIStore.js'

const authStore = useAuthStore()
const uiStore = useUIStore()

const otpDigits = reactive(['', '', '', '', '', ''])
const otpInputs = ref([])
const error = ref('')
const resendCooldown = ref(0)
let resendTimer = null

const isOtpComplete = computed(() => {
  return otpDigits.every(digit => digit !== '')
})

const handleInput = (index, event) => {
  const value = event.target.value
  
  // Only allow digits
  if (!/^\d$/.test(value) && value !== '') {
    event.target.value = ''
    otpDigits[index] = ''
    return
  }
  
  otpDigits[index] = value
  
  // Auto-tab to next input if current input has value
  if (value && index < otpDigits.length - 1) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleKeydown = (index, event) => {
  // Handle backspace to move to previous input
  if (event.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

const verifyOtp = async () => {
  if (!isOtpComplete.value) {
    error.value = 'Please enter the complete 6-digit OTP code'
    return
  }
  
  const otp = otpDigits.join('')
  error.value = ''
  
  const result = await authStore.verifyOTP(otp)
  
  if (!result.success) {
    error.value = result.error || 'Invalid OTP. Please try again.'
    // Clear OTP inputs on error
    otpDigits.forEach((_, index) => {
      otpDigits[index] = ''
    })
    otpInputs.value[0]?.focus()
  }
}

const resendOtp = async () => {
  if (resendCooldown.value > 0) return
  
  // TODO: Replace with actual API call
  // await api.resendOTP()
  
  // Start cooldown timer
  resendCooldown.value = 60
  resendTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer)
    }
  }, 1000)
  
  error.value = ''
  // Clear current OTP
  otpDigits.forEach((_, index) => {
    otpDigits[index] = ''
  })
  otpInputs.value[0]?.focus()
}

const goBack = () => {
  uiStore.switchToSignUp()
}

onMounted(() => {
  // Focus first input on mount
  otpInputs.value[0]?.focus()
})

onUnmounted(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})
</script>

<style scoped>
.otp-container {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  border: 1px solid var(--border-glass);
  box-shadow: var(--shadow-elegant);
  position: relative;
  overflow: hidden;
  width: 400px;
  max-width: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 8px;
}

.back-button:hover {
  color: var(--accent-primary);
}

.otp-form {
  background-color: var(--bg-glass-strong);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  text-align: center;
  border-radius: 10px;
}

.otp-inputs {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  width: 100%;
  gap: 8px;
}

.otp-input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  background-color: var(--input-bg);
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.otp-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1);
}

.dark .otp-input:focus {
  box-shadow: 0 0 0 2px rgba(249, 250, 251, 0.1);
}

.resend-option {
  margin-top: 25px;
  font-size: 14px;
  color: var(--text-muted);
}

.resend-option a {
  color: var(--accent-primary);
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.resend-option a:hover:not(.disabled) {
  color: var(--accent-secondary);
  text-decoration: underline;
}

.resend-option a.disabled {
  color: var(--text-muted);
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 15px;
  text-align: center;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:disabled:hover {
  transform: none;
  box-shadow: none;
}
</style>
