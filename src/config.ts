require("dotenv").config();

export interface Config {
	server: {
		hostname: string;
		port: number;
	};
	database: {
		host: string;
		port: number;
		username: string;
		password: string;
		dbName: string;
	};
	jwt: {
		secret: string;
		expiryTime: string;
	};
}

export const defaultConfig: Config = {
	server: {
		hostname: "localhost",
		port: 3000
	},
	database: {
		host: "localhost",
		port: 5432,
		username: "dev",
		password: "dev",
		dbName: "obama69"
	},
	jwt: {
		secret: "secret",
		expiryTime: "24h"
	}
};

/**
 * The current configuration for the application. Defaults to values in defaultConfig for any options missing
 * from .env.
 */
export const config: Config = {
	server: {
		hostname: process.env.HOSTNAME || defaultConfig.server.hostname,
		port:
			(process.env.PORT as number | undefined) ||
			defaultConfig.server.port
	},
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
	},
	jwt: {
		secret: process.env.JWT_SECRET || defaultConfig.jwt.secret,
		expiryTime: process.env.JWT_EXPIRY_TIME || defaultConfig.jwt.expiryTime
	}
};
