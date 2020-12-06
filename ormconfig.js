const { config } = require("./dist/server/config");

module.exports = [
	{
		name: "obama69",
		type: "postgres",
		host: config.database.host,
		port: config.database.port,
		username: config.database.username,
		password: config.database.password,
		database: config.database.dbName,
		synchronize: true,
		logging: false,
		entities: ["dist/server/entity/**/*.js"],
		migrations: ["dist/server/migration/**/*.js"],
		subscribers: ["dist/server/subscriber/**/*.js"],
		cli: {
			entitiesDir: "src/entity",
			migrationsDir: "src/migration",
			subscribersDir: "src/subscriber"
		}
	}
];
