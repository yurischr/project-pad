/**
 * Responsible for handling the actions happening on the navigation
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {App} from "../app.js";
import {Controller} from "./controller.js";

export class NavbarController extends Controller {
    #navbarView

    constructor() {
        super();
        this.#setupView();

        console.log(App.getCurrentController())


    }

    /**
     * Loads contents of desired HTML file into the index.html .navigation div
     * @returns {Promise<void>}
     * @private
     */
    async #setupView() {
        //await for when HTML is
        this.#navbarView = await super.loadHtmlIntoNavigation("html_views/components/navbar.html");

        this.#handleActiveClassOnLoad();

        this.#setTheme();

        //from here we can safely get elements from the view via the right getter
        const anchors = this.#navbarView.querySelectorAll("a.nav-links");

        //set click listener on each anchor
        anchors.forEach(anchor => anchor.addEventListener("click", (event) => this.#handleClickNavigationItem(event)));

        this.#navbarView.querySelector("#checkbox").addEventListener("change", (event) => {
            this.#handleThemeToggle(event);
        })
    }

    /**
     * Reads data attribute on each .nav-link and then when clicked navigates to specific controller
     * @param event - clicked anchor event
     * @returns {boolean} - to prevent reloading
     * @private
     */
    #handleClickNavigationItem(event) {
        //Get the data-controller from the clicked element (this)
        const clickedAnchor = event.target;
        const controller = clickedAnchor.dataset.controller;

        if (typeof controller === "undefined") {
            console.error("No data-controller attribute defined in anchor HTML tag, don't know which controller to load!")
            return false;
        }

        this.#navbarView.querySelectorAll(".nav-links").forEach((navLink) => {
            navLink.classList.remove("active-link");
        });

        if (!clickedAnchor.parentNode.classList.contains("navbar-brand")) {
            clickedAnchor.classList.add("active-link");
        }

        //Pass the action to a new function for further processing
        App.loadController(controller);

        //Return false to prevent reloading the page
        return false;
    }

    /**
     * Sets the active class on the navigation bar based on the current controller
     * @private
     */
    #handleActiveClassOnLoad() {
        let links = this.#navbarView.querySelectorAll("[data-controller]");

        for (let link of links) {
            if (link.dataset.controller === App.getCurrentController()) {
                if (!link.parentNode.classList.contains("navbar-brand")) {
                    link.classList.add("active-link");
                }
            }
        }
    }

    /**
     * Handles the toggle of the theme switchers
     * @param event - the event that triggered the click (Theme-toggle)
     */
    #handleThemeToggle(event) {
        if (event.target.checked) {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
            App.sessionManager.set("theme", "dark");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
            App.sessionManager.set("theme", "light");
        }
    }

    /**
     * Methods sets the theme based on the theme values in the session
     */
    #setTheme() {
        if (App.sessionManager.get("theme") === "dark") {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
            this.#navbarView.querySelector("#checkbox").checked = true;
        } else {
            document.body.classList.add("light-mode")
            document.body.classList.remove("dark-mode");
            this.#navbarView.querySelector("#checkbox").checked = false;
        }
    }
}
