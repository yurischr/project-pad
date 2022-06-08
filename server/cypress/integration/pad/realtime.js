
describe('realtime', function () {
    const CONSUMPTION_PAGE_URL = Cypress.env("CONSUMPTION_PAGE_URL");
    const API_BASE_URL = Cypress.env("LOCAL_API_BASE_URL");
    const endpoint = "/realtime/electricity"

    //Run before each test
    beforeEach(() => {
        //go to specified URL
        cy.visit(CONSUMPTION_PAGE_URL)
        //start server
        cy.server()
    })

    //Test: Validate realtime card form
    it('valid format ', function () {
        cy.get(".card-text").should("exist")
        cy.get(".electricity-difference").should("exist")
    });

    //Test: Successful result
    it('successful result', function () {

        cy.request('POST', API_BASE_URL + endpoint, { realtime: '2021-01-01' }).then(
            (response) => {
                //expecting body to contain values
                expect(JSON.stringify(response.body.data[0].id)).to.eq("105206");
                expect(JSON.stringify(response.body.data[0].consumption)).to.eq("77.4");
            }
        )
    })

    it('successful statuscode', function () {
        cy.request("POST", API_BASE_URL + endpoint, { realtime: '2021-01-01' }).its("status").should("be.equal", 200)
    });


    it('No content fail - status', function () {
        cy.request("POST", API_BASE_URL + endpoint).its("status").should("be.equal", 204)
    });


})