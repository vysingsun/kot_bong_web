<template>
    <TablePaging
        name="Fuel Income"
        :headers="store.headers"
        column-no
        :api-service="fuel_stockService"
        get-service-key="get"
    />
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { initFlowbite } from 'flowbite'
    import { fuel_stockService } from '@/modules/fuel-stock/services/api.service'
    import { useFuelStockStore } from '@/modules/fuel-stock/store/index'

    const store = useFuelStockStore()
    onMounted(() => {
        initFlowbite()
    })
</script>

<style lang="scss" scoped></style>
