import { UserPersistenceError, UserPersistenceInterface } from '../../../domain/users_authorizacion/driven_ports/UserPersistence'
import { User } from '../../../domain/users_authorizacion/entities/User'
import { QueryBusError } from '../../common/queries/QueryBusInterface'
import { QueryAbstract, QueryHandlerInterface } from '../../common/queries/Query'

export class GetAllUsersQuery extends QueryAbstract {
    public constructor() {
        super('GetAllUsersQuery')
    }
}

export class GetAllUsersQueryHandler implements QueryHandlerInterface {
    public constructor(private _userPersistence: UserPersistenceInterface) {}

    public async handle(query: GetAllUsersQuery): Promise<User[]> {
        if (!(query instanceof GetAllUsersQuery)) {
            throw new QueryBusError('GetAllUsersQueryHandler can only execute GetAllUsersQuery')
        }

        try {
            const users = await this._userPersistence.retrieveAllUsers()
            return users
        } catch (error) {
            if (error instanceof UserPersistenceError) {
                throw new QueryBusError(error.message)
            }
            throw error
        }
    }
}