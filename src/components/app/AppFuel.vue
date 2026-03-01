<template>
    <div class="flex items-end gap-3">
        <!-- Fuel Icon -->
        <div
            class="rounded-lg flex items-center justify-center flex-shrink-0"
            :class="sizeIconClass"
            :style="{ backgroundColor: fuel.color + '20' }"
        >
            <svg :class="sizesvgClass" :style="{ color: fuel.color }" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
            <slot name="title">
                <h3 class="font-bold text-gray-900 dark:text-white truncate" :class="sizeTitleClass">
                    {{ fuel.fuel_name }}
                </h3>
            </slot>
            <slot name="subtitle">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ t('onboarding.coefficient') }}:
                    <span class="font-bold" :style="{ color: fuel.color }">
                        {{ fuel.coefficient_value }}
                    </span>
                    {{ t('onboarding.liters_per_ton') }}
                </p>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    interface Fuel {
        _id: string
        fuel_name: string
        color: string
        coefficient_value?: number
    }

    const props = withDefaults(
        defineProps<{
            fuel: Fuel
            size?: 'sm' | 'md' | 'lg'
        }>(),
        {
            size: 'md',
        },
    )

    const sizeIconClass = computed(() => ({
        'w-8 h-8': props.size === 'sm',
        'w-10 h-10': props.size === 'md',
        'w-16 h-16': props.size === 'lg',
    }))

    const sizesvgClass = computed(() => ({
        'w-4 h-4': props.size === 'sm',
        'w-7 h-7': props.size === 'md',
        'w-10 h-10': props.size === 'lg',
    }))

    const sizeTitleClass = computed(() => ({
        'text-sm': props.size === 'sm',
        'text-lg': props.size === 'md',
        'text-xl': props.size === 'lg',
    }))
</script>
