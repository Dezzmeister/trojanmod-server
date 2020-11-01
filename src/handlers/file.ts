import { Application, Request, Response } from "express";
import {
	FILENAME_ROUTE,
	FILE_ROUTE,
	SET_PAYLOAD_ROUTE,
	UPLOAD_PAYLOAD_ROUTE
} from "../routes";

const DOWNLOAD_FILES_DIR = "./files/";
const UPLOAD_FILES_DIR = "./dist/server/files/";

let currentFilename = "";

function downloadFileGet(req: Request, res: Response) {
	if (currentFilename) {
		res.sendFile(`${DOWNLOAD_FILES_DIR}${currentFilename}`, {
			root: __dirname
		});
	} else {
		res.status(404);
		res.send(`no file exists`);
	}
}

function filenameGet(req: Request, res: Response) {
	res.send(currentFilename || "null");
}

function setPayloadPost(req: Request, res: Response) {
	if (req.body && req.user) {
		currentFilename = req.body.filename;
		console.log(`Changed payload to ${currentFilename}`);
		res.send(`Changed payload to ${currentFilename}`);
		return;
	}

	console.log(`Invalid request`);
	if (req.body) {
		console.log(`Request body: ${JSON.stringify(req.body)}`);
	}

	// Make the requester think this isn't a valid route
	res.status(404);
	res.send(`nothing here`);
}

function uploadFilePost(req: Request, res: Response) {
	if (req.body) {
		if (req.user) {
			if (req.files && req.files.file) {
				const { name, mv } = req.files.file;
				mv(`${UPLOAD_FILES_DIR}${name}`);
				console.log(`Received file ${name}`);
				res.send(`Received file ${name}`);
			}
		}
	}

	res.status(403);
	res.send("need to log in");
	return;
}

export function addRoutes(app: Application) {
	app.get(FILE_ROUTE, downloadFileGet);
	app.get(FILENAME_ROUTE, filenameGet);
	app.post(SET_PAYLOAD_ROUTE, setPayloadPost);
	app.post(UPLOAD_PAYLOAD_ROUTE, uploadFilePost);
}
