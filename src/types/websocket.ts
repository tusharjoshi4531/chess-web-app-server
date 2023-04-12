export interface IChallengeData {
    white: string;
    black: string;
    from: string;
    to: string;
}

export interface IGameData extends IChallengeData {
    boardState: string;
}

export interface IGameState {
    oponent: string;
    color: 0 | 1;
    boardState: string;
    roomId: string;
}

export interface IMoveMade {
    roomId: string;
    boardState: string;
}

export interface IGameFinish {
    roomId: string;
    winner: 0 | 1 | 2;
    type:
        | "resign"
        | "threefolds"
        | "insuffecient material"
        | "checkmate"
        | "stalemate";
}
