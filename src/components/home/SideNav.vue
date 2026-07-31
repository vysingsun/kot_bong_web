<template>
    <div class="sidenav overflow-y-auto py-6 px-3 h-full">
        <ul class="nav-list">
            <!-- Overview -->
            <li>
                <RouterLink to="/overview" class="nav-item" active-class="nav-item--active">
                    <span class="nav-icon icon-green">
                        <!-- Dashboard / Overview -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.overview') }}</span>
                </RouterLink>
            </li>

            <!-- Stock Report (Admin only) -->
            <li v-if="isAdmin">
                <RouterLink to="/fuel-stock" class="nav-item" active-class="nav-item--active">
                    <span class="nav-icon icon-blue">
                        <!-- Document / Report -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5a2.5 2.5 0 0 1-5 0V6h2v6.5a.5.5 0 0 0 1 0V7h5v3h-2V7zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"
                            />
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.stocksReport') }}</span>
                </RouterLink>
            </li>

            <!-- Stock Graph (Admin only) -->
            <li v-if="isAdmin">
                <RouterLink to="/fuelstockgraph" class="nav-item" active-class="nav-item--active">
                    <span class="nav-icon icon-purple">
                        <!-- Area chart / Stock graph -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M3 13.5L8.5 8l4 4L18 6.5V5h1v2.5L13.5 14l-4-4L3 15.5V19h18v2H3a1 1 0 0 1-1-1V4h2v9.5z"
                            />
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.stockGraph') }}</span>
                </RouterLink>
            </li>

            <!-- Sales Report -->
            <li>
                <RouterLink to="/fuel-sold-report" class="nav-item" active-class="nav-item--active">
                    <span class="nav-icon icon-amber">
                        <!-- Receipt / Sales report -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"
                            />
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.salesReport') }}</span>
                </RouterLink>
            </li>

            <!-- Sales Graph -->
            <li>
                <RouterLink to="/fuelsalesgraph" class="nav-item" active-class="nav-item--active">
                    <span class="nav-icon icon-red">
                        <!-- Bar chart / Sales graph -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z" />
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.salesGraph') }}</span>
                </RouterLink>
            </li>
            <li v-if="isAdmin">
                <a
                    class="nav-item"
                    :class="{ 'nav-item--active': isFuelPriceEstimateActive }"
                    @click="onClickFuelPriceEstimate"
                >
                    <span class="nav-icon icon-lime relative">
                        <svg
                            class="w-6 h-6"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13.6 16.733c.234.269.548.456.895.534a1.4 1.4 0 0 0 1.75-.762c.172-.615-.446-1.287-1.242-1.481-.796-.194-1.41-.861-1.241-1.481a1.4 1.4 0 0 1 1.75-.762c.343.077.654.26.888.524m-1.358 4.017v.617m0-5.939v.725M4 15v4m3-6v6M6 8.5 10.5 5 14 7.5 18 4m0 0h-3.5M18 4v3m2 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
                            />
                        </svg>
                        <!-- Pro Max badge -->
                        <span
                            v-if="!isSuperAdmin && !subscription?.canViewOilEstimation"
                            class="pro-max-badge"
                        >
                            <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </span>
                    </span>
                    <span class="nav-label">{{ $t('menu.fuel_price_estimate') }}</span>
                </a>
            </li>
        </ul>

        <ProUpgradeModal
            :show="upgradeModal"
            plan="pro_max"
            @close="upgradeModal = false"
            @confirm="onConfirmUpgrade"
        />
    </div>
</template>

<script setup lang="ts">
    import { inject, onMounted, ref, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { AuthKey } from '@/composables/useAuth'
    import { getFromCache } from '@/composables/useCache'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { usePaymentStore } from '@/modules/payment/store/index'
    import type { Subscription } from '@/modules/payment/services/api.service'
    import ProUpgradeModal from '@/components/app/ProUpgradeModal.vue'

    const { isAdmin, isSuperAdmin } = inject(AuthKey)!
    const route = useRoute()
    const router = useRouter()
    const paymentStore = usePaymentStore()

    const subscription = ref<Subscription | null>(null)
    const upgradeModal = ref(false)

    const isFuelPriceEstimateActive = computed(() => route.path.startsWith('/fuel-price-estimate'))

    onMounted(async () => {
        if (!isAdmin.value || isSuperAdmin.value) return
        const appData = getFromCache('app_data')
        const stationId = appData?.value?.stations?.[0]?._id
        if (!stationId) return
        try {
            const res = await lookupService.getStationById(stationId)
            subscription.value = res.data.data.subscription
        } catch {
            // Leave subscription null — badge/gate simply stay conservative (locked)
        }
    })

    const onClickFuelPriceEstimate = () => {
        if (isSuperAdmin.value || subscription.value?.canViewOilEstimation) {
            router.push('/fuel-price-estimate')
            return
        }
        upgradeModal.value = true
    }

    const onConfirmUpgrade = () => {
        upgradeModal.value = false
        paymentStore.targetPlan = 'pro_max'
        router.push('/payment')
    }
</script>

<style lang="scss" scoped>
    .sidenav {
        background: rgba(255, 255, 255, 0.82);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-right: 1px solid rgba(255, 255, 255, 0.9);
    }

    .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 9px 10px;
        border-radius: 12px;
        text-decoration: none;
        transition: background 0.18s ease;
        cursor: pointer;

        &:hover {
            background: rgba(0, 0, 0, 0.05);

            .nav-label {
                color: #111827;
            }

            .nav-icon {
                opacity: 1;
                transform: scale(1.1);
            }
        }

        &.nav-item--active {
            background: rgba(0, 0, 0, 0.06);

            .nav-label {
                color: #111827;
                font-weight: 700;
            }

            .nav-icon {
                opacity: 1;
            }
        }
    }

    /* Icon container — small, circular, transparent tinted */
    .nav-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        flex-shrink: 0;
        opacity: 0.85;
        transition:
            transform 0.18s ease,
            opacity 0.18s ease;
        background: transparent;

        /* Tinted backgrounds per color */
        &.icon-green {
            background: rgba(16, 185, 129, 0.12);
            color: #059669;
        }
        &.icon-blue {
            background: rgba(59, 130, 246, 0.12);
            color: #2563eb;
        }
        &.icon-purple {
            background: rgba(139, 92, 246, 0.12);
            color: #7c3aed;
        }
        &.icon-amber {
            background: rgba(245, 158, 11, 0.12);
            color: #d97706;
        }
        &.icon-red {
            background: rgba(239, 68, 68, 0.12);
            color: #dc2626;
        }
        &.icon-lime {
            background: rgba(132, 204, 22, 0.12);
            color: #84cc16;
        }
    }

    /* Pro Max badge — mirrors the badge used on gated buttons elsewhere */
    .pro-max-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 16px;
        height: 16px;
        border-radius: 9999px;
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: 11px;
            height: 11px;
            color: #2563eb;
        }
    }

    .nav-label {
        font-family: 'Inter', 'Outfit', system-ui, sans-serif;
        font-size: 14.5px;
        font-weight: 500;
        color: #4b5563;
        transition: color 0.18s ease;
        white-space: nowrap;
    }
</style>
