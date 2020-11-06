import { Application, Request, Response } from "express";
import { AUTH_TOKEN_KEY, generateAuthToken, saveToken } from "../auth";
import {
	BAD_LOGIN_ROUTE,
	LOGIN_ROUTE,
	REGISTER_ROUTE,
	USERNAME_ISTAKEN_ROUTE
} from "../routes";

// Terrible practice here
const LANCEG_USERNAME = "lanceg";
const LANCEG_PASSWORD = "hardcoded17@-password$76-lol";

export enum UsernameIsTakenValues {
	INVALID = "invalid",
	TRUE = "true",
	FALSE = "false"
}

function loginGet(req: Request, res: Response): void {
	res.render("login", {
		title: "log in (please)"
	});
	res.status(200);
}

function loginPost(req: Request, res: Response): void {
	const { username, password } = req.body;
	console.log(JSON.stringify(req.body));

	if (username === LANCEG_USERNAME && password === LANCEG_PASSWORD) {
		const authToken = generateAuthToken();
		saveToken(authToken);
		res.cookie(AUTH_TOKEN_KEY, authToken);
		res.send("logged in");
		return;
	}

	res.redirect(BAD_LOGIN_ROUTE);
	return;
}

function badLoginGet(req: Request, res: Response): void {
	res.render("home", {
		title: "your idiot"
	});
}

function registerGet(req: Request, res: Response): void {
	res.render("register", {
		title: "pls registar"
	});
}

async function usernameIsTakenGet(req: Request, res: Response): Promise<void> {
	const name = req.query.name;

	if (!name) {
		res.send(UsernameIsTakenValues.INVALID);
	}
}

export function addRoutes(app: Application): void {
	app.get(LOGIN_ROUTE, loginGet);
	app.post(LOGIN_ROUTE, loginPost);
	app.get(BAD_LOGIN_ROUTE, badLoginGet);
	app.get(REGISTER_ROUTE, registerGet);
	app.get(USERNAME_ISTAKEN_ROUTE, usernameIsTakenGet);
}
