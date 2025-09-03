<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
         Backdrop 
        <div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="closeModal"
        ></div>
        
         Modal Content 
        <div 
          :class="[
            'relative glass-card rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden',
            sizeClasses
          ]"
        >
           Header 
          <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h3 v-if="title" class="text-xl font-semibold text-white">{{ title }}</h3>
              <slot name="header"></slot>
            </div>
            <button 
              @click="closeModal"
              class="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

           Body 
          <div class="p-6 overflow-y-auto max-h-[60vh]">
            <slot></slot>
          </div>

           Footer 
          <div v-if="$slots.footer" class="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl'
  }
  return sizes[props.size]
})

const closeModal = () => {
  if (props.closeOnBackdrop) {
    emit('close')
  }
}

// Handle escape key
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        emit('close')
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .glass-card,
.modal-leave-active .glass-card {
  transition: transform 0.3s ease;
}

.modal-enter-from .glass-card,
.modal-leave-to .glass-card {
  transform: scale(0.9);
}
</style>
