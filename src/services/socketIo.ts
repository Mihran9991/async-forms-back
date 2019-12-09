import socketIO from "socket.io";
import express from 'express';


class SocketIOWrapper {
    public static getInstance(): SocketIOWrapper {
        if (!SocketIOWrapper.instance) {
            SocketIOWrapper.instance = new SocketIOWrapper();
        }

        return SocketIOWrapper.instance;
    }

    public connect(app: express.Application): Promise<void> {
        return new Promise((resolve, reject) => {
            const io = socketIO(app);
            io.on("connection", socket => {
                console.log("New socket connection has been established!");
                // io.on | io.emit
                io.emit("hello", "Priveeeeeeet!");
            });

            return resolve();
        })
    }
 
    private static instance: SocketIOWrapper;
}

export default SocketIOWrapper;