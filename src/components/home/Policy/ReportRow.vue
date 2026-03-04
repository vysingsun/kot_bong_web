<script setup lang="ts">
    /**
     * Component showing separate access levels for Owner and Staff roles.
     * All text (including labels) is passed via props to support localization.
     */
    interface Props {
        title: string
        desc?: string
        // Role labels (passed from parent for translation)
        ownerLabel?: string
        staffLabel?: string
        // Status & Notes
        owner?: boolean
        ownerNote?: string
        staff?: boolean
        staffNote?: string
    }

    withDefaults(defineProps<Props>(), {
        desc: '',
        ownerLabel: 'Owner',
        staffLabel: 'Staff',
        owner: false,
        ownerNote: '',
        staff: false,
        staffNote: '',
    })
</script>

<template>
    <div
        class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-200 shadow-sm group"
    >
        <div class="flex-1 min-w-0">
            <div class="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">
                {{ title }}
            </div>
            <div v-if="desc" class="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">
                {{ desc }}
            </div>
        </div>

        <div class="flex items-start gap-4 shrink-0">
            <div class="flex flex-col items-center min-w-[48px]">
                <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1.5">
                    {{ ownerLabel }}
                </span>
                <div
                    v-if="owner"
                    class="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-inner"
                >
                    <svg
                        class="w-3.5 h-3.5 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div v-if="ownerNote" class="text-[10px] font-medium text-blue-500 mt-1 whitespace-nowrap italic">
                    {{ ownerNote }}
                </div>
            </div>

            <div class="flex flex-col items-center min-w-[48px]">
                <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1.5">
                    {{ staffLabel }}
                </span>
                <div
                    class="w-7 h-7 rounded-full flex items-center justify-center shadow-inner"
                    :class="staff ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'"
                >
                    <svg
                        v-if="staff"
                        class="w-3.5 h-3.5 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg
                        v-else
                        class="w-3.5 h-3.5 text-red-500 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
                <div v-if="staffNote" class="text-[10px] font-medium text-amber-500 mt-1 whitespace-nowrap italic">
                    {{ staffNote }}
                </div>
            </div>
        </div>
    </div>
</template>
