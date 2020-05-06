import io from "socket.io";
import jwtAuth from "socketio-jwt-auth";

import socketConstants from "../constants/socket.events.constants";
import { ISocketIO } from "../types/main.types";

class Socket implements ISocketIO {
  private io: any;

  constructor(server: any) {
    this.io = io.listen(server);
  }

  public init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.io.on("connection", (socket: io.Socket) => {
        console.log("New socket connection has been established!", socket.id);

        this.disableField(socket);
        this.enableField(socket);
        this.deleteTableFieldRow(socket);

        return resolve();
      });

      this.io.on("connect_error", (err: any) => {
        return reject(err);
      });
    });
  }

  private deleteTableFieldRow(socket: io.Socket) {}

  private disableField(socket: io.Socket) {
    socket.on(socketConstants.START_FORM_FIELD_CHANGE, (data: Object) => {
      console.log(socketConstants.START_FORM_FIELD_CHANGE, data);

      socket.broadcast.emit(socketConstants.DISABLE_FORM_FIELD, data);
    });
  }

  private enableField(socket: io.Socket) {
    socket.on(socketConstants.FINISH_FORM_FIELD_CHANGE, (data: Object) => {
      console.log(socketConstants.FINISH_FORM_FIELD_CHANGE, data);

      socket.broadcast.emit(socketConstants.ENABLE_FORM_FIELD, data);
    });
  }

  private deleteField(socket: io.Socket) {
    socket.on(socketConstants.DELETE_FORM_FIELD, (data: object) => {
      console.log(socketConstants.DELETE_FORM_FIELD, data);

      socket.broadcast.emit(socketConstants.DELETE_FORM_FIELD, data);
    });
  }
}

export default Socket;
