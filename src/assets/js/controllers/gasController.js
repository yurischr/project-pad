import {App} from "../app.js";
import {Controller} from "./controller.js";
import {ConsumptionController} from "./consumptionController.js";

export class GasController extends Controller{
    #view

    constructor(view) {
        super();
        this.#view = view;

        this.#svgAnimation();
    }

    #svgAnimation() {
        setTimeout(() => {
            this.#view.querySelectorAll("#windows path").forEach(path => {
                path.classList.remove("window-lights");
            });
        }, 500);
    }
}