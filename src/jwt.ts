import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "./config";
import { jwtCookieKey } from "./handlers/login";
import { logger } from "./logging";
import {
	BAD_LOGIN_ROUTE,
	DEFAULT_ROUTE,
	FILENAME_ROUTE,
	FILE_ROUTE,
	LOGIN_ROUTE,
	LOGOUT_ROUTE,
	MC_SERVER_CONSOLE_ROUTE,
	QUERY_MC_SERVER_ROUTE,
	REGISTER_ROUTE,
	SET_PAYLOAD_ROUTE,
	START_MC_SERVER_ROUTE,
	UPLOAD_PAYLOAD_ROUTE,
	USERNAME_IS_TAKEN_ROUTE
} from "./routes";

enum Strictness {
	REQUIRED = "required", // JWT is required for this endpoint, an error will be thrown if it isn't provided
	RECOMMENDED = "recommended", // JWT is recommended for this endpoint, no error but a warning will be printed
	OPTIONAL = "optional", // JWT is optional (flow diverges depending on presence of JWT)
	NOT_REQUIRED = "not_required" // JWT is not required and will be ignored
}

const jwtPaths = buildJwtPaths();

function buildJwtPaths(): { [key: string]: Strictness } {
	const obj: { [key: string]: Strictness } = {};

	obj[DEFAULT_ROUTE] = Strictness.OPTIONAL;
	obj[LOGIN_ROUTE] = Strictness.NOT_REQUIRED;
	obj[REGISTER_ROUTE] = Strictness.NOT_REQUIRED;
	obj[LOGOUT_ROUTE] = Strictness.REQUIRED;
	obj[USERNAME_IS_TAKEN_ROUTE] = Strictness.NOT_REQUIRED;
	obj[BAD_LOGIN_ROUTE] = Strictness.NOT_REQUIRED;
	obj[SET_PAYLOAD_ROUTE] = Strictness.REQUIRED;
	obj[UPLOAD_PAYLOAD_ROUTE] = Strictness.REQUIRED;
	obj[FILENAME_ROUTE] = Strictness.NOT_REQUIRED;
	obj[FILE_ROUTE] = Strictness.NOT_REQUIRED;
	obj[QUERY_MC_SERVER_ROUTE] = Strictness.NOT_REQUIRED;
	obj[MC_SERVER_CONSOLE_ROUTE] = Strictness.REQUIRED;
	obj[START_MC_SERVER_ROUTE] = Strictness.REQUIRED;

	return obj;
}

export function jwtMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const strictness = jwtPaths[req.path];

	if (!strictness || strictness === Strictness.NOT_REQUIRED) {
		next();
		return;
	}

	const token = req.cookies[jwtCookieKey];

	jwt.verify(token, config.jwt.secret, (err: any, user: any) => {
		if (err) {
			const errorString = `User tried to access ${
				req.path
			} with no JWT: ${JSON.stringify(err)}`;

			if (strictness === Strictness.REQUIRED) {
				logger.error(errorString);
			} else if (strictness === Strictness.RECOMMENDED) {
				logger.warn(errorString);
			}

			req.user = null;
		} else {
			req.user = user;
		}

		next();
	});
}
