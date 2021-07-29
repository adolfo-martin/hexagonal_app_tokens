export class User {
    constructor(
        public readonly uuid: string,
        public readonly login: string,
        public readonly password: string,
        public readonly type: string) {
    }

    private _isStrongPassword(password: string): boolean {
        return password.length >= 8
    }

    public isRightPassword(password: string): boolean {
        return this.password.localeCompare(password) === 0
    }

    public isAdministrator(): boolean {
        return this.type === 'administrator'
    }
}