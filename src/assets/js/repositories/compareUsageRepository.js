/**
 * repository for entity compareUsage - interacts with networkmanager
 * @author Yuri Schrieken
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class CompareUsageRepository {
    #networkManager;
    #route

    constructor() {
        this.#route = "/compare"
        this.#networkManager = new NetworkManager();
    }

    getDataDaily(selectedDay) {
        return this.#networkManager.doRequest(`${this.#route}/daily/day=${selectedDay}`, "GET")
    }
}