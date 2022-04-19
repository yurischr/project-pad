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

    async getDataDaily(selectedDay) {
        return await this.#networkManager
            .doRequest(`${this.#route}/daily`, "POST", {
            "selectedDay": selectedDay
        });
    }
}