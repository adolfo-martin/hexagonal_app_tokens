import { CommandAbstract, CommandHandlerInterface } from '../../common/commands/Command'
import { CommandBusError } from '../../common/commands/CommandBusInterface'
import { DomainEventBusInterface } from '../../common/events/DomainEventBus'
import { Client } from '../entities/Client'
import { User } from '../entities/User'
import { ClientCreatedDomainEvent } from '../events/ClientCreatedDomainEvent'
import { UserCreatedDomainEvent } from '../events/UserCreatedDomainEvent'
import { UserPersistenceInterface, UserPersistenceError } from '../ports/UserPersistence'

export class CreateUserCommand extends CommandAbstract {
    public constructor(
        public readonly userUuid: string,
        public readonly login: string,
        public readonly password: string,
        public readonly type: string,
        public readonly clientUuid: string,
        public readonly firstName: string,
        public readonly lastName: string,
    ) {
        super('CreateUserCommand')
    }
}

export class CreateUserCommandHandler implements CommandHandlerInterface {
    public constructor(
        private readonly _userPersistence: UserPersistenceInterface,
        private readonly _domainEventBus: DomainEventBusInterface
    ) { }

    public async handle(command: CreateUserCommand): Promise<void> {
        if (!(command instanceof CreateUserCommand)) {
            throw new CommandBusError('CreateUserCommandHandler can only execute CreateUserCommand')
        }

        const { userUuid, login, password, type, clientUuid, firstName, lastName } = command

        if (!userUuid || !login || !password || !type || !clientUuid || !firstName || !lastName) {
            throw new CommandBusError('CreateUserCommand: userUuid, login, password, type, clientUuid, firstName or lastName is missing')
        }

        try {
            await this._userPersistence.storeUser(userUuid, login, password, type)
            await this._userPersistence.storeClient(clientUuid, firstName, lastName, userUuid)
            const user = new User(userUuid, login, password, type, clientUuid)
            const client = new Client(clientUuid, firstName, lastName)
            this._domainEventBus.dispatch(new UserCreatedDomainEvent(user.uuid, user))
            this._domainEventBus.dispatch(new ClientCreatedDomainEvent(user.uuid, client))
            return 
        } catch (error) {
            if (error instanceof UserPersistenceError) {
                throw new CommandBusError(error.message)
            }
            throw error
        }
    }
}