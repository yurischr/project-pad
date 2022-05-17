class RealtimeRoutes {

    #app
    #db
    #errCodes
    constructor(app) {
        this.#app = app
        this.#db = require("../framework/utils/databaseHelper")
        this.#errCodes = require("../framework/utils/httpErrorCodes")
        this.#getRealtimeData()
    }

    #getRealtimeData() {
        this.#app.post(`/realtime`, async (req, res) => {
            try {
                console.log("test")
                console.log(req.body.realtime)
                    let data = await this.#db.handleQuery({
                    query: "SELECT * FROM electricity WHERE time = " + "\"" + req.body.realtime + "\""
                    // query: "SELECT * FROM electricity WHERE time = \"?\"",
                    //
                    //     variables: [req.body.realtime]
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