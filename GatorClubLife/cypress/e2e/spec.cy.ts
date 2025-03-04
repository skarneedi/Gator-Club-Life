// cypress/e2e/spec.cy.ts

describe('Authentication Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean state
    cy.window().then((win) => {
      win.localStorage.clear();
    });
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

  it('should handle invalid login credentials correctly', () => {
    // Mock the backend API response for invalid credentials
    cy.intercept('POST', 'http://localhost:8080/login', {
      statusCode: 401,
      body: { error: 'Invalid email or password' }, // Simulate an error response
    }).as('loginRequest');

    // Visit the login page
    cy.visit('/login');

    // Fill out the login form with invalid credentials
    cy.get('#username').type('invaliduser@example.com');
    cy.get('#password').type('wrongpassword');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the API request to complete
    cy.wait('@loginRequest');

    // Assert that the backend returned the expected error response
    cy.get('@loginRequest')
      .its('response.statusCode')
      .should('eq', 401); // Verify the status code is 401 Unauthorized

    cy.get('@loginRequest')
      .its('response.body.error')
      .should('eq', 'Invalid email or password'); // Verify the error message

    // Optionally, assert that the user remains on the login page
    cy.url().should('include', '/login');
  });

  it('should navigate to the About page after login', () => {
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

    // Navigate to the About page
    cy.get('a[href="/about"]').click(); // Replace 'a[href="/about"]' with the actual selector for your About link

    // Assert that the user is on the About page
    cy.url().should('include', '/about');
  });
});