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
                const url = `https://svm.hbo-ict.cloud/api/v1/data/${req.body.realtime}`;
                // await this.#axios.get(url, {params: {day: req.body.realtime}}).then(function (response) {
                //     data = response.data
                // }).catch(function (e) {
                //     console.log(e)
                // })

                let data = await this.#db.handleQuery({
                    query: `SELECT DATE_FORMAT(time, '%Y-%m-%d') AS day, SUM (consumption / 4) AS consumption
                            FROM electricity
                            WHERE time = ?
                            GROUP BY DATE (time)
                            ORDER BY DATE (time)`,
                    variables: `${req.body.realtime}`
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

module.exports = RealtimeRoutes