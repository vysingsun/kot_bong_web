<template>
    <div v-if="isLoading" class="progress w-full mb-1"></div>
    <div class="relative sm:rounded-lg">
        <div v-if="isGlobalSearch" class="pb-4">
            <label for="table-search" class="sr-only">Search</label>
            <div class="relative">
                <div
                    class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none"
                >
                    <svg
                        class="w-5 h-5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </div>
                <input
                    id="table-search"
                    v-model="search"
                    type="text"
                    class="w-full block p-2 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg w-80 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search for items"
                    @input="updateSearch"
                />
            </div>
        </div>
        <div class="w-full overflow-x-auto rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th v-if="columnNo" id="#" scope="col" class="px-6 py-3">#</th>
                        <template v-for="(item, idx) of getHeaders" :key="idx">
                            <th :id="`header-${idx}`" scope="col" class="px-6 py-3">{{ item.text }}</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-if="items?.length == 0"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        <td :colspan="columnNo ? getHeaders?.length + 1 : getHeaders?.length" class="text-center">
                            <span>No matching records found</span>
                        </td>
                    </tr>

                    <tr
                        v-for="(item, ridx) of items"
                        :key="item"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        @click="clickableRow && isRowClickable(item) && onClickRow(item)"
                    >
                        <th v-if="columnNo" scope="row" class="px-6 py-4">{{ getRowNumber(ridx) }}</th>
                        <template v-for="({ align, value, visible, exportOnly }, cidx) of headers" :key="cidx">
                            <td class="px-6 py-4 text-no-wrap">
                                <slot :name="value" :item="item" :search="search || params.search">
                                    <span>
                                        {{ getItem(item, value) ?? '--' }}
                                    </span>
                                </slot>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
        <nav class="flex items-center justify-between pt-6" aria-label="Table navigation">
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                Total Records:
                <span class="font-semibold text-gray-900 dark:text-white">{{ totalRecords }}</span></span
            >
            <select
                id="small"
                v-model="tableParams.page_size"
                class="block w-20 h-[35px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                @change="updatePageSize(tableParams.page_size)"
            >
                <option value="7">7</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="60">60</option>
                <option value="120">120</option>
            </select>
            <ul class="inline-flex items-stretch -space-x-px">
                <li>
                    <button
                        :disabled="disable_btn_decrease_page"
                        class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        @click="updatePageDecrease"
                    >
                        <span class="sr-only">Previous</span>
                        <svg
                            class="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </li>
                <li>
                    <a
                        href="#"
                        class="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >{{ tableParams.page_number }}</a
                    >
                </li>
                <li>
                    <button
                        :disabled="disable_btn_increase_page"
                        class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        @click="updatePageIncrease"
                    >
                        <span class="sr-only">Next</span>
                        <svg
                            class="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, reactive, computed, onBeforeMount } from 'vue'
    import _ from 'lodash'
    import { initFlowbite } from 'flowbite'

    /* emits */
    const emits = defineEmits(['rowClick', 'retrieveResult'])

    /* props */
    const props = defineProps({
        name: String,
        apiService: {
            type: Object,
            required: true,
        },
        getServiceKey: {
            type: String,
            default: 'get',
        },
        headers: {
            type: Array<any>,
            default: [],
        },
        params: {
            type: Object,
            default: {},
        },
        clickableRow: {
            type: Boolean,
            default: false,
        },
        isRowClickable: {
            type: Function,
            default: () => true,
        },
        columnNo: Boolean,
        loadDataOnMount: {
            type: Boolean,
            default: true,
        },
        isGlobalSearch: {
            type: Boolean,
            default: false,
        },
    })
    const disable_btn_decrease_page = ref(true)
    const disable_btn_increase_page = ref(false)
    const totalRecords = ref(0)
    const paginationLength = computed(() => Math.ceil(totalRecords.value / tableParams.page_size))
    const getColSpan = computed(() => (props.columnNo ? getHeaders?.value.length + 1 : getHeaders?.value.length))

    const getHeaders = computed(() => {
        return [...props.headers]
    })

    /* data */
    const isLoading = ref(false)
    const my_key = ref(0)
    const tableParams = reactive({
        page_number: 1,
        page_size: 10,
        search: '',
    })

    const extraParams = ref<any>({})
    const items = ref([])
    const search = ref('')
    /* methods */
    const getItem = (obj: any, key: any) => {
        return _.get(obj, key)
    }

    const getRowNumber = (idx: number) => {
        const idxNum = idx + 1
        if (totalRecords.value > tableParams.page_size && tableParams.page_number > 1) {
            return (tableParams.page_number - 1) * tableParams.page_size + idxNum
        }

        return idxNum
    }

    const getData = async (renew: boolean = false) => {
        if (renew) {
            tableParams.page_number = 1
        }
        items.value = []
        isLoading.value = true
        try {
            const { data } = await props.apiService[props.getServiceKey]({ ...tableParams, ...extraParams.value })
            items.value = data?.data
            totalRecords.value = data?.count ?? data.data?.length
            isLoading.value = false
            emits('retrieveResult', {
                totalRecord: data?.count,
                data: data?.results,
                params: { ...extraParams.value },
                allData: data,
            })
            if (tableParams.page_number >= paginationLength.value) {
                disable_btn_increase_page.value = true
            }
            if (tableParams.page_number > 1) {
                disable_btn_decrease_page.value = false
            }
        } catch (error: any) {
            items.value = []
        }
    }

    const onClickRow = (item: any) => {
        emits('rowClick', item)
    }

    const updateSearch = _.debounce(async () => {
        tableParams.search = search.value
        tableParams.page_number = 1
        getData()
    }, 1000)

    const updatePageSize = async (pageSize: any) => {
        if (pageSize * tableParams.page_number > totalRecords.value) {
            tableParams.page_number = 1
        }

        tableParams.page_size = pageSize
        getData()
    }

    const updatePageDecrease = async () => {
        tableParams.page_number -= 1
        if (tableParams.page_number === 1) {
            disable_btn_decrease_page.value = true
        }
        if (tableParams.page_number <= paginationLength.value) {
            disable_btn_increase_page.value = false
        }
        getData()
    }

    const updatePageIncrease = async () => {
        tableParams.page_number += 1
        if (tableParams.page_number >= paginationLength.value) {
            disable_btn_increase_page.value = true
        }
        if (tableParams.page_number > 1) {
            disable_btn_decrease_page.value = false
        }
        getData()
    }

    onMounted(() => {
        initFlowbite()
        extraParams.value = { ...props.params }
        if (props.loadDataOnMount) {
            getData()
        }
    })
</script>

<style lang="scss" scoped>
    .progress {
        height: 4.5px;
        background: linear-gradient(#faca15 0 0), linear-gradient(#faca15 0 0), #dbdcef;
        background-size: 60% 100%;
        background-repeat: no-repeat;
        animation: progress-7x9cg2 2.4000000000000004s infinite;
    }

    @keyframes progress-7x9cg2 {
        0% {
            background-position:
                -150% 0,
                -150% 0;
        }

        66% {
            background-position:
                250% 0,
                -150% 0;
        }

        100% {
            background-position:
                250% 0,
                250% 0;
        }
    }
</style>
