import { TimeStampGenerator } from '../../../infraestructure/utilities/TimeStampGenerator'

export interface DomainEventInterface {
    name: string
    timeStamp: number
    agregateId: string
    data: [string, any][]
}
export abstract class DomainEventAbstract implements DomainEventInterface {
    public readonly timeStamp: number

    public constructor(
        public readonly name: string,
        public readonly agregateId: string,
        public readonly data: [string, any][]
    ) {
        this.timeStamp = TimeStampGenerator.generate()
    }
}

export interface DomainEventHandlerInterface {
    handle(event: DomainEventInterface): Promise<void>
}