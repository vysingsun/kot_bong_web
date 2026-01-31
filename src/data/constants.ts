export interface IUser {
    _id: string
    username: string
    email: string
    firstName: string
    lastName: string
    role_id: string
    stations?: []
    createdAt?: string
    updatedAt?: string
}
