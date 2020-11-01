require("dotenv").config();

export interface Config {
    port: number;
}

export const defaultConfig: Config = {
    port: 3000
};

export const config: Config = {
    port: (process.env.PORT as number | undefined) || defaultConfig.port
};
