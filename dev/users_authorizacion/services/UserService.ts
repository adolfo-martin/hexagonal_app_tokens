import { CommandBusInterface } from "../../common/commands/CommandBusInterface";
import { QueryBusInterface } from "../../common/queries/QueryBusInterface";
import { CreateUserCommand } from "../commands/CreateUserCommand";
import { OpenAdministratorSessionCommand } from "../commands/OpenAdministratorSessionCommand";
import { OpenUserSessionCommand } from "../commands/OpenUserSessionCommand";
import { UserServiceInterface } from "../driving_ports/UserService";
import { User } from "../entities/User";
import { GetAllUsersQuery } from "../queries/GetAllUsersQuery";
import { GetUserByUuidQuery } from "../queries/GetUserByUuidQuery";


export class UserService implements UserServiceInterface {
    constructor(
        private _commandBus: CommandBusInterface,
        private _queryBus: QueryBusInterface,
        // private _domainEventDispatcher: DomainEventBusInterface,
    ) { }

    public async getAllUsers(): Promise<User[]> {
        const users: User[] = await this._queryBus.execute(new GetAllUsersQuery())
        return users
    }

    public async getUserByUuid(uuid: string): Promise<User | undefined> {
        const user: User = await this._queryBus.execute(new GetUserByUuidQuery(uuid))
        return user
    }

    public async createUser(uuid: string, login: string, password: string, type: string): Promise<void> {
        await this._commandBus.execute(new CreateUserCommand(uuid, login, password, type))
    }

    public async openUserSession(login: string, password: string): Promise<string> {
        const token: string = await this._commandBus.execute(new OpenUserSessionCommand(login, password))
        return token
    }

    public async openAdministratorSession(login: string, password: string): Promise<string> {
        const token: string = await this._commandBus.execute(new OpenAdministratorSessionCommand(login, password))
        return token
    }
}

export class UserServiceError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UserServiceError'
    }
}