<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/modules/auth/store/index'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const onlogin = async () => {
  loading.value = true
  const payload = {
    email: email.value,
    password: password.value,
  }
  await authStore.login(payload)
  loading.value = false
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex items-end h-screen pb-28">
      <div class="bg-red flex flex-col items-center justify-center mx-auto lg:py-0">
        <img class="w-2/3" src="@/assets/images/base_station.svg" alt="logo">
        <div class="w-full md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div>
              <input v-model="email" type="Email" name="email" id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-2xl focus:ring-yellow-300 focus:border-yellow-300 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Email">
            </div>
            <div>
              <input v-model="password" type="password" name="password" id="password" placeholder="Password"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-2xl focus:ring-yellow-300 focus:border-yellow-300 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
            <button @click="onlogin()"
              class="w-full flex justify-center text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-2xl text-sm px-5 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              <svg v-if="loading" aria-hidden="true" role="status" class="inline w-5 h-5 text-white animate-spin" viewBox="0 0 100 101"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB" />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor" />
              </svg>
              <div v-else>Sign In</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>