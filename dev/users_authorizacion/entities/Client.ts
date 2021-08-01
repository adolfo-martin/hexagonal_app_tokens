export class Client {
    constructor(
        public readonly uuid: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly userUuid: string,
    ) {}
}