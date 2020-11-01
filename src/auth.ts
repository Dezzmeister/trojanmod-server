import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

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
