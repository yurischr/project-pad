import {Controller} from "./controller.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {CompareUsageRepository} from "../repositories/compareUsageRepository.js";
import {ComparisonChartRepository} from "../repositories/comparisonChartRepository.js";
import {CompareUsageController} from "./compareUsageController.js";

export class ElectraController extends Controller {
    #TAB_DAY = 'day';
    #TAB_WEEK = 'week';
    #TAB_MONTH = 'month';
    #TAB_YEAR = 'year';
    #view
    #table
    #electricityRepository
    #comparisonChartRepository
    #compareUsageController;
    #compareUsageRepository;

    constructor(view) {
        super();
        this.#view = view;
        this.#compareUsageController = new CompareUsageController(this.#view);
        this.#electricityRepository = new ElectricityRepository();
        this.#comparisonChartRepository = new ComparisonChartRepository();
        this.#compareUsageRepository = new CompareUsageRepository();

        this.#compareUsageRepository.getDataDaily('2018');

        this.#compareUsageController.setupDatePickers();


        // Calling the method to show the graph
        this.#graph();

        // Calling the method for the electricity SVG Animation
        this.#svgAnimation();

        // Selecting all the the period tab links
        const tabs = this.#view.querySelectorAll("button.tab-link");

        // When a specific tab is clicked the `handleTableView` will be called
        tabs.forEach(tab => tab.addEventListener("click", async (event) => {
            // Removes all the child nodes of the table in tbody
            while (this.#view.querySelector(".table-body").hasChildNodes()) {
                this.#view.querySelector(".table-body").removeChild(
                    document.querySelector(".table-body").firstChild
                );
            }

            // Prevent the page from scrolling to the top when clicking a tab
            event.preventDefault();

            // Calling the method for handling the table view and the active tab buttons
            await this.#handleTableView(event, tabs);
        }))
    }

    /**
     * Method selects all the paths for the 'windows' and the CSS class to the paths
     */
    #svgAnimation() {
        this.#view.querySelectorAll("#windows path").forEach(path => {
            path.classList.add("window-lights");
        });
    }

    /**
     * Method removes the active class from all the buttons and adds the active class to the clicked tab button.
     * and calls the methods for the table data depending on which tab has been clicked
     * @param event - The event that has been triggered (Tab)
     * @param tabs - The array of all the tab buttons
     * @returns {Promise<boolean>} - Returns a promise that resolves to true  if the table was successfully handled
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
                break;
            case this.#TAB_WEEK:
                await this.#fetchPeriodData(await this.#electricityRepository.getWeeklyData(), "Week", "week");
                this.#comparisonChart(await this.#comparisonChartRepository.getWeeklyComparisonData());
                break;
            case this.#TAB_MONTH:
                await this.#fetchPeriodData(await this.#electricityRepository.getMonthlyData(), "Maand", "maand");
                this.#comparisonChart(await this.#comparisonChartRepository.getMonthlyComparisonData());
                break;
            case this.#TAB_YEAR:
                await this.#fetchPeriodData(await this.#electricityRepository.getYearlyData(), "Jaar", "year");
                this.#comparisonChart(await this.#comparisonChartRepository.getYearlyComparisonData());
                break;
            default:
                return false;
        }

        return true;
    }

    /**
     * Async function gets the data for a period via the repository and adds the data to the table rows
     * @param data - data from period
     * @param timePeriod - time period (day, week, month, year)
     * @param selector - selector for JSON
     * @returns {Promise<void>} - Returns a promise that resolves to void
     */
    async #fetchPeriodData(data, timePeriod, selector) {
        try {
            $('#table-data').DataTable().clear().destroy();

            this.#view.querySelector(".time-column").innerHTML = timePeriod;

            let template = this.#view.querySelector("#row-template");

            for (let row in data.data) {
                let clone = template.content.cloneNode(true);

                clone.querySelector(".time").textContent = data.data[row][selector];
                clone.querySelector(".data").textContent = data.data[row]['consumption'];
                this.#view.querySelector(".table-body").appendChild(clone);
            }
            await this.#setDatable()
        } catch (e) {
            console.log("error while fetching the electricity data", e);
        }
    }

    /**
     * Method sets the datatable for the table
     * @returns {Promise<void>} - Returns a promise that resolves to void
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
     */
    #comparisonChart(comparisonData) {
        this.#view.querySelector('#chart').remove();
        this.#view.querySelector('.comparison-chart').insertAdjacentHTML("beforeend", '<canvas id="chart">' +
            '</canvas>');
        const electricity = comparisonData.data['electricity'];
        const gas = comparisonData.data['gas'];

        const data = {
            labels: ['Elektriciteit', 'Gas'],
            datasets: [{
                label: 'Verbruik',
                data: [electricity, gas],
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
    }

    async #graph() {
        const graph = document.querySelector("#graph");
        const yearlyData = this.#electricityRepository.getYearlyData();
        let consumptionYearly = [];

        for (let i = 0; i < 4; i++) {
            consumptionYearly[i] = await yearlyData.then(function (results) {
                return results.data[i].consumption;
            });
        }

        const myChart = new Chart(graph, {
            type: 'line',
            data: {
                labels: ['2018', '2019', '2020', '2021'],
                datasets: [{
                    label: 'Verbruik (kWh)',
                    data: [consumptionYearly[0], consumptionYearly[1], consumptionYearly[2], consumptionYearly[3]],
                    fill: false,
                    borderColor: '#0063c3',
                    tension: 0.4,
                }]
            }
        });
    }
}