// Context: Table for yearly data
describe("yearlyTable", () => {
    const ENDPOINT = "/electricity/yearly";
    const API_BASE_URL = Cypress.env("LOCAL_API_BASE_URL");
    const CONSUMPTION_PAGE_URL = Cypress.env("CONSUMPTION_PAGE_URL");

    // Run before each test in this context
    beforeEach(() => {
        cy.visit(CONSUMPTION_PAGE_URL);
    });

    //Test: Validate table
    it("Validate table", () => {
        cy.get('[data-table="year"]').should('exist');
        cy.get("#table-data").should("exist");
    });

    // Test: Successful call
    it("Successful call", () => {
        cy.server();
        const mockedResponse = {"data": [{year: 2018, consumption: 659079.225}]}

        cy.wait(4000);
        cy.get('[data-table="year"]').click({force: true});

        cy.request(API_BASE_URL + ENDPOINT).its('status').should('be.equal', 200);
        cy.get(".table-body").should("contain", mockedResponse.data[0].consumption);
    });

    // Test: Failed call
    it("Failed call", () => {
        cy.server();

        const mockedResponse = {
            reason: "ERROR - No data available"
        };

        cy.intercept('GET', ENDPOINT, {
            statusCode: 204,
            body: mockedResponse
        }).as('yearlyData');

        cy.wait(4000);
        cy.get('[data-table="year"]').click({ force: true});

        cy.wait("@yearlyData");

        cy.get(".err-msg").should("exist");
    });
});