import { UserPersistenceError, UserPersistenceInterface } from './domain/users_authorizacion/driven_ports/UserPersistence'
import { QueryBusError, QueryBusInterface } from './application/common/queries/QueryBusInterface'
import { SynchronousQueryBusFactory } from './infraestructure/buses/SynchronousQueryBus'
import { UserPersistenceAdapter } from './infraestructure/repositories/users/users_repository_array/UserPersistenceAdapter'
import { GetAllUsersQuery, GetAllUsersQueryHandler } from './application/users_authorization/queries/GetAllUsersQuery'
import { User } from './domain/users_authorizacion/entities/User'
import { GetUserByUuidQuery, GetUserByUuidQueryHandler } from './application/users_authorization/queries/GetUserByUuidQuery'
import { CreateUserCommand, CreateUserCommandHandler } from './application/users_authorization/commands/CreateUserCommand'
import { UuidGenerator } from './infraestructure/utilities/UuidGenerator'
import { CommandBusError, CommandBusInterface } from './application/common/commands/CommandBusInterface'
import { SynchronousCommandBusFactory } from './infraestructure/buses/SynchronousCommandBus'
import { UserRestWebService } from './infraestructure/presentations/users/users_presentation_rest/UserPresentationRest'
import { UserServiceInterface } from './domain/users_authorizacion/driving_ports/UserService'
import { UserService } from './application/users_authorization/services/UserService'
import { OpenAdministratorSessionCommand, OpenAdministratorSessionCommandHandler } from './application/users_authorization/commands/OpenAdministratorSessionCommand'
import { OpenUserSessionCommand, OpenUserSessionCommandHandler } from './application/users_authorization/commands/OpenUserSessionCommand'

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