import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { stationService, type Station, type UpdateStationSettingsPayload } from '@/modules/setting/services/api.service'

export const useStationSettingsStore = defineStore('stationSettingsStore', () => {
    const { t } = useI18n()

    const station = ref<Station | null>(null)
    const loading = ref(false)
    const saving = ref(false)
    const error = ref<string | null>(null)
    const successMessage = ref<string | null>(null)

    // Form state
    const currency = ref('')
    const isNozzle = ref(false)

    const fetchStation = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const res = await stationService.getById(id)
            station.value = res.data.data
            currency.value = station.value.currency
            isNozzle.value = station.value.isNozzle
        } catch {
            error.value = t('station.fetchError')
        } finally {
            loading.value = false
        }
    }

    const updateSettings = async (id: string) => {
        saving.value = true
        error.value = null
        successMessage.value = null
        try {
            const payload: UpdateStationSettingsPayload = {
                currency: currency.value,
                isNozzle: isNozzle.value,
            }
            const res = await stationService.updateSettings(id, payload)
            station.value = res.data.data
            successMessage.value = t('station.successDesc')

            // Auto-clear success after 3s
            setTimeout(() => {
                successMessage.value = null
            }, 3000)
        } catch {
            error.value = t('station.errorDesc')
        } finally {
            saving.value = false
        }
    }

    const resetForm = () => {
        if (station.value) {
            currency.value = station.value.currency
            isNozzle.value = station.value.isNozzle
        }
        error.value = null
        successMessage.value = null
    }

    return {
        station,
        loading,
        saving,
        error,
        successMessage,
        currency,
        isNozzle,
        fetchStation,
        updateSettings,
        resetForm,
    }
})
