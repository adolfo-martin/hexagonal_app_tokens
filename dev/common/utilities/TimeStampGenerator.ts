export class TimeStampGenerator {
    public static generate(): number {
        const timeStamp: number = (Date.now || (() => +new Date))()
        return timeStamp
    }
}