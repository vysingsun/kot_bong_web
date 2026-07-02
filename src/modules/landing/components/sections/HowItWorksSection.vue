<template>
  <section id="how-it-works" class="py-24 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span class="landing-feature-chip mb-4 inline-flex items-center gap-1.5">
          <Zap class="w-3.5 h-3.5" /> {{ t('landing.howItWorks.badge') }}
        </span>
        <h2 class="landing-section-title mb-4">{{ t('landing.howItWorks.title') }}</h2>
      </div>

      <!-- 3 steps -->
      <div class="relative mb-20">
        <div class="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-landing-primary-600 via-indigo-500 to-purple-600"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div v-for="(step, i) in steps" :key="i" class="relative flex flex-col items-center text-center">
            <div class="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg mb-6" :class="step.bg">
              {{ i + 1 }}
            </div>
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" :class="step.iconBg">
              <component :is="step.icon" class="w-7 h-7" :class="step.iconColor" />
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-xl mb-3">{{ step.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Auth Methods -->
      <div class="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 class="text-center font-bold text-gray-900 dark:text-white text-xl mb-8">
          {{ locale === 'kh' ? 'វិធីចុះឈ្មោះ / ចូល' : 'Sign-up / Login Methods' }}
        </h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <!-- Facebook -->
          <div class="flex flex-col items-center gap-3 p-5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-[#1877F2] shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <span class="text-sm font-bold text-gray-800 dark:text-gray-100">Facebook</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">OAuth 2.0</span>
          </div>

          <!-- Google -->
          <div class="flex flex-col items-center gap-3 p-5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span class="text-sm font-bold text-gray-800 dark:text-gray-100">Google</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">OAuth 2.0</span>
          </div>

          <!-- Phone -->
          <div class="flex flex-col items-center gap-3 p-5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-landing-green-50 dark:hover:bg-landing-green-900/10 transition-colors group">
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-landing-green-500 shadow-lg shadow-landing-green-500/30 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <span class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ locale === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone Number' }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ locale === 'kh' ? 'ផ្ទៀងផ្ទាត់ OTP' : 'OTP verify' }}</span>
          </div>

          <!-- Email -->
          <div class="flex flex-col items-center gap-3 p-5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-landing-primary-50 dark:hover:bg-landing-primary-900/10 transition-colors group">
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-landing-primary-600 shadow-lg shadow-landing-primary-600/30 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <span class="text-sm font-bold text-gray-800 dark:text-gray-100">Email</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ locale === 'kh' ? 'ផ្ទៀងផ្ទាត់ OTP' : 'OTP verify' }}</span>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ClipboardList, Fuel, BarChart2, Zap } from 'lucide-vue-next'
const { t, locale } = useI18n()

const steps = computed(() => [
  { icon: ClipboardList, title: t('landing.howItWorks.step1Title'), desc: t('landing.howItWorks.step1Desc'), bg: 'bg-landing-primary-600 shadow-landing-primary-600/40', iconBg: 'bg-landing-primary-50 dark:bg-landing-primary-900/30', iconColor: 'text-landing-primary-600 dark:text-landing-primary-400' },
  { icon: Fuel,          title: t('landing.howItWorks.step2Title'), desc: t('landing.howItWorks.step2Desc'), bg: 'bg-indigo-600 shadow-indigo-600/40',   iconBg: 'bg-indigo-50 dark:bg-indigo-900/30',   iconColor: 'text-indigo-600 dark:text-indigo-400' },
  { icon: BarChart2,     title: t('landing.howItWorks.step3Title'), desc: t('landing.howItWorks.step3Desc'), bg: 'bg-purple-600 shadow-purple-600/40',   iconBg: 'bg-purple-50 dark:bg-purple-900/30',   iconColor: 'text-purple-600 dark:text-purple-400' },
])
</script>
