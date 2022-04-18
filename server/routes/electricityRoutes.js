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
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     */
    constructor(app) {
        this.#app = app;

        this.#getWeeklyData()
        this.#getDailyData()
        this.#getMonthlyData()
        this.#getYearlyData()
    }

    #getMonthlyData() {
        this.#app.get("/electricity/monthly", async (req, res) => {
            try {
                const data = await this.#db.handleQuery({
                    query: 'SELECT time AS start, month(time) AS maand, SUM(consumption / 12) AS consumption FROM electricity WHERE time BETWEEN ? AND ? GROUP BY month(time)\n',
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
                        "SUM(consumption / 4) AS consumption " +
                        " FROM electricity " +
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
        this.#app.get("/electricity/daily", async (req, res) => {
            try {
                const data = await this.#db.handleQuery({
                    query: `SELECT DATE_FORMAT(time, '%Y-%m-%d') AS day, SUM (consumption / 4) AS consumption
                            FROM electricity
                            WHERE time BETWEEN ? AND ?
                            GROUP BY DATE (time)
                            ORDER BY DATE (time)`,
                    values: [this.#ELECTRA_START_DATETIME, this.#ELECTRA_END_DATETIME]
                });

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data})
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"})
                }
            } catch (e) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: `${e}`});
            }
        });
    }

    /**
     * Electricity route for getting the electricity consumption on yearly base
     * @private
     */
    #getYearlyData() {
        this.#app.get("/electricity/yearly", async (req, res) => {
            try {
                const data = await this.#db.handleQuery({
                    query: 'SELECT YEAR(time) AS year, sum(consumption) / 4 AS consumption FROM electricity WHERE time BETWEEN \'2018-01-01 00:00:00\' AND \'2022-03-08 23:45:00\' GROUP BY YEAR(time) ORDER BY time'
                })
                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data});
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"});
                }
            } catch (e) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}

module.exports = ElectricityRoutes

