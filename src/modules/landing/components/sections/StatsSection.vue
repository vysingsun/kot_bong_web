<template>
  <section class="py-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="stat in stats" :key="stat.label" class="text-center group">
          <div class="text-3xl lg:text-4xl font-bold text-landing-primary-600 dark:text-landing-primary-400 mb-2 group-hover:scale-110 transition-transform duration-200">
            {{ stat.value }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const stats = computed(() => [
  { value: '150+',   label: t('landing.stats.stations') },
  { value: '4',      label: t('landing.stats.fuelTypes') },
  { value: '99.9%',  label: t('landing.stats.uptime') },
  { value: '24/7',   label: t('landing.stats.support') },
])
</script>
