import { defineStore } from 'pinia'
import { ref } from 'vue'
import { staffService } from '@/modules/staff/services/api.service'

class FormData {
    firstName: string = ''
    lastName: string = ''
    phone?: string | null = null
    email?: string | null = null
    role?: string | null = null
    station_id?: string | null = null
    language: string = 'en'
}

export interface IRole {
    _id: string
    role_name: string
    createdAt: string
    updatedAt: string
}

export interface IStaff {
    _id: string
    firstName: string
    lastName: string
    phone?: string
    email?: string
    role: IRole
    stations: string[]
    language: string
    isDeleted: boolean
    deletedAt: string | null
    registerBy: string
    createdAt: string
    updatedAt: string
}

export const useStaffStore = defineStore('staffStore', () => {
    const formData = ref(new FormData())
    const roles = ref<IRole[]>([])

    const headers = ref([
        { text: 'staff.first_name', value: 'firstName' },
        { text: 'staff.last_name', value: 'lastName' },
        { text: 'staff.phone', value: 'phone' },
        { text: 'staff.role', value: 'role.role_name' },
        { text: 'staff.language', value: 'language' },
        { text: 'staff.created_at', value: 'createdAt' },
    ])

    const saveStaff = async () => {
        const res = await staffService.create(formData.value)
        return res.data.success
    }

    const updateStaff = async (id: string) => {
        const res = await staffService.update(id, formData.value)
        return res.data.success
    }

    const deleteStaff = async (id: string) => {
        try {
            const res = await staffService.delete(id)
            return res.data.success
        } catch (error) {
            console.error('Error deleting staff:', error)
            return false
        }
    }

    const readDataFromApi = async (id: any) => {
        const { data } = await staffService.get(id)
        readStaff(data.data)
    }

    const readStaff = ({
        firstName = '',
        lastName = '',
        phone = null,
        email = null,
        role = null,
        station_id = null,
        language = 'en',
    }: Partial<FormData> = {}) => {
        formData.value = {
            firstName,
            lastName,
            phone,
            email,
            role,
            station_id,
            language,
        }
    }

    const resetData = () => {
        formData.value = new FormData()
        roles.value = []
    }

    return {
        formData,
        headers,
        roles,
        saveStaff,
        updateStaff,
        deleteStaff,
        readDataFromApi,
        resetData,
    }
})
