Cypress.Commands.add('attemptLogin', (username, password, options = {}) => {
    if (!options.skipVisit) cy.visit('/login');
    if (username) cy.get('[name="username"]').type(username);
    if (password) cy.get('[name="password"]').type(options.useEnter ? `${password}{enter}` : password);
    if (password && !options.useEnter) cy.contains('button', 'Login').click();
});

Cypress.Commands.add('verifySuccessfulLogin', (expectedUsername) => {
    cy.url().should('include', '/profile/');
    cy.contains('h2', expectedUsername).should('be.visible');
});

Cypress.Commands.add('logout', () => {
    cy.contains('a', 'Menu').click({ force: true });
    cy.contains('Log out').click();
    cy.url().should('include', '/login');
    cy.contains('Login').should('be.visible');
});

Cypress.Commands.add('searchFor', (term) => {
  cy.get('[name="searchForm"]').click();
  cy.get('[name="search"]').type(term);
});