import {Controller} from "./controller.js";
import {App} from "../app.js";

export class CompareUsageController extends Controller{
    #view

    constructor(view) {
        super();

        this.#view = view
        console.log(this.#view)
    }
}
