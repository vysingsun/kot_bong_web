<template>
  <div :class="{ dark: isDark }">
    <div class="min-h-screen bg-white dark:bg-gray-950 font-kantumruy">
      <LandingNavBar @toggle-dark="toggleDark" :is-dark="isDark" />
      <router-view />
      <LandingFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LandingNavBar from '../components/LandingNavBar.vue'
import LandingFooter from '../components/LandingFooter.vue'

// Standalone dark mode — only visible on landing pages, independent of app theme store
const isDark = ref(false)
function toggleDark() {
  isDark.value = !isDark.value
}
</script>
