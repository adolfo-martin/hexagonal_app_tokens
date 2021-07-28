export interface QueryInterface {
    className: string
}

export abstract class QueryAbstract implements QueryInterface {
    constructor(public readonly className: string) {}
}

export interface QueryHandlerInterface {
    handle(query: QueryInterface): Promise<any>
}