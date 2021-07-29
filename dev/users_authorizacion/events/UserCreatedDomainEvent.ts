import { DomainEventAbstract, DomainEventHandlerInterface, DomainEventInterface } from "../../common/events/DomainEvent";
import { User } from "../entities/User";

export class UserCreatedDomainEvent extends DomainEventAbstract {
    constructor(agregatedId: string, user: User) {
        const data = Object.entries(user)
        super('UserCreatedDomainEvent', agregatedId, data)
    }
}

export class UserCreatedDomainEventHandler implements DomainEventHandlerInterface {
    public async handle(event: DomainEventInterface): Promise<void> {
        const data = event.data
        console.log(`EVENT. Type: ${event.name}. Data: ${event.data}`)
    }
}