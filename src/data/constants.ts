export interface IUser {
    _id: string
    email: string
    firstName: string
    lastName: string
    role_id: string
    stations?: IStation[]
    createdAt?: string
    updatedAt?: string
}

export interface IStation {
    _id: string
    station_name: string
    owner: string
    users: string[]
    createdAt: string
    updatedAt: string
}

export interface Company {
    _id: string
    name: string
    image: string
    needsUpdate: boolean
}

export const COMPANIES: Company[] = [
    {
        _id: 'kot_preng',
        name: 'Kot_Preng',
        image: new URL('@/assets/images/kotpreng.svg', import.meta.url).href,
        needsUpdate: true,
    },
    {
        _id: 'tela',
        name: 'Tela',
        image: new URL('@/assets/images/tela_logo.png', import.meta.url).href,
        needsUpdate: false,
    },
    {
        _id: 'total_energies',
        name: 'Total_Energies',
        image: new URL('@/assets/images/total_energies_logo.png', import.meta.url).href,
        needsUpdate: true,
    },
    {
        _id: 'caltex',
        name: 'Caltex',
        image: 'https://brandlogos.net/wp-content/uploads/2014/11/caltex_vertical-logo_brandlogos.net_anupq.png',
        needsUpdate: true,
    },
    {
        _id: 'tela_khmer',
        name: 'Tela_Khmer',
        image: new URL('@/assets/images/tela_khmer_logo.png', import.meta.url).href,
        needsUpdate: false,
    },
    {
        _id: 'sokimex',
        name: 'Sokimex',
        image: new URL('@/assets/images/sokimex_logo.png', import.meta.url).href,
        needsUpdate: true,
    },
    {
        _id: 'peace_petroleum',
        name: 'Peace_Petroleum_Cambodia',
        image: new URL('@/assets/images/ppc_logo.png', import.meta.url).href,
        needsUpdate: true,
    },
    {
        _id: 'bvm_petroleum',
        name: 'BVM_Petroleum',
        image: 'https://www.bvmpetroleum.com/wp-content/uploads/2024/07/BVM-Logo_Primary.png',
        needsUpdate: true,
    },
    {
        _id: 'lim_long',
        name: 'Lim_Long_Petroleum',
        image: new URL('@/assets/images/lim_long_logo.jpg', import.meta.url).href,
        needsUpdate: true,
    },
]
