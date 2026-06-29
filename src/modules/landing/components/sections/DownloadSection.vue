<template>
  <section
    id="download"
    class="py-24 bg-gradient-to-br from-gray-950 via-landing-primary-950 to-gray-950 relative overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="animate-landing-blob blob-1 absolute top-0 left-0 w-72 h-72 rounded-full bg-landing-primary-600/20 blur-3xl"></div>
      <div class="animate-landing-blob blob-2 absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl"></div>
      <div class="absolute inset-0 landing-bg-grid-pattern opacity-20"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="landing-feature-chip mb-6 inline-flex items-center gap-1.5 border-landing-primary-500/30 text-landing-primary-300 bg-landing-primary-600/20">
        <Download class="w-3.5 h-3.5" /> {{ t('landing.download.badge') }}
      </span>
      <h2 class="landing-section-title text-white mb-4">{{ t('landing.download.title') }}</h2>
      <p class="landing-section-subtitle text-gray-400 max-w-xl mx-auto mb-12">
        {{ t('landing.download.subtitle') }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <!-- Google Play -->
        <a
          href="https://kotpreng.com"
          target="_blank"
          class="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-black border border-white/10 hover:bg-gray-900 hover:border-white/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-black/50 min-w-[200px]"
        >
          <img src="@/assets/images/play-store.png" alt="play-store" class="w-8 h-8 flex-shrink-0" />
          <div class="text-left">
            <div class="text-white/60 text-xs leading-none mb-0.5">
              {{ locale === 'kh' ? 'ទាញពី' : 'GET IT ON' }}
            </div>
            <div class="text-white font-bold text-base leading-tight">Google Play</div>
          </div>
        </a>

        <!-- App Store -->
        <a
          href="https://kotpreng.com"
          target="_blank"
          class="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-black border border-white/10 hover:bg-gray-900 hover:border-white/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-black/50 min-w-[200px]"
        >
          <img src="@/assets/images/app-store.png" alt="app-store" class="w-8 h-8 flex-shrink-0" />
          <div class="text-left">
            <div class="text-white/60 text-xs leading-none mb-0.5">
              {{ locale === 'kh' ? 'ទាញពី' : 'Download on the' }}
            </div>
            <div class="text-white font-bold text-base leading-tight">App Store</div>
          </div>
        </a>

        <!-- Web App -->
        <a
          href="/home"
          class="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-landing-primary-600 hover:bg-landing-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-landing-primary-600/40 min-w-[200px]"
        >
          <svg class="w-8 h-8 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <div class="text-left">
            <div class="text-landing-primary-200 text-xs leading-none mb-0.5">kotpreng.com</div>
            <div class="text-white font-bold text-base leading-tight">
              {{ locale === 'kh' ? 'ប្រើលើវែប' : 'Use on Web' }}
            </div>
          </div>
        </a>
      </div>

      <!-- Platforms chips -->
      <div class="flex flex-wrap items-center justify-center gap-3">
        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
            <path d="M48,59.49v393a4.33,4.33,0,0,0,7.37,3.07L260,256,55.37,56.42A4.33,4.33,0,0,0,48,59.49Z"/>
            <path d="M345.8,174,89.22,32.64l-.16-.09c-4.42-2.4-8.62,3.58-5,7.06L285.19,231.93Z"/>
            <path d="M84.08,472.39c-3.64,3.48.56,9.46,5,7.06l.16-.09L345.8,338l-60.61-57.95Z"/>
            <path d="M449.38,231l-71.65-39.46L310.36,256l67.37,64.43L449.38,281C468.87,270.23,468.87,241.77,449.38,231Z"/>
          </svg>
          Android
        </div>
        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
            <path d="M248.644,123.476c-5.45-29.71,8.598-60.285,25.516-80.89c18.645-22.735,50.642-40.17,77.986-42.086c4.619,31.149-8.093,61.498-24.826,82.965C309.37,106.527,278.508,124.411,248.644,123.476z M409.034,231.131c8.461-23.606,25.223-44.845,51.227-59.175c-26.278-32.792-63.173-51.83-97.99-51.83c-46.065,0-65.542,21.947-97.538,21.947c-32.96,0-57.965-21.947-97.866-21.947c-39.127,0-80.776,23.848-107.19,64.577c-9.712,15.055-16.291,33.758-19.879,54.59c-9.956,58.439,4.916,134.557,49.279,202.144c21.57,32.796,50.321,69.737,87.881,70.059c33.459,0.327,42.951-21.392,88.246-21.616c45.362-0.258,53.959,21.841,87.372,21.522c37.571-0.317,67.906-41.199,89.476-73.991c15.359-23.532,21.167-35.418,33.11-62.023C414.435,352.487,389.459,285.571,409.034,231.131z"/>
          </svg>
          iOS
        </div>
        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Web
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Download } from 'lucide-vue-next'
const { t, locale } = useI18n()
</script>
