<template>
  <div :class="cardClasses">
     Header 
    <div v-if="title || subtitle || $slots.header" class="p-6 border-b border-white/10">
      <div v-if="title || subtitle" class="flex items-center justify-between">
        <div>
          <h3 v-if="title" class="text-lg font-semibold text-white">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-gray-400 mt-1">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.actions">
          <slot name="actions"></slot>
        </div>
      </div>
      <slot name="header"></slot>
    </div>

     Body 
    <div :class="bodyClasses">
      <slot></slot>
    </div>

     Footer 
    <div v-if="$slots.footer" class="p-6 border-t border-white/10">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'gradient', 'bordered'].includes(value)
  },
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['none', 'sm', 'normal', 'lg'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  const baseClasses = 'glass-card rounded-xl overflow-hidden transition-all duration-300'
  
  const variantClasses = {
    default: '',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-gradient',
    bordered: 'border-2 border-white/20'
  }

  const hoverClasses = props.hover ? 'hover:scale-105 hover:shadow-2xl cursor-pointer' : ''

  return [baseClasses, variantClasses[props.variant], hoverClasses].join(' ')
})

const bodyClasses = computed(() => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8'
  }

  return paddingClasses[props.padding]
})
</script>
