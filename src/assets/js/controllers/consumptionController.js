/**
 * Controller responsible for all events in the consumption view
 */

import {App} from "../app.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {Controller} from "./controller.js";
import {ElectraController} from "./electraController.js";
import {GasController} from "./gasController.js";
import {CompareUsageController} from "./compareUsageController.js";

export class ConsumptionController extends Controller {
    #DASHBOARD_GAS = 'gas';
    #DASHBOARD_ELECTRA = 'electra';
    #electricityRepository
    #consumptionView

    constructor() {
        super();
        this.#electricityRepository = new ElectricityRepository();
        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        document.title = "Dashboard | Het Scheepvaartmuseum";

        //await for when HTML is loaded, never skip this method call in a controller
        this.#consumptionView = await super.loadHtmlIntoContent("html_views/consumption.html")
        await this.#setupComponents();
    }

    async #setupComponents() {
        //loading realtime cards into the DOM element [ID: #realtime-cards]
        await super.loadHtmlIntoCustomElement("html_views/realtime-cards.html"
            , document.querySelector("#realtime-cards"));

        // loading the compare usages into the DOM element [ID: #usage-compare]
        await super.loadHtmlIntoCustomElement("html_views/compare-usages.html"
            , document.querySelector("#usage-compare"))
        new CompareUsageController(this.#consumptionView);

        // Loading the table into the DOM element [ID: #tableSpace]
        await super.loadHtmlIntoCustomElement("html_views/components/temp-table.html"
            , document.querySelector("#tableSpace"));

        // Loading the comparison chart into the DOM element [CLASS: .comparison-chart]
        await super.loadHtmlIntoCustomElement("html_views/components/comparisonChart.html"
            , document.querySelector(".comparison-chart"));

        // Loading the header SVG into the DOM element [CLASS: .header-svg]
        await super.loadHtmlIntoCustomElement("assets/svg/consumption-header-svg.svg"
            , document.querySelector(".header-svg"));

        // Loading the nav pills into the DOM element [CLASS: .nav-pills-box]
        await super.loadHtmlIntoCustomElement("html_views/components/nav-pills.html"
            , this.#consumptionView.querySelector(".nav-pills-box"));

        // Loading the graph into the DOM element [CLASS: .graph]
        await super.loadHtmlIntoCustomElement("html_views/graph.html"
            , document.querySelector(".graph"));

        // Selecting all the buttons with the class: dashboard-buttons
        const dashboardBtns = this.#consumptionView.querySelectorAll("button.dashboard-buttons");

        // Adding event listeners to all the buttons
        dashboardBtns.forEach(button => button.addEventListener("click", async (event) => {
            dashboardBtns.forEach((button) => {
                button.classList.remove('active-dashboard-btn');
            });

            // Avoids the event from adding an active class to the icon
            if (event.target.nodeName === "BUTTON") {
                event.target.classList.add('active-dashboard-btn');
            }

            // Calling the method for handling the dashboard
            this.#handleDashboard(event);
        }))
    }

    /**
     * Method calls the dashboard (electricity or gas) based on which button is clicked
     *
     * @param event - The event that triggered the method (Button)
     * @returns {boolean} - Returns true if the dashboard was successfully handled
     */
    async #handleDashboard(event) {
        switch (event.target.dataset.dashboard) {
            case this.#DASHBOARD_GAS:
                await this.#setupComponents();
                App.setCurrentController("gas");
                new GasController(this.#consumptionView);
                break;
            case this.#DASHBOARD_ELECTRA:
                await this.#setupComponents();
                App.setCurrentController("electra");
                new ElectraController(this.#consumptionView);
                break;
            default:
                return false;
        }

        return true;
    }
}

