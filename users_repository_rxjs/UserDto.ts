export class UserDto {
    constructor(
        private _uuid: string,
        private _login: string,
        private _password: string) {
    }

    get uuid(): string {
        return this._uuid
    }

    get login(): string {
        return this._login
    }

    get password(): string {
        return this._password
    }

    private _isStrongPassword(password: string): boolean {
        return password.length >= 8
    }

    public isRightPassword(password: string): boolean {
        return this._password.localeCompare(password) === 0
    }
}