import {Controller} from "./controller.js";

export class RealtimeController extends Controller {
    #view

    constructor(view) {
        super();
        this.#view = view;
    }



}