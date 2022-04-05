import {Controller} from "./controller.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";

export class ElectraController extends Controller{
    #TAB_DAY = 'day';
    #TAB_WEEK = 'week';
    #TAB_MONTH = 'month';
    #TAB_YEAR = 'year';
    #view
    #table
    #electricityRepository

    constructor(view) {
        super();
        this.#view = view;
        this.#electricityRepository = new ElectricityRepository();

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
            event.preventDefault()

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
            default:
                return false;
        }

        return true;
    }

    /**
     * Async function gets the monthly electricity data via the repository and adds the data to the table rows
     * @returns {Promise<void>}
     */
    async #fetchMonthlyData() {
        this.#view.querySelector(".time-column").innerHTML = 'Maand';

        try {
            $('#table-data').DataTable().clear().destroy();

            const data = await this.#electricityRepository.getMonthlyData()

            let template = this.#view.querySelector("#row-template");
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    console.log(data[i][j])
                    let clone = template.content.cloneNode(true);

                    clone.querySelector(".time").textContent = data[i][j]['month'];
                    clone.querySelector(".data").textContent = data[i][j]['consumption'];
                    this.#view.querySelector(".table-body").appendChild(clone)
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
                this.#view.querySelector(".table-body").appendChild(clone)
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
}