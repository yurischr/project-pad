import {Controller} from "./controller.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {AreaConsumptionRepository} from "../repositories/areaConsumptionRepository.js";

/**
 * Controller responsible for usage comparison
 * @author Harmohat Khangura
 */
export class AreaConsumptionController extends Controller {
    MAX_DATE = new Date("2022/03/07")
    #areaName;
    #view
    #electricityRepository
    #areaConsumptionRepository

    constructor(view) {
        super();
        this.#view = view;
        this.#electricityRepository = new ElectricityRepository();
        this.#areaConsumptionRepository = new AreaConsumptionRepository();

        this.#loadDetail();

        // when the click event is fired on the button the class is removed and page flips back to normal
        this.#view.querySelector(".flip-back").addEventListener("click", () => {
            this.#view.querySelector(".flip-page-wrapper").classList.remove("flip-vertical");
        });

        // looping through all the buttons and adding event listeners to them to handle the click event on them a
        this.#view.querySelectorAll(".area-card-btn button").forEach(btn => {
            btn.addEventListener("click", async (event) => {
                await this.#loadDetail();
                this.#view.querySelector(".flip-page-wrapper").classList.add("flip-vertical");

                this.#getAreas()
            });
        });

    }

    /**
     * Loads the detail of the area consumption and sets the date picker
     * @returns {Promise<void>} - a promise that resolves when the detail is loaded
     */
    async #loadDetail() {
        await super.loadHtmlIntoCustomElement("html_views/components/area-detail.html"
            , this.#view.querySelector(".back-flipped"));
    }

    async #getAreas() {
        let areaTemplate = this.#view.querySelector(".area-card-template");

        try {
            const data = await this.#areaConsumptionRepository.getArea();

            // removes child nodes of the parent .rooms-display
            while (this.#view.querySelector(".areas-view").firstChild) {
                this.#view.querySelector(".areas-view").removeChild(this.#view.querySelector(".areas-view").firstChild);
            }

            for (let key in data) {
                let areaClone = areaTemplate.content.cloneNode(true);
                let roomTemplate = areaClone.querySelector(".room-card-template");

                areaClone.querySelector(".area-title").textContent = data[key].name === "Open plein" ? data[key].name : data[key].name + " Vleugel";

                for (let roomsKey in data[key].rooms) {
                    let roomClone = roomTemplate.content.cloneNode(true);
                    let chartTemplate = roomClone.querySelector('.chart-template');

                    const roomData = this.#areaConsumptionRepository.getRoomConsumption(data[key].rooms[roomsKey].id, 2019);

                    console.log(roomData.data);
                    for (let roomDataKey in roomData.data) {
                        console.log(roomData.data[roomDataKey])
                    }

                    roomClone.querySelector(".room-title").textContent = data[key].rooms[roomsKey].name;

                    areaClone.querySelector(".rooms-display").appendChild(roomClone);
                }

                this.#view.querySelector(".areas-view").appendChild(areaClone)
            }
        } catch (e) {
            console.log(e);
        }
    }
    async #setGraph(chart) {
        const myChart = new Chart(chart, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

