context('Gallery Navigation and Photo Browsing', () => {

    beforeEach(() => {
        cy.visit('/main');
    });

    it('should display the hero image and scroll indicator on initial load', () => {
        cy.get('.hero').should('be.visible');
        cy.get('[title="Display photos"]').should('be.visible');
        cy.get('.menu').should('be.visible');
        cy.get('[name="search"]').should('be.visible');
    });

    it('should reveal the main photo gallery after clicking the scroll down indicator', () => {
        cy.get('[title="Display photos"]').click();
        cy.get('.thumbnail').should('have.length.greaterThan', 0);
    });

    it('should navigate to the photo detail page when a thumbnail is clicked', () => {
        cy.get('[title="Display photos"]').click();
        cy.get('.thumbnail').first().click();

        cy.url().should('include', '/photo/');
        cy.get('img.image--primary').should('be.visible');
    });

    it('should return to the top of the main page when navigating back from a photo detail page', () => {
        cy.get('[title="Display photos"]').click();
        cy.get('.thumbnail').first().click();

        cy.url().should('include', '/photo/');
        cy.get('img.image--primary').should('be.visible');
        
        cy.get('[title="Close photo"]').click();
        
        cy.url().should('not.include', '/photo/');
        cy.url().should('include', '/main');
        cy.get('.hero').should('be.visible');
        cy.window().its('scrollY').should('be.lessThan', 100);
    });
});