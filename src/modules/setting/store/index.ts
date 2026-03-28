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

    const fetchStation = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const res = await stationService.getById(id)
            station.value = res.data.data
        } catch {
            error.value = t('station.fetchError')
        } finally {
            loading.value = false
        }
    }

    /**
     * Calls the update API and returns true on success, false on failure.
     * The caller is responsible for updating local state and cache —
     * this store does NOT re-fetch the station after saving.
     */
    const updateSettings = async (id: string, payload: UpdateStationSettingsPayload): Promise<boolean> => {
        saving.value = true
        error.value = null
        try {
            await stationService.updateSettings(id, payload)
            return true
        } catch {
            error.value = t('station.errorDesc')
            return false
        } finally {
            saving.value = false
        }
    }

    return {
        station,
        loading,
        saving,
        error,
        fetchStation,
        updateSettings,
    }
})
