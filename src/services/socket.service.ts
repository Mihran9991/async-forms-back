import io from "socket.io";
import jwtAuth from "socketio-jwt-auth";
import get from "lodash/get";

import socketConstants from "../constants/socket.events.constants";
import { JWT_SECRET } from "../configs/auth.config";
import UserService from "./user.service";
import RedisService from "./redis.service";
import FormFieldDto from "../dtos/form.field.dto";

class Socket {
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

      console.log("socket.request", socket.request.user.dataValues);
      const { name, pictureUrl, uuid, email } = get(
        socket,
        "request.user.dataValues",
        ""
      );
      this.redisService.addActiveUser({
        name,
        pictureUrl,
        uuid,
        email,
      });
      console.log("New socket connection has been established!", socket.id);
    });

    this.io.on("connect_error", (err: any) => {
      throw `Socket connection error: ${err.message}`;
    });

    this.io.on("disconnect", async (socket: io.Socket) => {
      const { uuid } = get(socket, "request.user.dataValues", "");
      // noinspection ES6MissingAwait
      this.redisService.removeActiveUser(uuid);
    });
  }

  private disableField(socket: io.Socket): void {
    socket.on(socketConstants.START_FORM_FIELD_CHANGE, (data: FormFieldDto) => {
      console.log(socketConstants.START_FORM_FIELD_CHANGE, data);
      this.redisService
        .isFieldLocked(data)
        .then((isLocked) => {
          if (!isLocked) {
            this.redisService.lockField(data);
            socket.broadcast.emit(socketConstants.DISABLE_FORM_FIELD, data);
          }
        })
        .catch(() => {
          throw `Error during field lock operation: ${data.fieldName}`;
        });
    });
  }

  private enableField(socket: io.Socket): void {
    socket.on(
      socketConstants.FINISH_FORM_FIELD_CHANGE,
      (data: FormFieldDto) => {
        console.log(socketConstants.FINISH_FORM_FIELD_CHANGE, data);
        this.redisService
          .isFieldLocked(data)
          .then((isLocked) => {
            if (isLocked) {
              this.redisService.unLockField(data);
              socket.broadcast.emit(socketConstants.ENABLE_FORM_FIELD, data);

              if (data.value) {
                socket.broadcast.emit(socketConstants.UPDATE_FORM_FIELD, data);
              }
            }
          })
          .catch(() => {
            throw `Error during field lock operation: ${data.fieldName}`;
          });
      }
    );
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
