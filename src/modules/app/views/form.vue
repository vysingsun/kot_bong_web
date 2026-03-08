<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
        <BaseLoading v-if="isPageLoading" />

        <div v-else class="max-w-2xl mx-auto px-4 py-5 space-y-4">
            <!-- Profile Header -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <div class="flex items-center gap-4">
                    <AppAvatar :user="user" size="lg" />
                    <div class="flex-1 min-w-0">
                        <h2 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {{ user.firstName }} {{ user.lastName }}
                        </h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {{ user.phone || user.email }}
                        </p>
                        <div class="flex flex-wrap items-center gap-2 mt-2">
                            <span
                                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 capitalize"
                            >
                                <svg
                                    v-if="user.registerBy === 'phone'"
                                    class="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <svg
                                    v-else-if="user.registerBy === 'email'"
                                    class="w-3 h-3"
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
                                {{ t(`profile.register_by_${user.registerBy}`) }}
                            </span>
                            <span
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                :class="
                                    user.isDeleted
                                        ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                "
                            >
                                <span
                                    class="w-1.5 h-1.5 rounded-full"
                                    :class="user.isDeleted ? 'bg-red-500' : 'bg-green-500'"
                                />
                                {{ user.isDeleted ? t('staff.inactive') : t('staff.active') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Basic Info -->
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.basic_info') }}</h3>
                </div>
                <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                            >{{ t('staff.first_name') }}</label
                        >
                        <input
                            v-model="basicForm.firstName"
                            type="text"
                            class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                            >{{ t('staff.last_name') }}</label
                        >
                        <input
                            v-model="basicForm.lastName"
                            type="text"
                            class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div class="sm:col-span-2 flex justify-end">
                        <button
                            class="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                            :disabled="isSavingInfo"
                            @click="saveBasicInfo"
                        >
                            {{ isSavingInfo ? `${t('fuel.saving')}` : t('fuel.save') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Contact Info -->
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.contact_info') }}</h3>
                </div>
                <div class="p-5 space-y-4">
                    <!-- Phone -->
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                        >
                            {{ t('staff.phone') }}
                        </label>
                        <div class="flex gap-2">
                            <template v-if="user.phone && !editingPhone">
                                <input
                                    type="tel"
                                    :value="user.phone"
                                    class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white opacity-60 cursor-not-allowed"
                                    disabled
                                />
                                <span
                                    class="shrink-0 inline-flex items-center gap-1 px-3 rounded-lg text-xs font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                >
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2.5"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    {{ t('profile.verified') }}
                                </span>
                                <button
                                    class="shrink-0 px-3 py-2 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                                    @click="(editingPhone = true), (contactForm.phone = user.phone)"
                                >
                                    {{ t('form.edit') }}
                                </button>
                            </template>
                            <template v-else>
                                <input
                                    v-model="contactForm.phone"
                                    type="tel"
                                    class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    :placeholder="t('staff.phone_placeholder')"
                                />
                                <button
                                    v-if="editingPhone"
                                    class="shrink-0 px-3 py-2 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                                    @click="(editingPhone = false), (contactForm.phone = '')"
                                >
                                    {{ t('form.cancel') }}
                                </button>
                                <button
                                    class="shrink-0 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                                    :disabled="!contactForm.phone"
                                    @click="openOtpCard('phone')"
                                >
                                    {{ t('profile.add_and_verify') }}
                                </button>
                            </template>
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                        >
                            {{ t('staff.email') }}
                        </label>
                        <div class="flex gap-2">
                            <template v-if="user.email && !editingEmail">
                                <input
                                    type="email"
                                    :value="user.email"
                                    class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white opacity-60 cursor-not-allowed"
                                    disabled
                                />
                                <span
                                    class="shrink-0 inline-flex items-center gap-1 px-3 rounded-lg text-xs font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                >
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2.5"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    {{ t('profile.verified') }}
                                </span>
                                <button
                                    class="shrink-0 px-3 py-2 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                                    @click="(editingEmail = true), (contactForm.email = user.email)"
                                >
                                    {{ t('form.edit') }}
                                </button>
                            </template>
                            <template v-else>
                                <input
                                    v-model="contactForm.email"
                                    type="email"
                                    class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    :placeholder="t('staff.email_placeholder')"
                                />
                                <button
                                    v-if="editingEmail"
                                    class="shrink-0 px-3 py-2 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                                    @click="(editingEmail = false), (contactForm.email = '')"
                                >
                                    {{ t('form.cancel') }}
                                </button>
                                <button
                                    class="shrink-0 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                                    :disabled="!contactForm.email"
                                    @click="openOtpCard('email')"
                                >
                                    {{ t('profile.add_and_verify') }}
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <!-- OTP Verification card -->
            <div
                v-if="otpState.show"
                class="bg-white dark:bg-gray-800 rounded-2xl border border-secondary/40 dark:border-secondary/30 overflow-hidden"
            >
                <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                            {{ t('profile.enter_otp') }}
                        </h3>
                    </div>
                    <!-- Close button -->
                    <button
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                        @click="closeOtpCard"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div class="p-5 space-y-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ t('profile.otp_sent_to') }}
                        <span class="font-semibold text-gray-900 dark:text-white">{{ otpState.sentTo }}</span>
                    </p>
                    <div class="flex gap-2 justify-center py-1">
                        <input
                            v-for="(_, i) in 6"
                            :key="i"
                            :ref="
                                el => {
                                    if (el) otpInputs[i] = el as HTMLInputElement
                                }
                            "
                            v-model="otpDigits[i]"
                            type="text"
                            inputmode="numeric"
                            maxlength="1"
                            class="w-11 h-13 text-center text-lg font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                            @input="onOtpInput(i, $event)"
                            @keydown="onOtpKeydown(i, $event)"
                            @paste="onOtpPaste"
                        />
                    </div>
                    <div class="flex items-center justify-between">
                        <button
                            v-if="resendTimer <= 0"
                            class="text-xs text-secondary hover:underline"
                            @click="resendOtp"
                        >
                            {{ t('profile.resend_otp') }}
                        </button>
                        <span v-else class="text-xs text-gray-400">{{
                            t('profile.resend_in', { s: resendTimer })
                        }}</span>
                        <button
                            class="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                            :disabled="otpCode.length < 6"
                            @click="verifyOtp"
                        >
                            {{ t('profile.verify') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Change Password -->
            <div
                v-if="user.registerBy === 'phone' || user.registerBy === 'email'"
                class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ t('profile.change_password') }}
                    </h3>
                </div>
                <div class="p-5 space-y-4">
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                            >{{ t('profile.current_password') }}</label
                        >
                        <div class="relative">
                            <input
                                v-model="passwordForm.current_password"
                                :type="showPw.current ? 'text' : 'password'"
                                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                :placeholder="t('profile.current_password_placeholder')"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                @click="showPw.current = !showPw.current"
                            >
                                <svg
                                    v-if="showPw.current"
                                    class="w-4 h-4"
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
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                            >{{ t('profile.new_password') }}</label
                        >
                        <div class="relative">
                            <input
                                v-model="passwordForm.new_password"
                                :type="showPw.new ? 'text' : 'password'"
                                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                :placeholder="t('profile.new_password_placeholder')"
                                @input="checkPasswordStrength"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                @click="showPw.new = !showPw.new"
                            >
                                <svg
                                    v-if="showPw.new"
                                    class="w-4 h-4"
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
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div v-if="passwordForm.new_password" class="mt-2 space-y-1.5">
                            <div class="flex gap-1">
                                <div
                                    v-for="i in 5"
                                    :key="i"
                                    class="h-1 flex-1 rounded-full transition-all duration-300"
                                    :style="{ backgroundColor: i <= passwordStrength ? strengthBarColor : '#E5E7EB' }"
                                />
                            </div>
                            <p class="text-xs" :style="{ color: strengthBarColor }">{{ getStrengthText() }}</p>
                            <div class="grid grid-cols-2 gap-1">
                                <span
                                    v-for="check in passwordCheckList"
                                    :key="check.key"
                                    class="flex items-center gap-1 text-xs"
                                    :class="check.pass ? 'text-green-500' : 'text-gray-400'"
                                >
                                    <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            v-if="check.pass"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2.5"
                                            d="M5 13l4 4L19 7"
                                        />
                                        <path
                                            v-else
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                    {{ t(`profile.pw_check_${check.key}`) }}
                                    {{ check.key === 'special' ? `(@$!%*?&)` : '' }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                            >{{ t('profile.confirm_password') }}</label
                        >
                        <div class="relative">
                            <input
                                v-model="passwordForm.repeat_password"
                                :type="showPw.confirm ? 'text' : 'password'"
                                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                :class="{ 'border-red-400 focus:ring-red-400 focus:border-red-400': passwordMismatch }"
                                :placeholder="t('profile.confirm_password_placeholder')"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                @click="showPw.confirm = !showPw.confirm"
                            >
                                <svg
                                    v-if="showPw.confirm"
                                    class="w-4 h-4"
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
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p v-if="passwordMismatch" class="mt-1.5 text-xs text-red-500">
                            {{ t('profile.password_mismatch') }}
                        </p>
                    </div>
                    <div class="flex items-center justify-between pt-1">
                        <button
                            class="text-xs text-secondary hover:underline"
                            @click="router.push('/auth/forgot-password')"
                        >
                            {{ t('profile.forgot_password') }}
                        </button>
                        <button
                            class="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                            :disabled="
                                isSavingPw ||
                                passwordMismatch ||
                                !passwordForm.current_password ||
                                !passwordForm.new_password
                            "
                            @click="changePassword"
                        >
                            {{ isSavingPw ? `${t('fuel.saving')}...` : t('profile.update_password') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Social login — no password -->
            <div
                v-else
                class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/40 p-4 flex items-start gap-3"
            >
                <svg
                    class="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p class="text-sm text-amber-700 dark:text-amber-400">
                    {{ t('profile.social_no_password', { provider: user.registerBy }) }}
                </p>
            </div>

            <!-- Station / Change Company -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.stations') }}</h3>
                </div>
                <div class="divide-y divide-gray-100 dark:divide-gray-700">
                    <div v-for="station in user.stations" :key="station._id" class="px-5 py-4 space-y-4">
                        <!-- Station Info -->
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                                <svg
                                    class="w-4 h-4 text-secondary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {{ station.station_name }}
                                </p>
                                <p class="text-xs text-gray-400 dark:text-gray-500">
                                    {{ t('profile.owner') }}: {{ station.owner }}
                                </p>
                            </div>
                            <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">{{
                                formatDate(station.createdAt)
                            }}</span>
                        </div>

                        <!-- Edit Owner Name -->
                        <div>
                            <label
                                class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                            >
                                {{ t('profile.station_owner') }}
                            </label>
                            <div class="flex gap-2">
                                <input
                                    v-model="stationForms[station._id].owner"
                                    type="text"
                                    class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    :placeholder="t('profile.station_owner_placeholder')"
                                />
                                <button
                                    class="shrink-0 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                                    :disabled="!stationForms[station._id].owner || stationForms[station._id].saving"
                                    @click="saveStationOwner(station._id)"
                                >
                                    {{ stationForms[station._id].saving ? `${t('fuel.saving')}` : t('fuel.save') }}
                                </button>
                            </div>
                        </div>

                        <!-- Change Company dropdown -->
                        <div>
                            <label
                                class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                            >
                                {{ t('profile.change_company') }}
                            </label>
                            <div class="relative" :ref="el => (companyDropdownRefs[station._id] = el as HTMLElement)">
                                <button
                                    type="button"
                                    class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:text-white flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
                                    @click="toggleCompanyDropdown(station._id)"
                                >
                                    <div
                                        v-if="stationForms[station._id].selectedCompany"
                                        class="flex items-center gap-2.5"
                                    >
                                        <img
                                            :src="stationForms[station._id].selectedCompany?.image"
                                            :alt="stationForms[station._id].selectedCompany?.name"
                                            class="w-6 h-6 object-contain rounded bg-white p-0.5"
                                        />
                                        <span class="font-medium">{{
                                            stationForms[station._id].selectedCompany?.name
                                        }}</span>
                                    </div>
                                    <span v-else class="text-gray-500 dark:text-gray-400">{{
                                        t('onboarding.choose_company')
                                    }}</span>
                                    <svg
                                        class="w-4 h-4 text-gray-400 transition-transform shrink-0"
                                        :class="{ 'rotate-180': openDropdownId === station._id }"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                <transition
                                    enter-active-class="transition ease-out duration-100"
                                    enter-from-class="opacity-0 scale-95"
                                    enter-to-class="opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="opacity-100 scale-100"
                                    leave-to-class="opacity-0 scale-95"
                                >
                                    <div
                                        v-if="openDropdownId === station._id"
                                        class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                                    >
                                        <ul class="py-1 max-h-52 overflow-y-auto">
                                            <li
                                                v-for="company in COMPANIES"
                                                :key="company._id"
                                                class="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center gap-3 text-sm"
                                                :class="{
                                                    'bg-secondary/5 dark:bg-secondary/10':
                                                        stationForms[station._id].selectedCompany?._id === company._id,
                                                }"
                                                @click="selectCompany(station._id, company)"
                                            >
                                                <img
                                                    :src="company.image"
                                                    :alt="company.name"
                                                    class="w-8 h-8 object-contain rounded bg-gray-50 dark:bg-gray-600 p-1 shrink-0"
                                                />
                                                <span class="font-medium text-gray-900 dark:text-white flex-1">{{
                                                    company.name
                                                }}</span>
                                                <svg
                                                    v-if="
                                                        stationForms[station._id].selectedCompany?._id === company._id
                                                    "
                                                    class="w-4 h-4 text-secondary shrink-0"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </li>
                                        </ul>
                                    </div>
                                </transition>
                            </div>
                            <button
                                v-if="stationForms[station._id].selectedCompany"
                                class="mt-2 w-full py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                                :disabled="stationForms[station._id].savingCompany"
                                @click="updateCompany(station._id)"
                            >
                                {{
                                    stationForms[station._id].savingCompany
                                        ? `${t('fuel.saving')}`
                                        : t('profile.save_company')
                                }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Danger Zone -->
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl border border-red-100 dark:border-red-900/30 overflow-hidden"
            >
                <div class="px-5 py-4 border-b border-red-100 dark:border-red-900/30">
                    <h3 class="text-sm font-semibold text-red-600 dark:text-red-400">{{ t('profile.danger_zone') }}</h3>
                </div>
                <div class="p-5 space-y-4">
                    <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ t('profile.deactivate_title') }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            {{ t('profile.deactivate_desc') }}
                        </p>
                    </div>

                    <!-- Checkbox confirmation -->
                    <label class="flex items-start gap-3 cursor-pointer group">
                        <div class="relative mt-0.5 shrink-0">
                            <input
                                v-model="deactivateConfirmed"
                                type="checkbox"
                                class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                            />
                        </div>
                        <span class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            {{ t('profile.deactivate_checkbox') }}
                        </span>
                    </label>

                    <button
                        class="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        :disabled="!deactivateConfirmed"
                        @click="deleteModal.show = true"
                    >
                        {{ t('profile.deactivate_btn') }}
                    </button>
                </div>
            </div>
        </div>

        <BottomNavigation />
    </div>

    <!-- ───────── Modals ───────── -->
    <DeleteModal
        :show="deleteModal.show"
        :title="t('profile.deactivate_confirm_title')"
        :description="t('profile.deactivate_confirm_desc')"
        @close="deleteModal.show = false"
        @confirm="deactivateAccount"
    />

    <SuccessModal
        :show="successModal.show"
        :type="successModal.type"
        :title="successModal.title"
        :description="successModal.description"
        @close="successModal.show = false"
        @confirm="successModal.show = false"
    />

    <ErrorModal
        :show="errorModal.show"
        :description="errorModal.description"
        :error-message="errorModal.message"
        @confirm="errorModal.show = false"
    />
</template>

<script setup lang="ts">
    import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import BottomNavigation from '@/components/home/BottomNavigation.vue'
    import { COMPANIES, type Company } from '@/data/constants'
    import { userService } from '@/modules/app/services/api.service'
    import { stationService } from '@/modules/OnboardingView/services/api.service'
    import { getFromCache, setCache } from '@/composables/useCache'
    import { useThemeStore } from '@/stores/theme'
    import { useAuthStore } from '@/modules/auth/store/index'
    import { useFormatDate } from '@/composables/useFormatDate'
    import BaseLoading from '@/components/app/BaseLoading.vue'
    import DeleteModal from '@/components/app/DeleteModal.vue'

    const { formatDate } = useFormatDate()
    const authStore = useAuthStore()
    const { t } = useI18n()
    const router = useRouter()
    const themeStore = useThemeStore()

    // Get user from cache — no separate userId/stationId needed
    const appData = getFromCache('app_data')

    // ─── User state ───
    const isPageLoading = ref(true)
    const user = reactive<any>({
        _id: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        registerBy: 'phone',
        isDeleted: false,
        deletedAt: null,
        stations: [],
    })

    const basicForm = reactive({ firstName: '', lastName: '' })
    const contactForm = reactive({ phone: '', email: '' })
    const editingPhone = ref(false)
    const editingEmail = ref(false)
    const isSavingInfo = ref(false)
    const isSavingContact = ref(false)

    // ─── Password ───
    const passwordForm = reactive({ current_password: '', new_password: '', repeat_password: '' })
    const showPw = reactive({ current: false, new: false, confirm: false })
    const isSavingPw = ref(false)

    const passwordMismatch = computed(
        () => !!passwordForm.repeat_password && passwordForm.new_password !== passwordForm.repeat_password,
    )

    const passwordChecks = reactive({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    })
    const passwordStrength = ref(0)

    const passwordCheckList = computed(() => [
        { key: 'length', pass: passwordChecks.length },
        { key: 'lowercase', pass: passwordChecks.lowercase },
        { key: 'uppercase', pass: passwordChecks.uppercase },
        { key: 'number', pass: passwordChecks.number },
        { key: 'special', pass: passwordChecks.special },
    ])

    const checkPasswordStrength = () => {
        const pwd = passwordForm.new_password
        passwordChecks.length = pwd.length >= 8
        passwordChecks.lowercase = /[a-z]/.test(pwd)
        passwordChecks.uppercase = /[A-Z]/.test(pwd)
        passwordChecks.number = /\d/.test(pwd)
        passwordChecks.special = /[@$!%*?&]/.test(pwd)
        passwordStrength.value = Object.values(passwordChecks).filter(Boolean).length
    }

    const strengthBarColor = computed(() => {
        if (passwordStrength.value <= 1) return '#EF4444'
        if (passwordStrength.value <= 2) return '#F97316'
        if (passwordStrength.value <= 3) return '#EAB308'
        return '#22C55E'
    })

    const getStrengthText = () => {
        if (passwordStrength.value <= 1) return t('register.weak')
        if (passwordStrength.value <= 2) return t('register.fair')
        if (passwordStrength.value <= 3) return t('register.good')
        return t('register.strong')
    }

    // ─── OTP (inline, no modal) ───
    const otpState = reactive({ show: false, type: 'phone' as 'phone' | 'email', sentTo: '' })
    const otpDigits = ref<string[]>(Array(6).fill(''))
    const otpInputs = ref<HTMLInputElement[]>([])
    const otpCode = computed(() => otpDigits.value.join(''))
    const resendTimer = ref(0)
    let resendInterval: ReturnType<typeof setInterval> | null = null

    const startResendTimer = () => {
        resendTimer.value = 60
        resendInterval = setInterval(() => {
            resendTimer.value--
            if (resendTimer.value <= 0 && resendInterval) clearInterval(resendInterval)
        }, 1000)
    }

    // Opens the OTP card and pre-fills sentTo — does NOT call API yet
    const openOtpCard = async (type: 'phone' | 'email') => {
        const value = type === 'phone' ? contactForm.phone.trim() : contactForm.email.trim()
        if (!value) return
        // Skip if value unchanged
        const current = type === 'phone' ? user.phone : user.email
        if (value === current) {
            if (type === 'phone') {
                editingPhone.value = false
                contactForm.phone = ''
            } else {
                editingEmail.value = false
                contactForm.email = ''
            }
            return
        }

        otpState.type = type
        otpState.sentTo = value
        otpState.show = true
        otpDigits.value = Array(6).fill('')
        await sendOtp()
    }

    // Called when user clicks "Send Code" / resend — this is where you call the API
    const sendOtp = async () => {
        try {
            if (otpState.type === 'phone') {
                await authStore.sendOTPtoSMS({ phone: otpState.sentTo, firstName: user.firstName })
            } else {
                await authStore.sendOTP({ email: otpState.sentTo, firstName: user.firstName })
            }
            startResendTimer()
            setTimeout(() => otpInputs.value[0]?.focus(), 100)
        } catch (err: any) {
            otpState.show = false
            errorModal.show = true
            errorModal.description = t('profile.otp_send_failed')
            errorModal.message = err.response?.data?.error || err.message
        }
    }

    const closeOtpCard = () => {
        otpState.show = false
        otpDigits.value = Array(6).fill('')
        if (resendInterval) clearInterval(resendInterval)
        resendTimer.value = 0
    }

    const resendOtp = async () => {
        otpDigits.value = Array(6).fill('')
        await sendOtp()
    }

    const onOtpInput = (index: number, event: Event) => {
        const val = (event.target as HTMLInputElement).value.replace(/\D/g, '')
        otpDigits.value[index] = val
        if (val && index < 5) otpInputs.value[index + 1]?.focus()
    }

    const onOtpKeydown = (index: number, event: KeyboardEvent) => {
        if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
            otpDigits.value[index - 1] = ''
            otpInputs.value[index - 1]?.focus()
        }
        if (event.key === 'ArrowLeft' && index > 0) otpInputs.value[index - 1]?.focus()
        if (event.key === 'ArrowRight' && index < 5) otpInputs.value[index + 1]?.focus()
    }

    const onOtpPaste = (event: ClipboardEvent) => {
        event.preventDefault()
        const digits = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6).split('')
        digits.forEach((d, i) => {
            otpDigits.value[i] = d
        })
        otpInputs.value[Math.min(digits.length, 5)]?.focus()
    }

    const verifyOtp = async () => {
        try {
            if (otpState.type === 'phone') {
                user.phone = otpState.sentTo
                await authStore.verifyOTP({
                    identifier: user.phone,
                    otp: otpCode.value,
                })
                contactForm.phone = ''
                editingPhone.value = false
            } else {
                user.email = otpState.sentTo
                await authStore.verifyOTP({
                    identifier: user.email,
                    otp: otpCode.value,
                })
                contactForm.email = ''
                editingEmail.value = false
            }
            const payload = otpState.type === 'phone' ? { phone: otpState.sentTo } : { email: otpState.sentTo }

            try {
                await userService.update(user._id, payload)
            } catch (error: any) {
                errorModal.show = true
                errorModal.description = t('profile.otp_verify_failed')
                errorModal.message = error.response?.data?.error || error.message
            }
            otpState.show = false
            showSuccess(t('profile.contact_added'))
        } catch (err: any) {
            errorModal.show = true
            errorModal.description = t('profile.otp_verify_failed')
            errorModal.message = err.response?.data?.error || err.message
        }
    }

    // ─── Station forms (one per station) ───
    // stationForms[stationId] = { owner, saving, selectedCompany, savingCompany }
    const stationForms = reactive<
        Record<
            string,
            {
                owner: string
                saving: boolean
                selectedCompany: Company | null
                savingCompany: boolean
            }
        >
    >({})

    const matchCompanyFromName = (stationName: string): Company | null => {
        if (!stationName) return COMPANIES[0] ?? null

        // Try exact match (spaces vs underscores)
        let match = COMPANIES.find(c => c.name.toLowerCase() === stationName.toLowerCase().replace(/_/g, ' '))
        // Try by _id
        if (!match) match = COMPANIES.find(c => c._id === stationName.toLowerCase())
        // Try partial match
        if (!match) {
            const lower = stationName.toLowerCase()
            match = COMPANIES.find(c => lower.includes(c._id) || c._id.includes(lower))
        }
        return match || COMPANIES[0] || null
    }

    const initStationForms = () => {
        user.stations.forEach((s: any) => {
            if (!stationForms[s._id]) {
                stationForms[s._id] = {
                    owner: s.owner ?? '',
                    saving: false,
                    selectedCompany: matchCompanyFromName(s.station_name),
                    savingCompany: false,
                }
            }
        })
    }

    // Dropdown open state — only one open at a time
    const openDropdownId = ref<string | null>(null)
    const companyDropdownRefs = reactive<Record<string, HTMLElement>>({})

    const toggleCompanyDropdown = (stationId: string) => {
        openDropdownId.value = openDropdownId.value === stationId ? null : stationId
    }

    const selectCompany = (stationId: string, company: Company) => {
        stationForms[stationId].selectedCompany = company
        openDropdownId.value = null
    }

    // Close dropdown on outside click
    const handleOutsideClick = (e: MouseEvent) => {
        if (!openDropdownId.value) return
        const ref = companyDropdownRefs[openDropdownId.value]
        if (ref && !ref.contains(e.target as Node)) {
            openDropdownId.value = null
        }
    }

    const saveStationOwner = async (stationId: string) => {
        const form = stationForms[stationId]
        if (!form?.owner.trim()) return

        // Skip if nothing changed
        const station = user.stations.find((s: any) => s._id === stationId)
        if (form.owner.trim() === station?.owner) return
        form.saving = true
        const cached = appData
        try {
            await stationService.updateStation(stationId, { owner: form.owner.trim() })
            if (station) station.owner = form.owner.trim()
            cached.value.stations[0].owner = station.owner
            setCache('app_data', cached.value)
            showSuccess(t('profile.station_owner_updated'))
        } catch (err: any) {
            errorModal.show = true
            errorModal.description = t('profile.station_owner_update_failed')
            errorModal.message = err.response?.data?.error || err.message
        } finally {
            form.saving = false
        }
    }

    const updateCompany = async (stationId: string) => {
        const form = stationForms[stationId]
        if (!form?.selectedCompany) return
        form.savingCompany = true
        try {
            const newStationName = form.selectedCompany.name.replace(/\s+/g, '_')
            const response = await stationService.updateStation(stationId, { station_name: newStationName })

            if (response.data.result.success) {
                const cached = appData
                if (cached.value?.stations?.[0]) {
                    cached.value.stations[0].station_name = newStationName
                    setCache('app_data', cached.value)
                }
                themeStore.setTheme(form.selectedCompany._id)
                form.selectedCompany = null
                showSuccess(t('profile.company_updated'))
            } else {
                throw new Error('Failed to update station')
            }
        } catch (err: any) {
            errorModal.show = true
            errorModal.description = t('profile.company_update_error')
            errorModal.message = err.response?.data?.details?.[0]?.error || err.message
        } finally {
            form.savingCompany = false
        }
    }

    // ─── Danger zone ───
    const deactivateConfirmed = ref(false)
    const deleteModal = reactive({ show: false })

    // ─── Modals ───
    const successModal = reactive({ show: false, type: 'success', title: '', description: '' })
    const errorModal = reactive({ show: false, description: '', message: '' })

    const showSuccess = (title: string, description = '') => {
        successModal.type = 'success'
        successModal.title = title
        successModal.description = description
        successModal.show = true
    }

    // ─── API calls (use appData directly, no separate userId) ───
    const fetchUser = async () => {
        try {
            const { data } = await userService.get()
            Object.assign(user, data.data ?? data)
            basicForm.firstName = user.firstName
            basicForm.lastName = user.lastName
        } catch (e) {
            console.error('Failed to fetch user', e)
        } finally {
            isPageLoading.value = false
            initStationForms()
        }
    }

    const saveBasicInfo = async () => {
        // Skip if nothing changed
        if (basicForm.firstName === user.firstName && basicForm.lastName === user.lastName) return

        isSavingInfo.value = true
        const cached = appData
        try {
            await userService.update(user._id, { firstName: basicForm.firstName, lastName: basicForm.lastName })
            user.firstName = basicForm.firstName
            user.lastName = basicForm.lastName
            showSuccess(t('profile.info_updated'))
            cached.value.firstName = basicForm.firstName
            cached.value.lastName = basicForm.lastName
            setCache('app_data', cached.value)
        } catch (err: any) {
            errorModal.show = true
            errorModal.description = t('profile.update_failed')
            errorModal.message = err.response?.data?.error || err.message
        } finally {
            isSavingInfo.value = false
        }
    }

    const changePassword = async () => {
        if (passwordMismatch.value || !passwordForm.current_password || !passwordForm.new_password) return
        isSavingPw.value = true
        try {
            await userService.updatePassword(user._id, {
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password,
                repeat_password: passwordForm.repeat_password,
            })
            passwordForm.current_password = ''
            passwordForm.new_password = ''
            passwordForm.repeat_password = ''
            passwordStrength.value = 0
            showSuccess(t('profile.password_updated'))
        } catch (err: any) {
            errorModal.show = true
            errorModal.description = t('profile.password_update_failed')
            errorModal.message = err.response?.data?.error || err.message
            passwordForm.current_password = ''
            passwordForm.new_password = ''
            passwordForm.repeat_password = ''
            passwordStrength.value = 0
        } finally {
            isSavingPw.value = false
        }
    }

    const deactivateAccount = async () => {
        try {
            // await userService.delete(user._id)
            // deleteModal.show = false
            // showSuccess(t('profile.deactivated_title'), t('profile.deactivated_desc'))
            // setTimeout(() => router.push('/auth/login'), 3000)
            router.push('/comingsoon')
        } catch (err: any) {
            deleteModal.show = false
            errorModal.show = true
            errorModal.description = t('profile.deactivate_failed')
            errorModal.message = err.response?.data?.error || err.message
        }
    }

    onMounted(() => {
        fetchUser()
        document.addEventListener('click', handleOutsideClick)
    })
    onBeforeUnmount(() => {
        if (resendInterval) clearInterval(resendInterval)
        document.removeEventListener('click', handleOutsideClick)
    })
</script>
