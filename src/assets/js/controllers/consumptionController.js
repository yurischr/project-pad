/**
 * Controller responsible for all events in the consumption view
 */

import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {Controller} from "./controller.js";


export class ConsumptionController extends Controller {
    #TAB_DAY = 'day';
    #TAB_WEEK = 'week';
    #TAB_MONTH = 'month';
    #TAB_YEAR = 'year';
    #table
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

        // Loading the table into the DOM element
        this.#consumptionView = super.loadHtmlIntoCustomElement("html_views/components/temp-table.html"
            , document.querySelector("#tableSpace"));


        // Selecting all the the tab links
        const tabs = document.querySelectorAll("a.tab-link");

        // When a specific tab is clicked the `handleTableView` will be called
        tabs.forEach(tab => tab.addEventListener("click", async (event) => {
            while (document.querySelector(".table-body").hasChildNodes()){
                document.querySelector(".table-body").removeChild(document.querySelector(".table-body").firstChild);
            }
            await this.#handleTableView(event);
        }))
    }

    /**
     *
     * @param event - Tab
     * @returns {Promise<void>}
     */
    async #handleTableView(event) {
        switch (event.target.dataset.table) {
            case this.#TAB_DAY:
                await this.#fetchDailyData()
                break;
            case this.#TAB_WEEK:
                await this.#fetchWeeklyData()
                break;
            case this.#TAB_MONTH:
                await this.#fetchMonthlyData()
                break;
            case this.#TAB_YEAR:
                await this.#fetchYearlyData()
                break;
        }
    }

    /**
     * Async function gets the weekly electricity data via the repository and adds the data to the table rows
     * @returns {Promise<void>}
     */
    async #fetchWeeklyData() {
        document.querySelector(".time-column").innerHTML = 'week';

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const data = await this.#electricityRepository.getWeeklyData();

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
     * Get the yearly electricity data via the repository
     * @returns {Promise<void>}
     */
    async #fetchYearlyData() {
        document.querySelector(".time-column").innerHTML = 'Jaar';

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const data = await this.#electricityRepository.getYearlyData();

            let template = document.querySelector("#row-template");

            console.log(template)
            for (let row in data.data) {
                let clone = template.content.cloneNode(true);

                clone.querySelector(".time").textContent = data.data[row]['year'];
                clone.querySelector(".data").textContent = data.data[row]['consumption'];
                document.querySelector(".table-body").appendChild(clone)
            }
        } catch (e) {
            console.log("error while fetching the yearly electricity data", e);
        }
    }

    /**
     * Get the daily electricity data via the repository and add the data to the table
     * @returns {Promise<void>}
     */
    async #fetchDailyData() {
        try {
            document.querySelector(".time-column").innerHTML = 'Dag';
            const dailyData = await this.#electricityRepository.getDailyData();

            let template = document.querySelector("#row-template");

            for (let i = 0; i < dailyData.length; i++) {
                for (let j = 0; j < dailyData[i].length; j++) {
                    let clone = template.content.cloneNode(true);

                    clone.querySelector(".time").textContent = dailyData[i][j]['day'];
                    clone.querySelector(".data").textContent = dailyData[i][j]['consumption'];
                    document.querySelector(".table-body").appendChild(clone)
                }
            }
        } catch (e) {
            console.log("error while fetching the daily electricity data", e);
        }
    }

    /**
     * Async function gets the monthly electricity data via the repository and adds the data to the table rows
     * @returns {Promise<void>}
     */
    async #fetchMonthlyData() {
        document.querySelector(".time-column").innerHTML = 'Maand';

        try {
            const data = await this.#electricityRepository.getMonthlyData()

            let template = document.querySelector("#row-template");
            for (let i = 0; i < data.length;i++){
                for (let j = 0; j < data[i].length; j++) {
                    let clone = template.content.cloneNode(true);

                    clone.querySelector(".time").textContent = data[i][j]['month'];
                    clone.querySelector(".data").textContent = data[i][j]['consumption'];
                    document.querySelector(".table-body").appendChild(clone)
                }
            }
        } catch (e) {
            console.log("error while fetching the monthly electricity data", e)
        }
    }

    async #setDatable(){
        this.#table.destroy()

        this.#table = $('#table-data').DataTable({
            aLengthMenu: [
                [10, 25, 50, 100, 150, -1],
                [10, 25, 50, 100, 150, "All"]
            ]
        });

    }

}
