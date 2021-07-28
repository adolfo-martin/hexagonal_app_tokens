import { QueryHandlerInterface, QueryInterface } from "./Query"

export interface QueryBusInterface {
    register(queryClassName: string, handler: QueryHandlerInterface): void
    execute(query: QueryInterface): Promise<any>
}

export class QueryBusError extends Error {
    public constructor(message: string) {
        super(message)
        this.name = 'QueryBusError'
    }
}