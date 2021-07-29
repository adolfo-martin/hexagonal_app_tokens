import { DomainEventHandlerInterface, DomainEventInterface } from '../events/DomainEvent'
import { DomainEventBusInterface } from '../events/DomainEventBus'

export class SynchronousDomainEventBus implements DomainEventBusInterface {
    private _handlers = new Map<string, DomainEventHandlerInterface[]>()

    public register(eventName: string, handler: DomainEventHandlerInterface): void {
        if (this._handlers.has(eventName))
            this._handlers.get(eventName)?.push(handler)
        else
            this._handlers.set(eventName, [handler])
    }

    public registered(eventName: string): DomainEventHandlerInterface[] {
        if (this._handlers.has(eventName))
            // @ts-ignore: Unreachable code error
            return this._handlers.get(eventName)
        else
            return []
    }

    public dispatch(event: DomainEventInterface): void {
        const eventName = event.name
        const handlers = this.registered(eventName)
        for (const handler of handlers) {
            handler.handle(event)
        }
    }
}