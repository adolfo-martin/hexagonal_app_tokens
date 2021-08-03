import { Client } from "../entities/Client";
import { User } from "../entities/User";

export interface UserServiceInterface {
    getAllUsers(): Promise<User[]>
    getUserByUuid(id: string): Promise<User | undefined>
    getClientByUuid(id: string): Promise<Client | undefined>
    createUser(userUuid: string, login: string, password: string, type: string, clientUuid: string, firstName: string, lastName: string): Promise<void>
    openUserSession(login: string, password: string): Promise<string>
    openAdministratorSession(login: string, password: string): Promise<string>
}