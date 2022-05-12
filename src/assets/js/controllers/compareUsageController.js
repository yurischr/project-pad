import {Controller} from "./controller.js";
import {CompareUsageRepository} from "../repositories/compareUsageRepository.js";
import {ElectricityRepository} from "../repositories/electricityRepository.js";

/**
 * Controller responsible for usage comparison
 * @author Yuri Schrieken
 */
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

    /**
     * setup for date-pickers
     * @returns {number}
     */
    setupDatePickers() {
        const currentDate = new Date("Date.now()");
        const maxDate = new Date("2022/03/07")
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
                    this.#getData(picker.getStartDate(), picker.getEndDate())

                });
                picker.setDate(maxDate)
            },
        });

    }

    /**
     * get and displays data according to selected dates
     * @param startDate - first selected date
     * @param endDate - second selected date
     * @returns {Promise<void>}
     */
    async #getData(startDate, endDate) {
        console.log("HJIER KOM IK");
        //formats date
        const dateFormat = {month: "long", day: "numeric", year: "numeric"}
        const firstSelectedDate = startDate.toLocaleDateString("nl-NL", dateFormat)
        const secondSelectedDate = endDate.toLocaleDateString("nl-NL", dateFormat)

        //adds formatted date to HTML
        document.querySelector("#long-date1").innerHTML = firstSelectedDate
        document.querySelector("#long-date2").innerHTML = secondSelectedDate

        // //month buffer for date-picker
        console.log(startDate)
        console.log(endDate)
        //gets results from AIP
        const data1 = await this.#compareUsageRepository.getDataDaily(startDate.getFullYear() + "/" + this.#getCorrectNumericMonth(startDate))
        const data2 = await this.#compareUsageRepository.getDataDaily(endDate.getFullYear() + "/" + this.#getCorrectNumericMonth(endDate))

        //adds result to HTML
        document.querySelector("#result1").innerHTML = data1.data[startDate.getDate()]['electricity'] + " kWh";
        document.querySelector("#result2").innerHTML = data2.data[endDate.getDate()]['electricity'] + " kWh";

        this.#calculateDifferences(data1.data[startDate.getDate()]['electricity'], data2.data[endDate.getDate()]['electricity'])
    }

    #getCorrectNumericMonth(date) {
        return date.getMonth() + 1;
    }

    /**
     * calculates and displays difference between two dates
     * @param result1 - first result
     * @param result2 - second result
     */
    #calculateDifferences(result1, result2) {
        const difference = document.querySelector("#difference")

        //calculates difference in percentage and rounds to two decimals
        const percentage = (result2 - result1) / result1 * 100;
        const rounded_percentage = Math.round(percentage * 100) / 100


        if (result1 > result2) {
            //adds result to HTML if second result is less than first result
            //changes result color to red
            difference.innerHTML = rounded_percentage + "%"
            difference.classList.add("positive");
            return;
        }

        if (result1 < result2) {
            //adds result to HTML if first result is less than second result
            //changes result color to green
            difference.innerHTML = "+" + rounded_percentage + "%"
            difference.classList.add("negative");
            return;
        }

        //adds result to HTML if the two results are equal
        //changes result color to green
        difference.innerHTML = "+/- " + rounded_percentage + "%"
        difference.classList.add("positive");


    }
}
