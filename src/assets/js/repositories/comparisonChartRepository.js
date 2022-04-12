/**
 * Repository responsible for all comparison data from server - CRUD
 **/

import {NetworkManager} from "../framework/utils/networkManager.js";

export class ComparisonChartRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/comparison"
        this.#networkManager = new NetworkManager()
    }

    /**
     * Async function to get the daily electricity and gas data via network manager
     * @returns {Promise<*>}
     */
    async getDailyComparisonData() {
        return await this.#networkManager.doRequest(`${this.#route}/daily`, "GET");
    }

    /**
     * Async function to get the weekly electricity and gas data via network manager
     * @returns {Promise<*>}
     */
    async getWeeklyComparisonData() {
        return await this.#networkManager.doRequest(`${this.#route}/weekly`, "GET");
    }

    /**
     * Async function to get the monthly electricity and gas data via network manager
     * @returns {Promise<*>}
     */
    async getMonthlyComparisonData() {
        return await this.#networkManager.doRequest(`${this.#route}/monthly`, "GET");
    }

    /**
     * Async function to get the yearly electricity and gas data via network manager
     * @returns {Promise<*>}
     */
    async getYearlyComparisonData() {
        return await this.#networkManager.doRequest(`${this.#route}/yearly`, "GET");
    }
}

