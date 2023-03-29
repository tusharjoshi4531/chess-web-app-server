import { getSocketIdFromUsername, socketIdToUserId } from "./global";

export const connect = (
    socketId: string,
    userId: string,
    username: string,
    email: string
): boolean => {
    if (getSocketIdFromUsername(username) != "") return false;

    socketIdToUserId.set(socketId, { userId, username, email });

    return true;
};

export const disconnect = (socketId: string) => {
    socketIdToUserId.delete(socketId);
};

export const debug = () => {
    console.log(socketIdToUserId);
};
