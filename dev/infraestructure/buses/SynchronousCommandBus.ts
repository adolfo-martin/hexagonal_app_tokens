import { CommandHandlerInterface, CommandInterface } from "../../application/common/commands/Command"
import { CommandBusInterface, CommandBusError } from "../../application/common/commands/CommandBusInterface"

class SynchronousCommandBus implements CommandBusInterface {
    private _handlers = new Map<string, CommandHandlerInterface>()

    public register(commandClassName: string, handler: CommandHandlerInterface): void {
        this._handlers.set(commandClassName, handler)
    }

    public async execute(command: CommandInterface): Promise<any> {
        if (!command.className) {
            throw new CommandBusError(`Command class name is needed`)
        }

        if (!this._handlers.has(command.className)) {
            throw new CommandBusError(`Command ${command.className} is not registered`)
        }

        const handler = this._handlers.get(command.className)
        return await handler?.handle(command)
    }
}

export class SynchronousCommandBusFactory {
    private static _commandBus: SynchronousCommandBus

    public static createCommandBus(): SynchronousCommandBus {
        if (!SynchronousCommandBusFactory._commandBus) {
            SynchronousCommandBusFactory._commandBus = new SynchronousCommandBus()
        }

        return SynchronousCommandBusFactory._commandBus
    }
} 