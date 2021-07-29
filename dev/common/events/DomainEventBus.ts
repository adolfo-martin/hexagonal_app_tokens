import { DomainEventHandlerInterface, DomainEventInterface } from "./DomainEvent"

export interface DomainEventBusInterface {
    register(eventName: string, handler: DomainEventHandlerInterface): void

    registered(eventName: string): DomainEventHandlerInterface[]

    dispatch(event: DomainEventInterface): void
}