<template>
  <section class="py-24 bg-white dark:bg-gray-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span class="landing-feature-chip mb-4 inline-flex items-center gap-1.5">
          <Fuel class="w-3.5 h-3.5" /> {{ t('landing.fuelTypes.badge') }}
        </span>
        <h2 class="landing-section-title mb-4">{{ t('landing.fuelTypes.title') }}</h2>
        <p class="landing-section-subtitle max-w-2xl mx-auto">{{ t('landing.fuelTypes.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="fuel in fuels" :key="fuel.key"
          class="group relative p-6 rounded-3xl bg-gradient-to-br border-2 text-center cursor-default hover:scale-105 transition-all duration-300"
          :class="[fuel.gradient, fuel.border]"
        >
          <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
            <component :is="fuel.icon" class="w-8 h-8 text-white" />
          </div>
          <h3 class="font-bold text-white text-lg mb-1">{{ fuel.name }}</h3>
          <p class="text-white/70 text-xs">{{ locale === 'kh' ? 'បានបង្កើតដោយស្វ័យប្រវត្តិ' : 'Auto-created' }}</p>
          <div class="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/60 animate-landing-pulse-slow"></div>
        </div>
      </div>

      <!-- Custom types note -->
      <div class="mt-8 flex items-center justify-center gap-3 p-4 rounded-2xl bg-landing-primary-50 dark:bg-landing-primary-900/20 border border-landing-primary-200 dark:border-landing-primary-800">
        <div class="w-8 h-8 rounded-xl bg-landing-primary-100 dark:bg-landing-primary-800/50 flex items-center justify-center flex-shrink-0">
          <Sparkles class="w-4 h-4 text-landing-primary-600 dark:text-landing-primary-400" />
        </div>
        <p class="text-landing-primary-700 dark:text-landing-primary-300 font-medium text-sm">
          {{ locale === 'kh'
            ? 'អ្នកអាចបន្ថែម ឬកែប្រែប្រភេទប្រេងឥន្ធនៈតាមការចង់បានរបស់អ្នក!'
            : 'You can create or edit fuel types as you wish!'
          }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Fuel, Flame, Truck, Wind, Sparkles } from 'lucide-vue-next'
const { t, locale } = useI18n()

const fuels = computed(() => [
  { key: 'regular', icon: Fuel,  name: t('landing.fuelTypes.regular'), gradient: 'from-blue-500 to-blue-700',     border: 'border-blue-400/50' },
  { key: 'super',   icon: Flame, name: t('landing.fuelTypes.super'),   gradient: 'from-orange-500 to-orange-700', border: 'border-orange-400/50' },
  { key: 'diesel',  icon: Truck, name: t('landing.fuelTypes.diesel'),  gradient: 'from-landing-green-400 to-landing-green-600',   border: 'border-landing-green-300/50' },
  { key: 'gas',     icon: Wind,  name: t('landing.fuelTypes.gas'),     gradient: 'from-cyan-500 to-cyan-700',     border: 'border-cyan-400/50' },
])
</script>
