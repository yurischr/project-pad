import {Controller} from "./controller.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {ComparisonChartRepository} from "../repositories/comparisonChartRepository.js";
import {CompareUsageController} from "./compareUsageController.js";
import {RealtimeController} from "./realtimeController.js"

export class ElectraController extends Controller {
    #CO2_KG = 0.4;
    #CO2_TREE_CONSUMPTION_KG = 20;
    #TAB_DAY = 'day';
    #TAB_WEEK = 'week';
    #TAB_MONTH = 'month';
    #TAB_YEAR = 'year';
    #view
    #table
    #electricityRepository
    #comparisonChartRepository
    #compareUsageController;
    #realtimeController;

    /**
     * Constructor for the ElectraController
     * @param view - the view to be used by the controller
     */
    constructor(view) {
        super();
        this.#view = view;
        this.#electricityRepository = new ElectricityRepository();
        this.#comparisonChartRepository = new ComparisonChartRepository();
        this.#realtimeController = new RealtimeController(this.#view);
        this.#compareUsageController = new CompareUsageController(this.#view);
        this.#compareUsageController.setupDatePickers();

        // top level async function
        (async () => {
            try {
                await this.#fetchPeriodData(await this.#electricityRepository.getDailyData(), "Dag", "day");
                await this.#comparisonChart(await this.#comparisonChartRepository.getDailyComparisonData());
                await this.#graphDaily();
            } catch (e) {
                console.log("error while executing the data", e);
            }
        })();

        // Selecting all the the period tab links
        const tabs = this.#view.querySelectorAll("button.tab-link");

        // When a specific tab is clicked the `handleTableView` will be called
        tabs.forEach(tab => tab.addEventListener("click", async (event) => {
            // Removes all the child nodes of the table in tbody
            while (this.#view.querySelector(".table-body").hasChildNodes()) {
                this.#view.querySelector(".table-body").removeChild(
                    this.#view.querySelector(".table-body").firstChild
                );
            }

            // Prevent the page from scrolling to the top when clicking a tab
            event.preventDefault();

            try {
                // Calling the method for handling the table view and the active tab buttons
                await this.#handleTableView(event, tabs);
            } catch (e) {
                if (e.code === 204) {
                    await super.loadErrAlertIntoCustomElement(this.#view.querySelector(".error-box-nav-pills"), {
                        reason: "No data available for this period",
                        code: 204
                    });
                }
            }
        }));

        // When the info icon button is clicked the `handleModalClick` will be called
        this.#view.querySelectorAll(".modal-button").forEach(button =>
            button.addEventListener("click", async (event) => {
                await this.#handleModalClick(event);
            })
        );
    }

    /**
     * Method handles the click on the info  to show the modal
     * @param {object} event - The event object
     * @returns {Promise<void>}
     * @private
     */
    async #handleModalClick(event) {
        const value = event.target.parentNode.value;
        const consumptionType = event.target.parentNode.dataset.consumption;
        const chartType = event.target.parentNode.dataset.type;

        if (chartType === "cc-chart") {
            this.#view.querySelector(".modal-content-custom").style.display = "none";
            this.#view.querySelector(".modal-explanation").style.display = "block";
        } else {
            this.#view.querySelector(".modal-content-custom").style.display = "block";
            this.#view.querySelector(".modal-explanation").style.display = "none";

            const treeCompensateCalc = (value * this.#CO2_KG) / this.#CO2_TREE_CONSUMPTION_KG;

            this.#view.querySelector(".modal-consumption-value").innerHTML = `${value} kWh`;
            this.#view.querySelector(".modal-tree-value").innerHTML = treeCompensateCalc.toFixed();
        }
    }

    /**
     * Method removes the active class from all the buttons and adds the active class to the clicked tab button.
     * and calls the methods for the table data depending on which tab has been clicked
     * @param {object} event - The event that has been triggered (Tab)
     * @param {object} tabs - The array of all the tab buttons
     * @returns {Promise<boolean>} - Returns a promise that resolves to true  if the table was successfully handled
     * @private
     */
    async #handleTableView(event, tabs) {
        tabs.forEach((tab) => {
            tab.classList.remove('tab-active')
        });

        event.target.classList.add("tab-active");

        switch (event.target.dataset.table) {
            case this.#TAB_DAY:
                await this.#fetchPeriodData(await this.#electricityRepository.getDailyData(), "Dag", "day");
                this.#comparisonChart(await this.#comparisonChartRepository.getDailyComparisonData());
                await this.#graphDaily();
                break;
            case this.#TAB_WEEK:
                await this.#fetchPeriodData(await this.#electricityRepository.getWeeklyData(), "Week", "week");
                this.#comparisonChart(await this.#comparisonChartRepository.getWeeklyComparisonData());
                await this.#graphWeekly();
                break;
            case this.#TAB_MONTH:
                await this.#fetchPeriodData(await this.#electricityRepository.getMonthlyData(), "Maand", "maand");
                this.#comparisonChart(await this.#comparisonChartRepository.getMonthlyComparisonData());
                await this.#graphMonthly();
                break;
            case this.#TAB_YEAR:
                await this.#fetchPeriodData(await this.#electricityRepository.getYearlyData(), "Jaar", "year");
                this.#comparisonChart(await this.#comparisonChartRepository.getYearlyComparisonData());
                await this.#graphYearly();
                break;
            default:
                return false;
        }

        return true;
    }

    /**
     * Async function gets the data for a period via the repository and adds the data to the table rows
     * @param {object} data - data from period
     * @param {string} timePeriod - time period (day, week, month, year)
     * @param {string} selector - selector for JSON
     * @returns {Promise<void>} - Returns a promise that resolves to void
     * @private
     */
    async #fetchPeriodData(data, timePeriod, selector) {
        try {
            $('#table-data').DataTable().clear().destroy();

            this.#view.querySelector(".time-column").innerHTML = timePeriod;

            let template = this.#view.querySelector("#row-template");

            for (let row in data.data) {
                let clone = template.content.cloneNode(true);

                let treeCompensateCalc = (data.data[row]['consumption'] * this.#CO2_KG) / this.#CO2_TREE_CONSUMPTION_KG;

                clone.querySelector(".time").textContent = data.data[row][selector];
                clone.querySelector(".data").textContent = data.data[row]['consumption'];
                clone.querySelector(".tree-value").textContent = treeCompensateCalc.toFixed();
                this.#view.querySelector(".table-body").appendChild(clone);
            }
            await this.#setDatable()
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Method sets the datatable for the table
     * @returns {Promise<void>} - Returns a promise that resolves to void
     * @private
     */
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

    /**
     * Function gets the electricity and gas data and adds the data to a doughnut chart
     * @param comparisonData - comparison data from selected period
     * @private
     */
    #comparisonChart(comparisonData) {
        this.#view.querySelector('#chart').remove();
        this.#view.querySelector('.comparison-chart').insertAdjacentHTML("beforeend", '<canvas id="chart">' +
            '</canvas>');
        const electricity = comparisonData.data['electricity'];
        const gas = comparisonData.data['gas'];


        const co2EmissionFactorElectricity = 0.649;
        const co2EmissionFactorGas = 1.89;

        const co2ElectricityUsage = electricity * co2EmissionFactorElectricity;
        const co2GasUsage = gas * co2EmissionFactorGas;

        const data = {
            labels: ['Elektriciteit', 'Gas'],
            datasets: [{
                label: 'Verbruik',
                data: [co2ElectricityUsage, co2GasUsage],
                backgroundColor: [
                    'rgba(0, 74, 143, 0.5)',
                    '#004A8F'
                ],
            }]
        };

        const config = {
            type: 'doughnut',
            data
        };

        const comparisonChart = this.#view.querySelector('#chart');
        const doughnutChart = new Chart(comparisonChart, config);

        this.#view.querySelector(".cc-value button").dataset.type = "cc-chart";
    }

    /**
     * Function creates a graph and adds daily consumption data to it
     */
    async #graphDaily() {
        this.#clearGraph();
        const graph = document.querySelector("#graph");
        const dailyData = this.#electricityRepository.getDailyData();
        let dailyConsumption = [];
        const startOfDailyData = 1521;
        const amountOfDays = 7;

        for (let i = 0; i < amountOfDays; i++) {
            dailyConsumption[i] = await dailyData.then(function (results) {
                return results.data[i + startOfDailyData].consumption;
            });
        }

        const myChart = new Chart(graph, {
            type: 'line',
            data: {
                labels: ['02-03-2022', '03-03-2022', '04-03-2022', '05-03-2022', '06-03-2022', '07-03-2022', '08-03-2022'],
                datasets: [{
                    label: 'Verbruik (kWh)',
                    data: dailyConsumption,
                    fill: true,
                    backgroundColor: [
                        'rgba(0,97,194,0.4)'
                    ],
                    borderColor: '#0063c3',
                    tension: 0.4,
                }]
            }
        });
    }

    /**
     * Function creates a graph and adds weekly consumption data to it
     */
    async #graphWeekly() {
        this.#clearGraph();
        const graph = document.querySelector("#graph");
        const weeklyData = this.#electricityRepository.getWeeklyData();
        let weeklyConsumption = [];
        const startOfWeeklyData = 215;
        const amountOfWeeks = 4;

        for (let i = 0; i < amountOfWeeks; i++) {
            weeklyConsumption[i] = await weeklyData.then(function (results) {
                return results.data[i + startOfWeeklyData].consumption;
            });
        }

        const myChart = new Chart(graph, {
            type: 'line',
            data: {
                labels: ['2022 - Week 7', '2022 - Week 8', '2022 - Week 9', '2022 - Week 10'],
                datasets: [{
                    label: 'Verbruik (kWh)',
                    data: weeklyConsumption,
                    fill: true,
                    backgroundColor: [
                        'rgba(0,97,194,0.4)'
                    ],
                    borderColor: '#0063c3',
                    tension: 0.4,
                }]
            }
        });
    }

    /**
     * Function creates a graph and adds monthly consumption data to it
     */
    async #graphMonthly() {
        this.#clearGraph();
        const graph = document.querySelector("#graph");
        const monthlyData = this.#electricityRepository.getMonthlyData();
        let monthlyConsumption = [];
        const amountOfMonths = 12;

        for (let i = 0; i < amountOfMonths; i++) {
            monthlyConsumption[i] = await monthlyData.then(function (results) {
                return results.data[i].consumption;
            });
        }

        const myChart = new Chart(graph, {
            type: 'line',
            data: {
                labels: ['January 2021', 'February 2021', 'March 2021', 'April 2021', 'May 2021', 'June 2021', 'July 2021', 'August 2021', 'September 2021', 'October 2021', 'November 2021', 'December 2021'],
                datasets: [{
                    label: 'Verbruik (kWh)',
                    data: monthlyConsumption,
                    fill: true,
                    backgroundColor: [
                        'rgba(0,97,194,0.4)'
                    ],
                    borderColor: '#0063c3',
                    tension: 0.4,
                }]
            }
        });
    }

    /**
     * Function creates a graph and adds yearly consumption data to it
     */
    async #graphYearly() {
        this.#clearGraph();
        const graph = document.querySelector("#graph");
        const yearlyData = this.#electricityRepository.getYearlyData();
        let yearlyConsumption = [];
        const amountOfYears = 4;

        for (let i = 0; i < amountOfYears; i++) {
            yearlyConsumption[i] = await yearlyData.then(function (results) {
                return results.data[i].consumption;
            });
        }

        const myChart = new Chart(graph, {
            type: 'line',
            data: {
                labels: ['2018', '2019', '2020', '2021'],
                datasets: [{
                    label: 'Verbruik (kWh)',
                    data: yearlyConsumption,
                    fill: true,
                    backgroundColor: [
                        'rgba(0,97,194,0.4)'
                    ],
                    borderColor: '#0063c3',
                    tension: 0.4,
                }]
            }
        });
    }

    /**
     * Function removes previous graph when you choose a different time period
     */
    #clearGraph() {
        this.#view.querySelector('#graph').remove();
        this.#view.querySelector('.graph').insertAdjacentHTML("beforeend", '<canvas id="graph">' +
            '</canvas>');
    }
}