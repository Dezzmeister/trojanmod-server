import express, { Application, Request, Response } from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import { config } from "./config";
import {
	DEFAULT_ROUTE,
	LOGIN_ROUTE,
	MC_SERVER_CONSOLE_ROUTE,
	REGISTER_ROUTE
} from "./routes";
import { jwtMiddleware } from "./jwt";
import addRoutes from "./add_routes";
import { initDatabase } from "./services/database";
import { logger, loggingMiddleware } from "./logging";
import { hasPermission, PERMISSIONS } from "./services/permissions";

export const app: Application = express();

export const PAYLOAD_DIR = "files/";
const VIEWS_DIR = `${__dirname}/views`;

app.set("view engine", "handlebars");
app.set("views", VIEWS_DIR);
app.engine(
	"handlebars",
	handlebars({
		defaultLayout: "main"
	})
);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(jwtMiddleware);
app.use(loggingMiddleware);

app.use(express.static(VIEWS_DIR));
app.use(express.static(PAYLOAD_DIR));

app.use(express.json());

app.get(DEFAULT_ROUTE, function (req: Request, res: Response): void {
	if (req.user) {
		if (hasPermission(req.user, PERMISSIONS.server.start)) {
			res.redirect(MC_SERVER_CONSOLE_ROUTE);
			return;
		}
	}

	res.render("landing", {
		title: "obama 69 websit",
		loginRoute: LOGIN_ROUTE,
		registerRoute: REGISTER_ROUTE
	});
});

addRoutes(app);

initDatabase(config.database.dbName);

app.listen(config.server.port, function () {
	logger.info(
		`Trojan Control Server listening on port ${config.server.port}`
	);
});
