import { Client } from '../entities/Client'
import { User } from '../entities/User'

export interface UserPersistenceInterface {
    storeUser(userUuid: string, login: string, password: string, type: string): Promise<void>

    retrieveAllUsers(): Promise<User[]>

    retrieveUserByUuid(uuid: string): Promise<User | undefined>

    retrieveUserByLoginAndPassword(login: string, password: string): Promise<User | undefined>

    storeClient(clientUuid: string, firstName: string, lastName: string, userUuid: string): Promise<void>

    retrieveAllClients(): Promise<Client[]>

    retrieveClientByUuid(uuid: string): Promise<Client | undefined>

    retrieveClientByLoginAndPassword(login: string, password: string): Promise<Client | undefined>
}

export class UserPersistenceError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserPersistenceError'
    }
}