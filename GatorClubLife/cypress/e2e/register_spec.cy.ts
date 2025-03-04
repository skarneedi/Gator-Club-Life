// cypress/e2e/register_spec.cy.ts

describe('Registration Form Test', () => {
    beforeEach(() => {
      // Visit the register page before each test
      cy.visit('/register'); // Cypress will prepend the baseUrl (http://localhost:4200)
    });
  
    it('should allow a user to register successfully', () => {
      // Step 1: Fill out the registration form
      cy.get('#name').type('John Doe'); // Name field
      cy.get('#email').type('john.doe@example.com'); // Email field
      cy.get('#username').type('johndoe'); // Username field
      cy.get('#password').type('password123'); // Password field
      cy.get('#confirm-password').type('password123'); // Confirm password field
      cy.get('#role').select('member'); // Select role from dropdown
  
      // Step 2: Submit the form
      cy.get('button[type="submit"]').click(); // Click the "Register" button
  
      // Step 3: Assert that the user is redirected to the login page
      cy.url().should('include', '/login'); // Verify redirection to /login
  
      // Optional: Check for a success message (if implemented)
      cy.contains('Registration successful!').should('be.visible');
    });
  
    it('should display an error message if username is already taken', () => {
      // Step 1: Register a user first
      cy.get('#name').type('Jane Doe');
      cy.get('#email').type('jane.doe@example.com');
      cy.get('#username').type('janedoe');
      cy.get('#password').type('password123');
      cy.get('#confirm-password').type('password123');
      cy.get('#role').select('member');
      cy.get('button[type="submit"]').click();
  
      // Step 2: Try registering again with the same username
      cy.visit('/register'); // Revisit the register page
      cy.get('#name').type('Jane Doe');
      cy.get('#email').type('jane.doe@example.com');
      cy.get('#username').type('janedoe'); // Same username as before
      cy.get('#password').type('password123');
      cy.get('#confirm-password').type('password123');
      cy.get('#role').select('member');
      cy.get('button[type="submit"]').click();
  
      // Step 3: Assert that an error message is displayed
      cy.contains('Username is already taken').should('be.visible');
    });
  });