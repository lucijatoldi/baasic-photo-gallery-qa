
context('Login', () => {
    
    const getCredentials = () => ({
        email: Cypress.env('TEST_USER_EMAIL'),
        password: Cypress.env('TEST_USER_PASSWORD'),
        username: Cypress.env('TEST_USER_USERNAME')
    });

    beforeEach(() => {
        const { email, password, username } = getCredentials();
        if (!email || !password || !username) {
            throw new Error('Missing test user credentials in cypress.env.json');
        }
    });

    it('should display a single error message when submitting an empty form', () => {
        cy.visit('/login');
        cy.contains('button', 'Login').click();

        cy.get('.alert.alert--warning')
            .should('be.visible')
            .and('contain', 'Username and password required.');
    });
    
    it('should display an error for invalid credentials', () => {
        cy.attemptLogin('nonexistentuser', 'wrongpassword');

        cy.get('.alert.alert--warning')
            .should('be.visible')
            .and('contain', 'Invalid email, username or password');

        cy.url().should('include', '/login');
    });

    it('should successfully log in with a valid email', () => {
        const { email, password, username } = getCredentials();
        
        cy.attemptLogin(email, password);
        cy.verifySuccessfulLogin(username);
    });

    it('should successfully log in with a valid username', () => {
        const { email, password, username } = getCredentials();
        
        cy.attemptLogin(username, password);
        cy.verifySuccessfulLogin(username);
    });

    it('should successfully log in by pressing Enter in the password field', () => {
        const { email, password, username } = getCredentials();

        cy.attemptLogin(email, password, { useEnter: true });
        cy.verifySuccessfulLogin(username);
    });

    it('should successfully log in even with leading/trailing spaces in credentials', () => {
        const { email, password, username } = getCredentials();
        const emailWithSpaces = `   ${email}   `;

        cy.attemptLogin(emailWithSpaces, password);
        cy.verifySuccessfulLogin(username);
    });

    it('should successfully log in when the username/email is entered with mixed case', () => {
        const { email, password, username } = getCredentials();
        const mixedCaseEmail = email.split('').map((char, i) => 
            i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
        ).join('');

        cy.attemptLogin(mixedCaseEmail, password);
        cy.verifySuccessfulLogin(username);
    });

});