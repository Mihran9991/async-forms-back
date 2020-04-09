import socketIO from "socket.io";
import express from "express";
import {
  FORM_FIELD_CHANGE,
  FORM_FIELD_FINISH_CHANGE
} from "../constants/socketEvents";

class SocketIOWrapper {
  public static getInstance(): SocketIOWrapper {
    if (!SocketIOWrapper.instance) {
      SocketIOWrapper.instance = new SocketIOWrapper();
    }

    return SocketIOWrapper.instance;
  }

  public connect(app: express.Application): Promise<void> {
    const io = socketIO(app);
    io.on("connection", socket => {
      console.log("New socket connection has been established!", socket.id);
      /**
       * @param data {Object}
       * @description - broadcast @param data from backend,
       *  because there may be some cases that the @param data should be processed
       *  and then broadcasted
       */
      socket.on(FORM_FIELD_CHANGE, (data: Object) => {
        console.log(FORM_FIELD_CHANGE, data);
        socket.broadcast.emit(FORM_FIELD_CHANGE, data);
      });

      socket.on(FORM_FIELD_FINISH_CHANGE, (data: Object) => {
        console.log(FORM_FIELD_FINISH_CHANGE, data);
        socket.broadcast.emit(FORM_FIELD_FINISH_CHANGE, data);
      });
    });

    return Promise.resolve();
  }

  private static instance: SocketIOWrapper;
}

export default SocketIOWrapper;