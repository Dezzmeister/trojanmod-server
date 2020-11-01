import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import fileUpload = require("express-fileupload");
import { config } from "./config";
import { DEFAULT_ROUTE } from "./routes";
import { authTokenMiddleware } from "./auth";
import addRoutes from "./add_routes";

export const app: Application = express();

app.use(cookieParser());
app.use(authTokenMiddleware);

app.use(
	fileUpload({
		createParentPath: true,
		useTempFiles: true,
		tempFileDir: "/tmp/",
		debug: true
	})
);

app.use(express.json());

app.get(DEFAULT_ROUTE, function (req: Request, res: Response): void {
	console.log(`GET ${DEFAULT_ROUTE}`);
	res.send("Hello chief");
});

addRoutes(app);

app.listen(config.port, function () {
	console.log(`Trojan Control Server listening on port ${config.port}`);
});
