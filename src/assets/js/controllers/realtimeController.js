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
        this.#setIntervals()
        this.#satisfactionPercentage()
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

        this.#view.querySelector("#realtime-electra-data").innerHTML = electricityData.data[0]['consumption'] + "kWh";
        this.#view.querySelector("#realtime-gas-data").innerHTML = gasData.data[0]['usage'] + "m^3"
    }

    #satisfactionPercentage() {
        const percentageBar = this.#view.querySelector('.percentage-bar');
        const percentageCount = this.#view.querySelector('.percentage-count');
        const satisfactionIcon = this.#view.querySelector('.satisfaction-icon');
        const iconsFolder = 'assets/images/icons';
        const percentage = 20;
        const rotateDegree = 45 + (percentage * 1.8);
        percentageBar.style.transform = `rotate(${rotateDegree}deg)`;
        percentageCount.innerHTML = `${percentage}%`;

        if (percentage < 50) {
            setSatisfactionIcon(`${iconsFolder}/sad-icon.png`)
        } else if (percentage >= 50 && percentage < 70) {
            setSatisfactionIcon(`${iconsFolder}/neutral-icon.png`)
        } else {
           setSatisfactionIcon(`${iconsFolder}/happy-icon.png`)
        }

        function setSatisfactionIcon(iconPath) {
            satisfactionIcon.src = iconPath;
        }
    }
}
