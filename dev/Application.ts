import { SynchronousCommandBusFactory } from "./common/buses/SynchronousCommandBus"
import { SynchronousQueryBusFactory } from "./common/buses/SynchronousQueryBus"
import { CommandBusInterface } from "./common/commands/CommandBusInterface"
import { QueryBusInterface } from "./common/queries/QueryBusInterface"
import { CreateUserCommand, CreateUserCommandHandler } from "./users_authorizacion/commands/CreateUserCommand"
import { OpenAdministratorSessionCommand, OpenAdministratorSessionCommandHandler } from "./users_authorizacion/commands/OpenAdministratorSessionCommand"
import { OpenUserSessionCommand, OpenUserSessionCommandHandler } from "./users_authorizacion/commands/OpenUserSessionCommand"
import { UserPersistenceInterface } from "./users_authorizacion/ports/UserPersistence"
import { UserServiceInterface } from "./users_authorizacion/ports/UserService"
import { UserRestWebService } from "./users_authorizacion/presentations/users_presentation_rest/UserPresentationRest"
import { GetAllUsersQuery, GetAllUsersQueryHandler } from "./users_authorizacion/queries/GetAllUsersQuery"
import { GetUserByUuidQuery, GetUserByUuidQueryHandler } from "./users_authorizacion/queries/GetUserByUuidQuery"
import { UserPersistenceAdapter } from "./users_authorizacion/repositories/UserPersistenceAdapter"
import { UserService } from "./users_authorizacion/services/UserService"

class Application {

    private constructor(
        private _commandBus: QueryBusInterface,
        private _queryBus: QueryBusInterface,
        private _userPersistence: UserPersistenceInterface,
    ) { }

    public static applicationFactory(
        commandBus: CommandBusInterface,
        queryBus: QueryBusInterface,
        userPersistence: UserPersistenceInterface,
    ) {
        return new Application(commandBus, queryBus, userPersistence)
    }

    public async run() {
        console.log('Application running ...')

        this._queryBus.register(
            GetAllUsersQuery.name,
            new GetAllUsersQueryHandler(this._userPersistence)
        )

        this._queryBus.register(
            GetUserByUuidQuery.name,
            new GetUserByUuidQueryHandler(this._userPersistence)
        )

        this._commandBus.register(
            CreateUserCommand.name,
            new CreateUserCommandHandler(this._userPersistence)
        )

        this._commandBus.register(
            OpenUserSessionCommand.name,
            new OpenUserSessionCommandHandler(this._userPersistence)
        )

        this._commandBus.register(
            OpenAdministratorSessionCommand.name,
            new OpenAdministratorSessionCommandHandler(this._userPersistence)
        )
    }
}

const commandBus: QueryBusInterface = SynchronousCommandBusFactory.createCommandBus()
const queryBus: QueryBusInterface = SynchronousQueryBusFactory.createQueryBus()
const userPersistence: UserPersistenceInterface = new UserPersistenceAdapter()

const userService: UserServiceInterface = new UserService(commandBus, queryBus)
const webServer: UserRestWebService = new UserRestWebService(5000, userService)
webServer.listen()

const app = Application.applicationFactory(commandBus, queryBus, userPersistence)

app.run().then(_ => console.log('Application running ...'))