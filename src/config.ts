require("dotenv").config();

export interface Config {
	port: number;
	database: {
		host: string;
		port: number;
		username: string;
		password: string;
		dbName: string;
	};
}

export const defaultConfig: Config = {
	port: 3000,
	database: {
		host: "localhost",
		port: 5432,
		username: "dev",
		password: "dev",
		dbName: "obama69"
	}
};

export const config: Config = {
	port: (process.env.PORT as number | undefined) || defaultConfig.port,
	database: {
		host: process.env.DATABASE_HOST || defaultConfig.database.host,
		port:
			(process.env.DATABASE_PORT as number | undefined) ||
			defaultConfig.database.port,
		username:
			process.env.DATABASE_USERNAME || defaultConfig.database.username,
		password:
			process.env.DATABASE_PASSWORD || defaultConfig.database.password,
		dbName: process.env.DATABASE_DBNAME || defaultConfig.database.dbName
	}
};
