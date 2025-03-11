describe('Game Initialization', () => {
  beforeEach(() => {
    // Clear local storage before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should display the title screen', () => {
    cy.contains('h1', 'Bug Collector').should('be.visible');
    cy.contains('h2', 'The Four Souls').should('be.visible');
    cy.contains('button', 'New Game').should('be.visible');
  });

  it('should allow selecting a starter bug', () => {
    cy.contains('button', 'New Game').click();
    cy.contains('h2', 'Choose your starter bug').should('be.visible');
    
    // Should display 3 starter bugs
    cy.get('.grid > div').should('have.length', 3);
    
    // Select the first bug
    cy.get('.grid > div').first().click();
    cy.contains('button', 'Start Adventure').should('be.enabled');
  });

  it('should start a new game with selected bug', () => {
    cy.contains('button', 'New Game').click();
    cy.get('.grid > div').first().click();
    cy.contains('button', 'Start Adventure').click();
    
    // Should show the game screen
    cy.contains('Game loaded successfully').should('be.visible');
    cy.contains('Ember Island').should('be.visible');
    cy.contains('Bugs collected: 1').should('be.visible');
  });

  it('should save and load game state', () => {
    // Start a new game
    cy.contains('button', 'New Game').click();
    cy.get('.grid > div').first().click();
    cy.contains('button', 'Start Adventure').click();
    
    // Reload the page
    cy.reload();
    
    // Should show the continue button
    cy.contains('button', 'Continue Game').should('be.visible');
    cy.contains('button', 'Continue Game').click();
    
    // Should load the saved game
    cy.contains('Game loaded successfully').should('be.visible');
    cy.contains('Bugs collected: 1').should('be.visible');
  });
}); 