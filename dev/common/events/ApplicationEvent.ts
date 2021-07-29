import { TimeStampGenerator } from "../utilities/TimeStampGenerator"

export interface ApplicationEventInterface {
    name: string
    timeStamp: number
    agregateId: string
    data: [string, any][]
}
export abstract class ApplicationEventAbstract implements ApplicationEventInterface {
    public readonly timeStamp: number

    public constructor(
        public readonly name: string,
        public readonly agregateId: string,
        public readonly data: [string, any][]
    ) {
        this.timeStamp = TimeStampGenerator.generate()
    }
}

export interface ApplicationEventHandlerInterface {
    handle(event: ApplicationEventInterface): Promise<void>
}