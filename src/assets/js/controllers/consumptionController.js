/**
 * Controller responsible for all events in the consumption view
 */

import { Controller } from "./controller.js";

export class ConsumptionController extends Controller{
    #consumptionView

    constructor() {
        super();
        document.title = "Consumption";
        this.#setupView()
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        //await for when HTML is loaded, never skip this method call in a controller
        this.#consumptionView = await super.loadHtmlIntoContent("html_views/consumption.html")
        this.#consumptionView = super.loadHtmlIntoCustomElement("html_views/realtimeCards.html", document.querySelector("#realtime-cards"))
z    }


}
