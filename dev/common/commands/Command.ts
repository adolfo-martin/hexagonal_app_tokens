export interface CommandInterface {
    className: string
}

export abstract class CommandAbstract implements CommandInterface {
    constructor(public readonly className: string) {}
}

export interface CommandHandlerInterface {
    handle(command: CommandInterface): Promise<any>
}