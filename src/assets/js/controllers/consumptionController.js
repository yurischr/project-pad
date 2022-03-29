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
        this.#comparisonChart();
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
        this.#consumptionView.querySelector(".time-column").innerHTML = 'Week';

        try {
            $('#table-data').DataTable().clear().destroy();

            //await keyword 'stops' code until data is returned - can only be used in async function
            const data = await this.#electricityRepository.getWeeklyData();

            let template = this.#consumptionView.querySelector("#row-template");

            for (let row in data.data) {
                let clone = template.content.cloneNode(true);

                clone.querySelector(".time").textContent = data.data[row]['week'];
                clone.querySelector(".data").textContent = data.data[row]['consumption'];
                this.#consumptionView.querySelector(".table-body").appendChild(clone)
            }

            await this.#setDatable()
        } catch (e) {
            console.log("error while fetching the weekly electricity data", e);
        }
    }

    /**
     * Get the yearly electricity data via the repository
     * @returns {Promise<void>}
     */
    async #fetchYearlyData() {
        this.#consumptionView.querySelector(".time-column").innerHTML = 'Jaar';

        try {
            $('#table-data').DataTable().clear().destroy();

            //await keyword 'stops' code until data is returned - can only be used in async function
            const data = await this.#electricityRepository.getYearlyData();

            let template = this.#consumptionView.querySelector("#row-template");

            for (let row in data.data) {
                let clone = template.content.cloneNode(true);

                clone.querySelector(".time").textContent = data.data[row]['year'];
                clone.querySelector(".data").textContent = data.data[row]['consumption'];
                this.#consumptionView.querySelector(".table-body").appendChild(clone)
            }
            await this.#setDatable()

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
            $('#table-data').DataTable().clear().destroy();

            this.#consumptionView.querySelector(".time-column").innerHTML = 'Dag';
            const dailyData = await this.#electricityRepository.getDailyData();

            let template = this.#consumptionView.querySelector("#row-template");

            for (let i = 0; i < dailyData.length; i++) {
                let clone = template.content.cloneNode(true);

                clone.querySelector(".time").textContent = dailyData[i]['day'];
                clone.querySelector(".data").textContent = dailyData[i]['consumption'];
                this.#consumptionView.querySelector(".table-body").appendChild(clone)
            }
            await this.#setDatable()
        } catch (e) {
            console.log("error while fetching the daily electricity data", e);
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

    #comparisonChart() {
        const labels = [
            'Elektriciteit',
            'Gas'
        ];

        const data = {
            labels: labels,
            datasets: [{
                label: 'Vergelijking Elektriciteit, Gas',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [75, 25],
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {}
        };

        const myChart = new Chart(
            this.#consumptionView.querySelector(".comparison-chart-case"),
            config
        );


    }
}
