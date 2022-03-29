import {Controller} from "./controller.js";
import {App} from "../app";

export class CompareUsageController extends Controller{
    #view

    constructor(view) {
        super();

        this.#view = view
    }
}
