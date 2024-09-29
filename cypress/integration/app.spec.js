describe('My First Test', () => {
    it('Visits the App and checks the title', () => {
      cy.visit('/');
      cy.contains('Welcome to Your App');
    });
  
    it('Should navigate to the login page', () => {
      cy.visit('/login');
      cy.get('h2').should('contain', 'Login');
    });
  
    it('Should log in successfully', () => {
      cy.visit('/login');
      cy.get('input[name="username"]').type('admin');
      cy.get('input[name="password"]').type('password');
      cy.get('button').contains('Login').click();
      cy.get('h1').should('contain', 'Dashboard');
    });
  });
  