/**
 * repository for entity compareUsage - interacts with networkmanager
 * @author Yuri Schrieken
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class RealtimeRepository {
    #networkManager;
    #route

    constructor() {
        this.#route = "/realtime"
        this.#networkManager = new NetworkManager();
    }

    async getDataDaily(currentDay) {
        return await this.#networkManager
            .doRequest(`${this.#route}`, "POST", {
                "realtime": currentDay
            });
    }
}