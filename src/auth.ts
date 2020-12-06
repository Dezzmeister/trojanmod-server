import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "./config";
import { User } from "./entity/User";

const AUTH_TOKEN_BYTES = 32;
export const AUTH_TOKEN_KEY = "AuthToken";

const sessionTokens: string[] = [];

export function generateAuthToken(): string {
	return crypto.randomBytes(AUTH_TOKEN_BYTES).toString("hex");
}

export function isAuthorized(suppliedToken: string) {
	return sessionTokens.includes(suppliedToken);
}

export function saveToken(token: string) {
	sessionTokens.push(token);
}

export function authTokenMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const authToken = req.cookies[AUTH_TOKEN_KEY];

	req.user = isAuthorized(authToken);

	next();
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		req.user = null;
		next();
	} else {
		jwt.verify(token, config.jwt.secret, (err: any, user: any) => {
			console.log(err);

			if (err) {
				req.user = null;
			} else {
				req.user = user;
			}

			next();
		});
	}
}

export function generateAccessToken(user: User) {
	return jwt.sign(user, config.jwt.secret, {
		expiresIn: config.jwt.expiryTime
	});
}
