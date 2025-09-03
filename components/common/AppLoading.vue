<template>
  <div :class="containerClasses">
     Spinner 
    <div v-if="type === 'spinner'" :class="spinnerClasses">
      <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

     Dots 
    <div v-if="type === 'dots'" class="flex space-x-2">
      <div v-for="i in 3" :key="i" :class="[dotClasses, `animate-bounce`]" :style="{ animationDelay: `${(i - 1) * 0.1}s` }"></div>
    </div>

     Pulse 
    <div v-if="type === 'pulse'" :class="pulseClasses"></div>

     Loading Text 
    <p v-if="text" :class="textClasses">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => ['spinner', 'dots', 'pulse'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'blue'
  }
})

const containerClasses = computed(() => {
  const baseClasses = 'flex flex-col items-center justify-center space-y-3'
  const overlayClasses = props.overlay ? 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50' : ''
  
  return [baseClasses, overlayClasses].join(' ')
})

const spinnerClasses = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colors = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    green: 'text-green-500',
    red: 'text-red-500',
    white: 'text-white'
  }

  return [sizes[props.size], colors[props.color]].join(' ')
})

const dotClasses = computed(() => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5'
  }

  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    white: 'bg-white'
  }

  return ['rounded-full', sizes[props.size], colors[props.color]].join(' ')
})

const pulseClasses = computed(() => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    white: 'bg-white'
  }

  return ['rounded-full animate-pulse', sizes[props.size], colors[props.color]].join(' ')
})

const textClasses = computed(() => {
  const colors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    red: 'text-red-400',
    white: 'text-white'
  }

  return ['text-sm font-medium', colors[props.color]].join(' ')
})
</script>
