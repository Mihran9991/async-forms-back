import express from 'express';
import SocketIO from "./services/socketIo";
import { Sequelize } from 'sequelize-typescript';
import bodyParser from "body-parser";
import { AuthRouter } from "./routers/auth.router";
import { UserRouter } from "./routers/user.router";
import User from "./entities/user";
import UserRepository from './repositories/user.repository';
import UserService from './services/user.service';
import { AuthService } from './services/auth.service';
import * as APP_CONFIG from "./constants/app.constants";
import * as DB_CONFIG from "./constants/db.constants";
import ForgotRequest from "./entities/forgot.request";

const router = express.Router();

class App {
    private app: express.Application;
    private server: any;
    private sequelize: Sequelize;
    private authRouter: AuthRouter;
    private userRouter: UserRouter;
    private authService: AuthService;
    private userService: UserService;
    private userRepository: UserRepository;

    constructor() {
        this.initApp();
        this.initSequelize();
        this.initRepos();
        this.initServices();
        this.initRouters();
    }

    public initApp() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    public initSequelize() {
        console.log("Initiating sequelize...");
        this.sequelize = new Sequelize({
            host: DB_CONFIG.HOST,
            dialect: DB_CONFIG.DIALECT,
            username: DB_CONFIG.USERNAME,
            password: DB_CONFIG.PASSWORD,
            database: DB_CONFIG.DATABASE,
        });
        this.sequelize.addModels([User, ForgotRequest]);
        this.sequelize.sync();
        console.log("Sequelize initiated successfully");
    }

    public initRepos() {
        console.log("Initiating repositories...");
        this.userRepository = new UserRepository(this.sequelize.getRepository(User));
        console.log("Repositories initiated successfully");
    }

    public initServices() {
        console.log("Initiating services...");
        this.userService = new UserService(this.userRepository);
        this.authService = new AuthService(this.userService);
        console.log("Services initiated successfully");
    }

    public initRouters() {
        console.log("Initiating routers...");
        this.authRouter = new AuthRouter(router, this.authService);
        this.userRouter = new UserRouter(router, this.userService);
        this.app.use("/", router);
        console.log("Routers initiated successfully");
    }

    public async start() {
        console.log(`Initiating server, starting app on port ${APP_CONFIG.PORT}...`);
        this.server = this.app.listen(APP_CONFIG.PORT);
        console.log(`Server initiated successfully`);
        console.log(`Connecting sequelize to server...`);
        await SocketIO.getInstance().connect(this.server);
        console.log("Sequelize connected successfully");
        console.log(`App successfully started on port ${APP_CONFIG.PORT}`);
    }
}

new App().start();