import { Application, Request, Response } from "express";
import {
	LOGOUT_ROUTE,
	MC_SERVER_CONSOLE_ROUTE,
	QUERY_MC_SERVER_ROUTE,
	START_MC_SERVER_ROUTE,
	STOP_MC_SERVER_ROUTE
} from "../routes";
const { MinecraftServerListPing } = require("minecraft-status");
import { config } from "../config";
import {
	hasAnyPermission,
	hasPermission,
	PERMISSIONS
} from "../services/permissions";
import { startInstance, stopInstance } from "../services/aws";

export async function mcStatusGet(req: Request, res: Response): Promise<void> {
	MinecraftServerListPing.ping(
		config.mcServer.protocol,
		config.mcServer.ip,
		config.mcServer.port,
		3000
	)
		.then((response: any) => {
			res.json({
				hostname: config.mcServer.ip,
				port: config.mcServer.port,
				online: true,
				version: response.version.name,
				onlinePlayers: response.players.online,
				maxPlayers: response.players.max
			});
		})
		.catch((error: any) => {
			res.json({
				hostname: config.mcServer.ip,
				port: config.mcServer.port,
				online: false,
				error
			});
		});
}

export async function mcServerConsoleGet(
	req: Request,
	res: Response
): Promise<void> {
	if (!req.user) {
		res.status(401).send("Unauthorized!");
		return;
	}

	if (!hasAnyPermission(req.user, PERMISSIONS.server)) {
		res.status(403).send("You don't have permission");
		return;
	}

	res.render("mc_server_console", {
		title: "mein kraft",
		mcStatusQueryUrl: QUERY_MC_SERVER_ROUTE,
		startMCServerUrl: START_MC_SERVER_ROUTE,
		logoutRoute: LOGOUT_ROUTE
	});
}

export async function startMCServerPut(
	req: Request,
	res: Response
): Promise<void> {
	if (!req.user) {
		res.status(401).send("Unauthorized!");
		return;
	}

	if (!hasPermission(req.user, PERMISSIONS.server.start)) {
		res.status(403).send("You don't have permission");
		return;
	}

	// Start server
	await startInstance();

	res.json({
		success: true
	});
}

export async function stopMCServerPut(
	req: Request,
	res: Response
): Promise<void> {
	if (!req.user) {
		res.status(401).send("Unauthorized!");
		return;
	}

	if (!hasPermission(req.user, PERMISSIONS.server.stop)) {
		res.status(403).send("You don't have permission");
		return;
	}

	await stopInstance();

	res.json({
		success: true
	});
}

export function addRoutes(app: Application) {
	app.get(QUERY_MC_SERVER_ROUTE, mcStatusGet);
	app.get(MC_SERVER_CONSOLE_ROUTE, mcServerConsoleGet);
	app.put(START_MC_SERVER_ROUTE, startMCServerPut);
	app.put(STOP_MC_SERVER_ROUTE, stopMCServerPut);
}
