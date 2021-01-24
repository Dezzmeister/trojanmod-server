import { Application, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { User } from "../entity/User";
import {
	BAD_LOGIN_ROUTE,
	DEFAULT_ROUTE,
	LOGIN_ROUTE,
	LOGOUT_ROUTE,
	MC_SERVER_CONSOLE_ROUTE,
	REGISTER_ROUTE,
	USERNAME_IS_TAKEN_ROUTE
} from "../routes";
import { createEntityManager } from "../services/database";
import { bannedNames } from "../services/names";
import { checkLogin, createUser } from "../services/users";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { logger } from "../logging";
import { hasPermission, PERMISSIONS } from "../services/permissions";

export const jwtCookieKey = "accessToken";

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

async function loginPost(req: Request, res: Response): Promise<void> {
	const { username, password } = req.body;

	try {
		const user = await checkLogin(username, password);

		jwt.sign(
			{ ...user },
			config.jwt.secret,
			{
				expiresIn: config.jwt.expiryTime * 1000
			},
			(err, token) => {
				if (err) {
					logger.error(`Error signing JWT token: ${err}`);
					res.send("Error signing JWT token");
					return;
				}

				req.user = user;
				logger.info(`User '${user.username}' logged in`);

				res.cookie(jwtCookieKey, token);
				if (hasPermission(req.user, PERMISSIONS.server.start)) {
					res.redirect(MC_SERVER_CONSOLE_ROUTE);
					return;
				}

				res.render("madeyoulogin", {
					title: "HA HA HA MADE U LOG IN"
				});
			}
		);
	} catch (error) {
		logger.error(
			`Error logging in user '${username}': ` + JSON.stringify(error)
		);
		res.send("bruh pls suply corect pasword");
	}
}

function badLoginGet(req: Request, res: Response): void {
	res.render("home", {
		title: "your idiot"
	});
}

function logoutGet(req: Request, res: Response): void {
	res.clearCookie(jwtCookieKey);
	res.redirect(DEFAULT_ROUTE);
}

function registerGet(req: Request, res: Response): void {
	res.render("register", {
		title: "pls registar",
		usernameIsTakenUrl: USERNAME_IS_TAKEN_ROUTE
	});
}

const registerPostValidators = [
	check("username").isAlphanumeric().trim(),
	check("first_name").isAlphanumeric().trim(),
	check("last_name").isAlphanumeric().trim()
];

async function registerPost(req: Request, res: Response): Promise<Response> {
	const { username, password, first_name, last_name } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const data = {
		username,
		password,
		firstName: first_name,
		lastName: last_name
	};
	check(username);

	await createUser(data);
	res.render("register_success", {
		title: "CONGRATULATIONS!!!",
		loginEndpoint: LOGIN_ROUTE
	});
	return res.status(200);
}

const usernameIsTakenValidators = [check("name").isAlphanumeric().trim()];

async function usernameIsTakenGet(req: Request, res: Response): Promise<void> {
	console.log(`GET ${USERNAME_IS_TAKEN_ROUTE}`);
	let name = req.query.name;

	if (!name) {
		res.send(UsernameIsTakenValues.INVALID);
		return;
	}

	name = Buffer.from(name as string, "base64").toString("binary");

	const em = await createEntityManager();
	const existingUser = await em
		.getRepository(User)
		.findOne({ username: name });

	if (existingUser || bannedNames.includes(name)) {
		res.send(UsernameIsTakenValues.TRUE);
		return;
	}

	res.send(UsernameIsTakenValues.FALSE);
}

export function addRoutes(app: Application): void {
	app.get(LOGIN_ROUTE, loginGet);
	app.post(LOGIN_ROUTE, loginPost);
	app.get(BAD_LOGIN_ROUTE, badLoginGet);
	app.get(REGISTER_ROUTE, registerGet);
	app.post(REGISTER_ROUTE, registerPostValidators, registerPost);
	app.get(LOGOUT_ROUTE, logoutGet);
	app.get(
		USERNAME_IS_TAKEN_ROUTE,
		usernameIsTakenValidators,
		usernameIsTakenGet
	);
}
