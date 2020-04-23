import socketIO from "socket.io";
import express from "express";
import SocketConstants from "../constants/socket.events.constants";

class SocketIOWrapper {
  private static instance: SocketIOWrapper;

  public static getInstance(): SocketIOWrapper {
    if (!SocketIOWrapper.instance) {
      SocketIOWrapper.instance = new SocketIOWrapper();
    }

    return SocketIOWrapper.instance;
  }

  public connect(app: express.Application): Promise<void> {
    const io = socketIO(app);
    io.on("connection", (socket) => {
      console.log("New socket connection has been established!", socket.id);
      /**
       * @param data {Object}
       * @description - broadcast @param data from backend,
       *  because there may be some cases that the @param data should be processed
       *  and then broadcasted
       */
      socket.on(SocketConstants.FORM_FIELD_CHANGE, (data: Object) => {
        console.log(SocketConstants.FORM_FIELD_CHANGE, data);
        socket.broadcast.emit(SocketConstants.FORM_FIELD_CHANGE, data);
      });

      socket.on(SocketConstants.FORM_FIELD_FINISH_CHANGE, (data: Object) => {
        console.log(SocketConstants.FORM_FIELD_FINISH_CHANGE, data);
        socket.broadcast.emit(SocketConstants.FORM_FIELD_FINISH_CHANGE, data);
      });
    });

    return Promise.resolve();
  }
}

export default SocketIOWrapper;
