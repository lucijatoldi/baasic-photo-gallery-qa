
context('Registration Form Validation', () => {

  beforeEach(() => {
    cy.visit('/register');
  });

  it('should successfully submit the registration form with valid and unique data', () => {
    const timestamp = Date.now();
    const uniqueEmail = `testuser.${timestamp}@example.com`;
    const uniqueUsername = `testuser${timestamp}`;
    const password = 'ValidPassword123';

    cy.get('#email').type(uniqueEmail);
    cy.get('#userName').type(uniqueUsername);
    cy.get('#password').type(password);
    cy.get('#confirmPassword').type(password);
    cy.contains('button', 'Register').click();

    cy.url().should('include', '/register');

    cy.contains('p', 'You have successfully registered').should('be.visible');
  });

  it('should display required field errors on blur', () => {
    cy.get('#email').focus().blur();
    cy.get('.alert.alert--warning').should('contain', 'Email is required.');

    cy.get('#userName').focus().blur();
    cy.get('.alert.alert--warning').should('contain', 'Username is required.');

    cy.get('#password').focus().blur();
    cy.get('.alert.alert--warning').should('contain', 'Password is required.');

    cy.get('#confirmPassword').focus().blur();
    cy.get('.alert.alert--warning').should('contain', 'Confirm Password is required.');

    cy.contains('button', 'Register').should('be.disabled');
  });

  it('should display an error for an invalid email format', () => {
    cy.get('#email').type('invalid-email');
    cy.get('#userName').click(); 
    
    cy.get('.alert.alert--warning').should('contain', 'Please enter the correct email address!');
    cy.contains('button', 'Register').should('be.disabled');
  });

it('should display a "Password too short" error only after both password fields are touched', () => {
  cy.get('#password').type('123');
  
  cy.get('#userName').click();
  cy.get('.alert.alert--warning').should('not.exist'); 

  cy.get('#confirmPassword').type('123');

  cy.get('#userName').click();

  cy.get('.alert.alert--warning')
    .should('be.visible')
    .and('contain', 'Password too short.');
  
  cy.contains('button', 'Register').should('be.disabled');
});

  it('should display an error when passwords do not match', () => {
    cy.get('#password').type('ValidPassword123');
    cy.get('#confirmPassword').type('DifferentPassword456');
    cy.get('#userName').click();

    cy.get('.alert.alert--warning').should('contain', 'Passwords do not match'); 
    cy.contains('button', 'Register').should('be.disabled');
  });

});