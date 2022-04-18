/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {RoomsExampleRepository} from "../repositories/roomsExampleRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class WelcomeController extends Controller{
    #roomExampleRepository
    #welcomeView

    constructor() {
        super();
        this.#roomExampleRepository = new RoomsExampleRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#welcomeView = await super.loadHtmlIntoContent("html_views/welcome.html");

        // add event listener to the CTA button which leads to the consumption page
        this.#welcomeView.querySelector(".viewButton").addEventListener("click", (event) => {
            App.loadController(event.target.dataset.controller);
        });
    }

}