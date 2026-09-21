import { ref } from 'vue'
import axios from 'axios'

// Module-level singleton — shared by every component that needs it (landing
// page, policy page, etc.) so the flag is only fetched once per page load,
// signed in or not. Defaults to `true` to match the server's own default
// (models/appSettings.js) so a slow/failed fetch doesn't hide a real feature.
const fuelPriceEstimateEnabled = ref(true)
let fetched = false
let inflight: Promise<void> | null = null

const fetchPublicAppSettings = (): Promise<void> => {
    if (fetched) return Promise.resolve()
    if (inflight) return inflight

    inflight = axios
        .get('/app-settings/public')
        .then(res => {
            if (res.data?.success && typeof res.data.data?.fuelPriceEstimateEnabled === 'boolean') {
                fuelPriceEstimateEnabled.value = res.data.data.fuelPriceEstimateEnabled
            }
        })
        .catch(() => {
            // Best-effort — a marketing page shouldn't break because this failed.
        })
        .finally(() => {
            fetched = true
            inflight = null
        })

    return inflight
}

/**
 * Public (unauthenticated) app-settings flags — for pages viewed signed out,
 * like the landing page and the policy page. Mirrors the authenticated
 * fetch in modules/app's AppProvider, but hits GET /app-settings/public so
 * it works without a session.
 */
export function useAppSettings() {
    fetchPublicAppSettings()
    return { fuelPriceEstimateEnabled }
}
