import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();

import app from "./app";
import {
    createChallenge,
    findGameStateWithUsername,
    finishGame,
    getGameState,
    moveMade,
    sendChallenge,
} from "./websokets/challenge";
import { connect, debug, disconnect } from "./websokets/connection";
import {
    IChallengeData,
    IGameData,
    IGameFinish,
    IMoveMade,
} from "./types/websocket";
import { removeOutdatedChallengesFromDatabase } from "./models/challenges/remove-outdated-challenges";
import OpenChallengeModel from "./models/challenges/openChallenge";
import { getSocketIdFromUsername } from "./websokets/global";
import { removeOpenChallengeById } from "./models/challenges/remove-challenge-by-id";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
    console.log(PORT);
});

// Socket io
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    socket.join(socket.id);

    // Connect user to socket
    socket.on("connect-user", (data, callback) => {
        console.log(data);
        const hasConnected = connect(
            socket.id,
            data.userId,
            data.username,
            data.email
        );

        if (callback) callback(hasConnected);
        debug();
    });

    // When a player makes a challenge
    socket.on("challenge-sent", (data: IChallengeData, callback) => {
        // console.log(data);
        const hasSentChallenge = sendChallenge(data, io);
        if (callback) callback(hasSentChallenge);
        // console.log(data);
    });

    // When player accepts challenge
    socket.on("challenge-accepted", (data: IGameData) => {
        createChallenge(data, io);
    });

    // When player accepts open challeng
    socket.on(
        "open-challenge-accepted",
        async (data: { gameData: IGameData; id: string }, callback) => {
            try {
                await removeOutdatedChallengesFromDatabase();

                // Check if players are online and challenge is present in database
                if (
                    getSocketIdFromUsername(data.gameData.black) === "" ||
                    getSocketIdFromUsername(data.gameData.white) === "" ||
                    !(await OpenChallengeModel.findById(data.id))
                ) {
                    if (callback) {
                        callback(false);
                    }
                    return;
                }

                createChallenge(data.gameData, io);
                removeOpenChallengeById(data.id);
            } catch (error) {
                if (callback) callback(false);
            }
        }
    );

    // Check if user is in a room,
    socket.on("check-user-in-game", (data, callback) => {
        callback(findGameStateWithUsername(data.username));
    });

    // When player makes a move
    socket.on("move-made", (data: IMoveMade, callback) => {
        console.log(data);
        const hasMadeMove = moveMade(data, io);
        if (callback) callback(hasMadeMove);
    });

    // When game finishes
    socket.on("game-finish", (data: IGameFinish) => {
        console.log(data);
        finishGame(data, io);
    });

    // Disconnect user
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
        disconnect(socket.id);
        debug();
    });
});
