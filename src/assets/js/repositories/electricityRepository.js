/**
 * Repository responsible for all Electricity data from server - CRUD
 *
 * @author Harmohat Khangura,....
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class ElectricityRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/electricity"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Async function to get the weekly electricity data via network manager
     *
     * @returns {Promise<void>}
     */
    async getWeeklyData(){
        return await this.#networkManager
            .doRequest(`${this.#route}/weekly`, "GET");
    }

}