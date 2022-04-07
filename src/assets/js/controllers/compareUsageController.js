import {Controller} from "./controller.js";
import {App} from "../app.js";

export class CompareUsageController extends Controller{
    #view

    constructor(view) {
        super();

        this.#view = view

        this.#setupDatePickers()
    }

    #setupDatePickers(){
        const picker = new easepick.create({
            element: document.getElementById('datepicker'),
            css: [
                'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.1.3/dist/index.css',
            ],
            plugins: ['RangePlugin','AmpPlugin'],
            RangePlugin: {
                tooltipNumber(num) {
                    return num - 1;
                },
                locale: {
                    one: 'night',
                    other: 'nights',
                },
            },
            AmpPlugin: {
                dropdown: {
                    months: true,
                    years: true,
                },
            },

        });
    }
}
