/**
 * Controller responsible for all events in the consumption view
 */

import {App} from "../app.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {Controller} from "./controller.js";
import {ElectraController} from "./electraController.js";

export class ConsumptionController extends Controller {
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
     * @private
     */
    async #setupView() {
        document.title = "Dashboard | Het Scheepvaartmuseum";

        //await for when HTML is loaded, never skip this method call in a controller
        this.#consumptionView = await super.loadHtmlIntoContent("html_views/pages/consumption.html");

        // Loading the header SVG into the DOM element [CLASS: .header-svg]
        await super.loadHtmlIntoCustomElement("assets/svg/consumption-header-svg.svg"
            , this.#consumptionView.querySelector(".header-svg"));

        await this.#handleDashboard();

    }

    /**
     * Method loads the components for the dashboard
     * @returns {Promise<void>}
     * @private
     */
    async #setupComponents() {
        //loading realtime cards into the DOM element [ID: #realtime-cards]
        await super.loadHtmlIntoCustomElement("html_views/components/realtime-cards.html"
            , this.#consumptionView.querySelector("#realtime-cards"));

        // loading the compare usages into the DOM element [ID: #usage-compare]
        await super.loadHtmlIntoCustomElement("html_views/components/compare-usages.html"
            , this.#consumptionView.querySelector("#usage-compare"));

        // Loading the table into the DOM element [ID: #tableSpace]
        await super.loadHtmlIntoCustomElement("html_views/components/temp-table.html"
            , this.#consumptionView.querySelector("#tableSpace"));

        // Loading the comparison chart into the DOM element [CLASS: .comparison-chart]
        await super.loadHtmlIntoCustomElement("html_views/components/comparisonChart.html"
            , this.#consumptionView.querySelector(".comparison-chart-box"));

        // Loading the nav pills into the DOM element [CLASS: .nav-pills-box]
        await super.loadHtmlIntoCustomElement("html_views/components/nav-pills.html"
            , this.#consumptionView.querySelector(".nav-pills-box"));

        // Loading the side-nav into the DOM element [CLASS: .side-nav-main-box]
        await super.loadHtmlIntoCustomElement("html_views/components/side-nav.html"
            , this.#consumptionView.querySelector(".side-nav-main-box"));

        // Loading the graph into the DOM element [CLASS: .graph]
        await super.loadHtmlIntoCustomElement("html_views/components/graph.html"
            , this.#consumptionView.querySelector(".graph-box"));
    }

    /**
     * Method calls the controller for the electra components and methods
     *
     * @private
     */
    async #handleDashboard() {
        await this.#setupComponents();
        App.setCurrentController("electra");
        new ElectraController(this.#consumptionView);
    }

    /**
     * The Intersection Observer API observes changes in the intersection of a target element with an ancestor element
     * @returns {Promise<void>}
     * @private
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

