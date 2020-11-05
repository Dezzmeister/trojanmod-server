import { Connection, createConnection } from "typeorm";

let connectionPool: Promise<Connection>;

export function initDatabase(dbName: string): void {
	if (!connectionPool) {
		connectionPool = createConnection(dbName);
	}
}
