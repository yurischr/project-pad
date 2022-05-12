import {Controller} from "./controller.js";
import {CompareUsageRepository} from "../repositories/compareUsageRepository.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";

export class RealtimeController extends Controller {
    #view
    #compareUsageRepository
    #electricityRepository

    constructor(view) {
        super();
        this.#view = view;
        this.#compareUsageRepository = new CompareUsageRepository()
        this.#electricityRepository = new ElectricityRepository()
        this.#calculateRealtimeData()
    }

    #calculateRealtimeData() {
        const today = new Date()
        const yyyy = today.getFullYear() - 1
        const mm = today.getMonth() + 1
        const dd = today.getDate()
        const dateFormat = yyyy + "/" + mm + "/" + dd
        let errorAmount = 0;

            console.log(yyyy + "/" + mm + "/" + dd)

        let interval = setInterval(async () => {
            try {
                const data = await this.#electricityRepository.getDailyData(dateFormat);
                console.log(data);

                errorAmount++
                if (errorAmount > 4) {
                    clearInterval(interval)
                }
            } catch(e) {
                errorAmount++;
                if (errorAmount > 4) {
                    clearInterval(interval);
                    console.error("Error with interval -> interval has been stopped: " + e)
                }
            }

        }, 3000)
    }

}