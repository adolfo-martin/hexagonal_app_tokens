import { CommandAbstract, CommandHandlerInterface, CommandInterface } from '../../common/commands/Command'
import { CommandBusError } from '../../common/commands/CommandBusInterface'
import { UserPersistenceInterface, UserPersistenceError } from '../ports/UserPersistence'

export class OpenAdministratorSessionCommand extends CommandAbstract {
    constructor(
        public readonly login: string,
        public readonly password: string,
    ) {
        super('OpenAdministratorSessionCommand')
    }
}

export class OpenAdministratorSessionCommandHandler implements CommandHandlerInterface {

    public constructor(private readonly _userPersistence: UserPersistenceInterface) { }

    public async handle(command: CommandInterface): Promise<void> {
        if (!(command instanceof OpenAdministratorSessionCommand)) {
            throw new CommandBusError('OpenAdministratorSessionCommandHandler can only execute OpenAdministratorSessionCommand')
        }

        const { login, password } = command

        if (!login || !password) {
            throw new CommandBusError('OpenAdministratorSessionCommand: login or password is missing')
        }

        try {
            const user = await this._userPersistence.retrieveUserByLoginAndPassword(login, password)
            if (!user) {
                throw new CommandBusError('OpenAdministratorSessionCommand: argument login or password is wrong')
            }

            if (!user.isAdministrator()) {
                throw new CommandBusError('OpenAdministratorSessionCommand: the user is not an administrator')
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