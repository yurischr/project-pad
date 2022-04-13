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
            plugins: ['RangePlugin', 'AmpPlugin','LockPlugin'],
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
                },
            },
            LockPlugin: {
                maxDate: "2022/01/03"
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

        const data1 = await this.#compareUsageRepository.getDataDaily(startDate.replace(/-/g, "/"))
        const data2 = await this.#compareUsageRepository.getDataDaily(endDate.replace(/-/g, "/"))

        const result1 = document.querySelector("#result1").innerHTML = data1.data['electricity'] + " kWh";
        const result2 = document.querySelector("#result2").innerHTML = data2.data['electricity'] + " kWh";

        this.#calculateDifferences(data1.data['electricity'], data2.data['electricity'])
    }

    #calculateDifferences(result1, result2) {
        const difference = document.querySelector("#difference")
        const percentage = (result1 / result2) * 100;



        if (result1 > result2) {
            difference.innerHTML = "- " + percentage + "%"
            difference.classList.add("negative");
        }

        if (result1 < result2) {
            difference.innerHTML = "+ " + percentage + "%"
            difference.classList.add("positive");
        }

        difference.innerHTML = "+/- " + percentage + "%"
        difference.classList.add("positive");


    }
}
