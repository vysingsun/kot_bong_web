<template>
  <div class="min-h-full">
    <header class="bg-yellow-300">
      <div class="relative mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <RouterLink to="/">
          <svg class="absolute w-6 h-6 ml-2 text-white dark:text-white" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m15 19-7-7 7-7" />
          </svg>
        </RouterLink>
        <h3 class="text-white font-semibold flex justify-center text-xl tracking-tight">{{ route.currentRoute.value.name
          }}</h3>
      </div>
    </header>
    <main class="p-6">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const route = useRouter()
</script>