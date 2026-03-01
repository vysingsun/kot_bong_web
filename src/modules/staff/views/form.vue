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
                    {{ t('staff.email') }}
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
                    v-model="store.formData.role"
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

            <!-- Language -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ t('staff.language') }}
                </label>
                <select
                    v-model="store.formData.language"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary"
                    :disabled="mode === 'view'"
                >
                    <option value="en">English</option>
                    <option value="km">ខ្មែរ</option>
                </select>
            </div>
        </div>
    </BaseForm>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
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

    const getRolesService = async () => {
        if (store.roles.length === 0) {
            const response = await lookupService.getRoles()
            store.roles = response?.data?.data ?? []
            store.roles = store.roles.filter(role => role.role_name !== 'Super_Admin')
        }
    }

    const handleSaveLoading = (isLoading: boolean) => {
        loadingFrom.value = isLoading
    }

    onMounted(async () => {
        initFlowbite()
        const appData = getFromCache('app_data')
        stationId.value = appData.value.stations[0]._id
        store.formData.station_id = stationId.value

        if (mode.value === 'create') {
            store.roles = []
            await getRolesService()
        } else if (mode.value === 'edit') {
            store.roles = []
            await getRolesService()
            await store.readDataFromApi(staff_id)
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
