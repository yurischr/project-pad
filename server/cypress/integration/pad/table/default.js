describe("Table", () => {
    const CONSUMPTION_PAGE_URL = Cypress.env("CONSUMPTION_PAGE_URL");

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit(CONSUMPTION_PAGE_URL);
    });

    // Test: Validate the table + components are displayed
    it("Valid Table Component", () => {
        // Find the table parent box
        cy.get(".table-overview").should("exist");

        // Find the table
        cy.get("#table-data").should("exist");

        // Find the table filter
        cy.get(".dataTables_filter").should("exist");

        // Find the table pagination
        cy.get(".dataTables_paginate").should("exist");

        // Find the table row selection dropdown
        cy.get(".dataTables_length").should("exist");
    });
});