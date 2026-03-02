<template>
    <div class="flex items-center gap-3">
        <!-- Avatar Circle -->
        <div
            class="relative inline-flex items-center justify-center overflow-hidden rounded-full shrink-0"
            :class="[sizeClass, avatarColor]"
        >
            <span class="font-medium" :class="textClass">
                {{ initials }}
            </span>
        </div>

        <!-- Optional Info Slot -->
        <div v-if="$slots.title || $slots.subtitle" class="flex flex-col min-w-0">
            <slot name="title">
                <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ user?.firstName }} {{ user?.lastName }}
                </span>
            </slot>
            <slot name="subtitle">
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ contactInfo }}
                </span>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    interface User {
        _id: string
        firstName: string
        lastName: string
        phone?: string
        email?: string
        role?: { role_name: string }
        language?: string
    }

    const props = withDefaults(
        defineProps<{
            user: User
            size?: 'sm' | 'md' | 'lg'
        }>(),
        {
            size: 'md',
        },
    )

    const AVATAR_COLORS = [
        'bg-red-400 text-white',
        'bg-orange-400 text-white',
        'bg-amber-400 text-white',
        'bg-yellow-400 text-white',
        'bg-lime-500 text-white',
        'bg-green-500 text-white',
        'bg-teal-500 text-white',
        'bg-cyan-500 text-white',
        'bg-sky-500 text-white',
        'bg-blue-500 text-white',
        'bg-indigo-500 text-white',
        'bg-violet-500 text-white',
        'bg-purple-500 text-white',
        'bg-fuchsia-500 text-white',
        'bg-pink-500 text-white',
        'bg-rose-500 text-white',
    ]

    // Deterministic color based on user _id — same user always gets same color
    const avatarColor = computed(() => {
        const id = props.user?._id ?? ''
        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_COLORS.length
        return AVATAR_COLORS[index]
    })

    const initials = computed(() => {
        const first = props.user?.firstName?.charAt(0) ?? ''
        const last = props.user?.lastName?.charAt(0) ?? ''
        return `${first}${last}`.toUpperCase()
    })

    // Phone takes priority, fallback to email
    const contactInfo = computed(() => {
        return props.user?.phone || props.user?.email || ''
    })

    const sizeClass = computed(() => ({
        'w-6 h-6': props.size === 'sm',
        'w-8 h-8': props.size === 'md',
        'w-12 h-12': props.size === 'lg',
    }))

    const textClass = computed(() => ({
        'text-xs': props.size === 'sm',
        'text-sm': props.size === 'md',
        'text-lg': props.size === 'lg',
    }))
</script>

<!-- If Avatar only (no slots) -->
<!-- <AppAvatar :user="user" /> -->
