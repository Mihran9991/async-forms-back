import io from "socket.io";
import jwtAuth from "socketio-jwt-auth";

import socketConstants from "../constants/socket.events.constants";
import { ISocketIO } from "../types/main.types";
import { JWT_SECRET } from "../configs/auth.config";
import UserService from "./user.service";
import RedisService from "./redis.service";

class Socket implements ISocketIO {
  private io: any;
  private userService: UserService;
  private redisService: RedisService = new RedisService();

  public constructor(server: any, userService: UserService) {
    this.io = io.listen(server);
    this.userService = userService;
    this.authenticateSocket();
  }

  public init(): void {
    this.redisService.init();

    this.io.on("connection", (socket: io.Socket) => {
      this.disableField(socket);
      this.enableField(socket);

      console.log("New socket connection has been established!", socket.id);
    });

    this.io.on("connect_error", (err: any) => {
      console.log("Socket connection error", err);
    });
  }

  private disableField(socket: io.Socket): void {
    socket.on(socketConstants.START_FORM_FIELD_CHANGE, (data: Object) => {
      console.log(socketConstants.START_FORM_FIELD_CHANGE, data);
      //TODO:: check, if the field has owner in the redis

      socket.broadcast.emit(socketConstants.DISABLE_FORM_FIELD, data);
    });
  }

  private enableField(socket: io.Socket): void {
    socket.on(socketConstants.FINISH_FORM_FIELD_CHANGE, (data: Object) => {
      console.log(socketConstants.FINISH_FORM_FIELD_CHANGE, data);
      socket.broadcast.emit(socketConstants.ENABLE_FORM_FIELD, data);
    });
  }

  private authenticateSocket(): void {
    this.io.use(
      jwtAuth.authenticate(
        {
          secret: JWT_SECRET,
          algorithm: "HS256",
        },
        (payload, done) => {
          this.userService
            .findByUUID(payload.userId)
            .then((user) => {
              if (!user) {
                return done(null, false, "User does not exist");
              }

              return done(null, user);
            })
            .catch((err) => {
              return done(err);
            });
        }
      )
    );
  }
}

export default Socket;
