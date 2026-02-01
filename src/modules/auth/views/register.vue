<template>
    <section class="bg-gray-50 dark:bg-gray-900 relative min-h-screen flex items-center justify-center py-10 px-4">
        <!-- Language Switcher - Top Right -->
        <div class="absolute top-6 right-6 z-10">
            <LanguageSwitcher />
        </div>

        <div class="w-full max-w-md">
            <!-- Logo/Header -->
            <div class="text-center mb-5">
                <div class="flex justify-center mb-4">
                    <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                        <svg
                            aria-hidden="true"
                            class="w-12 h-12 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </div>
                </div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ t('register.title') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ t('register.subtitle') }}
                </p>
            </div>

            <!-- Main Card -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
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

                <form @submit.prevent="handleSubmit">
                    <!-- Step 1: Basic Info -->
                    <div v-show="currentStep === 1" class="space-y-4">
                        <!-- First Name & Last Name (Inline on desktop) -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {{ t('register.firstName') }} <span class="text-red-500">*</span>
                                </label>
                                <input
                                    v-model="formData.firstName"
                                    type="text"
                                    :placeholder="t('register.firstNamePlaceholder')"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    :class="{ 'border-red-500': errors.firstName }"
                                    required
                                />
                                <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">{{ errors.firstName }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {{ t('register.lastName') }} <span class="text-red-500">*</span>
                                </label>
                                <input
                                    v-model="formData.lastName"
                                    type="text"
                                    :placeholder="t('register.lastNamePlaceholder')"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    :class="{ 'border-red-500': errors.lastName }"
                                    required
                                />
                                <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">{{ errors.lastName }}</p>
                            </div>
                        </div>

                        <!-- Email or Phone -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('register.emailOrPhone') }} <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="formData.emailOrPhone"
                                type="text"
                                :placeholder="t('register.emailOrPhonePlaceholder')"
                                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                :class="{ 'border-red-500': errors.emailOrPhone }"
                                required
                            />
                            <p v-if="errors.emailOrPhone" class="mt-1 text-sm text-red-500">
                                {{ errors.emailOrPhone }}
                            </p>
                        </div>

                        <!-- Password -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('register.password') }} <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input
                                    v-model="formData.password"
                                    :type="showPassword ? 'text' : 'password'"
                                    :placeholder="t('register.passwordPlaceholder')"
                                    class="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    :class="{ 'border-red-500': errors.password }"
                                    @input="checkPasswordStrength"
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

                            <!-- Password Strength Indicator -->
                            <div v-if="formData.password" class="mt-3 space-y-2">
                                <div class="flex space-x-1">
                                    <div
                                        v-for="i in 4"
                                        :key="i"
                                        :class="[
                                            'h-1 flex-1 rounded-full transition-all',
                                            i <= passwordStrength ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-600',
                                        ]"
                                    ></div>
                                </div>
                                <p class="text-xs" :class="getStrengthTextColor()">
                                    {{ getStrengthText() }}
                                </p>

                                <!-- Password Requirements -->
                                <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 space-y-1 text-xs">
                                    <p class="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {{ t('register.passwordRequirements') }}
                                    </p>
                                    <div class="flex items-center space-x-2">
                                        <svg
                                            :class="passwordChecks.length ? 'text-green-500' : 'text-gray-400'"
                                            class="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            :class="
                                                passwordChecks.length
                                                    ? 'text-gray-900 dark:text-white'
                                                    : 'text-gray-500'
                                            "
                                        >
                                            {{ t('register.minLength') }}
                                        </span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <svg
                                            :class="passwordChecks.lowercase ? 'text-green-500' : 'text-gray-400'"
                                            class="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            :class="
                                                passwordChecks.lowercase
                                                    ? 'text-gray-900 dark:text-white'
                                                    : 'text-gray-500'
                                            "
                                        >
                                            {{ t('register.lowercase') }}
                                        </span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <svg
                                            :class="passwordChecks.uppercase ? 'text-green-500' : 'text-gray-400'"
                                            class="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            :class="
                                                passwordChecks.uppercase
                                                    ? 'text-gray-900 dark:text-white'
                                                    : 'text-gray-500'
                                            "
                                        >
                                            {{ t('register.uppercase') }}
                                        </span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <svg
                                            :class="passwordChecks.number ? 'text-green-500' : 'text-gray-400'"
                                            class="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            :class="
                                                passwordChecks.number
                                                    ? 'text-gray-900 dark:text-white'
                                                    : 'text-gray-500'
                                            "
                                        >
                                            {{ t('register.number') }}
                                        </span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <svg
                                            :class="passwordChecks.special ? 'text-green-500' : 'text-gray-400'"
                                            class="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                        <span
                                            :class="
                                                passwordChecks.special
                                                    ? 'text-gray-900 dark:text-white'
                                                    : 'text-gray-500'
                                            "
                                        >
                                            {{ t('register.special') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
                        </div>

                        <!-- Confirm Password -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('register.confirmPassword') }} <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input
                                    v-model="formData.confirmPassword"
                                    :type="showConfirmPassword ? 'text' : 'password'"
                                    :placeholder="t('register.confirmPasswordPlaceholder')"
                                    class="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    :class="{ 'border-red-500': errors.confirmPassword }"
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
                            type="button"
                            @click="proceedToStep2"
                            :disabled="loading"
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{ loading ? t('register.loading') : t('register.continue') }}
                        </button>
                    </div>

                    <!-- Step 2: OTP Verification (only for email) -->
                    <div v-show="currentStep === 2" class="space-y-4">
                        <div class="text-center mb-6">
                            <div
                                class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <svg
                                    class="w-8 h-8 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {{ t('register.verifyEmail') }}
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ t('register.otpSent') }}
                                <span class="font-semibold">{{ formData.emailOrPhone }}</span>
                            </p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                                {{ t('register.otpCode') }}
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
                                    class="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    :class="{ 'border-red-500': errors.otp }"
                                />
                            </div>
                            <p v-if="errors.otp" class="mt-1 text-sm text-red-500 text-center">{{ errors.otp }}</p>
                        </div>

                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-400">
                                {{ t('register.didntReceive') }}
                            </span>
                            <button
                                type="button"
                                @click="resendOTP"
                                :disabled="resendTimer > 0 || loading"
                                class="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {{
                                    resendTimer > 0 ? `${t('register.resend')} (${resendTimer}s)` : t('register.resend')
                                }}
                            </button>
                        </div>

                        <div class="flex space-x-3">
                            <button
                                type="button"
                                @click="currentStep = 1"
                                class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-xl transition-all"
                            >
                                {{ t('register.back') }}
                            </button>
                            <button
                                type="button"
                                @click="verifyOTP"
                                :disabled="loading || otpCode.length !== 6"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {{ loading ? t('register.verifying') : t('register.verify') }}
                            </button>
                        </div>
                    </div>

                    <!-- Step 3: Complete Registration -->
                    <div v-show="currentStep === 3" class="space-y-4">
                        <div class="text-center mb-6">
                            <div
                                class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <svg
                                    class="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {{ t('register.almostDone') }}
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ t('register.completeRegistration') }}
                            </p>
                        </div>

                        <button
                            type="submit"
                            :disabled="loading"
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{ loading ? t('register.creating') : t('register.createAccount') }}
                        </button>
                    </div>
                </form>

                <!-- Social Login (Only on Step 1) -->
                <div v-if="currentStep === 1">
                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                {{ t('register.orContinueWith') }}
                            </span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            @click="loginWithGoogle"
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
                        </button>

                        <button
                            type="button"
                            @click="loginWithFacebook"
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                <path
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                />
                            </svg>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
                        </button>
                    </div>
                </div>

                <!-- Login Link -->
                <div class="mt-6 text-center text-sm">
                    <span class="text-gray-600 dark:text-gray-400">
                        {{ t('register.haveAccount') }}
                    </span>
                    <router-link to="/auth/login" class="ml-1 text-blue-600 hover:text-blue-700 font-semibold">
                        {{ t('register.login') }}
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="showSuccessModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            >
                <Transition
                    enter-active-class="transition ease-out duration-300 transform"
                    enter-from-class="scale-95 opacity-0"
                    enter-to-class="scale-100 opacity-100"
                    leave-active-class="transition ease-in duration-200 transform"
                    leave-from-class="scale-100 opacity-100"
                    leave-to-class="scale-95 opacity-0"
                >
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                        <!-- Animated Success Icon -->
                        <div class="mb-6 relative">
                            <div
                                class="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center animate-scale-in"
                            >
                                <svg
                                    class="w-12 h-12 text-[#19b23e] animate-check"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="3"
                                        d="M5 13l4 4L19 7"
                                        class="checkmark"
                                    />
                                </svg>
                            </div>
                            <!-- Confetti effect -->
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div
                                    v-for="i in 8"
                                    :key="i"
                                    class="absolute w-2 h-2 rounded-full animate-confetti"
                                    :style="{
                                        backgroundColor: ['#19b23e'][i % 1],
                                        animationDelay: `${i * 0.1}s`,
                                    }"
                                ></div>
                            </div>
                        </div>

                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            {{ t('register.success.title') }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6">
                            {{ t('register.success.message') }}
                        </p>

                        <!-- Loading indicator -->
                        <div class="flex items-center justify-center space-x-2 text-blue-600">
                            <div
                                class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                                style="animation-delay: 0s"
                            ></div>
                            <div
                                class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                                style="animation-delay: 0.1s"
                            ></div>
                            <div
                                class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                                style="animation-delay: 0.2s"
                            ></div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </section>
</template>

<script setup lang="ts">
    import { ref, reactive, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { useAuthStore } from '@/modules/auth/store/index'
    import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

    const router = useRouter()
    const { t } = useI18n()
    const authStore = useAuthStore()

    const currentStep = ref(1)
    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const showSuccessModal = ref(false)
    const otpDigits = ref(['', '', '', '', '', ''])
    const otpInputs = ref<(HTMLInputElement | null)[]>([])
    const resendTimer = ref(0)

    const formData = reactive({
        firstName: '',
        lastName: '',
        emailOrPhone: '',
        password: '',
        confirmPassword: '',
    })

    const errors = reactive({
        firstName: '',
        lastName: '',
        emailOrPhone: '',
        password: '',
        confirmPassword: '',
        otp: '',
    })

    const passwordChecks = reactive({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    })

    const passwordStrength = ref(0)

    // Get OTP code from digits
    const otpCode = computed(() => otpDigits.value.join(''))

    // Check if input is email or phone
    const isEmail = computed(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(formData.emailOrPhone)
    })

    // Check if name is English (only ASCII characters)
    const isEnglish = (text: string) => {
        return /^[a-zA-Z\s]+$/.test(text)
    }

    // Generate username
    const generateUsername = () => {
        const firstName = formData.firstName.trim()
        const lastName = formData.lastName.trim()

        // If both names are English, combine them
        if (isEnglish(firstName) && isEnglish(lastName)) {
            return (firstName + lastName).toLowerCase().replace(/\s+/g, '')
        }

        // If email, extract username part
        if (isEmail.value) {
            return formData.emailOrPhone.split('@')[0].toLowerCase()
        }

        // If phone, use phone as username
        return formData.emailOrPhone.replace(/\s+/g, '')
    }

    // OTP Input Handlers
    const handleOtpInput = (index: number, event: Event) => {
        const input = event.target as HTMLInputElement
        const value = input.value

        // Only allow numbers
        if (value && !/^\d$/.test(value)) {
            otpDigits.value[index] = ''
            return
        }

        otpDigits.value[index] = value

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.value[index + 1]?.focus()
        }

        // Clear error when user types
        if (errors.otp) {
            errors.otp = ''
        }
    }

    const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
        // Handle backspace
        if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
            otpInputs.value[index - 1]?.focus()
        }

        // Handle arrow keys
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

        // Focus last filled input or next empty
        const lastIndex = Math.min(digits.length, 5)
        otpInputs.value[lastIndex]?.focus()
    }

    // Check password strength
    const checkPasswordStrength = () => {
        const pwd = formData.password

        passwordChecks.length = pwd.length >= 8
        passwordChecks.lowercase = /[a-z]/.test(pwd)
        passwordChecks.uppercase = /[A-Z]/.test(pwd)
        passwordChecks.number = /\d/.test(pwd)
        passwordChecks.special = /[@$!%*?&]/.test(pwd)

        const checks = Object.values(passwordChecks).filter(Boolean).length
        passwordStrength.value = checks
    }

    const getStrengthColor = () => {
        if (passwordStrength.value <= 1) return 'bg-red-500'
        if (passwordStrength.value <= 2) return 'bg-orange-500'
        if (passwordStrength.value <= 3) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getStrengthTextColor = () => {
        if (passwordStrength.value <= 1) return 'text-red-500'
        if (passwordStrength.value <= 2) return 'text-orange-500'
        if (passwordStrength.value <= 3) return 'text-yellow-500'
        return 'text-green-500'
    }

    const getStrengthText = () => {
        if (passwordStrength.value <= 1) return t('register.weak')
        if (passwordStrength.value <= 2) return t('register.fair')
        if (passwordStrength.value <= 3) return t('register.good')
        return t('register.strong')
    }

    // Validate form
    const validateStep1 = () => {
        let isValid = true

        // Reset errors
        Object.keys(errors).forEach(key => {
            errors[key as keyof typeof errors] = ''
        })

        if (!formData.firstName.trim()) {
            errors.firstName = t('register.errors.firstNameRequired')
            isValid = false
        }

        if (!formData.lastName.trim()) {
            errors.lastName = t('register.errors.lastNameRequired')
            isValid = false
        }

        if (!formData.emailOrPhone.trim()) {
            errors.emailOrPhone = t('register.errors.emailOrPhoneRequired')
            isValid = false
        } else if (isEmail.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.emailOrPhone)) {
                errors.emailOrPhone = t('register.errors.invalidEmail')
                isValid = false
            }
        }

        if (!formData.password) {
            errors.password = t('register.errors.passwordRequired')
            isValid = false
        } else if (!Object.values(passwordChecks).every(Boolean)) {
            errors.password = t('register.errors.passwordWeak')
            isValid = false
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = t('register.errors.confirmPasswordRequired')
            isValid = false
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = t('register.errors.passwordMismatch')
            isValid = false
        }

        return isValid
    }

    // Proceed to step 2
    const proceedToStep2 = async () => {
        if (!validateStep1()) return

        // If phone number, skip OTP and go to step 3
        if (!isEmail.value) {
            currentStep.value = 3
            return
        }

        // If email, send OTP
        loading.value = true
        try {
            await authStore.sendOTP({ email: formData.emailOrPhone, firstName: formData.firstName })
            currentStep.value = 2
            startResendTimer()
            // Focus first OTP input
            setTimeout(() => {
                otpInputs.value[0]?.focus()
            }, 100)
        } catch (error: any) {
            errors.emailOrPhone = error.response?.data?.message || t('register.errors.sendOtpFailed')
        } finally {
            loading.value = false
        }
    }

    // Start resend timer
    const startResendTimer = () => {
        resendTimer.value = 60
        const interval = setInterval(() => {
            resendTimer.value--
            if (resendTimer.value <= 0) {
                clearInterval(interval)
            }
        }, 1000)
    }

    // Resend OTP
    const resendOTP = async () => {
        // Clear OTP inputs
        otpDigits.value = ['', '', '', '', '', '']
        otpInputs.value[0]?.focus()

        loading.value = true
        try {
            await authStore.sendOTP({ email: formData.emailOrPhone, firstName: formData.firstName })
            startResendTimer()
        } catch (error: any) {
            errors.otp = error.response?.data?.message || t('register.errors.resendFailed')
        } finally {
            loading.value = false
        }
    }

    // Verify OTP
    const verifyOTP = async () => {
        if (otpCode.value.length !== 6) {
            errors.otp = t('register.errors.invalidOtp')
            return
        }

        loading.value = true
        try {
            await authStore.verifyOTP({
                email: formData.emailOrPhone,
                otp: otpCode.value,
            })
            currentStep.value = 3
        } catch (error: any) {
            errors.otp = error.response?.data?.message || t('register.errors.verifyFailed')
            // Clear OTP on error
            otpDigits.value = ['', '', '', '', '', '']
            otpInputs.value[0]?.focus()
        } finally {
            loading.value = false
        }
    }

    // Handle registration
    const handleSubmit = async () => {
        loading.value = true

        try {
            const locale = localStorage.getItem('locale') || 'en'
            const owner = `${formData.firstName} ${formData.lastName}`.trim()

            const payload = {
                username: generateUsername(),
                email: isEmail.value ? formData.emailOrPhone : '',
                phone: !isEmail.value ? formData.emailOrPhone : '',
                password: formData.password,
                repeat_password: formData.confirmPassword,
                firstName: formData.firstName,
                lastName: formData.lastName,
                station_name: `Tela ${owner}`,
                owner: owner,
                language: locale,
            }

            await authStore.register(payload)

            // Show success modal
            showSuccessModal.value = true

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/onboarding')
            }, 2000)
        } catch (error: any) {
            // Handle error
            console.error('Registration failed:', error)
        } finally {
            loading.value = false
        }
    }

    // Social login handlers
    const loginWithGoogle = () => {
        authStore.googleOAuth()
    }

    const loginWithFacebook = () => {
        authStore.facebookOAuth()
    }
</script>

<style scoped>
    @keyframes scale-in {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes check {
        0% {
            stroke-dashoffset: 50;
        }
        100% {
            stroke-dashoffset: 0;
        }
    }

    @keyframes confetti {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(var(--x), var(--y)) rotate(360deg);
            opacity: 0;
        }
    }

    .animate-scale-in {
        animation: scale-in 0.5s ease-out forwards;
    }

    .animate-check .checkmark {
        stroke-dasharray: 50;
        stroke-dashoffset: 50;
        animation: check 0.5s ease-out 0.3s forwards;
    }

    .animate-confetti {
        --x: 0px;
        --y: 0px;
        animation: confetti 1s ease-out forwards;
    }

    .animate-confetti:nth-child(1) {
        --x: 60px;
        --y: -80px;
    }
    .animate-confetti:nth-child(2) {
        --x: -60px;
        --y: -80px;
    }
    .animate-confetti:nth-child(3) {
        --x: 80px;
        --y: 0px;
    }
    .animate-confetti:nth-child(4) {
        --x: -80px;
        --y: 0px;
    }
    .animate-confetti:nth-child(5) {
        --x: 70px;
        --y: 70px;
    }
    .animate-confetti:nth-child(6) {
        --x: -70px;
        --y: 70px;
    }
    .animate-confetti:nth-child(7) {
        --x: 40px;
        --y: -70px;
    }
    .animate-confetti:nth-child(8) {
        --x: -40px;
        --y: -70px;
    }
</style>
