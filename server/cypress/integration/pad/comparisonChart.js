//Context: Comparison Chart
describe("ComparisonChart", () => {
    const endpoint = "/comparison/weekly";
    const CONSUMPTION_PAGE_URL = Cypress.env("CONSUMPTION_PAGE_URL");

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit(CONSUMPTION_PAGE_URL);
    });

    //Test: Validate UI
    it("Valid UI", () => {
        cy.get('[data-table="week"]').should('exist');
        cy.get('#chart').should('exist');
    });

    //Test: Happy Call
    it("Happy Call", () => {
        cy.server();
        const mockedResponse = {"data": [{"start": "2018-01-01T00:00:00.000Z", "week": 201753, "consumption": 10824.1}]}

        cy.intercept('GET', endpoint, {
            statusCode: 200,
            body : mockedResponse
        }).as('comparisonData')

        cy.get('[data-table="week"]').click({force: true});
        cy.wait('@comparisonData');
    });

    //Test: Unhappy Call
    it("Unhappy Call", () => {
    });
});