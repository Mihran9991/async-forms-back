import express from "express";
import SocketIO from "./services/socket.service";
import { Sequelize } from "sequelize-typescript";
import bodyParser from "body-parser";
import cors from "cors";

import AuthRouter from "./routers/auth.router";
import UserRouter from "./routers/user.router";
import FormRouter from "./routers/form.router";
import ForgotPasswordRouter from "./routers/forgot.password.router";

import UserRepository from "./repositories/user.repository";
import FormRepository from "./repositories/form.repository";
import ForgotRequestRepository from "./repositories/forgot.request.repository";

import UserService from "./services/user.service";
import AuthService from "./services/auth.service";
import EmailService from "./services/email.service";
import ForgotRequestService from "./services/forgot.request.service";
import ForgotPasswordService from "./services/forgot.password.service";
import FormService from "./services/form.service";

import User from "./entities/user.entity";
import ForgotRequest from "./entities/forgot.request.entity";

import AppConfig from "./configs/app.config";
import DbConfig from "./configs/db.config";

const router = express.Router();

class App {
  private app: express.Application;
  private server: any;
  private sequelize: Sequelize;

  private authRouter: AuthRouter;
  private userRouter: UserRouter;
  private forgotPasswordRouter: ForgotPasswordRouter;
  private formRouter: FormRouter;

  private authService: AuthService;
  private emailService: EmailService;
  private forgotPasswordService: ForgotPasswordService;
  private userService: UserService;
  private forgotRequestService: ForgotRequestService;
  private formService: FormService;

  private userRepository: UserRepository;
  private forgotRequestRepository: ForgotRequestRepository;
  private formRepository: FormRepository;

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
    this.app.use(cors());
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
    this.userRepository = new UserRepository(
      this.sequelize.getRepository(User)
    );
    this.forgotRequestRepository = new ForgotRequestRepository(
      this.sequelize.getRepository(ForgotRequest)
    );
    console.log("Repositories initiated successfully");
  }

  public initServices() {
    console.log("Initiating services...");
    this.emailService = new EmailService();
    this.userService = new UserService(this.userRepository);
    this.authService = new AuthService(this.userService);
    this.formService = new FormService(this.formRepository);

    this.forgotRequestService = new ForgotRequestService(
      this.forgotRequestRepository,
      this.userService
    );
    this.forgotPasswordService = new ForgotPasswordService(
      this.forgotRequestService,
      this.userService,
      this.emailService
    );
    console.log("Services initiated successfully");
  }

  public initRouters() {
    console.log("Initiating routers...");
    this.authRouter = new AuthRouter(router, this.authService);
    this.userRouter = new UserRouter(router, this.userService);
    this.formRouter = new FormRouter(router, this.formService);

    this.forgotPasswordRouter = new ForgotPasswordRouter(
      router,
      this.forgotPasswordService
    );
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
