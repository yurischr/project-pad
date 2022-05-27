/**
 * Do not change this - "main" entry point of the server
 *
 * Add your server logic to app.js
 *
 * @author Pim Meijer & Lennard Fonteijn
 */
const SERVER_ENVIRONMENT_LOCAL = "LOCAL";
const SERVER_ENVIRONMENT_DEV = "DEV";
const SERVER_ENVIRONMENT_LIVE = "LIVE";

const SERVER_PORT = process.env.PORT || 3000;
const SERVER_ENVIRONMENT = process.env.ENVIRONMENT || SERVER_ENVIRONMENT_LOCAL;

const SERVER_CONFIG_FILE = getConfigFilePath();
const SERVER_CONFIG = require(SERVER_CONFIG_FILE);

//Expose the config to the rest of the application
global.serverConfigFile = SERVER_CONFIG_FILE;
global.serverConfig = SERVER_CONFIG;
global.appPath = process.env.APP || "./";
global.wwwrootPath = process.env.WWWROOT || "../src/";

const app = require("./app");

const http = require('http').Server(app)
const io = require('socket.io')(http, {
    path: "/socket-conn/",
    cors: {
        origin: [
            'http://localhost:63342',
            'https://dev-svm-3.hbo-ict.cloud'
        ]
    }
})

let clients = {}

io.on('connection', (socket) => {
    clients[socket.id] = socket;
    console.log(socket.id)

    // on disconnect remove the client from the list of clients
    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete clients[socket.id];
    });
})


http.listen(SERVER_PORT, () => console.log(`\nPAD Framework server listening on port ${SERVER_PORT} for environment ${SERVER_ENVIRONMENT}!`));

function getConfigFilePath() {
    if(SERVER_ENVIRONMENT === SERVER_ENVIRONMENT_DEV) {
        return "./config/config.dev.json";
    }
    else if(SERVER_ENVIRONMENT === SERVER_ENVIRONMENT_LIVE) {
        return "./config/config.live.json";
    } else {
        return "./config/config.local.json";
    }
}
