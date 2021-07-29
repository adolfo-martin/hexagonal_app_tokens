import { QueryAbstract, QueryHandlerInterface } from '../../common/queries/Query'
import { QueryBusError } from '../../common/queries/QueryBusInterface'
import { UserPersistenceInterface, UserPersistenceError } from '../ports/UserPersistence'
import { User } from '../entities/User'

export class GetUserByUuidQuery extends QueryAbstract {
    public constructor(public uuid: string) {
        super('GetUserByUuidQuery')
    }
}

export class GetUserByUuidQueryHandler implements QueryHandlerInterface {
    public constructor(private _userPersistence: UserPersistenceInterface) { }

    public async handle(query: GetUserByUuidQuery): Promise<User | undefined> {
        if (!(query instanceof GetUserByUuidQuery)) {
            throw new QueryBusError('GetUserByUuidQueryHandler can only execute GetUserByUuidQuery')
        }

        try {
            const user = await this._userPersistence.retrieveUserByUuid(query.uuid)
            return user
        } catch (error) {
            if (error instanceof UserPersistenceError) {
                throw new QueryBusError(error.message)
            }
            throw error
        }
    }
}