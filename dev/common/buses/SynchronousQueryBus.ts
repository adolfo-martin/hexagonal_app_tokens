import { QueryHandlerInterface, QueryInterface } from "../queries/Query"
import { QueryBusInterface, QueryBusError } from "../queries/QueryBusInterface"

class SynchronousQueryBus implements QueryBusInterface {
    private _handlers = new Map<string, QueryHandlerInterface>()

    public register(queryClassName: string, handler: QueryHandlerInterface): void {
        this._handlers.set(queryClassName, handler)
    }

    public async execute(query: QueryInterface): Promise<any> {
        if (!query.className) {
            throw new QueryBusError(`Query class name is needed`)
        }

        if (!this._handlers.has(query.className)) {
            throw new QueryBusError(`Query ${query.className} is not registered`)
        }

        const handler = this._handlers.get(query.className)
        return await handler?.handle(query)
    }
}

export class SynchronousQueryBusFactory {
    private static _queryBus: SynchronousQueryBus

    public static createQueryBus(): SynchronousQueryBus {
        if (!SynchronousQueryBusFactory._queryBus) {
            SynchronousQueryBusFactory._queryBus = new SynchronousQueryBus()
        }

        return SynchronousQueryBusFactory._queryBus
    }
}