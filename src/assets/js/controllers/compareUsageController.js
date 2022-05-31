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
            plugins: ['RangePlugin', 'LockPlugin', 'AmpPlugin'],
            AmpPlugin: {
                dropdown: {
                    months: true,
                    years: true,
                    minYear: 2018
                },
                resetButton: true,
                darkMode: false
            },
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
                    // this.#getDaysArray(picker.getStartDate(), picker.getEndDate());
                    this.#graphDatepicker(picker.getStartDate(), picker.getEndDate())
                });
                picker.setDate(maxDate)
            },
        });

    }

    // #getDaysArray = function(start, end) {
    //     for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
    //         arr.push(new Date(dt).toISOString().split('T')[0]);
    //     }
    //     // console.log(arr);
    //     this.#graphDatepicker(arr);
    // };

    /**
     * Creates a graph based on data from chosen dates in the datepicker
     * @param startDate - start date
     * @param endDate - end date
     */
    async #graphDatepicker(startDate, endDate) {

        const newStartDate = startDate.toISOString().split('T')[0]
        const newEndDate = endDate.toISOString().split('T')[0]

        const data = await this.#electricityRepository.getData(newStartDate, newEndDate)

        console.log(data)

        let dayArray = []
        let dataArray = []

        for (let i = 0; i < data.data.length; i++) {
            dayArray[i] = data.data[i].day
            dataArray[i] = data.data[i].consumption
        }


        this.#view.querySelector('#graph-datepicker').remove();
        this.#view.querySelector('.datepicker-graph').insertAdjacentHTML("beforeend", '<canvas id="graph-datepicker" width="400" height="175">' +
            '</canvas>');
        const graph = document.querySelector("#graph-datepicker");

        const myChart = new Chart(graph, {
            type: 'line',
            data: {
                labels: dayArray,
                datasets: [{
                    label: 'Verbruik (kWh)',
                    data: dataArray,
                    fill: true,
                    backgroundColor: [
                        'rgba(0,97,194,0.4)'
                    ],
                    borderColor: '#0063c3',
                    tension: 0.4,
                }]
            },
            options:{
                onClick: this.#graphClickEvent
            }
        });
    }

    #graphClickEvent(event, array){
        console.log(event)
    }

    /**
     * get and displays data according to selected dates
     * @param startDate - first selected date
     * @param endDate - second selected date
     * @returns {Promise<void>}
     */
    async #getData(startDate, endDate) {
        this.#view.querySelector('.compare-usages-results').classList.remove("scale-effect");
        //formats date
        const dateFormat = {month: "long", day: "numeric", year: "numeric"}
        const firstSelectedDate = startDate.toLocaleDateString("nl-NL", dateFormat)
        const secondSelectedDate = endDate.toLocaleDateString("nl-NL", dateFormat)

        //adds formatted date to HTML
        document.querySelector("#first-long-date").innerHTML = firstSelectedDate
        document.querySelector("#second-long-date").innerHTML = secondSelectedDate

        //gets results from AIP
        const dataFirstSelectedDate = await this.#compareUsageRepository.getDataDaily(startDate.getFullYear() + "/" + this.#getCorrectNumericMonth(startDate))
        const dataSecondSelectedDate = await this.#compareUsageRepository.getDataDaily(endDate.getFullYear() + "/" + this.#getCorrectNumericMonth(endDate))

        //adds result to HTML
        document.querySelector("#first-result").innerHTML = dataFirstSelectedDate.data[startDate.getDate()]['electricity'] + " kWh";
        document.querySelector("#second-result").innerHTML = dataSecondSelectedDate.data[endDate.getDate()]['electricity'] + " kWh";

        // Add the result to the button values
        document.querySelector(".cu-mb-first button").value =  dataFirstSelectedDate.data[startDate.getDate()]['electricity']
        document.querySelector(".cu-mb-second button").value =  dataSecondSelectedDate.data[endDate.getDate()]['electricity']


        this.#calculateDifferences(dataFirstSelectedDate.data[startDate.getDate()]['electricity'], dataSecondSelectedDate.data[endDate.getDate()]['electricity'])
    }

    #getCorrectNumericMonth(date) {
        return date.getMonth() + 1;
    }

    /**
     * calculates and displays difference between two dates
     * @param firstDateResult - first result
     * @param secondDateResult - second result
     */
    #calculateDifferences(firstDateResult, secondDateResult) {
        const difference = document.querySelector("#difference")

        //calculates difference in percentage and rounds to two decimals
        const percentage = (secondDateResult - firstDateResult) / firstDateResult * 100;
        const roundedPercentage = Math.round(percentage * 100) / 100

        difference.classList.remove("positive", "negative")

        if (firstDateResult > secondDateResult) {
            //adds result to HTML if second result is less than first result
            //changes result color to red
            difference.innerHTML = roundedPercentage + "%"
            difference.classList.add("positive");
            return;
        }

        if (firstDateResult < secondDateResult) {
            //adds result to HTML if first result is less than second result
            //changes result color to green
            difference.innerHTML = "+" + roundedPercentage + "%"
            difference.classList.add("negative");
            return;
        }

        //adds result to HTML if the two results are equal
        //changes result color to green
        difference.innerHTML = "+/- " + roundedPercentage + "%"
        difference.classList.add("positive");


    }
}