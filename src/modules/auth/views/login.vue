<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/modules/auth/store/index'
import { appService } from '@/modules/app/services/api.service'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const login = async () => {
  loading.value = true
  const payload = {
    email: email.value,
    password: password.value,
  }
  await authStore.login(payload)
  loading.value = false
}
const init = async () => {
  await appService.init().then(res => {
    console.log(res)
    if (res.data.success) {
      return
    }
  }).catch(error => {
    console.log(error, 'init')
  })
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex items-end h-screen pb-28">
      <div class="bg-red flex flex-col items-center justify-center mx-auto lg:py-0">
        <img @click="init" class="w-2/3" src="@/assets/images/base_station.svg" alt="logo">
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
              class="w-full flex justify-center text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-2xl text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              <BaseLoading v-if="loading" />
              <div v-else>Sign In</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>