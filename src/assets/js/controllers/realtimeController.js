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
            const data = await this.#compareUsageRepository.getDataDaily(dateFormat);

            console.log(data)
        }, 3000)
    }

}