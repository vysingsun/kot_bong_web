<template>
    <BaseForm
        :title="t('staff.title')"
        :is-loading="loadingFrom"
        :editing-id="staff_id"
        :form-data="store.formData"
        :api-service="staffService"
        @on-save="handleSaveLoading"
    >
        <div class="form-grid">
            <!-- First Name -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ t('staff.first_name') }}
                </label>
                <input
                    v-model="store.formData.firstName"
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    :placeholder="t('staff.first_name_placeholder')"
                    :disabled="mode === 'view'"
                    required
                />
            </div>

            <!-- Last Name -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ t('staff.last_name') }}
                </label>
                <input
                    v-model="store.formData.lastName"
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    :placeholder="t('staff.last_name_placeholder')"
                    :disabled="mode === 'view'"
                    required
                />
            </div>

            <!-- Phone -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ t('staff.phone') }}
                </label>
                <input
                    v-model="store.formData.phone"
                    type="tel"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    :placeholder="t('staff.phone_placeholder')"
                    :disabled="mode === 'view'"
                />
            </div>

            <!-- Email -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ t('staff.email') }} {{ t('staff.optional') }}
                </label>
                <input
                    v-model="store.formData.email"
                    type="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    :placeholder="t('staff.email_placeholder')"
                    :disabled="mode === 'view'"
                />
            </div>

            <!-- Role -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ t('staff.role') }}
                </label>
                <select
                    v-model="selectedRoleId"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary"
                    :disabled="mode === 'view'"
                    required
                >
                    <option value="" disabled>{{ t('staff.role_placeholder') }}</option>
                    <option v-for="role in store.roles" :key="role._id" :value="role._id">
                        {{ t(`staff.${role.role_name}`) }}
                    </option>
                </select>
            </div>

            <!-- Password -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ t('staff.password') }}
                </label>
                <div class="relative">
                    <input
                        v-model="store.formData.password"
                        :type="showPassword ? 'text' : 'password'"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 pr-10 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        :placeholder="t('staff.password_placeholder')"
                        :disabled="mode === 'view'"
                    />
                    <button
                        v-if="mode !== 'view'"
                        type="button"
                        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        @click="showPassword = !showPassword"
                    >
                        <!-- Eye Open -->
                        <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <!-- Eye Closed -->
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
            </div>
        </div>
    </BaseForm>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
    import { useRoute, onBeforeRouteUpdate } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { staffService } from '@/modules/staff/services/api.service'
    import { useStaffStore } from '@/modules/staff/store/index'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { getFromCache } from '@/composables/useCache'
    import { initFlowbite } from 'flowbite'

    const { t } = useI18n()
    const store = useStaffStore()
    const route = useRoute()
    const mode = ref(route.params.mode)
    const loadingFrom = ref(true)
    const stationId = ref('')
    const staff_id = route.path.split('/').pop()
    const showPassword = ref(true)

    const getRolesService = async () => {
        if (store.roles.length === 0) {
            const response = await lookupService.getRoles()
            store.roles = response?.data?.data ?? []
            store.roles = store.roles.filter(role => role.role_name !== 'Super_Admin')
        }
    }

    const selectedRoleId = computed({
        get() {
            return typeof store.formData.role === 'object' ? store.formData.role?._id : store.formData.role
        },
        set(value) {
            store.formData.role = value
        },
    })

    const handleSaveLoading = (isLoading: boolean) => {
        loadingFrom.value = isLoading
    }

    onMounted(async () => {
        initFlowbite()
        const appData = getFromCache('app_data')
        stationId.value = appData.value.stations[0]._id
        store.formData.stations = stationId.value

        if (mode.value === 'create') {
            store.roles = []
            await getRolesService()
        } else if (mode.value === 'edit') {
            await store.readDataFromApi(staff_id)
            store.roles = []
            await getRolesService()
        } else if (mode.value === 'view') {
            await store.readDataFromApi(staff_id)
        }

        loadingFrom.value = false
    })

    watch(mode, async newMode => {
        if (newMode === 'edit' || newMode === 'create') {
            store.roles = []
            await getRolesService()
        }
    })

    onBeforeRouteUpdate((to, from, next) => {
        mode.value = to.params.mode
        next()
    })

    onBeforeUnmount(() => {
        store.resetData()
    })
</script>

<style lang="scss" scoped>
    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }

    @media (min-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (min-width: 1280px) {
        .form-grid {
            grid-template-columns: 1fr 1fr 1fr;
        }
    }
</style>
