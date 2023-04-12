import { IUserData } from "./types/AuthenticationTypes";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_API_KEY: string;
            PORT: string;
            SECRET_KEY: string;
            TEMP_MONGO_URL: string;
        }
    }
}

export {};
