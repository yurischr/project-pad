/**
 * This class contains ExpressJS routes specific for Area Consumption
 * this file is automatically loaded in app.js
 *
 * @author Harmohat Khangura
 */
class AreaConsumptionRoutes {
    API_URL = "https://svm.hbo-ict.cloud/api/v1";
    #SVM_AREATYPES = ["Noord", "east", "west", "outside"];
    #errCodes = require("../framework/utils/httpErrorCodes")
    #db = require("../framework/utils/databaseHelper")
    #axios = require("axios").default;
    #app

    /**
     * Constructor for AreaConsumptionRoutes
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     */
    constructor(app) {
        this.#app = app;

        this.#getArea();
        this.#getRoomConsumption();
    }

    /**
     * Method calls the API to get the data of a specific area (given query) located in the scheepvaartmuseum
     */
    #getArea() {
        this.#app.get("/areas/get", async (req, res) => {
            const areaType = req.query.areaType;
            try {
                const request = await this.#axios.get(`${this.API_URL}/areas`);
                const SVM_AREAS = ["north", "east", "west", "outside"];

                SVM_AREAS.forEach((area, index, array) => {
                    if (area === areaType) {
                        res.status(this.#errCodes.HTTP_OK_CODE).send(request.data[index]);
                    }
                });
            } catch (e) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Method calls the API to get the consumption of a specific room (given queries) located in the scheepvaartmuseum
     * @author Harmohat Khangura
     */
    #getRoomConsumption() {
        this.#app.get("/areas/get/room/consumption", async (req, res) => {
            const roomId = req.query.roomId;
            const year = req.query.year;
            try {
                const request = await this.#axios.get(`${this.API_URL}/rooms/${roomId}/data/${year}`);
                const data = request.data

                res.status(this.#errCodes.HTTP_OK_CODE).json({
                    data: data
                });
            } catch (e) {
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = AreaConsumptionRoutes

