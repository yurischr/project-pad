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

    /**
     * Constructor for the SocketController class
     * @param view - contains the view of the consumption page [<main>]
     */
    constructor(view) {
        super();
        this.#view = view;

        // Initialize the socket connection
        const socket = io(socketUrl, {
            path: socketPath
        });

        this.#socket = socket;

        let clearTimeout = setTimeout(async () => {
            console.log(this.#socket)
            if (!this.#socket.connected) {
                await this.#socketConnection(this.#CONN_DISCONNECT);
            }
        }, 3000);

        // if the socket connection is connected, show the connection message
        this.#socket.on("connect", async () => {
            await this.#socketConnection(this.#CONN_CONNECTED);
        });

        // if the socket connection is disconnected, show the disconnection message
        this.#socket.on("disconnect", async () => {
            await this.#socketConnection(this.#CONN_DISCONNECT);
        });

    }

    /**
     * Method to handle the socket connection message and show the message on the consumption page
     * @param type              - CONNECTED or DISCONNECTED
     * @returns {Promise<void>} - a promise that resolves when the message is shown
     * @private
     */
    async #socketConnection(type) {
        const current = new Date();
        const errTime = current.toLocaleTimeString("nl-NL");

        let template = this.#view.querySelector("#toast-template");
        let clone = template.content.cloneNode(true);
        let textColor = type === this.#CONN_DISCONNECT ? "text-danger" : "text-success";

        clone.querySelector(".toast-type").classList.add(textColor);
        clone.querySelector(".toast-type").innerHTML = type === this.#CONN_DISCONNECT ? "ERROR" : "SUCCES";
        clone.querySelector(".toast-body").innerHTML = "server is " + (type === this.#CONN_DISCONNECT ? "offline" : "online");
        clone.querySelector(".toast-time").innerHTML = errTime;

        this.#view.querySelector(".toast-container").appendChild(clone);

        this.#view.querySelectorAll(".toast-close").forEach(button => {
            button.addEventListener("click", (e) => {
                e.target.parentElement.parentElement.remove();
            });
        });
    }
}
