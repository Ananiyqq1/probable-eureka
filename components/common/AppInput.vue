<template>
  <div class="space-y-2">
     Label 
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-400 ml-1">*</span>
    </label>

     Input Container 
    <div class="relative">
       Left Icon 
      <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="iconLeft" class="h-5 w-5 text-gray-400" />
      </div>

       Input Field 
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

       Right Icon 
      <div v-if="iconRight" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <component :is="iconRight" class="h-5 w-5 text-gray-400" />
      </div>

       Password Toggle 
      <button
        v-if="type === 'password' && showPasswordToggle"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
        @click="togglePasswordVisibility"
      >
        <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
        </svg>
      </button>
    </div>

     Error Message 
    <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

     Help Text 
    <p v-if="helpText && !error" class="text-sm text-gray-400">{{ helpText }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  iconLeft: {
    type: [String, Object],
    default: null
  },
  iconRight: {
    type: [String, Object],
    default: null
  },
  showPasswordToggle: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const showPassword = ref(false)
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

const inputClasses = computed(() => {
  const baseClasses = 'glass-card w-full px-3 py-2 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300'
  const paddingClasses = props.iconLeft ? 'pl-10' : props.iconRight || (props.type === 'password' && props.showPasswordToggle) ? 'pr-10' : ''
  const errorClasses = props.error ? 'border-red-500 focus:ring-red-500' : ''
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : ''

  return [baseClasses, paddingClasses, errorClasses, disabledClasses].join(' ')
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
  // Update input type
  const input = document.getElementById(inputId)
  input.type = showPassword.value ? 'text' : 'password'
}
</script>
