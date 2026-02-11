<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { useAuthStore } from '@/modules/auth/store/index'
    import { useAppStore } from '@/modules/app/store/index'
    import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

    const router = useRouter()
    const authStore = useAuthStore()
    const appStore = useAppStore()
    const { t } = useI18n()

    const showPassword = ref(false)
    const identifier = ref('')
    const password = ref('')
    const errors = ref({
        identifier: '',
        password: '',
    })

    const isFormValid = computed(() => {
        return identifier.value.trim() !== '' && password.value.trim() !== ''
    })

    const validateForm = () => {
        errors.value = { identifier: '', password: '' }
        let isValid = true

        if (!identifier.value.trim()) {
            errors.value.identifier = t('auth.login.errors.identifier_required')
            isValid = false
        }

        if (!password.value.trim()) {
            errors.value.password = t('auth.login.errors.password_required')
            isValid = false
        }

        return isValid
    }

    const onlogin = async () => {
        if (!validateForm()) return

        appStore.loading = true
        try {
            const payload = {
                identifier: identifier.value,
                password: password.value,
            }
            await authStore.login(payload)
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.error || error.response?.data?.message || t('auth.login.errors.login_failed')
            errors.value.identifier = errorMessage
        } finally {
            appStore.loading = false
        }
    }

    const loginWithGoogle = async () => {
        appStore.loading = true
        try {
            await authStore.googleOAuth()
        } finally {
            appStore.loading = false
        }
    }

    const loginWithFacebook = async () => {
        appStore.loading = true
        try {
            await authStore.facebookOAuth()
        } finally {
            appStore.loading = false
        }
    }

    const goToRegister = () => {
        router.push('/auth/register')
    }

    const goToForgotPassword = () => {
        router.push('/auth/forgot-password')
    }
</script>

<template>
    <section class="bg-gray-50 dark:bg-gray-900 relative">
        <!-- Language Switcher - Top Right -->
        <div class="absolute top-6 right-6 z-10">
            <LanguageSwitcher />
        </div>

        <div class="flex items-end h-screen pb-28">
            <div class="flex flex-col items-center justify-center mx-auto lg:py-0">
                <img class="w-2/3" src="@/assets/images/base-station-blue.svg" alt="logo" />
                <div class="w-full md:mt-0 sm:max-w-md xl:p-0">
                    <div class="space-y-4 md:space-y-6 sm:p-8">
                        <!-- Email or Phone Input -->
                        <div>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        class="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </div>
                                <input
                                    v-model="identifier"
                                    type="text"
                                    name="identifier"
                                    id="identifier"
                                    class="bg-gray-50 border text-gray-900 rounded-xl block w-full pl-10 p-3 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white transition-colors"
                                    :class="
                                        errors.identifier
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600'
                                    "
                                    :placeholder="t('auth.login.identifier_placeholder')"
                                    @input="errors.identifier = ''"
                                    required
                                />
                            </div>
                            <p v-if="errors.identifier" class="mt-1 text-sm text-red-500">{{ errors.identifier }}</p>
                        </div>

                        <!-- Password Input -->
                        <div>
                            <div class="relative">
                                <div class="absolute z-50 inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        class="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <div class="relative">
                                    <input
                                        v-model="password"
                                        :type="showPassword ? 'text' : 'password'"
                                        name="password"
                                        id="password"
                                        class="bg-gray-50 border text-gray-900 rounded-xl block w-full pl-10 p-3 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white transition-colors"
                                        :class="
                                            errors.password
                                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600'
                                        "
                                        :placeholder="t('auth.login.password_placeholder')"
                                        @input="errors.password = ''"
                                        @keyup.enter="onlogin"
                                        required
                                    />
                                    <button
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        <svg
                                            v-if="!showPassword"
                                            class="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        <svg
                                            v-else
                                            class="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
                        </div>

                        <!-- Forgot Password Link -->
                        <div class="flex justify-end">
                            <button
                                @click="goToForgotPassword"
                                type="button"
                                class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            >
                                {{ t('auth.login.forgot_password') }}
                            </button>
                        </div>

                        <!-- Sign In Button -->
                        <button
                            @click="onlogin"
                            class="w-full flex justify-center text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium rounded-xl text-sm px-5 py-3 text-center transition-colors"
                        >
                            {{ t('auth.login.sign_in_button') }}
                        </button>

                        <!-- Divider -->
                        <div class="flex items-center">
                            <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                            <span class="px-4 text-sm text-gray-500 dark:text-gray-400">
                                {{ t('auth.login.or_continue_with') }}
                            </span>
                            <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                        </div>

                        <!-- Social Login Buttons -->
                        <div class="space-y-3">
                            <!-- Google Button -->
                            <button
                                @click="loginWithGoogle"
                                :disabled="appStore.loading"
                                type="button"
                                class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-xl text-sm px-5 py-3 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 transition-colors"
                            >
                                <svg class="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span class="text-gray-700 dark:text-gray-300">{{
                                    t('auth.login.continue_with_google')
                                }}</span>
                            </button>

                            <!-- Facebook Button -->
                            <button
                                @click="loginWithFacebook"
                                :disabled="appStore.loading"
                                type="button"
                                class="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-xl text-sm px-5 py-3 text-center text-white transition-colors"
                            >
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                    />
                                </svg>
                                <span>{{ t('auth.login.continue_with_facebook') }}</span>
                            </button>
                        </div>

                        <!-- Register Link -->
                        <p class="text-sm text-center text-gray-500 dark:text-gray-400">
                            {{ t('auth.login.no_account') }}
                            <button
                                @click="goToRegister"
                                type="button"
                                class="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            >
                                {{ t('auth.login.sign_up') }}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped></style>
