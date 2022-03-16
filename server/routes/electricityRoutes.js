/**
 * This class contains ExpressJS routes specific for the Electricity entity
 * this file is automatically loaded in app.js
 *
 * @author Harmohat Khangura, ....
 */
class ElectricityRoutes {
    #ELECTRA_START_DATETIME = "2018-01-01 00:00:00";
    #ELECTRA_END_DATETIME = "2022-03-08 23:45:00";
    #errCodes = require("../framework/utils/httpErrorCodes")
    #db = require("../framework/utils/databaseHelper")
    #cryptoHelper = require("../framework/utils/cryptoHelper");
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     */
    constructor(app) {
        this.#app = app;

        this.#getWeeklyData()
        this.#getDailyData()
        this.#getMonthlyData()
        // this.#getYearlyData()
    }

    #getMonthlyData() {
        this.#app.get("/electricity/monthly", async (req, res) => {
            try {
                const data = await this.#db.handleQuery({
                    // query:
                    //     "SELECT " +
                    //     "time AS start, " +
                    //     "YEARWEEK(time) AS week, " +
                    //     "sum(consumption) as consumption " +
                    //     "FROM electricity " +
                    //     "WHERE time BETWEEN ? AND ? " +
                    //     "GROUP BY YEARWEEK(time) " +
                    //     "ORDER BY time;",
                    // values: [this.#ELECTRA_START_DATETIME, this.#ELECTRA_END_DATETIME]
                })


                if (data.length > 0){
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data})
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"})
                }
            } catch (err) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: err});
            }

        })

    }

    /**
     * Electricity route for getting the electricity consumption on weekly base
     * @private
     */
    #getWeeklyData() {
        this.#app.get("/electricity/weekly", async (req, res) => {
            try {
                const data = await this.#db.handleQuery({
                    query:
                        "SELECT " +
                        "time AS start, " +
                        "YEARWEEK(time) AS week, " +
                        "sum(consumption) as consumption " +
                        "FROM electricity " +
                        "WHERE time BETWEEN ? AND ? " +
                        "GROUP BY YEARWEEK(time) " +
                        "ORDER BY time;",
                    values: [this.#ELECTRA_START_DATETIME, this.#ELECTRA_END_DATETIME]
                });

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data});
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"});
                }
            } catch (err) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: err});
            }
        });
    }

    /**
     * Electricity route for getting the electricity consumption on daily base
     * @private
     */
    #getDailyData() {
        const dailyStartTime2018 = "2018-01-01 00:00:00";
        const dailyStartTime2019 = "2019-01-01 00:00:00";
        const dailyStartTime2020 = "2020-01-01 00:00:00";
        const dailyStartTime2021 = "2021-01-01 00:00:00";
        const dailyStartTime2022 = "2022-01-01 00:00:00";
        const dailyEndTime = "2022-03-08 23:45:00";
        const query = `SELECT time AS day, SUM(consumption / 4) AS consumption FROM electricity
                         WHERE time BETWEEN ? AND ?
                         GROUP BY DAYOFYEAR(time)
                         ORDER BY time`;

        this.#app.get("/electricity/daily", async (req, res) => {
            let dailyData = [];
            try {
                const dailyData2018 = await this.#db.handleQuery({
                    query: query,
                    values: [dailyStartTime2018, dailyStartTime2019]
                });

                if (dailyData2018.length > 0) {
                    dailyData.push(dailyData2018)
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"})
                }

                const dailyData2019 = await this.#db.handleQuery({
                    query: query,
                    values: [dailyStartTime2019, dailyStartTime2020]
                });

                if (dailyData2019.length > 0) {
                    dailyData.push(dailyData2019)
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"});
                }

                const dailyData2020 = await this.#db.handleQuery({
                    query: query,
                    values: [dailyStartTime2020, dailyStartTime2021]
                });

                if (dailyData2020.length > 0) {
                    dailyData.push(dailyData2020)
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"});
                }

                const dailyData2021 = await this.#db.handleQuery({
                    query: query,
                    values: [dailyStartTime2021, dailyStartTime2022]
                });

                if (dailyData2021.length > 0) {
                    dailyData.push(dailyData2021)
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"});
                }

                const dailyData2022 = await this.#db.handleQuery({
                    query: query,
                    values: [dailyStartTime2022, dailyEndTime]
                });

                if (dailyData2022.length > 0) {
                    dailyData.push(dailyData2022)
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"});
                }

                res.status(this.#errCodes.HTTP_OK_CODE).json(dailyData)
            } catch (e) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: `${e}`});
            }
        });
    }
}

module.exports = ElectricityRoutes