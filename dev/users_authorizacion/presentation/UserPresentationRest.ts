// import bodyParser from 'body-parser'
// @ts-ignore: Unreachable code error
import express from 'express'
// @ts-ignore: Unreachable code error
import cors from 'cors'
import { TokenSessionUtility } from '../../common/utilities/TokenSessionUtility'
import { UuidGenerator } from '../../common/utilities/UuidGenerator'
import { User } from '../entities/User'
import { UserServiceInterface } from '../ports/UserService'



export class UserRestWebService {
    private _app: express.Express
    // @ts-ignore: Unreachable code error
    // private _userService: UserController

    constructor(
        private _port: number,
        private _userService: UserServiceInterface
    ) {
        this._app = this._createExpressServer()
        this._configureValidRoutes()
        this._configureInvalidRoutes()
    }

    private _createExpressServer() {
        const app = express()
        app.use(cors())
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json())
        return app
    }

    private _configureValidRoutes() {
        this._app.get(
            '/api/users',
            this._validateToken.bind(this),
            this._validateAdministratorCredentials.bind(this),
            this._sendUsers.bind(this)
        )

        this._app.get(
            '/api/user/:uuid',
            this._validateToken.bind(this),
            this._validateAdministratorCredentials.bind(this),
            this._sendUser.bind(this)
        )

        this._app.post(
            '/api/user',
            this._validateToken.bind(this),
            this._validateAdministratorCredentials.bind(this),
            this._createUser.bind(this)
        )

        this._app.post(
            '/api/user/authenticate',
            this._openUserSession.bind(this)
        )

        this._app.post(
            '/api/user/authenticate-administrator',
            this._openAdministratorSession.bind(this)
        )
    }

    private _configureInvalidRoutes() {
        this._app.all(
            '*',
            (
                req: express.Request,
                res: express.Response,
                next: express.NextFunction
            ) =>
                res.status(404).send({
                    ok: false,
                    result: 'Please, you have to use our API',
                })
        )
    }

    public listen(): void {
        this._app.listen(this._port, () =>
            console.log(`Server listening on port ${this._port}`)
        )
    }

    private async _sendUsers(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const users: User[] = await this._userService.getAllUsers()
            res.status(200).send({ ok: true, result: { users } })
        } catch (error) {
            res.status(401).send({ ok: false, result: { error: error.message } })
            return
        }
    }

    private async _sendUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const uuid: string = req.params.uuid

            const user = await this._userService.getUserByUuid(uuid)            
            if (!user) {
                res.status(404).send({
                    ok: false,
                    result: { error: `Cannot get user with uuid ${uuid}.` },
                })
                return
            }

            const client = await this._userService.getClientByUuid(user?.clientUuid)
            if (!client) {
                res.status(404).send({
                    ok: false,
                    result: { error: `Cannot get client with uuid ${user.clientUuid}.` },
                })
                return
            }

            res.status(200).send({ ok: true, result: { user, client } })
        } catch (error) {
            res.status(401).send({ ok: false, result: { error: error.message } })
            return
        }
    }

    private async _createUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const login: string = req.body.login
            const password: string = req.body.password
            const type: string = req.body.type
            const firstName: string = req.body['first-name']
            const lastName: string = req.body['last-name']

            const userUuid: string = UuidGenerator.generate()
            const clientUuid: string = UuidGenerator.generate()

            await this._userService.createUser(userUuid, login, password, type, clientUuid, firstName, lastName)
            res.status(201).send({ ok: true, result: { uuid: userUuid } })
        } catch (error) {
            res.status(401).send({ ok: false, result: { error: error.message } })
            return
        }
    }

    private async _openUserSession(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const login: string = req.body.login
        const password: string = req.body.password
        const remoteAddress = req.socket.remoteAddress

        if (!remoteAddress) {
            res.status(401).send({
                ok: false,
                result: { error: 'Cannot get remote access.' },
            })
            return
        }

        const token = TokenSessionUtility.generateToken(login, remoteAddress, 'user')

        try {
            await this._userService.openUserSession(login, password)
            res.status(200).send({ ok: true, result: { token } })
        } catch (error) {
            res.status(401).send({ ok: false, result: { error: error.message } })
            return
        }
    }

    private async _openAdministratorSession(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const login: string = req.body.login
        const password: string = req.body.password
        const remoteAddress = req.socket.remoteAddress
        if (!remoteAddress) {
            res.status(401).send({
                ok: false,
                result: { error: 'Cannot get remote access.' },
            })
            return
        }

        const token = TokenSessionUtility.generateToken(login, remoteAddress, 'administrator')

        try {
            await this._userService.openAdministratorSession(login, password)
            res.status(200).send({ ok: true, result: { token } })
        } catch (error) {
            res.status(401).send({ ok: false, result: { error: error.message } })
            return
        }
    }

    private _validateToken(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            res.status(401).send({
                ok: false,
                result: {
                    error: 'Token is not valid. User must validate again.',
                },
            })
            res.locals.authenticated = false
            return
        }

        const remoteAddress = req.socket.remoteAddress
        if (!remoteAddress) {
            res.status(401).send({
                ok: false,
                result: { error: 'Cannot get remote address.' },
            })
            res.locals.authenticated = false
            return
        }

        if (!TokenSessionUtility.isValidToken(token, remoteAddress)) {
            res.status(401).send({
                ok: false,
                result: {
                    error: 'Token is not valid. User must validate again.',
                },
            })
            res.locals.authenticated = false
            return
        }

        res.locals.authenticated = true
        res.locals.token = token
        next()
    }

    private _validateAdministratorCredentials(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const data = TokenSessionUtility.decodeToken(res.locals.token)

        // @ts-ignore: Unreachable code error
        const userType: string = data.type
        if (userType !== 'administrator') {
            res.status(403).send({
                ok: false,
                result: {
                    error: 'User does not have enough permissions to make the required operation.',
                },
            })
            return
        }

        next()
    }
}