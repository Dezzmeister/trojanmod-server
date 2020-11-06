import { Connection, createConnection, EntityManager } from "typeorm";

let connectionPool: Promise<Connection>;

export function initDatabase(dbName: string): void {
	if (!connectionPool) {
		connectionPool = createConnection(dbName);
	}
}

export async function getConnection(): Promise<Connection> {
	if (!connectionPool) {
		throw new Error("Connection pool has not been initialized");
	}

	return connectionPool;
}

export async function createEntityManager(): Promise<EntityManager> {
	const connection = await getConnection();
	return connection.createEntityManager();
}
