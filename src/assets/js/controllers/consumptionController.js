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

        this.#consumptionView = super.loadHtmlIntoCustomElement("html_views/components/temp-table.html"
            , document.querySelector("#tableSpace"));

        // this.#consumptionView = super.loadHtmlIntoCustomElement("html_views/table.html"
        //     , document.querySelector("#tableSpace"));

        const anchors = document.querySelectorAll("a.tab-link");
        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleTableView(event)))

        await this.#fetchWeeklyData()
        await this.#fetchDailyData()
        await this.#setDatable()
    }

    async #fetchWeeklyData() {
        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const data = await this.#electricityRepository.getWeeklyData();

            console.log(data)
            let template = document.querySelector("#row-template");

            for (let row in data.data) {
                let clone = template.content.cloneNode(true);

                clone.querySelector(".time").textContent = data.data[row]['week'];
                clone.querySelector(".data").textContent = data.data[row]['consumption'];
                document.querySelector(".table-body").appendChild(clone)
            }
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

    async #handleTableView(event) {
        console.log(event.target.dataset.table)
    }

    async #setDatable(){
        $('#table-data').DataTable({
            aLengthMenu: [
                [10, 25, 50, 100, 150, -1],
                [10, 25, 50, 100, 150, "All"]
            ]
        });
    }

}
