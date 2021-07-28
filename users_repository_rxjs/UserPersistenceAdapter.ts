import { lastValueFrom } from 'rxjs'
import { UserPersistenceInterface } from '../../../../domain/users_authorizacion/driven_ports/UserPersistence'
import { User } from '../../../../domain/users_authorizacion/entities/User'
import { UserDto } from './UserDto'
import { UserPersistence } from './UserPersistence'

export class UserPersistenceAdapter implements UserPersistenceInterface {
    public async storeUser(uuid: string, login: string, password: string): Promise<undefined> {
        const userDto = new UserDto(uuid, login, password)
        const promise = lastValueFrom(UserPersistence.storeUser$(userDto))
        return promise
    }

    public async retrieveAllUsers(): Promise<User[]> {
        const usersDto = await lastValueFrom(UserPersistence.retrieveAllUsers$())
        const users = usersDto.map(userDto => new User(userDto.uuid, userDto.login, userDto.password))
        return users
    }

    public async retrieveUserByUuid(uuid: string): Promise<User | undefined> {
        const userDto = await lastValueFrom(UserPersistence.retrieveUserByUuid$(uuid))
        if (!userDto)
            return 
        const user = new User(userDto.uuid, userDto.login, userDto.password)
        return user
    }

}