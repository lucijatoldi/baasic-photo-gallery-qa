context('Search Functionality', () => {

    const searchTerm = 'book';
    const noResultsTerm = 'asdfghjklqwerty';
    const singleSpace = ' ';

    beforeEach(() => {
        cy.visit('/main');
    });

    it('should successfully find and display photos for a valid search term', () => {
        cy.searchFor(`${searchTerm}{enter}`);

        cy.url().should('include', `/photo/search/${searchTerm}`);
        cy.contains('h4', `Search result for: '${searchTerm}'`).should('be.visible');
        cy.get('.thumbnail').should('have.length.greaterThan', 0);
    });

    it('should display a "no results" message for a search term that yields no results', () => {
        cy.searchFor(`${noResultsTerm}{enter}`);

        cy.url().should('include', `/photo/search/${noResultsTerm}`);
        cy.get('h2').should('contain.text', 'There are no photos that matches search term.');
        cy.get('.thumbnail').should('not.exist');
    });

    it('should be case-insensitive and return results for an uppercase search term', () => {
        const upperCaseTerm = searchTerm.toUpperCase();
        cy.searchFor(`${upperCaseTerm}{enter}`);

        cy.url().should('include', `/photo/search/${upperCaseTerm}`);
        cy.contains('h4', `Search result for: '${upperCaseTerm}'`).should('be.visible');
        cy.get('.thumbnail').should('have.length.greaterThan', 0);
    });

    it('should not perform a search when the input is empty', () => {
        cy.searchFor('{enter}');

        cy.url().should('include', '/main');
        cy.url().should('not.include', '/search');
        cy.get('[title="Display photos"]').should('be.visible');
        cy.contains('h4', 'Search result for:').should('not.exist');
    });

    it('should enter a broken state when searching for a single space', () => {
        cy.searchFor(`${singleSpace}{enter}`);

        cy.url().should('include', '/search/%20');
        cy.get('h2').should('contain.text', 'There are no photos that matches search term.');
        cy.contains('The request is invalid.').should('be.visible');
    });

    it('should handle leading/trailing spaces inconsistently between URL and title', () => {
        const termWithSpaces = '      b  o      o    k    ';
    
        const renderedInTitle = termWithSpaces.replace(/\s+/g, ' ');
        const encodedForUrl = encodeURIComponent(termWithSpaces);
        
        cy.searchFor(`${termWithSpaces}{enter}`);

        cy.url().should('include', `/photo/search/${encodedForUrl}`);
        cy.contains('h4', `Search result for: '${renderedInTitle}'`).should('be.visible');
        cy.get('.thumbnail').should('have.length.greaterThan', 0);
    });
});