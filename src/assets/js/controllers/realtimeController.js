import {Controller} from "./controller.js";
import {CompareUsageRepository} from "../repositories/compareUsageRepository.js";

export class RealtimeController extends Controller {
    #view
    #compareUsageRepository

    constructor(view) {
        super();
        this.#view = view;
        this.#compareUsageRepository = new CompareUsageRepository()
        this.#calculateRealtimeData()
    }

    #calculateRealtimeData() {
        const today = new Date()
        const yyyy = today.getFullYear()
        const mm = today.getMonth() + 1
        const dd = today.getDate()
        const dateFormat = yyyy + "/" + mm + "/" + dd

        console.log(yyyy + "/" + mm + "/" + dd)

        setInterval(async () => {
            try {
                const data = await this.#compareUsageRepository.getDataDaily(dateFormat);
                console.log(data);
            } catch(e) {
                //TODO: hou bij hoe vaak geprobeerd, wanneer > MAX_TRIES - stop setInterval
            }

        }, 3000)
    }

}