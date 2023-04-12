import { AuthorizedRequest } from "./AuthenticationTypes";

export interface IOpenChallengeData {
    creator: string;
    creatorColor: 0 | 1;
    description: string;
    validityTime: number;
}

export interface ICreateOpenChallengeRequestBody extends AuthorizedRequest {
    creatorColor: 0 | 1;
    description: string;
    validityTime: number;
}
