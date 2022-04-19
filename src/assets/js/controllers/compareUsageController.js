import {Controller} from "./controller.js";
import {CompareUsageRepository} from "../repositories/compareUsageRepository.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";
import CompareUsageRoutes from "../../../../server/routes/CompareUsageRoutes.js";

export class CompareUsageController extends Controller {
    #view
    #compareUsageRepository
    #electricityRepository
    #compareUsageRoutes

    constructor(view) {
        super();
        this.#compareUsageRepository = new CompareUsageRepository()
        this.#electricityRepository = new ElectricityRepository()
        this.#compareUsageRoutes = new CompareUsageRoutes()
        this.#view = view
    }

    setupDatePickers() {
        const currentDate = new Date(Date.now());
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
                maxDate: formattedDate
            },
            setup: (picker) => {
                picker.on('hide', () => {
                    this.#changeDate(picker.getStartDate(), picker.getEndDate())

                });
                picker.setDate(formattedDate)
            },
        });

        document.querySelector("#datepicker").innerHTML = "fadsfdsa"

    }

    async #changeDate(date1, date2) {
        const startDate = new Date(date1)
        const endDate = new Date(date2)

        startDate.setDate(startDate.getDate() + 1)
        endDate.setDate(endDate.getDate() + 1)

        const newStartDate = startDate.toISOString().split('T')[0]
        const newEndDate = endDate.toISOString().split('T')[0]

        // const data1 = await this.#compareUsageRepository.getDataDaily(newStartDate.replace(/-/g, "/"))
        // const data2 = await this.#compareUsageRepository.getDataDaily(newEndDate.replace(/-/g, "/"))

        const data1 = await this.#electricityRepository.getDailyData()
        console.log(data1);

        // document.querySelector("#result1").innerHTML = data1.data['electricity'] + " kWh";
        // document.querySelector("#result2").innerHTML = data2.data['electricity'] + " kWh";

        // this.#calculateDifferences(data1.data['electricity'], data2.data['electricity'])
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
