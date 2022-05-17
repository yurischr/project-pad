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
    }

    #calculateRealtimeData() {

        let interval = setInterval(async () => {
            try {
                const today = new Date()
                const yyyy = today.getFullYear() - 1
                const mm = today.getMonth() + 1
                const dd = today.getDate()
                const hh = today.getHours()
                const min = today.getMinutes()
                const roundedMinutes = this.#roundToNearest15(min)

                const formattedElectricityDate = `${yyyy}-${mm}-${dd} ${hh}:${roundedMinutes}`
                const formattedGasDate = `${yyyy}-${mm}-${dd}`

                const electricityData = await this.#realtimeRepository.getElectricityData(formattedElectricityDate);
                const gasData = await this.#realtimeRepository.getGassData(formattedGasDate)

                this.#view.querySelector("#realtime-electra-data").innerHTML = electricityData.data[0]['consumption'] + "kWh";
                this.#view.querySelector("#realtime-gas-data").innerHTML = gasData.data[0]['usage'] + "m^3"


            } catch (e) {
                let errorAmount = 0;

                errorAmount++;
                if (errorAmount > 1) {
                    clearInterval(interval);
                    console.error("Error with interval -> interval has been stopped: " + e)
                }
            }

        }, 1000*60*15)
    }

    #roundToNearest15(minutes) {
        let minuten = (Math.round(minutes / 15) * 15) % 60
        return minuten;
    }

}