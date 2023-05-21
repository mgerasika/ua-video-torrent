describe('get-imdb', () => {
    it('get-imdb-rate', () => {
        const url =
            Cypress.env('URL') || 'https://rezka.ag/films/thriller/57599-posle-nastupleniya-temnoty-moya-dorogaya-1990.html';
        cy.log('ENV', url);
        cy.visit(url);
        cy.url().should('include', url);
        cy.get('.imdb').should('be.visible').find('a').invoke('removeAttr', 'target').click();
        cy.url().should('include', 'https://www.imdb.com/');
        cy.url().then((url) => {
            const imdbId = url
                .split('/')
                .filter((f) => f)
                .pop();
            const result = { id: imdbId };

            console.log('result', result);
            cy.log('result', result);
            if (Cypress.env('URL')) {
                throw JSON.stringify(result);
            }
        });
    });
});
