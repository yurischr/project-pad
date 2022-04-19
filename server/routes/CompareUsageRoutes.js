/**
 * Routes file for compareUsage entity
 * @author Yuri Schrieken
 */


export class CompareUsageRoutes {
    #app;
    #errCodes = require("../framework/utils/httpErrorCodes");
    #axios = require("../node_modules/axios").default;
    #selectedDay = "2022/01/01";

    constructor(app) {
        this.#app = app
        this.#getData(this.#selectedDay)
    }

    #getData(selectedDay) {
        this.#app.get(`/compare/daily/day=${selectedDay}`, async (req, res) => {
            try {
                const url = `https://svm.hbo-ict.cloud/api/v1/data/${selectedDay}`;
                let data;
                await this.#axios.get(url, {params: {day: selectedDay}}).then(function (response) {
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
}

module.exports = CompareUsageRoutes

