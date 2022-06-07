//Context: Comparison Chart
describe("ComparisonChart", () => {
    const ENDPOINT = "/comparison/daily";
    const CONSUMPTION_PAGE_URL = Cypress.env("CONSUMPTION_PAGE_URL");
    const API_BASE_URL = Cypress.env("LOCAL_API_BASE_URL");

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit(CONSUMPTION_PAGE_URL);
    });

    //Test: Validate UI
    it("Valid UI", () => {
        cy.get('[data-table="day"]').should('exist');
        cy.get('#chart').should('exist');
    });

    //Test: Happy Call
    it("Make sure the request gets data", () => {
        // Check if the status code is 200
        cy.request(API_BASE_URL + ENDPOINT).its('status').should('be.equal', 200);

    });

    //Test: Unhappy Call
    it("Bad Request Call", () => {
        cy.server()

        const mockedResponse = {
            reason: "Bad Request"
        };

        cy.intercept('GET', ENDPOINT, {
            statusCode: 400,
            body: mockedResponse
        }).as('error');

        cy.wait(3000);
        cy.get('[data-table="day"]').click({ force: true});

        cy.wait("@error");

        cy.get(".err-msg").should("exist");

    });
});