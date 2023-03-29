import { IGameData } from "./types";

export const socketIdToUserId = new Map<
    string,
    { userId: string; username: string; email: string }
>();

export const rooms = new Map<string, IGameData>();

export const getSocketIdFromUsername = (username: string): string => {
    let socketId = "";
    socketIdToUserId.forEach(({ username: _username }, key) => {
        if (_username === username) socketId = key;
    });
    return socketId;
};

export const getUsernameFromEmail = (email: string): string => {
    let username = "";
    socketIdToUserId.forEach(({ username: _username, email: _email }) => {
        if (_email == email) username = _username;
    });
    return username;
};

export const getUserIdFromUsername = (username: string): string => {
    let userId = "";
    socketIdToUserId.forEach(({ username: _username, userId: _userId }) => {
        if (username == _username) userId = _userId;
    });
    return userId;
};

export const getRoomFromUsername = (username: string): string => {
    let roomId = "";
    rooms.forEach(({ white, black }, _roomId) => {
        if (white == username || black == username) roomId = _roomId;
    });
    return roomId;
};
