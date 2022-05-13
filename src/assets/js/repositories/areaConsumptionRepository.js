/**
 * Repository responsible for all Area Consumption data from server
 *
 * @author Harmohat Khangura
 */

import {NetworkManager} from "../framework/utils/networkManager.js";

export class AreaConsumptionRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/areas"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Async function that sends the areaType as query to the network manager which will send it to our back-end to see
     * if a specific area is found with the query value
     * @param areaType - The areaType to search for
     * @returns {Promise<area>} - Returns a promise that resolves to the area if found
     */
    async getArea(areaType) {
        return await this.#networkManager
            .doRequest(`${this.#route}/get?areaType=${areaType}`, "GET");
    }

    /**
     * Async function that sends the roomId, year, month and day as queries to the network manager which will
     * send it to our back-end which will return the consumption data for the given roomId, year, month and day
     * @param roomId - The roomId of the room we want to get the consumption data for
     * @param year - The year we want to get the consumption data for
     * @returns {Promise<room>} - Returns the consumption data for the given roomId, year, month and day
     */
    async getRoomConsumption(roomId, year) {
        return await this.#networkManager
            .doRequest(`${this.#route}/get/room/consumption?roomId=${roomId}&year=${year}`, "GET");
    }
}