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

    const currentStep = ref(1) // 1: Enter email/phone, 2: Enter OTP, 3: Reset password
    const identifier = ref('')
    const otpDigits = ref(['', '', '', '', '', ''])
    const otpInputs = ref<(HTMLInputElement | null)[]>([])
    const newPassword = ref('')
    const confirmPassword = ref('')
    const showNewPassword = ref(false)
    const showConfirmPassword = ref(false)
    const resendTimer = ref(0)

    const errors = ref({
        identifier: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    })

    const isEmail = computed(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(identifier.value)
    })

    const otpCode = computed(() => otpDigits.value.join(''))

    // Step 1: Send OTP
    const sendOTP = async () => {
        errors.value.identifier = ''

        if (!identifier.value.trim()) {
            errors.value.identifier = t('auth.forgotPassword.errors.identifier_required')
            return
        }

        appStore.loading = true
        try {
            if (isEmail.value) {
                await authStore.sendForgotPasswordOTP({ email: identifier.value })
            } else {
                await authStore.sendForgotPasswordOTPSMS({ phone: identifier.value })
            }

            currentStep.value = 2
            startResendTimer()

            setTimeout(() => {
                otpInputs.value[0]?.focus()
            }, 100)
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                t('auth.forgotPassword.errors.send_failed')
            errors.value.identifier = errorMessage
        } finally {
            appStore.loading = false
        }
    }

    // OTP Input Handlers
    const handleOtpInput = (index: number, event: Event) => {
        const input = event.target as HTMLInputElement
        const value = input.value

        if (value && !/^\d$/.test(value)) {
            otpDigits.value[index] = ''
            return
        }

        otpDigits.value[index] = value

        if (value && index < 5) {
            otpInputs.value[index + 1]?.focus()
        }

        if (errors.value.otp) {
            errors.value.otp = ''
        }
    }

    const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
        if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
            otpInputs.value[index - 1]?.focus()
        }

        if (event.key === 'ArrowLeft' && index > 0) {
            otpInputs.value[index - 1]?.focus()
        }
        if (event.key === 'ArrowRight' && index < 5) {
            otpInputs.value[index + 1]?.focus()
        }
    }

    const handleOtpPaste = (event: ClipboardEvent) => {
        event.preventDefault()
        const pastedData = event.clipboardData?.getData('text') || ''
        const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')

        digits.forEach((digit, index) => {
            if (index < 6) {
                otpDigits.value[index] = digit
            }
        })

        const lastIndex = Math.min(digits.length, 5)
        otpInputs.value[lastIndex]?.focus()
    }

    // Step 2: Verify OTP
    const verifyOTP = async () => {
        if (otpCode.value.length !== 6) {
            errors.value.otp = t('auth.forgotPassword.errors.invalid_otp')
            return
        }

        appStore.loading = true
        try {
            await authStore.verifyForgotPasswordOTP({
                identifier: identifier.value,
                otp: otpCode.value,
            })

            currentStep.value = 3
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                t('auth.forgotPassword.errors.verify_failed')
            errors.value.otp = errorMessage
            otpDigits.value = ['', '', '', '', '', '']
            otpInputs.value[0]?.focus()
        } finally {
            appStore.loading = false
        }
    }

    // Resend OTP
    const resendOTP = async () => {
        otpDigits.value = ['', '', '', '', '', '']
        errors.value.otp = ''
        otpInputs.value[0]?.focus()

        appStore.loading = true
        try {
            if (isEmail.value) {
                await authStore.sendForgotPasswordOTP({ email: identifier.value })
            } else {
                await authStore.sendForgotPasswordOTPSMS({ phone: identifier.value })
            }
            startResendTimer()
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                t('auth.forgotPassword.errors.resend_failed')
            errors.value.otp = errorMessage
        } finally {
            appStore.loading = false
        }
    }

    const startResendTimer = () => {
        resendTimer.value = 60
        const interval = setInterval(() => {
            resendTimer.value--
            if (resendTimer.value <= 0) {
                clearInterval(interval)
            }
        }, 1000)
    }

    // Step 3: Reset Password
    const resetPassword = async () => {
        errors.value = { identifier: '', otp: '', newPassword: '', confirmPassword: '' }

        if (!newPassword.value) {
            errors.value.newPassword = t('auth.forgotPassword.errors.password_required')
            return
        }

        if (newPassword.value.length < 8) {
            errors.value.newPassword = t('auth.forgotPassword.errors.password_weak')
            return
        }

        if (!confirmPassword.value) {
            errors.value.confirmPassword = t('auth.forgotPassword.errors.confirm_required')
            return
        }

        if (newPassword.value !== confirmPassword.value) {
            errors.value.confirmPassword = t('auth.forgotPassword.errors.password_mismatch')
            return
        }

        appStore.loading = true
        try {
            await authStore.resetPassword({
                identifier: identifier.value,
                newPassword: newPassword.value,
                confirmPassword: confirmPassword.value,
            })

            // Success - redirect to login
            router.push('/auth/login?reset=success')
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message

            if (
                errorMessage &&
                (errorMessage.toLowerCase().includes('otp') || errorMessage.toLowerCase().includes('verify'))
            ) {
                // OTP verification error - back to login
                router.push('/auth/login?error=otp_expired')
            } else {
                errors.value.newPassword = errorMessage || t('auth.forgotPassword.errors.reset_failed')
            }
        } finally {
            appStore.loading = false
        }
    }

    const goBackToLogin = () => {
        router.push('/auth/login')
    }
</script>

<template>
    <section class="bg-gray-50 dark:bg-gray-900 relative min-h-screen flex items-center justify-center py-12 px-4">
        <!-- Language Switcher - Top Right -->
        <div class="absolute top-6 right-6 z-10">
            <LanguageSwitcher />
        </div>

        <div class="w-full max-w-md">
            <!-- Logo/Header -->
            <div class="text-center mb-8">
                <div class="flex items-center justify-center gap-3 mb-2">
                    <svg class="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fill-rule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                        {{ t('auth.forgotPassword.title') }}
                    </h1>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ t('auth.forgotPassword.subtitle') }}
                </p>
            </div>

            <!-- Main Card -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <!-- Step Indicator -->
                <div class="flex items-center justify-center mb-8">
                    <div class="flex items-center space-x-2">
                        <div
                            :class="[
                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500',
                            ]"
                        >
                            1
                        </div>
                        <div
                            :class="['w-16 h-1 transition-all', currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200']"
                        ></div>
                        <div
                            :class="[
                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500',
                            ]"
                        >
                            2
                        </div>
                        <div
                            :class="['w-16 h-1 transition-all', currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200']"
                        ></div>
                        <div
                            :class="[
                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500',
                            ]"
                        >
                            3
                        </div>
                    </div>
                </div>

                <!-- Step 1: Enter Email/Phone -->
                <div v-show="currentStep === 1" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('auth.forgotPassword.identifier') }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model="identifier"
                            type="text"
                            :placeholder="t('auth.forgotPassword.identifier_placeholder')"
                            class="w-full px-4 py-3 rounded-lg border text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-all"
                            :class="
                                errors.identifier
                                    ? 'border-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            "
                            @input="errors.identifier = ''"
                            @keyup.enter="sendOTP"
                            required
                        />
                        <p v-if="errors.identifier" class="mt-1 text-sm text-red-500">{{ errors.identifier }}</p>
                    </div>

                    <button
                        @click="sendOTP"
                        :disabled="!identifier.trim() || appStore.loading"
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                        {{ t('auth.forgotPassword.send_otp') }}
                    </button>

                    <button
                        @click="goBackToLogin"
                        type="button"
                        class="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
                    >
                        {{ t('auth.forgotPassword.back_to_login') }}
                    </button>
                </div>

                <!-- Step 2: Verify OTP -->
                <div v-show="currentStep === 2" class="space-y-4">
                    <div class="text-center mb-6">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ t('auth.forgotPassword.verify_otp') }}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ t('auth.forgotPassword.otp_sent') }} <span class="font-semibold">{{ identifier }}</span>
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                            {{ t('auth.forgotPassword.otp_code') }}
                        </label>
                        <div class="flex justify-center gap-2 mb-2">
                            <input
                                v-for="(digit, index) in otpDigits"
                                :key="index"
                                :ref="
                                    el => {
                                        if (el) otpInputs[index] = el as HTMLInputElement
                                    }
                                "
                                v-model="otpDigits[index]"
                                type="text"
                                inputmode="numeric"
                                maxlength="1"
                                @input="handleOtpInput(index, $event)"
                                @keydown="handleOtpKeydown(index, $event)"
                                @paste="handleOtpPaste"
                                class="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                :class="
                                    errors.otp
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                "
                            />
                        </div>
                        <p v-if="errors.otp" class="mt-1 text-sm text-red-500 text-center">{{ errors.otp }}</p>
                    </div>

                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">{{
                            t('auth.forgotPassword.didnt_receive')
                        }}</span>
                        <button
                            @click="resendOTP"
                            :disabled="resendTimer > 0 || appStore.loading"
                            class="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{
                                resendTimer > 0
                                    ? `${t('auth.forgotPassword.resend')} (${resendTimer}s)`
                                    : t('auth.forgotPassword.resend')
                            }}
                        </button>
                    </div>

                    <div class="flex space-x-3">
                        <button
                            @click="currentStep = 1"
                            class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-lg transition-all"
                        >
                            {{ t('auth.forgotPassword.back') }}
                        </button>
                        <button
                            @click="verifyOTP"
                            :disabled="otpCode.length !== 6 || appStore.loading"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all"
                        >
                            {{ t('auth.forgotPassword.verify') }}
                        </button>
                    </div>
                </div>

                <!-- Step 3: Reset Password -->
                <div v-show="currentStep === 3" class="space-y-4">
                    <div class="text-center mb-6">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ t('auth.forgotPassword.new_password_title') }}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ t('auth.forgotPassword.new_password_subtitle') }}
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('auth.forgotPassword.new_password') }} <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input
                                v-model="newPassword"
                                :type="showNewPassword ? 'text' : 'password'"
                                :placeholder="t('auth.forgotPassword.new_password_placeholder')"
                                class="w-full px-4 py-3 pr-12 rounded-lg border text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-all"
                                :class="
                                    errors.newPassword
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                "
                                @input="errors.newPassword = ''"
                                required
                            />
                            <button
                                type="button"
                                @click="showNewPassword = !showNewPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <svg
                                    v-if="!showNewPassword"
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
                                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p v-if="errors.newPassword" class="mt-1 text-sm text-red-500">{{ errors.newPassword }}</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('auth.forgotPassword.confirm_password') }} <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input
                                v-model="confirmPassword"
                                :type="showConfirmPassword ? 'text' : 'password'"
                                :placeholder="t('auth.forgotPassword.confirm_password_placeholder')"
                                class="w-full px-4 py-3 pr-12 rounded-lg border text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-all"
                                :class="
                                    errors.confirmPassword
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                "
                                @input="errors.confirmPassword = ''"
                                @keyup.enter="resetPassword"
                                required
                            />
                            <button
                                type="button"
                                @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <svg
                                    v-if="!showConfirmPassword"
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
                                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">
                            {{ errors.confirmPassword }}
                        </p>
                    </div>

                    <button
                        @click="resetPassword"
                        :disabled="!newPassword || !confirmPassword || appStore.loading"
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                        {{ t('auth.forgotPassword.reset_password') }}
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
