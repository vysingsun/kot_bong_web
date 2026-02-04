export interface IUser {
    _id: string
    email: string
    firstName: string
    lastName: string
    role_id: string
    stations?: []
    createdAt?: string
    updatedAt?: string
}

export interface Company {
    _id: string
    name: string
    image: string
    needsUpdate: boolean
}

export const COMPANIES: Company[] = [
    {
        _id: 'tela',
        name: 'Tela',
        image: 'https://domnor.com/admin/images/shop/2021-09-04-14-23-29_1.jpg?v=1',
        needsUpdate: false,
    },
    {
        _id: 'bvm',
        name: 'BVM_Petroleum',
        image: 'https://www.bvmpetroleum.com/wp-content/uploads/2024/07/BVM-Logo_Primary.png',
        needsUpdate: true,
    },
    {
        _id: 'total',
        name: 'Total_Energies',
        image: 'https://images.seeklogo.com/logo-png/40/2/totalenergies-logo-png_seeklogo-405344.png',
        needsUpdate: true,
    },
]
