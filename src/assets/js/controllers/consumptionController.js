/**
 * Controller responsible for all events in the consumption view
 */

import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {Controller} from "./controller.js";
import {ElectraController} from "./electraController.js";
import {GasController} from "./gasController.js";

export class ConsumptionController extends Controller {
    #TAB_DAY = 'day';
    #TAB_WEEK = 'week';
    #TAB_MONTH = 'month';
    #TAB_YEAR = 'year';
    #DASHBOARD_GAS = 'gas';
    #DASHBOARD_ELECTRA = 'electra';
    #table
    #electricityRepository
    #consumptionView

    constructor() {
        super();
        document.title = "Energie Verbruik";
        this.#electricityRepository = new ElectricityRepository();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        //await for when HTML is loaded, never skip this method call in a controller
        this.#consumptionView = await super.loadHtmlIntoContent("html_views/consumption.html")

        //loading realtime cards into the DOM element
        await super.loadHtmlIntoCustomElement("html_views/realtime-cards.html"
            , document.querySelector("#realtime-cards"));

        await super.loadHtmlIntoCustomElement("html_views/compare-usages.html"
            , document.querySelector("#usage-compare"))

        // Loading the table into the DOM element
        await super.loadHtmlIntoCustomElement("html_views/components/temp-table.html"
            , document.querySelector("#tableSpace"));

        await super.loadHtmlIntoCustomElement("html_views/components/comparisonChart.html"
            , document.querySelector(".comparison-chart"));

        const dashboardBtns = this.#consumptionView.querySelectorAll(".dashboard-buttons");

        dashboardBtns.forEach(button => button.addEventListener("click", async (event) => {
            await this.#handleDashboard(event);
        }))

        // Selecting all the the tab links
        const tabs = this.#consumptionView.querySelectorAll("a.tab-link");

        // When a specific tab is clicked the `handleTableView` will be called
        tabs.forEach(tab => tab.addEventListener("click", async (event) => {
            while (this.#consumptionView.querySelector(".table-body").hasChildNodes()) {
                this.#consumptionView.querySelector(".table-body").removeChild(
                    document.querySelector(".table-body").firstChild
                );
            }

            event.preventDefault()
            await this.#handleTableView(event, tabs);
        }))
    }

    /**
     * Function toggles between the dashboard views
     *
     * @param event - Dashboard toggle event
     * @returns {Promise<void>}
     */
    #handleDashboard(event) {
        switch (event.target.dataset.dashboard) {
            case this.#DASHBOARD_GAS:
                new GasController(this.#consumptionView);
                break;
            case this.#DASHBOARD_ELECTRA:
                new ElectraController(this.#consumptionView);
                break;
        }
    }

    /**
     *
     * @param event - Tab
     * @param tabs - Tabs
     * @returns {Promise<void>}
     */
    async #handleTableView(event, tabs) {
        tabs.forEach((tab) => {
            tab.classList.remove('tab-active')
        });

        event.target.classList.add("tab-active")

        switch (event.target.dataset.table) {
            case this.#TAB_DAY:
                await this.#fetchPeriodData(await this.#electricityRepository.getDailyData(), "Dag", "day")
                break;
            case this.#TAB_WEEK:
                await this.#fetchPeriodData(await this.#electricityRepository.getWeeklyData(), "Week", "week")
                break;
            case this.#TAB_MONTH:
                await this.#fetchMonthlyData()
                break;
            case this.#TAB_YEAR:
                await this.#fetchPeriodData(await this.#electricityRepository.getYearlyData(), "Jaar", "year")
                break;
        }
    }

    /**
     * Async function gets the monthly electricity data via the repository and adds the data to the table rows
     * @returns {Promise<void>}
     */
    async #fetchMonthlyData() {
        this.#consumptionView.querySelector(".time-column").innerHTML = 'Maand';

        try {
            $('#table-data').DataTable().clear().destroy();

            const data = await this.#electricityRepository.getMonthlyData()

            let template = this.#consumptionView.querySelector("#row-template");
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    console.log(data[i][j])
                    let clone = template.content.cloneNode(true);

                    clone.querySelector(".time").textContent = data[i][j]['month'];
                    clone.querySelector(".data").textContent = data[i][j]['consumption'];
                    this.#consumptionView.querySelector(".table-body").appendChild(clone)
                }
            }
            await this.#setDatable()

        } catch (e) {
            console.log("error while fetching the monthly electricity data", e)
        }
    }

    /**
     * Async function gets the data for a period via the repository and adds the data to the table rows
     * @param data - data from period
     * @param timePeriod - time period (day, week, month, year)
     * @param selector - selector for JSON
     * @returns {Promise<void>}
     */
    async #fetchPeriodData(data, timePeriod, selector) {
        try {
            $('#table-data').DataTable().clear().destroy();

            this.#consumptionView.querySelector(".time-column").innerHTML = timePeriod;

            let template = this.#consumptionView.querySelector("#row-template");

            for (let row in data.data) {
                let clone = template.content.cloneNode(true);

                clone.querySelector(".time").textContent = data.data[row][selector];
                clone.querySelector(".data").textContent = data.data[row]['consumption'];
                this.#consumptionView.querySelector(".table-body").appendChild(clone)
            }
            await this.#setDatable()
        } catch (e) {
            console.log("error while fetching the electricity data", e);
        }
    }

    async #setDatable() {
        // Initialized the DataTable
        this.#table = $('#table-data').DataTable({
            "destroy": true,
            aLengthMenu: [
                // Menu length
                [10, 25, 50, 100, 150, -1],
                // Menu Labels
                [10, 25, 50, 100, 150, "All"]
            ],

        });
    }
}

