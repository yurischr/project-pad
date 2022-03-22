import {App} from "../app.js";
import {Controller} from "./controller.js";

export class ElectraController extends Controller{
    #view

    constructor(view) {
        super();

        this.#view = view
    }
}