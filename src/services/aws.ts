const AWS = require("@aws-sdk/client-ec2");
import { config } from "../config";
import * as cron from "node-cron";
const { MinecraftServerListPing } = require("minecraft-status");
import { logger } from "../logging";

const serverInstance = new AWS.EC2({ region: "us-east-1" });
let shouldShutdown = false;

export async function startInstance() {
	shouldShutdown = false;
	await serverInstance.startInstances({
		InstanceIds: [config.mcServer.instanceId]
	});
}

export async function stopInstance() {
	shouldShutdown = false;

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
			15000
		)
			.then((response: any) => {
				if (response.players.online !== 0) {
					shouldShutdown = false;
				} else {
					if (shouldShutdown) {
						logger.info("MC Server is inactive. Shutting down...");
						stopInstance();
					} else {
						shouldShutdown = true;
					}
				}
			})
			.catch((error: any) => {
				logger.info("MC Server likely crashed. Shutting down...");
				stopInstance();
			});
	});
}
