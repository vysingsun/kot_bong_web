<template>
  <section id="features" class="py-24 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <span class="landing-feature-chip mb-4 inline-flex">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ t('landing.features.badge') }}
        </span>
        <h2 class="landing-section-title mb-4">{{ t('landing.features.title') }}</h2>
        <p class="landing-section-subtitle max-w-2xl mx-auto">{{ t('landing.features.subtitle') }}</p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feat in features"
          :key="feat.key"
          class="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-landing-primary-300 dark:hover:border-landing-primary-600 hover:shadow-xl hover:shadow-landing-primary-600/10 transition-all duration-300 hover:-translate-y-1"
        >
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" :class="feat.bg">
            <component :is="feat.icon" class="w-6 h-6" :class="feat.color" />
          </div>
          <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-2">{{ feat.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Package, Receipt, BarChart2, Users, ShieldCheck, Smartphone } from 'lucide-vue-next'
const { t } = useI18n()

const features = computed(() => [
  { key: 'inventory', icon: Package,     title: t('landing.features.inventory.title'), desc: t('landing.features.inventory.desc'), bg: 'bg-blue-50 dark:bg-blue-900/20',   color: 'text-blue-600 dark:text-blue-400' },
  { key: 'sales',     icon: Receipt,     title: t('landing.features.sales.title'),     desc: t('landing.features.sales.desc'),     bg: 'bg-green-50 dark:bg-green-900/20',  color: 'text-green-600 dark:text-green-400' },
  { key: 'reports',   icon: BarChart2,   title: t('landing.features.reports.title'),   desc: t('landing.features.reports.desc'),   bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-600 dark:text-purple-400' },
  { key: 'staff',     icon: Users,       title: t('landing.features.staff.title'),     desc: t('landing.features.staff.desc'),     bg: 'bg-orange-50 dark:bg-orange-900/20', color: 'text-orange-600 dark:text-orange-400' },
  { key: 'multiAuth', icon: ShieldCheck, title: t('landing.features.multiAuth.title'), desc: t('landing.features.multiAuth.desc'), bg: 'bg-pink-50 dark:bg-pink-900/20',    color: 'text-pink-600 dark:text-pink-400' },
  { key: 'mobile',    icon: Smartphone,  title: t('landing.features.mobile.title'),    desc: t('landing.features.mobile.desc'),    bg: 'bg-cyan-50 dark:bg-cyan-900/20',    color: 'text-cyan-600 dark:text-cyan-400' },
])
</script>
