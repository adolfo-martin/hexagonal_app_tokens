import { ApplicationEventAbstract } from '../../common/events/ApplicationEvent';
import { User } from '../entities/User';

export class UserSessionItitiatedApplicationEvent extends ApplicationEventAbstract {
    constructor(agregatedId: string, user: User) {
        const data = Object.entries(user)
        super('UserCreatedDomainEvent', agregatedId, data)
    }
}