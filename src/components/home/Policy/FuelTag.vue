<script setup lang="ts">
    import { computed } from 'vue'

    // Define a type for the allowed colors
    type FuelColor = 'blue' | 'green' | 'yellow' | 'purple'

    interface Props {
        name: string
        desc: string
        color?: FuelColor // Optional, defaults to 'blue'
    }

    const props = withDefaults(defineProps<Props>(), {
        color: 'blue',
    })

    /**
     * Computed class mapping with strict TS typing
     */
    const colorClass = computed(() => {
        const map: Record<FuelColor, string> = {
            blue: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300',
            green: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300',
            yellow: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300',
            purple: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300',
        }

        return map[props.color]
    })
</script>

<template>
    <div
        class="border rounded-xl p-3 transition-all duration-200 hover:scale-[1.02] cursor-default"
        :class="colorClass"
    >
        <div class="font-bold text-sm tracking-tight leading-none mb-1">
            {{ name }}
        </div>
        <div class="text-[11px] leading-relaxed opacity-80 font-medium">
            {{ desc }}
        </div>
    </div>
</template>
