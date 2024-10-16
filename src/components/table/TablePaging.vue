<template>
    <div class="relative sm:rounded-lg">
        <div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            <div>
                <button
                    id="dropdownRadioButton"
                    data-dropdown-toggle="dropdownRadio"
                    class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    type="button"
                >
                    <svg
                        class="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"
                        />
                    </svg>
                    Last 30 days
                    <svg
                        class="w-2.5 h-2.5 ms-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 4 4 4-4"
                        />
                    </svg>
                </button>
                <!-- Dropdown menu -->
                <div
                    id="dropdownRadio"
                    class="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                    data-popper-reference-hidden=""
                    data-popper-escaped=""
                    data-popper-placement="top"
                    style="
                        position: absolute;
                        inset: auto auto 0px 0px;
                        margin: 0px;
                        transform: translate3d(522.5px, 3847.5px, 0px);
                    "
                >
                    <ul
                        class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownRadioButton"
                    >
                        <li>
                            <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input
                                    id="filter-radio-example-1"
                                    type="radio"
                                    value=""
                                    name="filter-radio"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    for="filter-radio-example-1"
                                    class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                    >Last day</label
                                >
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input
                                    id="filter-radio-example-2"
                                    type="radio"
                                    value=""
                                    name="filter-radio"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    for="filter-radio-example-2"
                                    class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                    >Last 7 days</label
                                >
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input
                                    id="filter-radio-example-3"
                                    type="radio"
                                    value=""
                                    name="filter-radio"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    for="filter-radio-example-3"
                                    class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                    >Last 30 days</label
                                >
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input
                                    id="filter-radio-example-4"
                                    type="radio"
                                    value=""
                                    name="filter-radio"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    for="filter-radio-example-4"
                                    class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                    >Last month</label
                                >
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input
                                    id="filter-radio-example-5"
                                    type="radio"
                                    value=""
                                    name="filter-radio"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    for="filter-radio-example-5"
                                    class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                    >Last year</label
                                >
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
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
                    type="text"
                    id="table-search"
                    class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search for items"
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
                        <span>No matching records found</span>
                    </tr>

                    <tr
                        v-for="(item, ridx) of items"
                        :key="item"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        <td v-if="columnNo" class="px-6 py-4">{{ ridx + 1 }}</td>
                        <template v-for="({ align, value, visible, exportOnly }, cidx) of headers" :key="cidx">
                            <td class="px-6 py-4">
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

    const getColSpan = computed(() => (props.columnNo ? getHeaders?.value.length + 1 : getHeaders?.value.length))

    const getHeaders = computed(() => {
        return [...props.headers]
    })

    /* data */
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

    const getData = async (renew: boolean = false) => {
        if (renew) {
            tableParams.page_number = 1
        }

        try {
            const { data } = await props.apiService[props.getServiceKey]({ ...tableParams, ...extraParams.value })
            items.value = data?.data
            console.log(items.value, 'T')

            emits('retrieveResult', {
                totalRecord: data?.count,
                data: data?.results,
                params: { ...extraParams.value },
                allData: data,
            })
        } catch (error: any) {
            items.value = []
        }
    }

    onMounted(() => {
        initFlowbite()
        if (props.loadDataOnMount) {
            getData()
        }
    })
</script>

<style lang="scss" scoped></style>
