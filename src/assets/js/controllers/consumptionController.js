/**
 * Controller responsible for all events in the consumption view
 */

import {App} from "../app.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {Controller} from "./controller.js";
import {ElectraController} from "./electraController.js";
import {GasController} from "./gasController.js";
import {AreaConsumptionController} from "./areaConsumptionController.js";

export class ConsumptionController extends Controller {
    #DASHBOARD_GAS = 'gas';
    #DASHBOARD_ELECTRA = 'electra';
    #electricityRepository
    #consumptionView

    constructor() {
        super();
        this.#electricityRepository = new ElectricityRepository();
        this.#setupView();

        window.addEventListener('scroll', this.#scrollEffect);
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        document.title = "Dashboard | Het Scheepvaartmuseum";

        //await for when HTML is loaded, never skip this method call in a controller
        this.#consumptionView = await super.loadHtmlIntoContent("html_views/consumption.html");

        // Loading the header SVG into the DOM element [CLASS: .header-svg]
        await super.loadHtmlIntoCustomElement("assets/svg/consumption-header-svg.svg"
            , document.querySelector(".header-svg"));

        // !TEST CODE FOR TESTING area-consumption
        await super.loadHtmlIntoCustomElement("html_views/components/area-consumption.html"
            , document.querySelector(".area-consumption"));

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
        }));


        // !TEST CODE FOR TESTING area-consumption
        await new AreaConsumptionController(this.#consumptionView);
    }

    async #setupComponents() {
        //loading realtime cards into the DOM element [ID: #realtime-cards]
        await super.loadHtmlIntoCustomElement("html_views/realtime-cards.html"
            , document.querySelector("#realtime-cards"));

        // loading the compare usages into the DOM element [ID: #usage-compare]
        await super.loadHtmlIntoCustomElement("html_views/compare-usages.html"
            , document.querySelector("#usage-compare"));

        // Loading the table into the DOM element [ID: #tableSpace]
        await super.loadHtmlIntoCustomElement("html_views/components/temp-table.html"
            , document.querySelector("#tableSpace"));

        // Loading the comparison chart into the DOM element [CLASS: .comparison-chart]
        await super.loadHtmlIntoCustomElement("html_views/components/comparisonChart.html"
            , document.querySelector(".comparison-chart-box"));

        // Loading the nav pills into the DOM element [CLASS: .nav-pills-box]
        await super.loadHtmlIntoCustomElement("html_views/components/nav-pills.html"
            , this.#consumptionView.querySelector(".nav-pills-box"));

        // Loading the side-nav into the DOM element [CLASS: .side-nav-main-box]
        await super.loadHtmlIntoCustomElement("html_views/components/side-nav.html"
            , document.querySelector(".side-nav-main-box"));

        // Loading the graph into the DOM element [CLASS: .graph]
        await super.loadHtmlIntoCustomElement("html_views/graph.html"
            , document.querySelector(".graph-box"));
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

    /**
     * The Intersection Observer API observes changes in the intersection of a target element with an ancestor element
     */
    #scrollEffect() {
        const rows = document.querySelectorAll('.scroll-effect');
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    entry.target.classList.toggle("show-section", entry.isIntersecting);
                });
            },
            {
                // indicate at what percentage of the target's visibility the observer's callback should be executed.
                threshold: 0.10
            }
        )

        rows.forEach(row => {
            // targeting the rows for the observer
            observer.observe(row)
        });
    };
}

