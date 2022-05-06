/**
 * Repository responsible for all gas data from server
 * @author Jordy Mol
 **/

import {NetworkManager} from "../framework/utils/networkManager.js";

export class GasRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/gas"
        this.#networkManager = new NetworkManager()
    }

    /**
     * Async function to get the daily gas data via network manager
     * @returns {Promise<*>}
     */
    async getDailyComparisonData() {
        return await this.#networkManager.doRequest(`${this.#route}/daily`, "GET");
    }

    /**
     * Async function to get the weekly gas data via network manager
     * @returns {Promise<*>}
     */
    async getWeeklyComparisonData() {
        return await this.#networkManager.doRequest(`${this.#route}/weekly`, "GET");
    }

    /**
     * Async function to get the monthly gas data via network manager
     * @returns {Promise<*>}
     */
    async getMonthlyComparisonData() {
        return await this.#networkManager.doRequest(`${this.#route}/monthly`, "GET");
    }

    /**
     * Async function to get the yearly gas data via network manager
     * @returns {Promise<*>}
     */
    async getYearlyComparisonData() {
        return await this.#networkManager.doRequest(`${this.#route}/yearly`, "GET");
    }
}