<template>
    <TablePaging
        :key="table_key"
        name="Fuel Income"
        :headers="store.headers"
        column-no
        :api-service="fuel_stockService"
        get-service-key="get"
        is-global-search
    />
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { initFlowbite } from 'flowbite'
    import { fuel_stockService } from '@/modules/fuel-stock/services/api.service'
    import { useFuelStockStore } from '@/modules/fuel-stock/store/index'

    const table_key = ref(0)
    const store = useFuelStockStore()
    onMounted(() => {
        initFlowbite()
    })
    const load = () => {
        table_key.value += 1
    }
</script>

<style lang="scss" scoped></style>
