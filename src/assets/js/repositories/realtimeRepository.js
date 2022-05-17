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

    async getElectricityData(currentDay) {
        return await this.#networkManager
            .doRequest(`${this.#route}/electricity`, "POST", {
                "realtime": currentDay
            });
    }

    async getGassData(currentDay) {
        return await this.#networkManager
            .doRequest(`${this.#route}/gas`, "POST", {
                "realtime" : currentDay
            })
    }

}