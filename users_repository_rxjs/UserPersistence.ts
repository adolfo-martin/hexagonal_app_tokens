import { UuidGenerator } from '../../../utilities/UuidGenerator'
import { UserDto } from './UserDto'
import { of, Observable, EMPTY, iif } from 'rxjs'
import { tap, delay, switchMap } from 'rxjs/operators'

export class UserPersistence {
    private static _users: UserDto[] = UserPersistence._setup()

    private static _setup(): UserDto[] {
        UserPersistence._users = []

        const user1 = new UserDto(UuidGenerator.generate(), 'adolfo', 'Adolfo1234')
        UserPersistence._users.push(user1)

        const user2 = new UserDto(UuidGenerator.generate(), 'maria', 'Maria1234')
        UserPersistence._users.push(user2)

        return UserPersistence._users
    }

    static storeUser$(user: UserDto): Observable<undefined> {
        return EMPTY.pipe(
            tap(_ => UserPersistence._users.push(user)),
            delay(1000)
        )
    }

    static retrieveUserByUuid$(uuid: string): Observable<UserDto | undefined> {
        return of(UserPersistence._users
            .filter((user: UserDto) => user.uuid === uuid)
        ).pipe(
            switchMap(
                users => iif(
                    () => users.length === 0,
                    EMPTY,
                    of(users[0])
                )
            )
        )
    }

    static retrieveAllUsers$(): Observable<UserDto[]> {
        return of(UserPersistence._users).pipe(
            delay(1000)
        )
    }
}