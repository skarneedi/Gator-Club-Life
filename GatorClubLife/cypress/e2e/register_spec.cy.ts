// cypress/e2e/register_spec.cy.ts

describe('Registration Form Test', () => {
  beforeEach(() => {
    // Visit the register page before each test
    cy.visit('/register'); // Cypress will prepend the baseUrl (http://localhost:4200)
  });

  it('should allow a user to register successfully', () => {
    // Mock the backend API response for successful registration
    cy.intercept('POST', 'http://localhost:8080/users/create', {
      statusCode: 200,
      body: { user_id: 123 }, // Simulate a successful response
    }).as('registerRequest');

    // Visit the registration page
    cy.visit('/register');

    // Fill out the registration form
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john.doe@example.com');
    cy.get('#username').type('johndoe');
    cy.get('#password').type('password123');
    cy.get('#confirm-password').type('password123');
    cy.get('#role').select('member');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the API request to complete
    cy.wait('@registerRequest');

    // Assert that the user is redirected to /login
    cy.url().should('include', '/login');
  });

  it('should allow a user to log in with valid credentials', () => {
    // Mock the backend API response for successful login
    cy.intercept('POST', 'http://localhost:8080/login', {
      statusCode: 200,
      body: { message: 'Login successful' }, // Simulate a successful response
    }).as('loginRequest');

    // Visit the login page
    cy.visit('/login');

    // Fill out the login form
    cy.get('#username').type('john.doe@example.com'); // Use the registered email
    cy.get('#password').type('password123'); // Use the registered password

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the API request to complete
    cy.wait('@loginRequest');

    // Assert that the user is redirected to /home
    cy.url().should('include', '/home');

    // Optional: Check that localStorage is updated
    cy.window().then((win) => {
      expect(win.localStorage.getItem('isLoggedIn')).to.eq('true');
    });
  });

  it('should prevent registration if username is already taken', () => {
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

    // Step 3: Submit the form
    cy.get('button[type="submit"]').click();

    // Step 4: Assert that the URL remains on the register page
    cy.url().should('include', '/register'); // Confirm that the user is not redirected

    // Optional: Debugging - Log the current URL for verification
    cy.url().then((url) => {
      console.log('Current URL after failed registration:', url);
    });
  });
});
