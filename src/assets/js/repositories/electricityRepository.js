/**
 * Repository responsible for all Electricity data from server - CRUD
 *
 * @author Harmohat Khangura,....
 */

import {NetworkManager} from "../framework/utils/networkManager.js";

export class ElectricityRepository {
    #route
    #networkManager

    /*
     * Constructor for ElectricityRepository class
     */
    constructor() {
        this.#route = "/electricity"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Async function to get the weekly electricity data via network manager
     * @returns {Promise<void>}
     */
    async getWeeklyData() {
        return await this.#networkManager
            .doRequest(`${this.#route}/weekly`, "GET");
    }

    /**
     * Async function to get the daily electricity data via network manager
     * @returns {Promise<*>}
     */
    async getDailyData() {
        return await this.#networkManager
            .doRequest(`${this.#route}/daily`, "GET")
    }

    /**
     * Async function to get the monthly electricity data via network manager
     * @returns {Promise<*>}
     */
    async getMonthlyData() {
        return await this.#networkManager
            .doRequest(`${this.#route}/monthly`, "GET")
    }


    /**
     * Async function to get the yearly electricity data via network manager
     * @returns {Promise<*>}
     */
    async getYearlyData() {
        return await this.#networkManager
            .doRequest(`${this.#route}/yearly`, "GET")
    }

    /**
     * Async function to get the electricity data for specific dates via network manager
     * @returns {Promise<*>}
     */
    async getData(startDate, endDate) {
        return await this.#networkManager
            .doRequest(`${this.#route}/dateData`, "POST", {
                "startDate": startDate, "endDate": endDate
            })
    }

    /**
     * Async function to get the average electricity data via network manager
     * @returns {Promise<*>}
     */
    async getAverageData() {
        return await this.#networkManager
            .doRequest(`${this.#route}/average`, 'GET');
    }
}