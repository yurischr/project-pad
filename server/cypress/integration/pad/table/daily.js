describe("Table Daily", () => {
    const API_BASE_URL = Cypress.env("LOCAL_API_BASE_URL");
    const CONSUMPTION_PAGE_URL = Cypress.env("CONSUMPTION_PAGE_URL");
    const endpoint = "/electricity/daily";

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit(CONSUMPTION_PAGE_URL);
    });

    it("Display right content when clicking on the daily tab button", () => {
        // Click on the daily button
        cy.get('[data-table="day"]').click({ force: true});

        cy.wait(3000);

        // Check that the right content is displayed in the table
        cy.get(".time-column").should("contain", "Dag");
    });

    it("Verify the status code which is returned by the request", () => {
        cy.request(API_BASE_URL + endpoint).its('status').should('be.equal', 200);
    });

    it("The request successfully returned more than 0 rows", () => {
        cy.request(API_BASE_URL + endpoint).its('body.data.length').should('be.gt', 0)
    });

    it("Failed call - No Content", () => {
        //Start a fake server
        cy.server();

        const mockedResponse = {
            reason: "No content"
        };

        cy.intercept('GET', endpoint, {
            statusCode: 204,
            body: mockedResponse
        }).as('daily');

        cy.wait(3000);
        cy.get('[data-table="day"]').click({ force: true});

        cy.wait("@daily");

        cy.get(".err-msg").should("exist");

    });
});