<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div class="max-w-2xl mx-auto space-y-4">
            <!-- Profile Header Card -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div class="flex items-center gap-4">
                    <AppAvatar :user="user" size="lg" />
                    <div class="flex-1 min-w-0">
                        <h1 class="text-xl font-bold text-gray-900 dark:text-white truncate">
                            {{ user.firstName }} {{ user.lastName }}
                        </h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {{ user.phone || user.email }}
                        </p>
                        <div class="flex items-center gap-2 mt-2">
                            <!-- Register By -->
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
                                <svg v-else class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    />
                                </svg>
                                {{ t(`profile.register_by_${user.registerBy}`) }}
                            </span>
                            <!-- Status -->
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
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.basic_info') }}</h2>
                </div>
                <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                        >
                            {{ t('staff.first_name') }}
                        </label>
                        <input
                            v-model="form.firstName"
                            type="text"
                            class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                        >
                            {{ t('staff.last_name') }}
                        </label>
                        <input
                            v-model="form.lastName"
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
                            <span v-if="isSavingInfo">{{ t('form.saving') }}...</span>
                            <span v-else>{{ t('form.save') }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Contact Info -->
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.contact_info') }}</h2>
                </div>
                <div class="p-6 space-y-4">
                    <!-- Phone -->
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                        >
                            {{ t('staff.phone') }}
                        </label>
                        <div class="flex gap-2">
                            <input
                                v-model="form.phone"
                                type="tel"
                                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                :disabled="!!user.phone"
                                :placeholder="user.phone ? user.phone : t('staff.phone_placeholder')"
                            />
                            <button
                                v-if="!user.phone"
                                class="shrink-0 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors"
                                @click="openOtp('phone')"
                            >
                                {{ t('profile.add_and_verify') }}
                            </button>
                            <span
                                v-else
                                class="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
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
                            <input
                                v-model="form.email"
                                type="email"
                                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                :disabled="!!user.email"
                                :placeholder="user.email ? user.email : t('staff.email_placeholder')"
                            />
                            <button
                                v-if="!user.email"
                                class="shrink-0 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors"
                                @click="openOtp('email')"
                            >
                                {{ t('profile.add_and_verify') }}
                            </button>
                            <span
                                v-else
                                class="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
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
                        </div>
                    </div>
                </div>
            </div>

            <!-- Change Password — only phone or email registered -->
            <div
                v-if="user.registerBy === 'phone' || user.registerBy === 'email'"
                class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ t('profile.change_password') }}
                    </h2>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label
                            class="block mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                        >
                            {{ t('profile.current_password') }}
                        </label>
                        <div class="relative">
                            <input
                                v-model="passwordForm.current"
                                :type="showCurrentPw ? 'text' : 'password'"
                                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                :placeholder="t('profile.current_password_placeholder')"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                @click="showCurrentPw = !showCurrentPw"
                            >
                                <svg
                                    v-if="showCurrentPw"
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
                        >
                            {{ t('profile.new_password') }}
                        </label>
                        <div class="relative">
                            <input
                                v-model="passwordForm.new"
                                :type="showNewPw ? 'text' : 'password'"
                                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                :placeholder="t('profile.new_password_placeholder')"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                @click="showNewPw = !showNewPw"
                            >
                                <svg
                                    v-if="showNewPw"
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
                        >
                            {{ t('profile.confirm_password') }}
                        </label>
                        <div class="relative">
                            <input
                                v-model="passwordForm.confirm"
                                :type="showConfirmPw ? 'text' : 'password'"
                                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                :class="{ 'border-red-400 focus:ring-red-400 focus:border-red-400': passwordMismatch }"
                                :placeholder="t('profile.confirm_password_placeholder')"
                            />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                @click="showConfirmPw = !showConfirmPw"
                            >
                                <svg
                                    v-if="showConfirmPw"
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
                    <div class="flex justify-end">
                        <button
                            class="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                            :disabled="isSavingPw || passwordMismatch || !passwordForm.current || !passwordForm.new"
                            @click="changePassword"
                        >
                            <span v-if="isSavingPw">{{ t('form.saving') }}...</span>
                            <span v-else>{{ t('profile.update_password') }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Social Login — no password change -->
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

            <!-- Station Info -->
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.stations') }}</h2>
                </div>
                <div class="divide-y divide-gray-100 dark:divide-gray-700">
                    <div
                        v-for="station in user.stations"
                        :key="station._id"
                        class="px-6 py-4 flex items-center justify-between"
                    >
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
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
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">
                                    {{ station.station_name }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ t('profile.owner') }}: {{ station.owner }}
                                </p>
                            </div>
                        </div>
                        <span class="text-xs text-gray-400 dark:text-gray-500">{{
                            formatDate(station.createdAt)
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- Danger Zone -->
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl border border-red-100 dark:border-red-900/30 overflow-hidden"
            >
                <div class="px-6 py-4 border-b border-red-100 dark:border-red-900/30">
                    <h2 class="text-sm font-semibold text-red-600 dark:text-red-400">{{ t('profile.danger_zone') }}</h2>
                </div>
                <div class="p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                                {{ t('profile.deactivate_title') }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {{ t('profile.deactivate_desc') }}
                            </p>
                        </div>
                        <button
                            class="shrink-0 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                            @click="showDeactivateModal = true"
                        >
                            {{ t('profile.deactivate_btn') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- OTP Modal -->
    <div
        v-if="otpModal.show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 w-full max-w-sm p-6 shadow-xl"
        >
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {{ otpModal.type === 'phone' ? t('profile.add_phone') : t('profile.add_email') }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ t('profile.otp_desc') }}</p>

            <div v-if="!otpModal.codeSent">
                <input
                    v-model="otpModal.value"
                    :type="otpModal.type === 'phone' ? 'tel' : 'email'"
                    class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
                    :placeholder="
                        otpModal.type === 'phone' ? t('staff.phone_placeholder') : t('staff.email_placeholder')
                    "
                />
                <div class="flex gap-2">
                    <button
                        class="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                        @click="otpModal.show = false"
                    >
                        {{ t('form.cancel') }}
                    </button>
                    <button
                        class="flex-1 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors"
                        @click="sendOtp"
                    >
                        {{ t('profile.send_otp') }}
                    </button>
                </div>
            </div>

            <div v-else>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {{ t('profile.otp_sent_to') }}
                    <span class="font-medium text-gray-900 dark:text-white">{{ otpModal.value }}</span>
                </p>
                <!-- OTP Input Boxes -->
                <div class="flex gap-2 justify-center mb-4">
                    <input
                        v-for="(_, i) in 6"
                        :key="i"
                        :ref="el => (otpInputs[i] = el as HTMLInputElement)"
                        v-model="otpDigits[i]"
                        type="text"
                        maxlength="1"
                        class="w-10 h-12 text-center text-lg font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        @input="onOtpInput(i)"
                        @keydown.backspace="onOtpBackspace(i)"
                    />
                </div>
                <div class="flex gap-2">
                    <button
                        class="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                        @click="otpModal.show = false"
                    >
                        {{ t('form.cancel') }}
                    </button>
                    <button
                        class="flex-1 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors"
                        :disabled="otpCode.length < 6"
                        @click="verifyOtp"
                    >
                        {{ t('profile.verify') }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Deactivate Confirm Modal -->
    <BaseModal
        :is-visible="showDeactivateModal"
        type="error"
        :title="t('profile.deactivate_confirm_title')"
        :confirm-label="t('profile.deactivate_btn')"
        @close="showDeactivateModal = false"
        @confirm="deactivateAccount"
    >
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('profile.deactivate_confirm_desc') }}</p>
    </BaseModal>
</template>

<script setup lang="ts">
    import { ref, reactive, computed } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { useFormatDate } from '@/composables/useFormatDate'

    const { formatDate } = useFormatDate()

    const { t } = useI18n()

    // Replace with your actual user from store/cache
    const user = reactive({
        _id: '69958d446cb060e451063820',
        firstName: 'SUN',
        lastName: 'VYSING_X',
        phone: '069212814',
        email: '',
        registerBy: 'phone',
        isDeleted: false,
        deletedAt: null as string | null,
        stations: [
            {
                _id: '69958d446cb060e451063821',
                station_name: 'Caltex',
                owner: 'SUN VYSING_X',
                createdAt: '2026-02-18T09:58:28.923Z',
            },
        ],
    })

    // Basic info form
    const form = reactive({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
    })

    // Password form
    const passwordForm = reactive({ current: '', new: '', confirm: '' })
    const showCurrentPw = ref(false)
    const showNewPw = ref(false)
    const showConfirmPw = ref(false)
    const isSavingInfo = ref(false)
    const isSavingPw = ref(false)
    const showDeactivateModal = ref(false)

    const passwordMismatch = computed(() => !!passwordForm.confirm && passwordForm.new !== passwordForm.confirm)

    // OTP Modal
    const otpModal = reactive({
        show: false,
        type: 'phone' as 'phone' | 'email',
        value: '',
        codeSent: false,
    })
    const otpDigits = ref<string[]>(Array(6).fill(''))
    const otpInputs = ref<HTMLInputElement[]>([])
    const otpCode = computed(() => otpDigits.value.join(''))

    const openOtp = (type: 'phone' | 'email') => {
        otpModal.type = type
        otpModal.value = ''
        otpModal.codeSent = false
        otpDigits.value = Array(6).fill('')
        otpModal.show = true
    }

    const sendOtp = async () => {
        // TODO: call your OTP send API
        otpModal.codeSent = true
    }

    const onOtpInput = (index: number) => {
        if (otpDigits.value[index] && index < 5) {
            otpInputs.value[index + 1]?.focus()
        }
    }

    const onOtpBackspace = (index: number) => {
        if (!otpDigits.value[index] && index > 0) {
            otpDigits.value[index - 1] = ''
            otpInputs.value[index - 1]?.focus()
        }
    }

    const verifyOtp = async () => {
        // TODO: call your OTP verify API with otpCode.value
        if (otpModal.type === 'phone') user.phone = otpModal.value
        else user.email = otpModal.value
        otpModal.show = false
    }

    const saveBasicInfo = async () => {
        isSavingInfo.value = true
        try {
            // TODO: call your update API
            user.firstName = form.firstName
            user.lastName = form.lastName
        } finally {
            isSavingInfo.value = false
        }
    }

    const changePassword = async () => {
        if (passwordMismatch.value) return
        isSavingPw.value = true
        try {
            // TODO: call your change password API
            passwordForm.current = ''
            passwordForm.new = ''
            passwordForm.confirm = ''
        } finally {
            isSavingPw.value = false
        }
    }

    const deactivateAccount = async () => {
        // TODO: call your deactivate API
        user.isDeleted = true
        user.deletedAt = new Date().toISOString()
        showDeactivateModal.value = false
    }
</script>
