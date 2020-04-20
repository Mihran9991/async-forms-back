import express from 'express';
import SocketIO from "./services/socketIo";
import { Sequelize } from 'sequelize-typescript';
import bodyParser from "body-parser";
import AuthRouter from "./routers/auth.router";
import UserRouter from "./routers/user.router";
import ForgotPasswordRouter from "./routers/forgot.password.router";
import User from "./entities/user";
import UserRepository from './repositories/user.repository';
import UserService from './services/user.service';
import AuthService from './services/auth.service';
import DbConfig from "./configs/db.config";
import ForgotRequest from "./entities/forgot.request";
import ForgotPasswordService from "./services/forgot.password.service";
import ForgotRequestService from "./services/forgot.request.service";
import ForgotRequestRepository from "./repositories/forgot.request.repository";
import EmailService from "./services/email.service";
import AppConfig from "./configs/app.config";

const router = express.Router();

class App {
    private app: express.Application;
    private server: any;
    private sequelize: Sequelize;
    private authRouter: AuthRouter;
    private userRouter: UserRouter;
    private forgotPasswordRouter: ForgotPasswordRouter;
    private authService: AuthService;
    private emailService: EmailService;
    private forgotPasswordService: ForgotPasswordService;
    private userService: UserService;
    private forgotRequestService: ForgotRequestService;
    private userRepository: UserRepository;
    private forgotRequestRepository: ForgotRequestRepository;

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
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    public initSequelize() {
        console.log("Initiating sequelize...");
        this.sequelize = new Sequelize({
            host: DbConfig.HOST,
            dialect: DbConfig.DIALECT,
            username: DbConfig.USERNAME,
            password: DbConfig.PASSWORD,
            database: DbConfig.DATABASE,
        });
        this.sequelize.addModels([User, ForgotRequest]);
        this.sequelize.sync();
        console.log("Sequelize initiated successfully");
    }

    public initRepos() {
        console.log("Initiating repositories...");
        this.userRepository = new UserRepository(this.sequelize.getRepository(User));
        this.forgotRequestRepository = new ForgotRequestRepository(this.sequelize.getRepository(ForgotRequest));
        console.log("Repositories initiated successfully");
    }

    public initServices() {
        console.log("Initiating services...");
        this.emailService = new EmailService();
        this.userService = new UserService(this.userRepository);
        this.authService = new AuthService(this.userService);
        this.forgotRequestService = new ForgotRequestService(this.forgotRequestRepository, this.userService);
        this.forgotPasswordService = new ForgotPasswordService(this.forgotRequestService, this.userService,
            this.emailService);
        console.log("Services initiated successfully");
    }

    public initRouters() {
        console.log("Initiating routers...");
        this.authRouter = new AuthRouter(router, this.authService);
        this.userRouter = new UserRouter(router, this.userService);
        this.forgotPasswordRouter = new ForgotPasswordRouter(router, this.forgotPasswordService);
        this.app.use("/", router);
        console.log("Routers initiated successfully");
    }

    public async start() {
        console.log(`Initiating server, starting app on port ${AppConfig.PORT}...`);
        this.server = this.app.listen(AppConfig.PORT);
        console.log(`Server initiated successfully`);
        console.log(`Connecting sequelize to server...`);
        await SocketIO.getInstance().connect(this.server);
        console.log("Sequelize connected successfully");
        console.log(`App successfully started on port ${AppConfig.PORT}`);
    }
}

new App().start();