import express from 'express';
import SocketIO from "./services/socketIo";
import { AuthRouter } from "./routers/auth.router";
import { UserRouter } from "./routers/user.router";
import bodyParser from "body-parser";
import { Sequelize } from 'sequelize-typescript';
import User from "./entities/user";
import * as DB_CONFIG from "./constants/db.constants";
import UserRepository from './repositories/user.repository';
import UserService from './services/user.service';
import { AuthService } from './services/auth.service';

const router = express.Router();

class App {
  private app: express.Application = express();
  private server: any = this.app.listen(3000);
  private sequelize: Sequelize = new Sequelize({
    host: DB_CONFIG.HOST,
    dialect: DB_CONFIG.DIALECT,
    username: DB_CONFIG.USERNAME,
    password: DB_CONFIG.PASSWORD,
    database: DB_CONFIG.DATABASE,
  });
  private authRouter: AuthRouter;
  private userRouter: UserRouter;
  private authService: AuthService;
  private userService: UserService;
  private userRepository: UserRepository;

  constructor() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.initSequelize();
    this.initRepos();
    this.initServices();
    this.initRouters();
  }

  public initSequelize() {
    this.sequelize.addModels([User]);
    this.sequelize.sync();
    console.log("inited sequelize");
  }

  public initRepos() {
    this.userRepository = new UserRepository(this.sequelize.getRepository(User));
    console.log("inited repositories");
  }

  public initServices() {
    this.userService = new UserService(this.userRepository);
    this.authService = new AuthService(this.userService);
    console.log("inited services");
  }

  public initRouters() {
    this.authRouter = new AuthRouter(router, this.authService);
    this.userRouter = new UserRouter(router, this.userService);
    this.app.use("/", router);
    console.log("inited routers");
  }

  public async start() {
    console.log("App listening on port 3000!");
    await SocketIO.getInstance().connect(this.server);
    console.log("SocketIO is connected to the app!");
  }
}

new App().start();