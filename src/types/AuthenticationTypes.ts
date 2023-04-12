export interface IUserData {
    username: string;
    email: string;
    password: string;
}

export interface ILoginRequestBody {
    email: string;
    password: string;
}

export interface ISignupRequestBody extends IUserData {}

export interface AuthorizedRequest {
    userData: IUserData;
}


