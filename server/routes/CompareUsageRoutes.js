/**
 * Routes file for compareUsage entity
 * @author Yuri Schrieken
 */


class CompareUsageRoutes {
    #app;
    #errCodes = require("../framework/utils/httpErrorCodes");
    #axios = require("../node_modules/axios").default;
    #selectedDay = "2022/01/01";

    constructor(app) {
        this.#app = app
        this.#getData();
    }

    #getData() {
        this.#app.post(`/compare/daily`, async (req, res) => {
            try {
                const url = `https://svm.hbo-ict.cloud/api/v1/data/${req.body.selectedDay}`;
                let data;
                await this.#axios.get(url, {params: {day: req.body.selectedDay}}).then(function (response) {
                    data = response.data
                }).catch(function (e) {
                    console.log(e)
                })

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data: data})
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"})
                }


                // res.send(req.body.selectedDay)
            } catch (e) {
                console.log(e)
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}

module.exports = CompareUsageRoutes

