const AWS = require("@aws-sdk/client-ec2");
import { config } from "../config";
import * as cron from "node-cron";
const { MinecraftServerListPing } = require("minecraft-status");
import { logger } from "../logging";

const serverInstance = new AWS.EC2({ region: "us-east-1" });
let lastUptime = Date.now();
let hasShutdown = false;

export async function startInstance() {
	hasShutdown = false;
	await serverInstance.startInstances({
		InstanceIds: [config.mcServer.instanceId]
	});
}

export async function stopInstance() {
	hasShutdown = true;

	await serverInstance.stopInstances({
		InstanceIds: [config.mcServer.instanceId]
	});
}

export function startServerControlCron() {
	cron.schedule("*/5 * * * *", function () {
		MinecraftServerListPing.ping(
			config.mcServer.protocol,
			config.mcServer.ip,
			config.mcServer.port,
			3000
		)
			.then((response: any) => {
				if (response.onlinePlayers !== 0) {
					lastUptime = Date.now();
					hasShutdown = false;
				} else if (
					!hasShutdown &&
					Date.now() - lastUptime > 5 * 60 * 1000
				) {
					logger.info("MC Server is inactive. Shutting down...");
					stopInstance();
					hasShutdown = true;
				}
			})
			.catch((error: any) => {});
	});
}
