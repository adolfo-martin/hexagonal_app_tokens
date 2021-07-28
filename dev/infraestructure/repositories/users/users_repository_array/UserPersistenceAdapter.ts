
import { UserPersistenceInterface } from '../../../../domain/users_authorizacion/driven_ports/UserPersistence'
import { User } from '../../../../domain/users_authorizacion/entities/User'
import { UserRepositoryWithArrays, UserDto } from './UserRepositoryWithArrays'

export class UserPersistenceAdapter implements UserPersistenceInterface {
    public async storeUser(uuid: string, login: string, password: string, type: string): Promise<void> {
        const userDto = new UserDto(uuid, login, password, type)
        await UserRepositoryWithArrays.storeUser(userDto)
        return undefined
    }

    public async retrieveAllUsers(): Promise<User[]> {
        const usersDto = await UserRepositoryWithArrays.retrieveAllUsers()
        const users = usersDto.map(userDto => new User(userDto.uuid, userDto.login, userDto.password, userDto.type))
        return users
    }

    public async retrieveUserByUuid(uuid: string): Promise<User | undefined> {
        const userDto = await UserRepositoryWithArrays.retrieveUserByUuid(uuid)
        if (!userDto)
            return 
        const user = new User(userDto.uuid, userDto.login, userDto.password, userDto.type)
        return user
    }

    public async retrieveUserByLoginAndPassword(login: string, password: string): Promise<User | undefined> {
        const userDto = await UserRepositoryWithArrays.retrieveUserByLoginPassword(login, password)
        if (!userDto)
            return
        const user = new User(userDto.uuid, userDto.login, userDto.password, userDto.type)
        return user
    }
}