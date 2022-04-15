/**
 * This class contains ExpressJS routes for getting electricity and gas data for the comparisonChart
 * this file is automatically loaded in app.js
 */

class ComparisonChartRoutes {
    #errCodes = require("../framework/utils/httpErrorCodes");
    #db = require("../framework/utils/databaseHelper");
    #app;
    #axios = require("../node_modules/axios").default;
    #DAILY_DATE = "2022/03";
    #MONTH_DATE = "2022";
    #YEAR_DATE = "2021";

    constructor(app) {
        this.#app = app;

        this.#getDailyComparisonData();
        this.#getWeeklyComparisonData();
        this.#getMonthlyComparisonData();
        this.#getYearlyComparisonData();
    }

    /**
     * Comparison route for getting the electricity and gas consumption on daily base
     * @private
     */
    #getDailyComparisonData() {
        this.#app.get("/comparison/daily", async (req, res) => {
            try {
                const url = `https://svm.hbo-ict.cloud/api/v1/data/${this.#DAILY_DATE}`;
                let data;
                await this.#axios.get(url).then(function (response) {
                    data = response.data
                }).catch(function (e) {
                    console.log(e)
                })

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data: data[7]})
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"})
                }
            } catch (e) {
                console.log(e)
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    /**
     * Comparison route for getting the electricity and gas consumption on weekly base
     * @private
     */
    #getWeeklyComparisonData() {
        this.#app.get("/comparison/weekly", async (req, res) => {
            try {
                const url = `https://svm.hbo-ict.cloud/api/v1/data/${this.#DAILY_DATE}`;
                let data;
                await this.#axios.get(url).then(function (response) {
                    data = response.data;
                }).catch(function (e) {
                    console.log(e);
                })

                if (data.length > 0) {
                    let electricityData = 0;
                    let gasData = 0;
                    for (let i = 1; i < data.length; i++) {
                        electricityData += data[i]['electricity'];
                        gasData += data[i]['gas'];
                    }
                    res.status(this.#errCodes.HTTP_OK_CODE).json({
                        data: {
                            electricity: electricityData.toFixed(2),
                            gas: gasData.toFixed(2)
                        }
                    });
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"});
                }
            } catch (e) {
                console.log(e)
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    /**
     * Comparison route for getting the electricity and gas consumption on monthly base
     * @private
     */
    #getMonthlyComparisonData() {
        this.#app.get("/comparison/monthly", async (req, res) => {
            try {
                const url = `https://svm.hbo-ict.cloud/api/v1/data/${this.#MONTH_DATE}`;
                let data;
                await this.#axios.get(url).then(function (response) {
                    data = response.data;
                }).catch(function (e) {
                    console.log(e);
                })

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data: data[0]});
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"});
                }
            } catch (e) {
                console.log(e)
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    /**
     * Comparison route for getting the electricity and gas consumption on yearly base
     * @private
     */
    #getYearlyComparisonData() {
        this.#app.get("/comparison/yearly", async (req, res) => {
            try {
                const url = `https://svm.hbo-ict.cloud/api/v1/data/${this.#YEAR_DATE}`;
                let data;
                await this.#axios.get(url).then(function (response) {
                    data = response.data;
                }).catch(function (e) {
                    console.log(e);
                })

                if (data.length > 0) {
                    let electricityData = 0;
                    let gasData = 0;
                    for (let i = 0; i < data.length; i++) {
                        electricityData += data[i]['electricity'];
                        gasData += data[i]['gas'];
                    }
                    res.status(this.#errCodes.HTTP_OK_CODE).json({
                        data: {
                            electricity: electricityData.toFixed(2),
                            gas: gasData.toFixed(2)
                        }
                    });
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"});
                }
            } catch (e) {
                console.log(e)
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}

module.exports = ComparisonChartRoutes