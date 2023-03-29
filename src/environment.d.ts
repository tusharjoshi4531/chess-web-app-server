declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_API_KEY: string;
            PORT: string;
            SECRET_KEY: string
        }
    }
}

export {};
