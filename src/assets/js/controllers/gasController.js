import {App} from "../app.js";
import {Controller} from "./controller.js";

export class GasController extends Controller{
    #view

    constructor(view) {
        super();

       this.#view = view
    }
}