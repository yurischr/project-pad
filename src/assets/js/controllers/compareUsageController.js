import {Controller} from "./controller.js";
import {CompareUsageRepository} from "../repositories/compareUsageRepository.js";

export class CompareUsageController extends Controller {
    #view
    #compareUsageRepository

    constructor(view) {
        super();
        this.#compareUsageRepository = new CompareUsageRepository()
        this.#view = view
    }

    setupDatePickers() {
        const picker = new easepick.create({
            element: document.getElementById('datepicker'),
            css: [
                'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.1.3/dist/index.css',
            ],
            plugins: ['RangePlugin', 'AmpPlugin'],
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
            setup: (picker) => {
                picker.on('hide', () => {
                    this.#changeDate(picker.getStartDate(), picker.getEndDate())

                });
            },
        });

    }

    async #changeDate(date1, date2) {
        const startDate = new Date(date1).toISOString().split('T')[0]
        const endDate = new Date(date2).toISOString().split('T')[0]

        const data = await this.#compareUsageRepository.getDataDaily(startDate.replace(/-/g, "/"))


    }
}
