/**
 * Repository responsible for all user data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with network!
 *
 * @author Harmohat Khangura,
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class ElectraRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/electra"
        this.#networkManager = new NetworkManager();
    }

}