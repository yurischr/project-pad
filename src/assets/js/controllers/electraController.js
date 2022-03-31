import {App} from "../app.js";
import {Controller} from "./controller.js";

export class ElectraController extends Controller{
    #view

    constructor(view) {
        super();

        this.#view = view;

        this.#svgAnimation();
    }

    #svgAnimation() {
        this.#view.querySelectorAll("#windows path").forEach(path => {
            path.classList.add("window-lights");
        });
    }
}