<script setup lang="ts">
    /**
     * Component for rendering a single feature row
     * in the subscription comparison table.
     */
    defineProps({
        feature: {
            type: String,
            required: true,
        },
        trial: {
            type: Boolean,
            default: false,
        },
        pro: {
            type: Boolean,
            default: false,
        },
        free: {
            type: Boolean,
            default: false,
        },
        freeNote: {
            type: String,
            default: '',
        },
    })
</script>

<template>
    <tr
        class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
    >
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">
            {{ feature }}
        </td>

        <td class="text-center px-3 py-2.5">
            <span v-if="trial" class="text-green-500 font-bold">✔</span>
            <span v-else class="text-gray-300 dark:text-gray-600">—</span>
        </td>

        <td class="text-center px-3 py-2.5">
            <span v-if="pro" class="text-green-500 font-bold">✔</span>
            <span v-else class="text-red-400 font-bold">✗</span>
        </td>

        <td class="text-center px-3 py-2.5">
            <span v-if="free" class="text-green-500 font-bold">✔</span>
            <span v-else-if="freeNote" class="text-amber-500 text-[10px] uppercase font-bold tracking-tight">
                {{ freeNote }}
            </span>
            <span v-else class="text-red-400 font-bold">✗</span>
        </td>
    </tr>
</template>
