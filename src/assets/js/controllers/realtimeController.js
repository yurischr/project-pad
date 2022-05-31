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
        const formattedGasDate = `${yyyy}-${mm}-${dd}`

        const electricityData = await this.#realtimeRepository.getElectricityData(formattedElectricityDate);
        const gasData = await this.#realtimeRepository.getGassData(formattedGasDate)

        this.#view.querySelector("#current-date").innerHTML = formattedGasDate

        this.#view.querySelector("#realtime-electra-data").innerHTML = electricityData.data[0]['consumption'] + "kWh";
        this.#view.querySelector("#realtime-gas-data").innerHTML = gasData.data[0]['usage'] + "m³";


        const realtimeElectricity = electricityData.data[0]['consumption']
        const realtimeGas = gasData.data[0]['usage']

        // Adds the electricity + gas data to the value of the realtime card button for electricity
        this.#view.querySelector(".rt-electra button").value = realtimeElectricity;
        this.#view.querySelector(".rt-gas button").value = realtimeGas

        // set the dataset of consumption type to the buttons
        this.#view.querySelector(".rt-gas button").dataset.consumption = "gas";
        this.#view.querySelector(".rt-electra button").dataset.consumption = "electricity";

        this.#calculateDifference(realtimeElectricity, realtimeGas)
        this.#satisfactionPercentage(electricityData.data[0]['consumption'])

    }

    async #calculateDifference(realtimeElectricity, realtimeGas) {
        const electricity = this.#view.querySelector(".electricity-difference")
        const average = await this.#electricityRepository.getAverageData()

        const electricityDifference = ((realtimeElectricity / average.data[0]['averageConsumption']) * 100) - 100;

        if (electricityDifference >= 0) {
            //changes result color to red
            electricity.classList.add("positive");
            electricity.innerHTML = "+" + Math.round(electricityDifference * 100) / 100 + "%"
            return;
        }
        //changes result color to green
        electricity.classList.add("negative");
        electricity.innerHTML = Math.round(electricityDifference * 100) / 100 + "%"
     }

    async #satisfactionPercentage(currentElectricityUsage) {
        const percentageBar = this.#view.querySelector('.percentage-bar');
        const percentageCount = this.#view.querySelector('.percentage-count');
        const satisfactionIcon = this.#view.querySelector('.satisfaction-icon');
        const iconsFolder = 'assets/images/icons';

        const averageElectricityData = await this.#electricityRepository.getAverageData();
        let percentage = ((averageElectricityData.data[0]['averageConsumption'] / currentElectricityUsage) * 100).toFixed(0);
        if (percentage > 100) {
            percentage = 100;
        }
        const rotateDegree = 45 + (percentage * 1.8);

        percentageBar.style.transform = `rotate(${rotateDegree}deg)`;
        percentageCount.innerHTML = `${percentage}%`;

        if (percentage < 50) {
            setSatisfactionIcon('sad-icon.png');
        } else if (percentage >= 50 && percentage < 70) {
            setSatisfactionIcon('neutral-icon.png');
        } else {
            setSatisfactionIcon('happy-icon.png');
        }

        function setSatisfactionIcon(iconName) {
            satisfactionIcon.src = `${iconsFolder}/${iconName}`;
        }
    }
}
