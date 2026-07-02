<template>
    <div class="sidenav overflow-y-auto py-6 px-3 h-full">
        <ul class="nav-list">

            <!-- Overview -->
            <li>
                <RouterLink
                    to="/overview"
                    class="nav-item"
                    active-class="nav-item--active"
                >
                    <span class="nav-icon icon-green">
                        <!-- Dashboard / Overview -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/>
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.overview') }}</span>
                </RouterLink>
            </li>

            <!-- Stock Report (Admin only) -->
            <li v-if="isAdmin">
                <RouterLink
                    to="/fuel-stock"
                    class="nav-item"
                    active-class="nav-item--active"
                >
                    <span class="nav-icon icon-blue">
                        <!-- Document / Report -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5a2.5 2.5 0 0 1-5 0V6h2v6.5a.5.5 0 0 0 1 0V7h5v3h-2V7zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/>
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.stocksReport') }}</span>
                </RouterLink>
            </li>

            <!-- Stock Graph (Admin only) -->
            <li v-if="isAdmin">
                <RouterLink
                    to="/fuelstockgraph"
                    class="nav-item"
                    active-class="nav-item--active"
                >
                    <span class="nav-icon icon-purple">
                        <!-- Area chart / Stock graph -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13.5L8.5 8l4 4L18 6.5V5h1v2.5L13.5 14l-4-4L3 15.5V19h18v2H3a1 1 0 0 1-1-1V4h2v9.5z"/>
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.stockGraph') }}</span>
                </RouterLink>
            </li>

            <!-- Sales Report -->
            <li>
                <RouterLink
                    to="/fuel-sold-report"
                    class="nav-item"
                    active-class="nav-item--active"
                >
                    <span class="nav-icon icon-amber">
                        <!-- Receipt / Sales report -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"/>
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.salesReport') }}</span>
                </RouterLink>
            </li>

            <!-- Sales Graph -->
            <li>
                <RouterLink
                    to="/fuelsalesgraph"
                    class="nav-item"
                    active-class="nav-item--active"
                >
                    <span class="nav-icon icon-red">
                        <!-- Bar chart / Sales graph -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/>
                        </svg>
                    </span>
                    <span class="nav-label">{{ $t('menu.salesGraph') }}</span>
                </RouterLink>
            </li>

        </ul>
    </div>
</template>

<script setup lang="ts">
    import { inject } from 'vue'
    import { AuthKey } from '@/composables/useAuth'

    const { isAdmin } = inject(AuthKey)!
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
    transition: transform 0.18s ease, opacity 0.18s ease;
    background: transparent;

    /* Tinted backgrounds per color */
    &.icon-green  { background: rgba(16, 185, 129, 0.12); color: #059669; }
    &.icon-blue   { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
    &.icon-purple { background: rgba(139, 92, 246, 0.12); color: #7c3aed; }
    &.icon-amber  { background: rgba(245, 158, 11, 0.12); color: #d97706; }
    &.icon-red    { background: rgba(239, 68, 68, 0.12);  color: #dc2626; }
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
