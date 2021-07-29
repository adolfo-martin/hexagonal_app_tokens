import { CommandAbstract, CommandHandlerInterface, CommandInterface } from '../../common/commands/Command'
import { CommandBusError } from '../../common/commands/CommandBusInterface'
import { UserPersistenceInterface, UserPersistenceError } from '../ports/UserPersistence'

export class OpenUserSessionCommand extends CommandAbstract {
    constructor(
        public readonly login: string,
        public readonly password: string,
    ) {
        super('OpenUserSessionCommand')
    }
}

export class OpenUserSessionCommandHandler implements CommandHandlerInterface {

    public constructor(private readonly _userPersistence: UserPersistenceInterface) { }

    public async handle(command: CommandInterface): Promise<void> {
        if (!(command instanceof OpenUserSessionCommand)) {
            throw new CommandBusError('OpenUserSessionCommandHandler can only execute OpenUserSessionCommand')
        }

        const { login, password } = command

        if (!login || !password) {
            throw new CommandBusError('OpenUserSessionCommandHandler: login or password is missing')
        }

        try {
            const user = await this._userPersistence.retrieveUserByLoginAndPassword(login, password)
            if (!user) {
                throw new CommandBusError('OpenUserSessionCommandHandler: argument login or password is wrong')
            }

            return
        } catch (error) {
            if (error instanceof UserPersistenceError) {
                throw new CommandBusError(error.message)
            }
            throw error
        }
    }
}