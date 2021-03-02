export default interface User 
{
    userName: string,
    displayName: string,
    token: string,
    email: string,
    image?: string
}

export interface UserFormValues
{
    email: string,
    password: string,
    displayName?: string,
    userName?: string
}