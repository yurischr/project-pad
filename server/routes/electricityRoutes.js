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
}

module.exports = ElectricityRoutes