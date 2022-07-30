/* eslint-disable no-undef */
Cypress.Commands.add("resetDatabase", () => {
	cy.request("POST", "http://localhost:5000/test/reset").as("resetDatabase");
	cy.wait("@resetDatabase");
});
