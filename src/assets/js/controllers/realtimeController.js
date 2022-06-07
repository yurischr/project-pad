import {Controller} from "./controller.js";
import {CompareUsageRepository} from "../repositories/compareUsageRepository.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";
import {RealtimeRepository} from "../repositories/realtimeRepository.js";

export class RealtimeController extends Controller {
    #view
    #compareUsageRepository
    #electricityRepository
    #realtimeRepository

    constructor(view) {
        super();
        this.#view = view;
        this.#compareUsageRepository = new CompareUsageRepository()
        this.#electricityRepository = new ElectricityRepository()
        this.#realtimeRepository = new RealtimeRepository();

        this.#calculateRealtimeData()

        setInterval(() => {
            this.#calculateRealtimeData()
        }, 1000 * 60 * 15)
    }

    async #calculateRealtimeData() {
        const today = new Date()
        const yyyy = today.getFullYear() - 1
        const mm = today.getMonth() + 1
        const dd = today.getDate()
        const hh = today.getHours()
        const min = today.getMinutes()
        const roundedMinutes = (Math.round(min / 15) * 15) % 60

        const formattedElectricityDate = `${yyyy}-${mm}-${dd} ${hh}:${roundedMinutes}`

        const electricityData = await this.#realtimeRepository.getElectricityData(formattedElectricityDate);

        this.#view.querySelector("#realtime-electra-data").innerHTML = electricityData.data[0]['consumption'] + "kWh";

        const realtimeElectricity = electricityData.data[0]['consumption']

        // Adds the electricity + gas data to the value of the realtime card button for electricity
        this.#view.querySelector(".rt-electra button").value = realtimeElectricity;

        // set the dataset of consumption type to the buttons
        this.#view.querySelector(".rt-electra button").dataset.consumption = "electricity";

        this.#calculateDifference(realtimeElectricity)
        this.#satisfactionPercentage(electricityData.data[0]['consumption'])

    }

    async #calculateDifference(realtimeElectricity) {
        const electricity = this.#view.querySelector(".electricity-difference")
        const average = await this.#electricityRepository.getAverageData()

        const electricityDifference = ((realtimeElectricity / average.data[0]['averageConsumption']) * 100) - 100;

        electricity.classList.remove("positive", "negative")

        if (electricityDifference >= 0) {
            //changes result color to red
            electricity.classList.add("negative");
            electricity.innerHTML = "+" + Math.round(electricityDifference * 100) / 100 + "%"
            return;
        }
        //changes result color to green
        electricity.classList.add("positive");
        electricity.innerHTML = Math.round(electricityDifference * 100) / 100 + "%"
     }

    /**
     * Function to calculate the satisfaction of the current electricity usage. Gets called every 15 minutes.
     * @param currentElectricityUsage - the current electricity usage
     * @returns {Promise<void>} - Returns a promise that resolves to void
     * @async - async function to await the repository
     * @private
     */
    async #satisfactionPercentage(currentElectricityUsage) {
        const percentageBar = this.#view.querySelector('.percentage-bar');
        const percentageCount = this.#view.querySelector('.percentage-count');
        const satisfactionIcon = this.#view.querySelector('.satisfaction-icon');
        const iconsFolder = 'assets/images/icons';

        //Get and calculate the percentage of the electricity usage.
        const averageElectricityData = await this.#electricityRepository.getAverageData();
        let percentage = (( currentElectricityUsage / averageElectricityData.data[0]['averageConsumption']) * 100).toFixed(0);
        //If percentage is higher then 200, make it 200.
        if (percentage > 200) {
            percentage = 200;
        }
        //Calculate the rotate degree ( / 2 so 100% is in the middle), *1.8 because (100 * 1.8) is 180 degrees.
        const rotateDegree = 45 + ((percentage / 2) * 1.8);

        percentageBar.style.transform = `rotate(${rotateDegree}deg)`;
        percentageCount.innerHTML = `${percentage}%`;

        //Change icon according to the percentage.
        if (percentage > 125) {
            setSatisfactionIcon('sad-icon.png');
        } else if (percentage >= 80 && percentage < 125) {
            setSatisfactionIcon('neutral-icon.png');
        } else {
            setSatisfactionIcon('happy-icon.png');
        }

        function setSatisfactionIcon(iconName) {
            satisfactionIcon.src = `${iconsFolder}/${iconName}`;
        }
    }


}
