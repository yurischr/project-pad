describe('realtime', function () {
    const CONSUMPTION_PAGE_URL = Cypress.env("CONSUMPTION_PAGE_URL");


    beforeEach(() => {

        cy.visit(CONSUMPTION_PAGE_URL)
    })

    //validate realtime card form
    it('valid format ', function () {
        cy.get(".card-text").should("exist")

    });


});