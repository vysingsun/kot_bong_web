<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/modules/auth/store/index'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const login = async () => {
  const payload = {
    email: email.value,
    password: password.value,
  }
  await authStore.login(payload)
} 
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex items-end h-screen pb-28">
      <div class="bg-red flex flex-col items-center justify-center px-6 mx-auto lg:py-0">
        <img class="w-2/3" src="@/assets/images/base_station.svg" alt="logo">
        <div class="w-full  md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div>
              <input v-model="email" type="Email" name="email" id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-2xl focus:ring-yellow-300 focus:border-yellow-300 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Email" required="">
            </div>
            <div>
              <input v-model="password" type="password" name="password" id="password" placeholder="Password"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-2xl focus:ring-yellow-300 focus:border-yellow-300 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required="">
            </div>

            <button @click="login()"
              class="w-full text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-2xl text-sm px-5 py-4 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign
              in</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>