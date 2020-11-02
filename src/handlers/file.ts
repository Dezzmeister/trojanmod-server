import { Application, Request, Response } from "express";
import { PAYLOAD_DIR } from "../app";
import {
	FILENAME_ROUTE,
	FILE_ROUTE,
	SET_PAYLOAD_ROUTE,
	UPLOAD_PAYLOAD_ROUTE
} from "../routes";
import multer from "multer";

let currentFilename = "";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, PAYLOAD_DIR);
	},

	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

function downloadFileGet(req: Request, res: Response) {
	if (currentFilename) {
		res.sendFile(currentFilename, {
			root: PAYLOAD_DIR
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
			const upload = multer({ storage }).single("file");

			upload(req, res, function () {
				// return res.send("file received");
			});
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
