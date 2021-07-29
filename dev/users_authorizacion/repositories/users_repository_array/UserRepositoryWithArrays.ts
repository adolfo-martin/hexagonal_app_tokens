import { UuidGenerator } from "../../../common/utilities/UuidGenerator"

export class UserDto {
    constructor(
        public readonly uuid: string,
        public readonly login: string,
        public readonly password: string,
        public readonly type: string) {
    }
}

export class UserRepositoryWithArrays {
    private static _users: UserDto[] = UserRepositoryWithArrays._setupUsers()

    private static _setupUsers() {
        const users = []

        const user1 = new UserDto(UuidGenerator.generate(), 'juan.canales', 'Hola1234', 'administrator')
        users.push(user1)

        const user2 = new UserDto(UuidGenerator.generate(), 'julia.ochoa', 'Hola1234', 'user')
        users.push(user2)

        return users
    }

    static async storeUser(user: UserDto): Promise<undefined> {
        UserRepositoryWithArrays._users.push(user)
        return
    }

    static async retrieveUserByUuid(uuid: string): Promise<UserDto | undefined> {
        const theUser = UserRepositoryWithArrays._users
            .filter((user: UserDto) => user.uuid === uuid)

        if (theUser.length === 0)
            return undefined

        return theUser[0]
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
}