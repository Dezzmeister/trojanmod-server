import { Application, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { AUTH_TOKEN_KEY, generateAuthToken, saveToken } from "../auth";
import { User } from "../entity/User";
import {
	BAD_LOGIN_ROUTE,
	LOGIN_ROUTE,
	REGISTER_ROUTE,
	USERNAME_IS_TAKEN_ROUTE
} from "../routes";
import { createEntityManager } from "../services/database";
import { bannedNames } from "../services/names";
import { checkLogin, createUser } from "../services/users";

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

async function loginPost(req: Request, res: Response): Promise<Response> {
	const { username, password } = req.body;

	try {
		const user = await checkLogin(username, password);
		const authToken = generateAuthToken();
		saveToken(authToken);
		res.cookie(AUTH_TOKEN_KEY, authToken);
		req.user = user;
	} catch (error) {
		return res.send("bruh pls suply corect pasword");
	}

	res.render("madeyoulogin", {
		title: "HA HA HA MADE U LOG IN"
	});

	return res.status(200);
}

function badLoginGet(req: Request, res: Response): void {
	res.render("home", {
		title: "your idiot"
	});
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
	app.get(
		USERNAME_IS_TAKEN_ROUTE,
		usernameIsTakenValidators,
		usernameIsTakenGet
	);
}
