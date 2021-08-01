import { UuidGenerator } from "./common/utilities/UuidGenerator"

export class UserDto {
    constructor(
        public readonly uuid: string,
        public readonly login: string,
        public readonly password: string,
        public readonly type: string) {
    }
}

export class ClientDto {
    constructor(
        public readonly uuid: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly userUuid: string,
    ) {}
}

export class UserRepositoryWithArrays {
    private static _users: UserDto[] = UserRepositoryWithArrays._setupUsers()
    private static _clients: ClientDto[] = UserRepositoryWithArrays._setupClients()

    private _INeedExecuteStaticMethod = UserRepositoryWithArrays._setupUsers()

    private static _setupUsers(): UserDto[] {
        const users: UserDto[] = []
        const user1 = new UserDto(UuidGenerator.generate(), 'juan.ramírez', 'Hola1234', 'administrator')
        users.push(user1)
        
        const user2 = new UserDto(UuidGenerator.generate(), 'luisa.ochoa', 'Hola1234', 'user')
        users.push(user2)

        return users
    }
    
    private static _setupClients(): ClientDto[] {
        const clients: ClientDto[] = []
        const client1 = new ClientDto(UuidGenerator.generate(), 'Juan', 'Ramírez', UserRepositoryWithArrays._users[0].uuid)
        clients.push(client1)
        
        const client2 = new ClientDto(UuidGenerator.generate(), 'Luisa', 'Ochoa', UserRepositoryWithArrays._users[1].uuid)
        clients.push(client2)

        return clients
    }

    static async storeUser(user: UserDto): Promise<undefined> {
        if (await UserRepositoryWithArrays._hasUserWithLogin(user.login)) {
            throw new Error(`There is already an user with login ${user.login}`)
        }
        UserRepositoryWithArrays._users.push(user)
        return
    }

    static async retrieveUserByUuid(uuid: string): Promise<UserDto | undefined> {
        const users = UserRepositoryWithArrays._users
            .filter((user: UserDto) => user.uuid === uuid)

        return users.length === 0 ? undefined : users[0]
    }

    static async retrieveClientByUuid(uuid: string): Promise<ClientDto | undefined> {
        const clients = UserRepositoryWithArrays._clients
            .filter((client: ClientDto) => client.uuid === uuid)

        return clients.length === 0 ? undefined : clients[0]
    }

    static async retrieveAllUsers(): Promise<UserDto[]> {
        return UserRepositoryWithArrays._users
    }

    static async retrieveUserByLoginPassword(login: string, password: string): Promise<UserDto | undefined> {
        const theUser = UserRepositoryWithArrays._users
            .filter((user: UserDto) => user.login === login && user.password === password)

        if (theUser.length === 0)
            return undefined

        return theUser[0]
    }

    private static async _retrieveUserByLogin(login: string): Promise<UserDto | undefined> {
        const theUser = UserRepositoryWithArrays._users
            .filter((user: UserDto) => user.login === login)

        if (theUser.length === 0)
            return undefined

        return theUser[0]
    }

    private static async _hasUserWithLogin(login: string): Promise<boolean> {
        const user = await UserRepositoryWithArrays._retrieveUserByLogin(login)
        return user !== undefined
    }

    static async storeClient(client: ClientDto): Promise<undefined> {
        UserRepositoryWithArrays._clients.push(client)
        return
    }
}