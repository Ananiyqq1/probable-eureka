<template>
  <div class="login-view">
    <!-- OTP View  -->
    <OTP v-if="uiStore.authMode === 'otp'" />
    
    <!-- Sign In/Sign Up Container  -->
    <div v-else class="auth-container" :class="{ 'right-panel-active': uiStore.authMode === 'signup' }">
      <!-- Sign Up Form Container  -->
      <div class="form-container sign-up-container">
        <SignUp />
      </div>
      
      <!-- Sign In Form Container  -->
      <div class="form-container sign-in-container">
        <SignIn />
      </div>
      
      <!-- Overlay Container  -->
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button class="ghost" @click="switchToSignIn">Sign In</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>HiLCoE Peer</h1>
            <p>Enter your credentials to start your journey with us</p>
            <button class="ghost" @click="switchToSignUp">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from '../../stores/useUIStore.js'
import SignIn from '../../components/auth/SignIn.vue'
import SignUp from '../../components/auth/SignUp.vue'
import OTP from '../../components/auth/OTP.vue'

const uiStore = useUIStore()

const switchToSignUp = () => {
  console.log('[v0] Switching to sign up mode')
  uiStore.switchToSignUp()
}

const switchToSignIn = () => {
  console.log('[v0] Switching to sign in mode')
  uiStore.switchToSignIn()
}
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-container {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  border: 1px solid var(--border-glass);
  box-shadow: var(--shadow-elegant);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  transition: all 0.6s ease-in-out;
  visibility: visible;
}

.sign-in-container {
  left: 0;
  z-index: 2;
  opacity: 1;
}

.sign-up-container {
  left: 0;
  opacity: 0;
  z-index: 1;
  visibility: hidden;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.overlay {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  color: var(--bg-glass-strong);
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(0%);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

/* Right Panel Active Animations */
.auth-container.right-panel-active .sign-in-container {
  transform: translateX(100%);
  opacity: 0;
  z-index: 1;
  visibility: hidden;
}

.auth-container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.auth-container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  visibility: visible;
  animation: show 0.6s;
}

.auth-container.right-panel-active .overlay {
  transform: translateX(50%);
}

.auth-container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.auth-container.right-panel-active .overlay-left {
  transform: translateX(0);
}

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
    visibility: hidden;
  }
  50%, 100% {
    opacity: 1;
    z-index: 5;
    visibility: visible;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-container {
    width: 100%;
    min-height: 600px;
  }
  
  .form-container {
    width: 100%;
    position: relative;
  }
  
  .overlay-container {
    display: none;
  }
  
  .sign-up-container,
  .sign-in-container {
    position: relative;
    left: 0;
    opacity: 1;
    visibility: visible;
    transform: none;
  }
  
  .auth-container.right-panel-active .sign-in-container {
    display: none;
  }
  
  .auth-container:not(.right-panel-active) .sign-up-container {
    display: none;
  }
}
</style>
