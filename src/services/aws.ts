const AWS = require("@aws-sdk/client-ec2");
import { config } from "../config";
import * as cron from "node-cron";
const { MinecraftServerListPing } = require("minecraft-status");
import { logger } from "../logging";

const enum ServerStatus {
	ACTIVE,
	INACTIVE,
	NOT_RESPONDING
}

const POLL_TIME_MINUTES = 5;
const SERVER_CRASH_TIMEOUT = 6;

const serverInstance = new AWS.EC2({ region: "us-east-1" });

let previousStatus = ServerStatus.NOT_RESPONDING;
let shouldBeRunning = false;
let startedAt = 0;

export async function startInstance() {
	shouldBeRunning = true;
	startedAt = Date.now();

	try {
		await serverInstance.startInstances({
			InstanceIds: [config.mcServer.instanceId]
		});
	} catch (e: any) {
		logger.error(`Error starting server: ${JSON.stringify(e)}`);
	}
}

export async function stopInstance() {
	shouldBeRunning = false;
	previousStatus === ServerStatus.NOT_RESPONDING;

	try {
		await serverInstance.stopInstances({
			InstanceIds: [config.mcServer.instanceId]
		});
	} catch (e: any) {
		logger.error(`Error stopping server: ${JSON.stringify(e)}`);
	}
}

function updateServerWithStatus(status: ServerStatus) {
	switch (status) {
		case ServerStatus.ACTIVE: {
			previousStatus = ServerStatus.ACTIVE;
		}
		case ServerStatus.INACTIVE: {
			if (
				previousStatus === ServerStatus.ACTIVE ||
				previousStatus === ServerStatus.NOT_RESPONDING
			) {
				previousStatus = ServerStatus.INACTIVE;
			} else {
				logger.info("MC Server is inactive. Shutting down...");
				stopInstance();
			}
			return;
		}
		case ServerStatus.NOT_RESPONDING: {
			if (
				shouldBeRunning &&
				Date.now() - startedAt >= SERVER_CRASH_TIMEOUT
			) {
				// The server crashed
				logger.info("MC Server likely crashed. Shutting down...");
				stopInstance();
			}
		}
	}
}

export function startServerControlCron() {
	cron.schedule(`*/${POLL_TIME_MINUTES} * * * *`, function () {
		MinecraftServerListPing.ping(
			config.mcServer.protocol,
			config.mcServer.ip,
			config.mcServer.port,
			15000
		)
			.then((response: any) => {
				if (response.players.online !== 0) {
					updateServerWithStatus(ServerStatus.ACTIVE);
				} else {
					updateServerWithStatus(ServerStatus.INACTIVE);
				}
			})
			.catch((error: any) => {
				updateServerWithStatus(ServerStatus.NOT_RESPONDING);
			});
	});
}
