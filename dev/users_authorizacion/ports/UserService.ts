import { User } from "../entities/User";

export interface UserServiceInterface {
    getAllUsers(): Promise<User[]>
    getUserByUuid(id: string): Promise<User | undefined>
    createUser(id: string, login: string, password: string, type: string): Promise<void>
    openUserSession(login: string, password: string): Promise<string>
    openAdministratorSession(login: string, password: string): Promise<string>
}