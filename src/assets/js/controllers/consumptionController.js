/**
 * Controller responsible for all events in the consumption view
 */

import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {Controller} from "./controller.js";

export class ConsumptionController extends Controller {
    #electricityRepository
    #consumptionView

    constructor() {
        super();
        document.title = "Consumption";
        this.#electricityRepository = new ElectricityRepository();
        this.#setupView()
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        //await for when HTML is loaded, never skip this method call in a controller
        this.#consumptionView = await super.loadHtmlIntoContent("html_views/consumption.html")
        this.#consumptionView = super.loadHtmlIntoCustomElement("html_views/realtimeCards.html"
            , document.querySelector("#realtime-cards"));
        this.#consumptionView = super.loadHtmlIntoCustomElement("html_views/table.html"
            , document.querySelector("#tableSpace"));


        await this.#fetchWeeklyData()
        await this.#fetchDailyData()
    }

    async #fetchWeeklyData() {
        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const data = await this.#electricityRepository.getWeeklyData();

        } catch (e) {
            console.log("error while fetching the weekly electricity data", e);
        }
    }

    /**
     * Get the daily electricity data via the repository
     * @returns {Promise<void>}
     */
    async #fetchDailyData() {
        try {
            const dailyData = await this.#electricityRepository.getDailyData();
        } catch (e) {
            console.log("error while fetching the weekly electricity data", e);
        }
    }

}
