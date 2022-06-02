describe('usage comparison', function () {
    const CONSUMPTION_PAGE_URL = Cypress.env("CONSUMPTION_PAGE_URL");


    beforeEach(() => {

        cy.visit(CONSUMPTION_PAGE_URL)
    })

    //validate usage comparison form
    it('valid format ', function () {
        cy.get("#datepicker").should("exist")

    });

    it('should ', function () {

        cy.server();

        const response = {"consumption": "33"}

        cy.intercept("POST", "/dateData", {
            statusCode: 200,
            body : response
        })

        cy.get("#datepicker").invoke("val", "2021-01-01 - 2021-01-02")
    });
});