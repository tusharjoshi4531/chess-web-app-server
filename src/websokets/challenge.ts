import { Server } from "socket.io";
import {
    getRoomFromUsername,
    getSocketIdFromUsername,
    getUserIdFromUsername,
    getUsernameFromEmail,
    rooms,
} from "./global";
import {
    IChallengeData,
    IGameData,
    IGameFinish,
    IGameState,
    IMoveMade,
} from "../types/websocket";

export const sendChallenge = (data: IChallengeData, io: Server): boolean => {
    if (data.to.includes("@")) data.to = getUsernameFromEmail(data.to);
    if (data.white.includes("@")) data.white = getUsernameFromEmail(data.white);
    if (data.black.includes("@")) data.black = getUsernameFromEmail(data.black);

    const targetSocketId = getSocketIdFromUsername(data.to);

    if (targetSocketId == "") return false;

    console.log({ targetSocketId });
    io.to(targetSocketId).emit("challenge-receive", data);

    return true;
};

export const getGameState = (
    username: string,
    roomId: string,
    data: IGameData
): IGameState | undefined => {
    const userSocketId = getSocketIdFromUsername(username);

    if (data.white == username)
        return {
            oponent: data.black,
            color: 0,
            boardState: data.boardState,
            roomId,
        };

    if (data.black == username)
        return {
            oponent: data.white,
            color: 1,
            boardState: data.boardState,
            roomId,
        };
};

export const createChallenge = (data: IGameData, io: Server) => {
    const whiteUserId = getUserIdFromUsername(data.white);
    const blackUserId = getUserIdFromUsername(data.black);

    const roomId = `${whiteUserId}${blackUserId}`;

    rooms.set(roomId, data);

    const whiteSocketId = getSocketIdFromUsername(data.white);
    const blackSocketId = getSocketIdFromUsername(data.black);

    const whiteGameState = getGameState(data.white, roomId, data);
    const blackGameState = getGameState(data.black, roomId, data);

    if (!whiteGameState || !blackGameState) return;

    io.to(whiteSocketId).emit("challenge-created", whiteGameState);
    io.to(blackSocketId).emit("challenge-created", blackGameState);
};

export const moveMade = (data: IMoveMade, io: Server): boolean => {
    if (!rooms.has(data.roomId)) return false;

    const gameData = rooms.get(data.roomId)!;
    const { white, black } = gameData;

    const whiteSocketId = getSocketIdFromUsername(white);
    const blackSocketId = getSocketIdFromUsername(black);

    if (whiteSocketId == "" || blackSocketId == "") return false;

    rooms.set(data.roomId, { ...gameData, boardState: data.boardState });

    io.to([whiteSocketId, blackSocketId]).emit("move-made", {
        boardState: data.boardState,
    });

    return true;
};

export const findGameStateWithUsername = (
    username: string
): IGameState | undefined => {
    const roomId = getRoomFromUsername(username);

    if (roomId == "") return undefined;

    const roomData = rooms.get(roomId)!;
    const gameState = getGameState(username, roomId, roomData);

    return gameState;
};

export const finishGame = (data: IGameFinish, io: Server) => {
    if (!rooms.has(data.roomId)) return;

    const { white, black } = rooms.get(data.roomId)!;

    const winner = data.winner === 0 ? white : black;
    const loser = data.winner === 0 ? black : white;

    let message = "";

    if (data.type === "resign") message = `${loser} resigned`;
    else if (data.type === "threefolds")
       message = "Draw by threefold repetition";
    else if (data.type === "stalemate") message = "Draw by stalemate";
    else if (data.type === "insuffecient material")
        message = "Draw by insufficient material";
    else if (data.type === "checkmate")
        message = `${winner} checkmated ${loser}`;
    else message = "unexpected message";

    const winnerSocketId = getSocketIdFromUsername(winner);
    const loserSocketId = getSocketIdFromUsername(loser);

    console.log({ winner, loser, winnerSocketId, loserSocketId });

    rooms.delete(data.roomId);

    io.to([winnerSocketId, loserSocketId]).emit("game-finish", {
        winner: data.winner,
        message,
    });
};
