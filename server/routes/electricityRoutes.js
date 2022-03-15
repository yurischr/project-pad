/**
 * This class contains ExpressJS routes specific for the Electricity entity
 * this file is automatically loaded in app.js
 *
 * @author Harmohat Khangura, ....
 */
class ElectricityRoutes {
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
                        "SELECT \n" +
                        "\ttime AS start,\n" +
                        "    YEARWEEK(time) AS week,\n" +
                        "    sum(consumption) as consumption \n" +
                        "    FROM electricity \n" +
                        "    WHERE time BETWEEN '2018-01-01 00:00:00' AND ' 2022-03-08 23:45:00'\n" +
                        "\tGROUP BY YEARWEEK(time)\n" +
                        "    ORDER BY time;"
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