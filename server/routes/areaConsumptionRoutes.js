/**
 * This class contains ExpressJS routes specific for Area Consumption
 * this file is automatically loaded in app.js
 *
 * @author Harmohat Khangura
 */
class AreaConsumptionRoutes {
    API_URL = "https://svm.hbo-ict.cloud/api/v1";
    #errCodes = require("../framework/utils/httpErrorCodes")
    #db = require("../framework/utils/databaseHelper")
    #axios = require("../node_modules/axios").default;
    #app

    /**
     * Constructor for AreaConsumptionRoutes
     * @author Harmohat Khangura
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     */
    constructor(app) {
        this.#app = app;

        this.#getArea();
        this.#getRoomConsumption();
    }

    /**
     * Method calls the API to get the data of a specific area (given query) located in the scheepvaartmuseum
     * @author Harmohat Khangura
     */
    #getArea() {
        this.#app.get("/areas/get", async (req, res) => {
            const areaType = req.query.areaType;
            try {
                const request = await this.#axios.get(`${this.API_URL}/areas`);

                switch (areaType) {
                    case "north":
                        res.status(this.#errCodes.HTTP_OK_CODE).send(request.data[0]);
                        break;
                    case "east":
                        res.status(this.#errCodes.HTTP_OK_CODE).send(request.data[1]);
                        break;
                    case "west":
                        res.status(this.#errCodes.HTTP_OK_CODE).send(request.data[2]);
                        break;
                    case "outside":
                        res.status(this.#errCodes.HTTP_OK_CODE).send(request.data[3]);
                        break;
                    default:
                        res.status(this.#errCodes.HTTP_OK_CODE).send(request.data);
                        break;
                }
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

