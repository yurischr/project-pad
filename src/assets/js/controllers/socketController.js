import {Controller} from "./controller.js";

/**
 * Responsible for handling the actions related to the socket connection happening on the consumption view
 *
 * @author Harmohat Khangura
 */
export class SocketController extends Controller {
    #view
    #socket
    #CONN_DISCONNECT = "DISCONNECTED";
    #CONN_CONNECTED = "CONNECTED";
    #LOCAL_ENV = "LOCAL";
    #DEV_ENV = "DEV";
    #LIVE_ENV = "LIVE";
    //! REPLACE URLS TO A DOTENV FILE
    #LOCAL_BACKEND_URL = "http://localhost:3000";
    #DEV_BACKEND_URL = "https://dev-svm-3.hbo-ict.cloud/api/";
    #LIVE_BACKEND_URL = "https://svm-3.hbo-ict.cloud/api/";

    /**
     * Constructor for the SocketController class
     *
     * @param view - contains the view of the consumption page [<main>]
     */
    constructor(view, env) {
        super();
        this.#view = view;

        try {
            // Initialize the socket connection
            const socket =  io(this.#getBackendURL(env), {
                transports: ['websocket'],
                reconnection: true

            });

            this.#socket = socket;
        } catch (e) {
            console.error(e);
        }

        console.log(`connected: ${this.#socket.connected}`);
        console.log(`disconnected: ${this.#socket.disconnected}`);
        console.log(this.#socket)

        // if the socket connection is disconnected, show the disconnection message
       if (!this.#socket.connected) {
           (async () => {
               try {
                   console.log("Socket disconnected");
                   await this.#socketConnection(this.#CONN_DISCONNECT);
               } catch (e) {
                    console.error(e);
               }
           })();
       }

        this.#socket.on("reconnect", async () => {
            console.log("Socket reconnected");
        });

       // if the socket connection is connected, show the connection message
        this.#socket.on("connect", async () => {
            await this.#socketConnection(this.#CONN_CONNECTED);
        });

       // if the socket connection is disconnected, show the disconnection message
        this.#socket.on("disconnect",  async () => {
            await this.#socketConnection(this.#CONN_DISCONNECT);
        });
    }

    /**
     * Method returns the backend url based on the chosen environment
     *
     * @param env        - the chosen environment - [<LOCAL_ENV>, <DEV_ENV>, <LIVE_ENV>]
     * @returns {string} - the backend url        - [<LOCAL_BACKEND_URL>, <DEV_BACKEND_URL>, <LIVE_BACKEND_URL>]
     */
    #getBackendURL(env) {
        switch (env) {
            case this.#LOCAL_ENV:
                return this.#LOCAL_BACKEND_URL;
            case this.#DEV_ENV:
                return this.#DEV_BACKEND_URL;
            case this.#LIVE_ENV:
                return this.#LIVE_BACKEND_URL;
            default:
                return this.#LOCAL_BACKEND_URL;
        }
    }

    /**
     * Method to handle the socket connection message and show the message on the consumption page
     *
     * @param type              - CONNECTED or DISCONNECTED
     * @returns {Promise<void>} - a promise that resolves when the message is shown
     */
    async #socketConnection(type) {
        let template = this.#view.querySelector("#toast-template");
        let clone = template.content.cloneNode(true);

        let textColor =  type === this.#CONN_DISCONNECT ? "text-danger" : "text-success";

        const current = new Date();
        const errTime = current.toLocaleTimeString("en-US");

        clone.querySelector(".toast-type").innerHTML =  type === this.#CONN_DISCONNECT ? "ERROR" : "SUCCES";
        clone.querySelector(".toast-type").classList.add(textColor);
        clone.querySelector(".toast-body").innerHTML = "server is " + (type === this.#CONN_DISCONNECT ? "offline" : "online");
        clone.querySelector(".toast-time").innerHTML = errTime;

        this.#view.querySelector(".toast-container").appendChild(clone);

        this.#view.querySelectorAll(".toast-close").forEach(button => {
            button.addEventListener("click", (e) => {
                e.target.parentElement.parentElement.remove()
            });
        });
    }

}
