import { User } from '../entities/User'
import { UserRepositoryWithArrays, UserDto, ClientDto } from '../../UserRepositoryWithArrays'
import { UserPersistenceError, UserPersistenceInterface } from '../ports/UserPersistence'
import { Client } from '../entities/Client'

export class UserPersistenceAdapter implements UserPersistenceInterface {

    public async storeUser(userUuid: string, login: string, password: string, type: string): Promise<void> {
        const userDto = new UserDto(userUuid, login, password, type)
        await UserRepositoryWithArrays.storeUser(userDto)
        return undefined
    }

    private async convertUserDtoToUser(userDto: UserDto): Promise<User> {
        const clientDto = await UserRepositoryWithArrays.retrieveClientByUserUuid(userDto.uuid)
        if (!clientDto)
            throw new UserPersistenceError(`There is not client associated with user with uuid ${userDto.uuid}`)
        const user = new User(userDto.uuid, userDto.login, userDto.password, userDto.type, clientDto?.uuid)
        return user
    }

    public async retrieveAllUsers(): Promise<User[]> {
        const usersDto = await UserRepositoryWithArrays.retrieveAllUsers()
        const users = usersDto.map(userDto => this.convertUserDtoToUser(userDto))
        return Promise.all(users)
    }

    public async retrieveUserByUuid(uuid: string): Promise<User | undefined> {
        const userDto = await UserRepositoryWithArrays.retrieveUserByUuid(uuid)
        if (!userDto)
            return
        const clientDto = await UserRepositoryWithArrays.retrieveClientByUserUuid(uuid)
        if (!clientDto)
            throw new UserPersistenceError(`There is not client associated with user with uuid ${uuid}`)
        const user = new User(userDto.uuid, userDto.login, userDto.password, userDto.type, clientDto?.uuid)
        return user
    }

    public async retrieveUserByLoginAndPassword(login: string, password: string): Promise<User | undefined> {
        const userDto = await UserRepositoryWithArrays.retrieveUserByLoginPassword(login, password)
        if (!userDto)
            return
        const clientDto = await UserRepositoryWithArrays.retrieveClientByUserUuid(userDto.uuid)
        if (!clientDto)
            throw new UserPersistenceError(`There is not client associated with user with uuid ${userDto.uuid}`)
        const user = new User(userDto.uuid, userDto.login, userDto.password, userDto.type, clientDto?.uuid)
        return user
    }

    public async storeClient(clientUuid: string, firstName: string, lastName: string, userUuid: string): Promise<void> {
        const clientDto = new ClientDto(clientUuid, firstName, lastName, userUuid)
        await UserRepositoryWithArrays.storeClient(clientDto)
        return undefined
    }

    public async retrieveAllClients(): Promise<Client[]> {
        throw new Error('Method not implemented.')
    }

    public async retrieveClientByUuid(uuid: string): Promise<Client | undefined> {
        const clientDto = await UserRepositoryWithArrays.retrieveClientByUuid(uuid)
        if (!clientDto)
            return
        const client = new Client(clientDto.uuid, clientDto.firstName, clientDto.lastName)
        return client
    }

    public async retrieveClientByLoginAndPassword(login: string, password: string): Promise<Client | undefined> {
        throw new Error('Method not implemented.')
    }
}