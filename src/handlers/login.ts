import { Application, Request, Response } from "express";
import { AUTH_TOKEN_KEY, generateAuthToken, saveToken } from "../auth";
import { BAD_LOGIN_ROUTE, LOGIN_ROUTE } from "../routes";

// Terrible practice here
const LANCEG_USERNAME = "lanceg";
const LANCEG_PASSWORD = "hardcoded17@-password$76-lol";

function loginGet(req: Request, res: Response): void {
	res.render("login", {
		title: "log in"
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
	res.status(200);
}

export function addRoutes(app: Application): void {
	app.get(LOGIN_ROUTE, loginGet);
	app.post(LOGIN_ROUTE, loginPost);
	app.get(BAD_LOGIN_ROUTE, badLoginGet);
}