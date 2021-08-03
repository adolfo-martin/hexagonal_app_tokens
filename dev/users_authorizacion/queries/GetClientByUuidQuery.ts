import { QueryAbstract, QueryHandlerInterface } from '../../common/queries/Query'
import { QueryBusError } from '../../common/queries/QueryBusInterface'
import { UserPersistenceInterface, UserPersistenceError } from '../ports/UserPersistence'
import { Client } from '../entities/Client'

export class GetClientByUuidQuery extends QueryAbstract {
    public constructor(public uuid: string) {
        super('GetClientByUuidQuery')
    }
}

export class GetClientByUuidQueryHandler implements QueryHandlerInterface {
    public constructor(private _clientPersistence: UserPersistenceInterface) { }

    public async handle(query: GetClientByUuidQuery): Promise<Client | undefined> {
        if (!(query instanceof GetClientByUuidQuery)) {
            throw new QueryBusError('GetClientByUuidQueryHandler can only execute GetClientByUuidQuery')
        }

        try {
            const client = await this._clientPersistence.retrieveClientByUuid(query.uuid)
            return client
        } catch (error) {
            if (error instanceof UserPersistenceError) {
                throw new QueryBusError(error.message)
            }
            throw error
        }
    }
}