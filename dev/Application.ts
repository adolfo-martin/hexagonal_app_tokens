import { SynchronousCommandBusFactory } from './common/buses/SynchronousCommandBus'
import { SynchronousDomainEventBus } from './common/buses/SynchronousDomainEventBus'
import { SynchronousQueryBusFactory } from './common/buses/SynchronousQueryBus'
import { CommandBusInterface } from './common/commands/CommandBusInterface'
import { DomainEventBusInterface } from './common/events/DomainEventBus'
import { QueryBusInterface } from './common/queries/QueryBusInterface'
import { CreateUserCommand, CreateUserCommandHandler } from './users_authorizacion/commands/CreateUserCommand'
import { OpenAdministratorSessionCommand, OpenAdministratorSessionCommandHandler } from './users_authorizacion/commands/OpenAdministratorSessionCommand'
import { OpenUserSessionCommand, OpenUserSessionCommandHandler } from './users_authorizacion/commands/OpenUserSessionCommand'
import { UserCreatedDomainEvent, UserCreatedDomainEventHandler } from './users_authorizacion/events/UserCreatedDomainEvent'
import { UserPersistenceInterface } from './users_authorizacion/ports/UserPersistence'
import { UserServiceInterface } from './users_authorizacion/ports/UserService'
import { UserRestWebService } from './users_authorizacion/presentation/UserPresentationRest'
import { GetAllUsersQuery, GetAllUsersQueryHandler } from './users_authorizacion/queries/GetAllUsersQuery'
import { GetUserByUuidQuery, GetUserByUuidQueryHandler } from './users_authorizacion/queries/GetUserByUuidQuery'
import { UserPersistenceAdapter } from './users_authorizacion/repositories/UserPersistenceAdapter'
import { UserService } from './users_authorizacion/services/UserService'

class Application {

    private constructor(
        private readonly _commandBus: QueryBusInterface,
        private readonly _queryBus: QueryBusInterface,
        private readonly _userPersistence: UserPersistenceInterface,
        private readonly _domainEventBus: DomainEventBusInterface
    ) { }

    public static applicationFactory(
        commandBus: CommandBusInterface,
        queryBus: QueryBusInterface,
        userPersistence: UserPersistenceInterface,
        domainEventBus: DomainEventBusInterface
    ) {
        return new Application(commandBus, queryBus, userPersistence, domainEventBus)
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
            new CreateUserCommandHandler(this._userPersistence, this._domainEventBus)
        )

        this._commandBus.register(
            OpenUserSessionCommand.name,
            new OpenUserSessionCommandHandler(this._userPersistence)
        )

        this._commandBus.register(
            OpenAdministratorSessionCommand.name,
            new OpenAdministratorSessionCommandHandler(this._userPersistence)
        )

        this._domainEventBus.register(UserCreatedDomainEvent.name, new UserCreatedDomainEventHandler())
    }
}

const userPersistence = new UserPersistenceAdapter()
const commandBus = SynchronousCommandBusFactory.createCommandBus()
const queryBus = SynchronousQueryBusFactory.createQueryBus()
const domainEventBus: DomainEventBusInterface = new SynchronousDomainEventBus()

const userService: UserServiceInterface = new UserService(commandBus, queryBus)
const webServer: UserRestWebService = new UserRestWebService(5000, userService)
webServer.listen()

const app = Application.applicationFactory(commandBus, queryBus, userPersistence, domainEventBus)

app.run().then(_ => console.log('Application running ...'))