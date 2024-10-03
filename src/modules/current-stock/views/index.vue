<template>
  <BaseLoading v-if="loading" />
  <div v-for="(item, index) in fuelStocks" :key="item?._id"
    class="w-full flex px-2.5 mb-5 justify-between max-w-sm bg-white border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700">
    <div class="w-[120px] bg-inherit pb-4" :id="'radial-chart-do-' + index"></div>
    <div class="flex items-center mr-3">
      <div
        class="text-xs font-semibold text-black bg-gray-300 bg-opacity-30 backdrop-blur-md backdrop-opacity-60 py-3 px-5 rounded-lg">
        Total Stock: {{ item?.current_stock_liter.toFixed(2) }} L
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { initFlowbite } from 'flowbite'
import ApexCharts from 'apexcharts'
import { useCurrentStockStore } from '@/modules/current-stock/store'
import { current_stockService } from '@/modules/current-stock/services/api.service'

const store = useCurrentStockStore()
const fuelStocks = ref<any[]>([])
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  initFlowbite()
  const response = await current_stockService.getAll()
  const result = response?.data

  fuelStocks.value = result?.data
  
  await nextTick()
  loading.value = false
  fuelStocks.value.forEach((item: any, index: number) => {
    const chartElementId = `#radial-chart-do-${index}`
    const current_stock_as_percent = (100 * item.current_stock_liter) / 5000
    const colors = ['#1C64F2', '#2e7d32', '#faca15']
    const color = colors[index % colors.length]
    if (document.querySelector(chartElementId)) {
      const chart = new ApexCharts(document.querySelector(chartElementId), store.getChartOptions(current_stock_as_percent, item.fuel_id.fuel_name, color))
      chart.render()
    }
  })
})
</script>

<style lang="scss" scoped></style>