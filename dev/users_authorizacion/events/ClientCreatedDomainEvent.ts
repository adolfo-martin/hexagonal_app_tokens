import { DomainEventAbstract, DomainEventHandlerInterface, DomainEventInterface } from "../../common/events/DomainEvent";
import { Client } from "../entities/Client";

export class ClientCreatedDomainEvent extends DomainEventAbstract {
    constructor(agregatedId: string, client: Client) {
        const data = Object.entries(client)
        super('ClientCreatedDomainEvent', agregatedId, data)
    }
}

export class ClientCreatedDomainEventHandler implements DomainEventHandlerInterface {
    public async handle(event: DomainEventInterface): Promise<void> {
        const data = event.data
        console.log(`EVENT. Type: ${event.name}. Data: ${event.data}`)
    }
}