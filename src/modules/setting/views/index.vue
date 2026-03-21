<template>
    <div class="p-4">
        <!-- Loading -->
        <Transition name="fade">
            <div
                v-if="store.loading"
                class="relative z-10 flex flex-col items-center justify-center gap-4 min-h-screen"
            >
                <div class="w-16 h-16 rounded-full glass-panel flex items-center justify-center">
                    <div class="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
                <p class="text-slate-500 text-sm font-light tracking-wide">{{ t('station.loading') }}</p>
            </div>
        </Transition>

        <!-- Main Content -->
        <Transition name="slide-up">
            <div v-if="!store.loading && store.station" class="relative z-10 w-full max-w-lg mx-auto">
                <!-- Alerts — top of page -->
                <div class="mb-4 space-y-2">
                    <Transition name="toast">
                        <div
                            v-if="store.successMessage"
                            class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm"
                        >
                            <div
                                class="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center"
                            >
                                <svg
                                    class="w-4 h-4 text-emerald-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <p class="text-emerald-700 text-sm font-medium">{{ store.successMessage }}</p>
                        </div>
                    </Transition>
                    <Transition name="toast">
                        <div
                            v-if="store.error"
                            class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 shadow-sm"
                        >
                            <div class="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                                <svg
                                    class="w-4 h-4 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                    />
                                </svg>
                            </div>
                            <p class="text-red-700 text-sm font-medium">{{ store.error }}</p>
                        </div>
                    </Transition>
                </div>

                <!-- Glass Card -->
                <div class="glass-card rounded-3xl overflow-hidden">
                    <!-- Header -->
                    <div class="relative p-4">
                        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-slate-200 mt-3" />
                        <div class="flex items-start gap-4 mt-2">
                            <div
                                class="flex-shrink-0 w-14 h-14 rounded-2xl glass-icon flex items-center justify-center"
                            >
                                <svg
                                    class="w-7 h-7 icon-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                                    />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h1 class="text-slate-800 text-xl font-semibold tracking-tight leading-tight">
                                    {{ t('station.settings') }}
                                </h1>
                                <p class="text-slate-500 text-sm mt-0.5">
                                    {{ store.station.station_name }} · {{ store.station.owner }}
                                </p>
                            </div>
                        </div>
                        <div class="mt-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    </div>

                    <!-- Form Body -->
                    <div class="px-4 pb-4 space-y-5">
                        <!-- Currency -->
                        <div class="space-y-2">
                            <label class="block text-slate-500 text-xs font-semibold tracking-widest uppercase px-1">
                                {{ t('station.currency') }}
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <svg
                                        class="w-4 h-4 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33"
                                        />
                                    </svg>
                                </div>
                                <select
                                    v-model="store.currency"
                                    class="glass-input w-full pl-10 pr-10 py-3.5 rounded-2xl text-slate-700 text-sm appearance-none cursor-pointer focus:outline-none transition-all"
                                >
                                    <option v-for="(label, code) in currencies" :key="code" :value="code">
                                        {{ label }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <svg
                                        class="w-4 h-4 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Nozzle Toggle -->
                        <div class="glass-field rounded-2xl px-5 py-4">
                            <div class="flex items-center justify-between gap-4">
                                <div class="flex items-center gap-3 min-w-0">
                                    <div
                                        class="flex-shrink-0 w-9 h-9 rounded-xl glass-icon-sm flex items-center justify-center"
                                    >
                                        <svg
                                            style="width: 18px; height: 18px"
                                            class="icon-secondary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                            />
                                        </svg>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-slate-700 text-sm font-semibold leading-tight">
                                            {{ t('station.isNozzle') }}
                                        </p>
                                        <!-- <p class="text-slate-400 text-xs mt-0.5 leading-relaxed">
                                            {{ t('station.isNozzleDesc') }}
                                        </p> -->
                                    </div>
                                </div>

                                <!-- Toggle — secondary color -->
                                <button
                                    type="button"
                                    @click="store.isNozzle = !store.isNozzle"
                                    :class="['toggle-track', store.isNozzle ? 'toggle-on bg-secondary' : 'toggle-off']"
                                    :aria-checked="store.isNozzle"
                                    role="switch"
                                >
                                    <span
                                        :class="['toggle-thumb', store.isNozzle ? 'translate-x-7' : 'translate-x-0']"
                                    />
                                </button>
                            </div>

                            <!-- Info hint when enabled -->
                            <Transition name="expand">
                                <div
                                    v-if="store.isNozzle"
                                    class="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl hint-box"
                                >
                                    <svg
                                        class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 icon-secondary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <p class="text-xs leading-relaxed hint-text">{{ t('station.isNozzleHint') }}</p>
                                </div>
                                <div v-else class="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl hint-box">
                                    <svg
                                        class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 icon-secondary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <p class="text-xs leading-relaxed hint-text">{{ t('station.isNotNozzleHint') }}</p>
                                </div>
                            </Transition>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-3 pt-1">
                            <button
                                type="button"
                                @click="store.resetForm()"
                                :disabled="store.saving"
                                class="flex-1 py-3.5 rounded-2xl btn-secondary text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-40"
                            >
                                {{ t('station.cancel') }}
                            </button>
                            <button
                                type="button"
                                :disabled="store.saving"
                                class="flex-[2] py-3.5 rounded-2xl bg-secondary text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2.5"
                                @click="handleSave"
                            >
                                <div
                                    v-if="store.saving"
                                    class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                                />
                                <svg
                                    v-else
                                    class="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {{ store.saving ? t('station.saving') : t('station.save') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, computed, ref } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { getFromCache, setCache } from '@/composables/useCache'
    import { useStationSettingsStore } from '@/modules/setting/store/index'

    const { t } = useI18n()
    const store = useStationSettingsStore()

    const stationId = ref('')
    const appData = getFromCache('app_data')

    const currencies = computed(() => ({
        USD: t('station.currencies.USD'),
        KHR: t('station.currencies.KHR'),
        VND: t('station.currencies.VND'),
        EUR: t('station.currencies.EUR'),
        CNY: t('station.currencies.CNY'),
        SGD: t('station.currencies.SGD'),
    }))

    const handleSave = async () => {
        await store.updateSettings(stationId.value)
    }

    onMounted(() => {
        stationId.value = appData.value.stations[0]._id
        store.fetchStation(stationId.value)
    })
</script>

<style scoped>
    /* ─── Brand tokens — swap to match your Tailwind/Flowbite config ─── */
    :root,
    :host {
        --primary: #3b82f6; /* blue-500  */
        --secondary: #6366f1; /* indigo-500 */
    }

    /* colour helpers */
    .icon-primary {
        color: var(--primary);
    }
    .icon-secondary {
        color: var(--secondary);
    }
    .border-primary {
        border-color: var(--primary);
    }

    /* ─── Light Glass Card ─── */
    .glass-card {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(32px) saturate(160%);
        -webkit-backdrop-filter: blur(32px) saturate(160%);
        border: 1px solid rgba(255, 255, 255, 0.92);
        box-shadow:
            0 20px 48px rgba(99, 102, 241, 0.1),
            0 1px 0 #fff inset;
    }

    .glass-panel {
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.85);
    }

    .glass-input {
        background: rgba(255, 255, 255, 0.75);
        border: 1px solid rgba(203, 213, 225, 0.85);
        backdrop-filter: blur(8px);
        transition:
            border-color 0.2s,
            background 0.2s,
            box-shadow 0.2s;
    }
    .glass-input:hover {
        background: rgba(255, 255, 255, 0.95);
        border-color: #94a3b8;
    }
    .glass-input:focus {
        background: #fff;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent);
    }

    .glass-field {
        background: rgba(248, 250, 252, 0.82);
        border: 1px solid rgba(226, 232, 240, 0.92);
    }

    .glass-icon {
        background: linear-gradient(135deg, #fff, #f1f5f9);
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
    }

    .glass-icon-sm {
        background: rgba(241, 245, 249, 0.92);
        border: 1px solid #e2e8f0;
    }

    /* ─── Toggle ─── */
    .toggle-track {
        position: relative;
        flex-shrink: 0;
        width: 3.5rem; /* 56px */
        height: 1.75rem; /* 28px */
        border-radius: 9999px;
        transition:
            background 0.3s,
            box-shadow 0.3s;
        border: none;
        cursor: pointer;
    }
    .toggle-on {
        background: var(--secondary);
        box-shadow: 0 0 14px color-mix(in srgb, var(--secondary) 35%, transparent);
    }
    .toggle-off {
        background: #cbd5e1; /* slate-300 */
    }
    .toggle-on:focus,
    .toggle-off:focus {
        outline: none;
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--secondary) 30%, transparent);
    }
    .toggle-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 9999px;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
        transition: transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
        display: block;
    }

    /* ─── Nozzle hint box ─── */
    .hint-box {
        background: color-mix(in srgb, var(--secondary) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--secondary) 20%, transparent);
    }
    .hint-text {
        color: color-mix(in srgb, var(--secondary) 80%, #1e293b);
    }

    /* ─── Buttons ─── */
    .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border: none;
        box-shadow: 0 4px 16px color-mix(in srgb, var(--secondary) 28%, transparent);
        transition:
            box-shadow 0.2s,
            transform 0.15s;
    }
    .btn-primary:hover:not(:disabled) {
        box-shadow: 0 8px 28px color-mix(in srgb, var(--secondary) 40%, transparent);
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(203, 213, 225, 0.9);
        color: #64748b;
        backdrop-filter: blur(8px);
        transition:
            background 0.2s,
            border-color 0.2s,
            color 0.2s;
    }
    .btn-secondary:hover:not(:disabled) {
        background: #fff;
        color: #1e293b;
        border-color: #94a3b8;
    }

    /* ─── Transitions ─── */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .slide-up-enter-active {
        transition: all 0.45s cubic-bezier(0.34, 1.4, 0.64, 1);
    }
    .slide-up-enter-from {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
    }

    .toast-enter-active {
        transition: all 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
    }
    .toast-leave-active {
        transition: all 0.2s ease;
    }
    .toast-enter-from {
        opacity: 0;
        transform: translateY(-6px) scale(0.98);
    }
    .toast-leave-to {
        opacity: 0;
        transform: translateY(-4px);
    }

    .expand-enter-active {
        transition: all 0.3s ease;
        transform-origin: top;
    }
    .expand-leave-active {
        transition: all 0.2s ease;
        transform-origin: top;
    }
    .expand-enter-from,
    .expand-leave-to {
        opacity: 0;
        transform: scaleY(0.85);
    }
</style>
