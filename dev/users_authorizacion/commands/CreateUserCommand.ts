import { CommandAbstract, CommandHandlerInterface } from '../../common/commands/Command'
import { CommandBusError } from '../../common/commands/CommandBusInterface'
import { UserPersistenceInterface, UserPersistenceError } from '../driven_ports/UserPersistence'

export class CreateUserCommand extends CommandAbstract {
    public constructor(
        public readonly uuid: string,
        public readonly login: string,
        public readonly password: string,
        public readonly type: string
    ) {
        super('CreateUserCommand')
    }
}

export class CreateUserCommandHandler implements CommandHandlerInterface {
    public constructor(private readonly _userPersistence: UserPersistenceInterface) { }

    public async handle(command: CreateUserCommand): Promise<void> {
        if (!(command instanceof CreateUserCommand)) {
            throw new CommandBusError('CreateUserCommandHandler can only execute CreateUserCommand')
        }

        const { uuid, login, password, type } = command

        if (!uuid || !login || !password || !type) {
            throw new CommandBusError('CreateUserCommand: uuid, login, password or type is missing')
        }

        try {
            const user = await this._userPersistence.storeUser(uuid, login, password, type)
            return user
        } catch (error) {
            if (error instanceof UserPersistenceError) {
                throw new CommandBusError(error.message)
            }
            throw error
        }
    }
}