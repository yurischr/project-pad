class RealtimeRoutes {

    #app
    #db
    #errCodes
    constructor(app) {
        this.#app = app
        this.#db = require("../framework/utils/databaseHelper")
        this.#errCodes = require("../framework/utils/httpErrorCodes")
        this.#getRealtimeElectricityData()
        this.#getRealtimeGasData()
    }

    #getRealtimeElectricityData() {
        this.#app.post(`/realtime`, async (req, res) => {
            try {
                    let data = await this.#db.handleQuery({
                    query: "SELECT * FROM electricity WHERE time = " + "\"" + req.body.realtimeElectricity + "\""
                })

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data: data})
                } else {
                    res.status(this.#errCodes.NO_CONTENT).json({reason: "Data not found"})
                }

            } catch (e) {
                console.log(e)
                res.status(this.#errCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #getRealtimeGasData() {
        this.#app.post(`/realtime/gas`, async (req, res) => {
            try {
                let data = await this.#db.handleQuery({
                    query: "SELECT * FROM electricity WHERE time = " + "\"" + req.body.realtimeGas + "\""
                })

                if (data.length > 0) {
                    res.status(this.#errCodes.HTTP_OK_CODE).json({data: data})
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

module.exports = RealtimeRoutes