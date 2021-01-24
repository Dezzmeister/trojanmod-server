import AWS from "@aws-sdk/client-ec2";
import { config } from "../config";

const serverInstance = new AWS.EC2({ region: "us-east-1" });

export async function startInstance() {
	await serverInstance.startInstances({
		InstanceIds: [config.mcServer.instanceId]
	});
}

export async function stopInstance() {
	await serverInstance.stopInstances({
		InstanceIds: [config.mcServer.instanceId]
	});
}
