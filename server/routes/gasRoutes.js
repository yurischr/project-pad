/**
 * This class contains ExpressJS routes specific for the Electricity entity
 * this file is automatically loaded in app.js
 *
 * @author Jordy Mol
 */
class GasRoutes {
    #GAS_START_DATETIME = "2019-06-01 00:00:00";
    #GAS_END_DATETIME = "2022-03-08 23:00:00";
    #errCodes = require("../framework/utils/httpErrorCodes");
    #db = require("../framework/utils/databaseHelper");
    #app;

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     */
    constructor(app) {
        this.#app = app;

        this.#getDailyData()
        this.#getWeeklyData()
        this.#getMonthlyData()
    }

    /**
     * Electricity route for getting the electricity consumption on daily base
     * @private
     */
    #getDailyData() {
        this.#app.get("/gas/daily", async (req, res) => {
            try {
                const data = await this.#db.handleQuery({
                    query: `SELECT DATE_FORMAT(time, '%Y-%m-%d') AS day, SUM(\`usage\`) AS consumption
                            FROM gas
                            WHERE time BETWEEN ? AND ?
                            GROUP BY DATE (time)
                            ORDER BY DATE (time)`,
                    values: [this.#GAS_START_DATETIME, this.#GAS_END_DATETIME]
                });

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data})
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"})
                }
            } catch (e) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Electricity route for getting the electricity consumption on weekly base
     * @private
     */
    #getWeeklyData() {
        this.#app.get("/gas/weekly", async (req, res) => {
            try {
                const data = await this.#db.handleQuery({
                    query: `SELECT  time AS start, YEARWEEK(time) AS week, 
                            SUM(\`usage\`) AS consumption 
                            FROM gas 
                            WHERE time BETWEEN ? AND ? 
                            GROUP BY YEARWEEK(time) 
                            ORDER BY time`,
                    values: [this.#GAS_START_DATETIME, this.#GAS_END_DATETIME]
                });

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data})
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"})
                }
            } catch (e) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Electricity route for getting the electricity consumption on monthly base
     * @private
     */
    #getMonthlyData(){
        this.#app.get("/gas/monthly", async (req, res) => {
            try {
                const data = await this.#db.handleQuery({
                    query: `SELECT DATE_FORMAT(time, '%Y-%m') AS maand, SUM(\`usage\`) AS consumption
                            FROM gas
                            WHERE time BETWEEN ? AND ?
                            GROUP BY YEAR (time), MONTH (time)`,
                    values: [this.#GAS_START_DATETIME, this.#GAS_END_DATETIME]
                });

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data})
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"})
                }
            } catch (e) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = GasRoutes;