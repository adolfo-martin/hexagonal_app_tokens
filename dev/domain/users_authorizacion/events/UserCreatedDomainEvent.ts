import { DomainEventAbstract } from "../../common/events/DomainEvent";
import { User } from "../entities/User";

export class UserCreatedDomainEvent extends DomainEventAbstract {
    constructor(agregatedId: string, user: User) {
        const data = Object.entries(user)
        super('UserCreatedDomainEvent', agregatedId, data)
    }
}