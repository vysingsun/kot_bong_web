<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
    :class="scrolled
      ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg shadow-gray-900/5'
      : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md'"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-lg shadow-landing-primary-600/40 group-hover:shadow-landing-primary-600/60 transition-all">
            <svg aria-hidden="true" fill="blue" viewBox="0 0 20 20" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span class="font-bold text-lg text-gray-900 dark:text-white tracking-tight">Kot Preng</span>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center gap-8">
          <a href="#features" @click.prevent="scrollTo('features')" class="landing-nav-link text-sm">{{ t('landing.nav.features') }}</a>
          <a href="#how-it-works" @click.prevent="scrollTo('how-it-works')" class="landing-nav-link text-sm">{{ t('landing.nav.howItWorks') }}</a>
          <a href="#pricing" @click.prevent="scrollTo('pricing')" class="landing-nav-link text-sm">{{ t('landing.nav.pricing') }}</a>
          <router-link to="/policy" class="landing-nav-link text-sm">{{ t('landing.nav.policy') }}</router-link>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-3">
          <!-- Language Switcher -->
          <div class="relative" ref="langDropdownRef">
            <button
              @click.stop="langOpen = !langOpen"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="p-0.5 rounded-md bg-gray-100 dark:bg-gray-700">
                <Languages class="w-4 h-4" />
              </div>
              <span class="hidden sm:block">{{ locale === 'kh' ? 'ខ្មែរ' : 'English' }}</span>
              <svg class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': langOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown -->
            <Transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="langOpen"
                class="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden origin-top-right z-50"
                @click.stop
              >
                <button
                  @click="setLang('kh')"
                  class="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-left hover:bg-landing-primary-50 dark:hover:bg-landing-primary-900/20 transition-colors"
                  :class="{ 'text-landing-primary-600 dark:text-landing-primary-400 font-semibold bg-landing-primary-50/50 dark:bg-landing-primary-900/10': locale === 'kh' }"
                >
                  <div class="w-5 h-5 rounded-md bg-landing-primary-100 dark:bg-landing-primary-900/40 flex items-center justify-center text-xs font-bold text-landing-primary-600 dark:text-landing-primary-400 flex-shrink-0">ក</div>
                  ខ្មែរ
                </button>
                <button
                  @click="setLang('en')"
                  class="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-left hover:bg-landing-primary-50 dark:hover:bg-landing-primary-900/20 transition-colors"
                  :class="{ 'text-landing-primary-600 dark:text-landing-primary-400 font-semibold bg-landing-primary-50/50 dark:bg-landing-primary-900/10': locale === 'en' }"
                >
                  <div class="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">A</div>
                  English
                </button>
              </div>
            </Transition>
          </div>

          <!-- Dark Mode Toggle (standalone, landing-only) -->
          <button
            @click="$emit('toggle-dark')"
            class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :title="isDark ? 'Light mode' : 'Dark mode'"
          >
            <svg v-if="!isDark" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </button>

          <a href="#download" @click.prevent="scrollTo('download')" class="hidden sm:flex landing-btn-primary text-sm py-2 px-5">
            {{ t('landing.nav.download') }}
          </a>

          <!-- Mobile Menu Button -->
          <button @click="mobileOpen = !mobileOpen" class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileOpen" class="lg:hidden border-t border-gray-100 dark:border-gray-800 py-4 space-y-1">
          <a href="#features" @click.prevent="scrollTo('features')" class="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-landing-primary-600 font-medium rounded-lg hover:bg-landing-primary-50 dark:hover:bg-landing-primary-900/10 transition-colors">{{ t('landing.nav.features') }}</a>
          <a href="#how-it-works" @click.prevent="scrollTo('how-it-works')" class="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-landing-primary-600 font-medium rounded-lg hover:bg-landing-primary-50 dark:hover:bg-landing-primary-900/10 transition-colors">{{ t('landing.nav.howItWorks') }}</a>
          <a href="#pricing" @click.prevent="scrollTo('pricing')" class="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-landing-primary-600 font-medium rounded-lg hover:bg-landing-primary-50 dark:hover:bg-landing-primary-900/10 transition-colors">{{ t('landing.nav.pricing') }}</a>
          <router-link to="/policy" @click="mobileOpen=false" class="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-landing-primary-600 font-medium rounded-lg hover:bg-landing-primary-50 dark:hover:bg-landing-primary-900/10 transition-colors">{{ t('landing.nav.policy') }}</router-link>
          <div class="px-4 pt-2">
            <a href="#download" @click.prevent="scrollTo('download')" class="landing-btn-primary w-full text-center block">{{ t('landing.nav.download') }}</a>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Languages } from 'lucide-vue-next'

defineProps<{ isDark: boolean }>()
defineEmits(['toggle-dark'])

const { t, locale } = useI18n()
const scrolled = ref(false)
const langOpen = ref(false)
const mobileOpen = ref(false)
const langDropdownRef = ref<HTMLElement | null>(null)

function scrollTo(id: string) {
  mobileOpen.value = false
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

function setLang(lang: string) {
  locale.value = lang
  langOpen.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (langDropdownRef.value && !langDropdownRef.value.contains(e.target as Node)) {
    langOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>
