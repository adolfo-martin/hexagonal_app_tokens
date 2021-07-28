import { CommandHandlerInterface, CommandInterface } from "./Command"

export interface CommandBusInterface {
    register(commandClassName: string, handler: CommandHandlerInterface): void
    execute(command: CommandInterface): Promise<any>
}

export class CommandBusError extends Error {
    public constructor(message: string) {
        super(message)
        this.name = 'CommandBusError'
    }
}