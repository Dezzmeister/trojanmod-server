import { Application } from "express";
import * as login from "./handlers/login";
import * as file from "./handlers/file";

export default function addRoutes(app: Application) {
	login.addRoutes(app);
	file.addRoutes(app);
}
