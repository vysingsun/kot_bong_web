<template>
  <section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-landing-primary-950 dark:to-gray-950">
    <!-- Decorative blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="animate-landing-blob blob-1 absolute -top-40 -left-40 w-96 h-96 rounded-full bg-landing-primary-300/30 dark:bg-landing-primary-600/20 blur-3xl"></div>
      <div class="animate-landing-blob blob-2 absolute top-1/3 right-0 w-80 h-80 rounded-full bg-indigo-300/30 dark:bg-indigo-600/15 blur-3xl"></div>
      <div class="animate-landing-blob blob-3 absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-purple-300/20 dark:bg-purple-600/10 blur-3xl"></div>
      <div class="absolute inset-0 landing-bg-grid-pattern opacity-40 dark:opacity-20"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 w-full">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <!-- Left: Text Content -->
        <div class="flex-1 text-center lg:text-left">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-landing-primary-100 dark:bg-landing-primary-600/20 border border-landing-primary-300 dark:border-landing-primary-500/30 text-landing-primary-700 dark:text-landing-primary-300 text-sm font-medium mb-8 animate-landing-fade-in">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
            </svg>
            {{ t('landing.hero.badge') }}
          </div>

          <!-- Title -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6 animate-landing-fade-up">
            {{ t('landing.hero.title') }}<br>
            <span class="landing-gradient-text">{{ t('landing.hero.titleHighlight') }}</span><br>
            <span class="text-gray-700 dark:text-gray-200">{{ t('landing.hero.titleEnd') }}</span>
          </h1>

          <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 animate-landing-fade-up landing-animate-delay-200">
            {{ t('landing.hero.subtitle') }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-landing-fade-up landing-animate-delay-300">
            <a href="#download" @click.prevent="scrollTo('download')" class="landing-btn-primary text-base px-8 py-4">
              <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              {{ t('landing.hero.cta') }}
            </a>
            <a href="#features" @click.prevent="scrollTo('features')"
              class="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-landing-primary-300 dark:border-white/20 text-landing-primary-700 dark:text-white font-semibold text-base hover:bg-landing-primary-50 dark:hover:bg-white/10 active:scale-95 transition-all">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ t('landing.hero.watchDemo') }}
            </a>
          </div>

          <!-- Free trial badge -->
          <div class="mt-6 flex items-center justify-center lg:justify-start gap-2 animate-landing-fade-up landing-animate-delay-400">
            <svg class="w-5 h-5 text-landing-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm text-landing-green-600 dark:text-landing-green-400 font-medium">{{ t('landing.hero.ctaFree') }}</span>
          </div>
        </div>

        <!-- Right: App Preview Card -->
        <div class="flex-1 flex justify-center lg:justify-end animate-landing-fade-up landing-animate-delay-200">
          <div class="relative w-full max-w-sm">
            <!-- Glow -->
            <div class="absolute inset-0 bg-landing-primary-400/20 dark:bg-landing-primary-600/30 blur-3xl rounded-full"></div>
            <!-- Card -->
            <div class="relative rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-landing-primary-600">
                    <svg aria-hidden="true" fill="white" viewBox="0 0 20 20" class="w-4 h-4">
                      <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-gray-900 dark:text-white font-bold text-sm">Kot Preng</span>
                </div>
                <span class="text-xs text-landing-green-600 bg-landing-green-100 dark:text-landing-green-400 dark:bg-landing-green-400/10 px-2 py-1 rounded-full font-semibold">● Live</span>
              </div>

              <!-- Fuel stock list -->
              <div class="space-y-3">
                <div v-for="fuel in fuelItems" :key="fuel.name" class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="fuel.iconBg">
                      <component :is="fuel.icon" class="w-4 h-4" :class="fuel.iconColor" />
                    </div>
                    <span class="text-gray-800 dark:text-white text-sm font-semibold">{{ fuel.name }}</span>
                  </div>
                  <div class="text-right">
                    <div class="text-gray-800 dark:text-white text-sm font-bold">{{ fuel.stock }}</div>
                    <div class="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div class="h-full rounded-full" :class="fuel.color" :style="`width:${fuel.pct}%`"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick stats -->
              <div class="grid grid-cols-2 gap-3 pt-1">
                <div class="p-3 rounded-xl bg-landing-primary-50 dark:bg-landing-primary-600/20 text-center">
                  <div class="text-xl font-bold text-landing-primary-700 dark:text-white">$1,240</div>
                  <div class="text-xs text-landing-primary-500 dark:text-landing-primary-300 mt-0.5">{{ locale === 'kh' ? 'ការលក់ថ្ងៃនេះ' : 'Today Sales' }}</div>
                </div>
                <div class="p-3 rounded-xl bg-landing-green-50 dark:bg-landing-green-500/10 text-center">
                  <div class="text-xl font-bold text-landing-green-600 dark:text-white">+12%</div>
                  <div class="text-xs text-landing-green-500 dark:text-landing-green-300 mt-0.5">{{ locale === 'kh' ? 'ធៀបម្សិលមិញ' : 'vs Yesterday' }}</div>
                </div>
              </div>
            </div>

            <!-- Floating badges -->
            <div class="absolute -top-4 -right-4 animate-landing-float">
              <div class="bg-landing-green-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-landing-green-500/40 flex items-center gap-1.5">
                <Check class="w-3.5 h-3.5" /> {{ locale === 'kh' ? 'ស្តុកធម្មតា' : 'Stock OK' }}
              </div>
            </div>
            <div class="absolute -bottom-4 -left-4 animate-landing-float landing-animate-delay-300">
              <div class="bg-landing-primary-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-landing-primary-600/40 flex items-center gap-1.5">
                <BarChart2 class="w-3.5 h-3.5" /> {{ locale === 'kh' ? 'របាយការណ៍' : 'Reports' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <a href="#features" class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-landing-primary-500 transition-colors">
      <span class="text-xs font-medium">{{ locale === 'kh' ? 'រំកិលចុះ' : 'Scroll down' }}</span>
      <div class="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
        <div class="w-1 h-2 bg-current rounded-full animate-bounce"></div>
      </div>
    </a>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Fuel, Flame, Truck, Wind, Check, BarChart2 } from 'lucide-vue-next'
import { useLandingScroll } from '@/modules/landing/composables/useLandingScroll'
const { t, locale } = useI18n()
const { scrollTo } = useLandingScroll()

const fuelItems = [
  { name: 'Regular', icon: Fuel,  stock: '2,450 L', pct: 72, color: 'bg-blue-500',   iconBg: 'bg-blue-100 dark:bg-blue-900/30',    iconColor: 'text-blue-600 dark:text-blue-400' },
  { name: 'Super',   icon: Flame, stock: '1,820 L', pct: 54, color: 'bg-orange-500', iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
  { name: 'Diesel',  icon: Truck, stock: '3,100 L', pct: 85, color: 'bg-landing-green-500',  iconBg: 'bg-landing-green-100 dark:bg-landing-green-900/30',   iconColor: 'text-landing-green-600 dark:text-landing-green-400' },
  { name: 'Gas',     icon: Wind,  stock: '950 L',   pct: 28, color: 'bg-yellow-500', iconBg: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600 dark:text-yellow-400' },
]
</script>
