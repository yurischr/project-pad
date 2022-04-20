import {Controller} from "./controller.js";
import {CompareUsageRepository} from "../repositories/compareUsageRepository.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";

export class CompareUsageController extends Controller {
    #view
    #compareUsageRepository
    #electricityRepository

    constructor(view) {
        super();
        this.#compareUsageRepository = new CompareUsageRepository()
        this.#electricityRepository = new ElectricityRepository()
        this.#view = view
    }

    setupDatePickers() {
        const currentDate = new Date("Date.now()");
        const maxDate = new Date("2022/03/08")
        const formattedDate = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;

        const picker = new easepick.create({
            element: document.getElementById('datepicker'),
            css: [
                'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.1.3/dist/index.css',
            ],
            plugins: ['RangePlugin', 'LockPlugin'],
            RangePlugin: {
                tooltipNumber(num) {
                    return num - 1;
                },
                locale: {
                    one: 'night',
                    other: 'nights',
                },
            },
            LockPlugin: {
                maxDate: maxDate
            },
            setup: (picker) => {
                picker.on('hide', () => {
                    this.#changeDate(picker.getStartDate(), picker.getEndDate())

                });
                picker.setDate(maxDate)
            },
        });

    }

    async #changeDate(date1, date2) {

        const startDate = new Date(date1)
        const endDate = new Date(date2)

        startDate.setMonth(startDate.getMonth() + 1)
        endDate.setMonth(endDate.getMonth() + 1)

        const data1 = await this.#compareUsageRepository.getDataDaily(startDate.getFullYear() + "/" + startDate.getMonth())
        const data2 = await this.#compareUsageRepository.getDataDaily(endDate.getFullYear() + "/" + endDate.getMonth())

        document.querySelector("#result1").innerHTML = data1.data[startDate.getDate()]['electricity'] + " kWh";
        document.querySelector("#result2").innerHTML = data2.data[endDate.getDate()]['electricity'] + " kWh";

        this.#calculateDifferences(data1.data[startDate.getDate()]['electricity'], data2.data[endDate.getDate()]['electricity'])
    }

    #calculateDifferences(result1, result2) {
        const difference = document.querySelector("#difference")
        const percentage = (result2 - result1) / result1 * 100;
        const rounded_percentage = Math.round(percentage * 100) / 100


        if (result1 > result2) {
            difference.innerHTML = rounded_percentage + "%"
            difference.classList.add("negative");
            return
        }

        if (result1 < result2) {
            difference.innerHTML = "+" + rounded_percentage + "%"
            difference.classList.add("positive");
            return;
        }

        difference.innerHTML = "+/- " + rounded_percentage + "%"
        difference.classList.add("positive");


    }
}
