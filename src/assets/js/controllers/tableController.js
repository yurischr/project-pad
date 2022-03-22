/**
 * Controller responsible for table on dashboard
 * @author Ares Kok
 */
import {Controller} from "./controller.js";

export class TableController extends Controller {
    #tableBody = document.body;
    #tableTemplate = document.querySelector("#useTable");
    #day = document.querySelector("#selectDay");
    #week = document.querySelector("#selectWeek");
    #month = document.querySelector("#selectMonth");
    #year = document.querySelector("#selectYear");
    #buttons = [this.#day, this.#week, this.#month, this.#year];
    #tableView

    constructor() {
        super();
        console.log("test");
        this.#setupView();
    }


    async #setupView(){
        this.#tableView = await super.loadHtmlIntoCustomElement("html_views/table.html"
            , document.querySelector("#tableSpace2"));
        this.#tableView.querySelector("#selectDay").addEventListener("click", function (){
            this.#appendTable("Dag")
            this.#setSelected(this);
        })
        this.#tableView.querySelector("#selectWeek").addEventListener("click", function (){
            this.#appendTable("Week")
            this.#setSelected(this);
        })
        this.#tableView.querySelector("#selectMonth").addEventListener("click", function (){
            this.#appendTable("Maand")
            this.#setSelected(this);
        })
        this.#tableView.querySelector("#selectYear").addEventListener("click", function (){
            this.#appendTable("Jaar")
            this.#setSelected(this);
        })
    }
    /**
     * This function appends the table to the view.
     * @param timePeriod which time period the table provides.
     */
    #appendTable(timePeriod){
        const clone = this.#tableTemplate.content.cloneNode(true);
        const period = clone.querySelector("#timePeriod");
        period.innerHTML = timePeriod;
        this.#tableBody.appendChild(clone);
    }

    /**
     * This function highlights the selected button.
     * @param toBeSelected the button that is selected.
     */
    #setSelected(toBeSelected){
        for (let i = 0; i < this.#buttons.length; i++) {
            this.#buttons[i].style.background = "#FFFFFF"
            this.#buttons[i].style.color = "#849AA9"
        }
        toBeSelected.style.background = "#0063c3";
        toBeSelected.style.color = "#FFFFFF"
    }
}