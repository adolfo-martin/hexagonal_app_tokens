import { User } from '../entities/User'

export interface UserPersistenceInterface {
    storeUser(uuid: string, login: string, password: string, type: string): Promise<void>

    retrieveAllUsers(): Promise<User[]>

    retrieveUserByUuid(uuid: string): Promise<User | undefined>

    retrieveUserByLoginAndPassword(login: string, password: string): Promise<User | undefined>
}

export class UserPersistenceError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserPersistenceError'
    }
}